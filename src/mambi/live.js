// Cuentas en vivo con Google (Firebase Auth + Firestore). Solo la guerra: el ejército y las invasiones.
// La finca (pesos, gallinas, central) no sale del teléfono. Sin Cloud Functions: quien juega la batalla
// anota el resultado; las reglas impiden escribir el ejército de otro.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  addDoc, collection, doc, getFirestore, limit, onSnapshot, query, serverTimestamp, setDoc, where,
} from 'firebase/firestore';
import { CITY_BY_ID } from './data.js';
import { WAR } from './war.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBrYJvxnpPhEJY3e6srQ52CnIyJzeqbipE',
  authDomain: 'la-finca-guerra.firebaseapp.com',
  projectId: 'la-finca-guerra',
  storageBucket: 'la-finca-guerra.firebasestorage.app',
  messagingSenderId: '420699562681',
  appId: '1:420699562681:web:abe495926eec0c6504f168',
};

const SEEN = 'lafinca-live-seen';
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const liveState = { user: null, fincas: [], total: 0, error: '', ready: false };

let game = null;
let stopFincas = null;
let stopHits = null;
let lastPush = 0;
let lastSig = '';
let pushing = false;

const cleanName = (s) => String(s || '').replace(/[<>]/g, '').trim().slice(0, 24) || 'Finca';
const seenIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN) || '[]')); } catch { return new Set(); }
};
const markSeen = (id) => {
  const arr = [...seenIds()].filter((x) => x !== id);
  arr.push(id);
  try { localStorage.setItem(SEEN, JSON.stringify(arr.slice(-40))); } catch { /* privado */ }
};

export function livePower(f) {
  if (!f) return 0;
  return (f.inf | 0) * 4 + (f.cab | 0) * 10 + Math.min(5, f.cart | 0) * 14 + Math.round(((f.garInf | 0) * 4 + (f.garCab | 0) * 10) * 0.85);
}

export function liveFinca(uid) {
  return liveState.fincas.find((f) => f.uid === uid) || null;
}

function snapshot(sim) {
  const a = sim.mb().army;
  let gi = 0, gc = 0;
  try {
    for (const c of Object.values(sim.cs().cities)) { gi += c.gar.inf | 0; gc += c.gar.cab | 0; }
  } catch { /* sin guarnición */ }
  const nick = sim.war?.().nick;
  const google = cleanName(auth.currentUser?.displayName || '');
  const nombre = nick && nick !== 'YAREY' ? cleanName(nick) : google;
  return {
    nombre,
    inf: a.inf | 0,
    cab: a.cab | 0,
    cart: Math.min(5, a.cart | 0),
    garInf: gi,
    garCab: gc,
    freed: Math.min(13, sim.mb().freed.length),
    updated: serverTimestamp(),
  };
}

export async function pushFinca(sim, force = false) {
  const u = auth.currentUser;
  if (!u || !sim) return;
  const data = snapshot(sim);
  const sig = `${data.nombre}|${data.inf}|${data.cab}|${data.cart}|${data.garInf}|${data.garCab}|${data.freed}`;
  const now = Date.now();
  if (!force && sig === lastSig && now - lastPush < 20000) return;
  if (pushing) return;
  pushing = true;
  try {
    await setDoc(doc(db, 'fincas', u.uid), data);
    lastSig = sig;
    lastPush = now;
    liveState.error = '';
  } catch (e) {
    liveState.error = e?.code === 'permission-denied'
      ? 'Firestore rechazó la ficha. Publica las reglas de la guerra en la consola de Firebase.'
      : 'No se pudo publicar tu ficha.';
    console.warn('[vivo]', e);
  } finally { pushing = false; }
}

function defenderLoss(snap, attackerWon) {
  const frac = attackerWon ? 0.28 : 0.08;
  return {
    defInf: Math.min(40, Math.round((snap.inf | 0) * frac * 0.4)),
    defCab: Math.min(20, Math.round((snap.cab | 0) * frac * 0.4)),
    defGarInf: Math.min(80, Math.round((snap.garInf | 0) * frac)),
    defGarCab: Math.min(40, Math.round((snap.garCab | 0) * frac)),
  };
}

export async function reportLive(sim, snap, result) {
  const u = auth.currentUser;
  if (!u || !snap?.uid || snap.uid === u.uid) return;
  const loss = defenderLoss(snap, !!result?.win);
  try {
    await addDoc(collection(db, 'invasiones'), {
      from: u.uid,
      to: snap.uid,
      fromName: snapshot(sim).nombre,
      estado: 'resuelta',
      win: !!result?.win,
      defInf: loss.defInf,
      defCab: loss.defCab,
      defGarInf: loss.defGarInf,
      defGarCab: loss.defGarCab,
      at: serverTimestamp(),
    });
    liveState.error = '';
  } catch (e) {
    liveState.error = e?.code === 'permission-denied'
      ? 'No se pudo avisar a la otra finca. Publica las reglas de Firestore.'
      : 'No se pudo avisar a la otra finca.';
    console.warn('[vivo] invasión', e);
    sim?.h?.toast?.(liveState.error);
  }
  await pushFinca(sim, true);
}

function applyHit(data, id) {
  if (!game || seenIds().has(id)) return;
  markSeen(id);
  const sim = game.sim;
  const a = sim.mb().army;
  const take = (have, asked, pct) => Math.min(have | 0, Math.max(0, asked | 0), Math.max(0, Math.round((have | 0) * pct)));
  const inf = take(a.inf, data.defInf, 0.2);
  const cab = take(a.cab, data.defCab, 0.2);
  a.inf -= inf;
  a.cab -= cab;
  let gi = Math.max(0, data.defGarInf | 0);
  let gc = Math.max(0, data.defGarCab | 0);
  try {
    for (const c of Object.values(sim.cs().cities)) {
      const di = Math.min(c.gar.inf, gi);
      const dc = Math.min(c.gar.cab, gc);
      c.gar.inf -= di;
      c.gar.cab -= dc;
      gi -= di;
      gc -= dc;
    }
  } catch { /* sin ciudades */ }
  let cityName = '';
  if (data.win) {
    const freed = sim.mb().freed.filter((cid) => CITY_BY_ID[cid]);
    if (freed.length) {
      const cid = freed[Math.floor(Math.random() * freed.length)];
      try {
        sim.csCity(cid).raidUntil = Date.now() / 1000 + WAR.RAID_BLOCK;
        cityName = CITY_BY_ID[cid].name;
      } catch { /* nada */ }
    }
  }
  sim.h?.changed?.('res');
  sim.mbChanged();
  const who = cleanName(data.fromName);
  const lostN = inf + cab;
  const line = data.win
    ? `${who} te invadió y tomó la plaza. ${cityName ? `La renta de ${cityName} para unos minutos. ` : ''}${lostN ? `${lostN} de tu tropa se dispersaron y volvieron a casa. ` : ''}Tus ciudades siguen libres.`
    : `${who} te invadió y no pudo tomarla. ${lostN ? `${lostN} se dispersaron. ` : 'Tu tropa aguantó. '}Tus ciudades siguen libres.`;
  try { sim.war().log.push(line); } catch { /* sin guerra */ }
  pushFinca(sim, true);
  if (game.field?.active || game.war?.modalOpen?.()) {
    (sim.warEvents ||= []).push({ win: !data.win, title: data.win ? 'Te invadieron' : 'Aguantaste la invasión', line, cancelled: false, field: false, liveHit: true });
  } else game.war?.resultModal?.({ win: !data.win, title: data.win ? 'Te invadieron' : 'Aguantaste la invasión', line, field: false });
}

function listen(user) {
  stopFincas?.();
  stopHits?.();
  stopFincas = onSnapshot(query(collection(db, 'fincas'), limit(30)), (qs) => {
    const mine = user.uid;
    const all = qs.docs.map((d) => ({ uid: d.id, ...d.data() }));
    liveState.total = all.length;
    liveState.fincas = all.filter((f) => f.uid !== mine);
    liveState.ready = true;
    liveState.error = '';
    game?.war?.onLive?.();
  }, (e) => {
    liveState.error = e?.code === 'permission-denied'
      ? 'No se pueden ver las otras fincas. Publica las reglas de Firestore.'
      : 'No se pudo leer las fincas en vivo.';
    console.warn('[vivo] lista', e);
    game?.war?.onLive?.();
  });
  stopHits = onSnapshot(query(collection(db, 'invasiones'), where('to', '==', user.uid), limit(20)), (qs) => {
    const backlog = !localStorage.getItem('lafinca-live-booted');
    qs.docChanges().forEach((ch) => {
      if (ch.type === 'removed') return;
      if (backlog) { markSeen(ch.doc.id); return; }
      const data = ch.doc.data();
      if (data.estado !== 'resuelta' || data.from === user.uid) return;
      applyHit(data, ch.doc.id);
    });
    try { localStorage.setItem('lafinca-live-booted', '1'); } catch { /* privado */ }
  }, (e) => {
    console.warn('[vivo] invasiones', e);
  });
}

export function attachLive(g) {
  game = g;
  onAuthStateChanged(auth, (user) => {
    liveState.user = user;
    liveState.ready = !!user;
    if (!user) {
      stopFincas?.();
      stopHits?.();
      stopFincas = null;
      stopHits = null;
      liveState.fincas = [];
      liveState.total = 0;
      g.war?.onLive?.();
      return;
    }
    listen(user);
    if (g.sim) pushFinca(g.sim, true);
    g.war?.onLive?.();
  });
}

export function signInGoogle() {
  return signInWithPopup(auth, provider).catch((e) => {
    const code = e?.code || '';
    const msg = code === 'auth/unauthorized-domain'
      ? 'Este sitio no está autorizado en Firebase. En Authentication → Settings agrega lafory.github.io.'
      : code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed'
        ? 'En Firebase, Authentication → Sign-in method, activa Google y guarda.'
        : code === 'auth/popup-blocked'
          ? 'El teléfono bloqueó la ventana. Toca otra vez Entrar con Google.'
          : code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'
            ? 'Se cerró la ventana de Google.'
            : 'No se pudo entrar con Google.';
    liveState.error = msg;
    game?.ui?.toast?.(msg);
    throw e;
  });
}

export function signOutGoogle() {
  return signOut(auth);
}

export function liveNombre() {
  return cleanName(liveState.user?.displayName || '');
}
