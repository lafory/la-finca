// Guerra entre fincas. No hay red: otras fincas (con nombre de finca, no de persona real) invaden
// tus ciudades libres y tú puedes invadirlas. Un código corto deja pelear contra los números de
// un amigo; el resultado se queda en este teléfono. Nunca toca las ciudades de la campaña ni al Régimen.
import { registerSimModule, registerMigration } from '../registry.js';
import { Sim } from '../sim.js';
import { CITY_BY_ID } from './data.js';

export const WAR = {
  WARN: 150,
  FIRST: 3 * 60,
  INT_MIN: 4 * 60,
  INT_MAX: 9 * 60,
  RAID_BLOCK: 10 * 60,
  OFF_MAX: 3,
  MOOD_MIN: 0.55,
  MOOD_MAX: 1.2,
  RECOVER: 0.012,
};

export const RIVALS = [
  { id: 'guasima', name: 'Cachita', finca: 'La Guásima', motto: 'café y machete', foe: 'ocre', terrain: 'monte', base: 36 },
  { id: 'mango', name: 'Pancho', finca: 'El Mango', motto: 'jinetes del llano', foe: 'azul', terrain: 'llano', base: 52 },
  { id: 'yagruma', name: 'Nené', finca: 'La Yagruma', motto: 'fusiles del monte', foe: 'morado', terrain: 'monte', base: 70 },
  { id: 'ceiba', name: 'Tato', finca: 'La Ceiba', motto: 'cañones del camino', foe: 'teja', terrain: 'costa', base: 96 },
];
export const RIVAL_BY = Object.fromEntries(RIVALS.map((r) => [r.id, r]));

export const rt = () => Date.now() / 1000;
const int = (v) => Math.max(0, Math.floor(+v || 0));
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function checksum(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  h >>>= 0;
  return ALPH[h & 31] + ALPH[(h >>> 5) & 31];
}

export function slugNick(s) {
  const n = String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
  return n.length >= 2 ? n : 'FINCA';
}

export function cleanDet(det) {
  return {
    inf: Math.max(0, Math.floor(+det?.inf || 0)),
    cab: Math.max(0, Math.floor(+det?.cab || 0)),
    cart: Math.max(0, Math.floor(+det?.cart || 0)),
  };
}

export function detachmentError(army, viveres, det) {
  const d = cleanDet(det);
  if (d.inf + d.cab < 1) return 'Manda al menos un soldado del campamento.';
  if (d.inf > (army.inf | 0)) return `Solo tienes ${army.inf | 0} infantes en el campamento.`;
  if (d.cab > (army.cab | 0)) return `Solo tienes ${army.cab | 0} jinetes en el campamento.`;
  if (d.cart > (army.cart | 0)) return `Solo tienes ${army.cart | 0} carretas.`;
  const need = d.inf + d.cab;
  if ((viveres || 0) < need) return `La marcha gasta ${need} víveres y tienes ${Math.floor(viveres || 0)}.`;
  return null;
}

export function reinforcementError(army, viveres, det) {
  const d = cleanDet(det);
  if (d.inf + d.cab + d.cart === 0) return null;
  if (d.inf > (army.inf | 0)) return `Solo tienes ${army.inf | 0} infantes en el campamento.`;
  if (d.cab > (army.cab | 0)) return `Solo tienes ${army.cab | 0} jinetes en el campamento.`;
  if (d.cart > (army.cart | 0)) return `Solo tienes ${army.cart | 0} carretas.`;
  const need = d.inf + d.cab;
  if (need && (viveres || 0) < need) return `Llevar esa tropa gasta ${need} víveres y tienes ${Math.floor(viveres || 0)}.`;
  return null;
}

export function suggestDetachment(army, enemyPower) {
  const a = army || { inf: 0, cab: 0, cart: 0 };
  let inf = 0, cab = 0, cart = 0, p = 0;
  const target = Math.max(8, Math.round((enemyPower || 0) * 1.05));
  while (cab < (a.cab | 0) && p < target && cab < 80) { cab++; p += 10; }
  while (inf < (a.inf | 0) && p < target && inf < 120) { inf++; p += 4; }
  if ((a.cart | 0) > 0 && (enemyPower || 0) >= 50) cart = 1;
  if (inf + cab === 0) {
    if (a.inf) inf = Math.min(a.inf, 6);
    else if (a.cab) cab = Math.min(a.cab, 2);
  }
  return { inf, cab, cart };
}

export function friendPower(f) {
  if (!f) return 0;
  return (f.inf | 0) * 4 + (f.cab | 0) * 10 + Math.min(5, f.cart | 0) * 14 + Math.round(((f.garInf | 0) * 4 + (f.garCab | 0) * 10) * 0.85);
}

export function troopCode({ inf = 0, cab = 0, cart = 0, garInf = 0, garCab = 0, freed = 0, nick = 'FINCA' } = {}) {
  const name = slugNick(nick);
  const body = [int(inf), int(cab), Math.min(5, int(cart)), int(garInf), int(garCab), Math.min(13, int(freed)), name].join('.');
  return `LAF-${body}-${checksum(body)}`;
}

export function readTroopCode(raw) {
  const s = String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
  const m = s.match(/^LAF-(\d{1,4})\.(\d{1,3})\.(\d{1,2})\.(\d{1,4})\.(\d{1,3})\.(\d{1,2})\.([A-Z]{2,10})-([A-Z2-9]{2})$/);
  if (!m) return null;
  const body = `${m[1]}.${m[2]}.${m[3]}.${m[4]}.${m[5]}.${m[6]}.${m[7]}`;
  if (checksum(body) !== m[8]) return null;
  const inf = +m[1], cab = +m[2], cart = +m[3], garInf = +m[4], garCab = +m[5], freed = +m[6];
  if (inf > 800 || cab > 400 || cart > 5 || garInf > 800 || garCab > 400 || freed > 13) return null;
  if (inf + cab + garInf + garCab < 1) return null;
  const name = m[7].charAt(0) + m[7].slice(1).toLowerCase();
  return { name, inf, cab, cart, garInf, garCab, freed, terrain: ['llano', 'monte', 'costa'][freed % 3], foe: 'amigo' };
}

export function settleWar(state, o) {
  const army = { inf: state.army.inf | 0, cab: state.army.cab | 0, cart: state.army.cart | 0 };
  const gar = { inf: state.gar?.inf | 0, cab: state.gar?.cab | 0 };
  const freed = state.freed.slice();
  let money = state.money | 0;
  let farmBank = state.farmBank | 0;
  let viveres = state.viveres | 0;
  let mood = Number.isFinite(+state.mood) ? +state.mood : 1;
  let raidUntil = 0;
  const sent = cleanDet(o.sent);
  const cap = (n, top) => Math.min(top, Math.max(0, Math.round(+n || 0)));
  const lost = {
    inf: cap(o.lost?.inf, Math.min(army.inf, sent.inf)),
    cab: cap(o.lost?.cab, Math.min(army.cab, sent.cab)),
    cart: cap(o.lost?.cart, Math.min(army.cart, sent.cart)),
    garInf: o.war === 'repel' ? cap(o.lost?.garInf, gar.inf) : 0,
    garCab: o.war === 'repel' ? cap(o.lost?.garCab, gar.cab) : 0,
  };
  army.inf -= lost.inf; army.cab -= lost.cab; army.cart -= lost.cart;
  gar.inf -= lost.garInf; gar.cab -= lost.garCab;
  const march = sent.inf + sent.cab;
  if (march && !o.spared) viveres = Math.max(0, viveres - Math.min(viveres, march));
  let loot = 0, stolen = 0, xp = 0;
  const enemy = Math.max(0, Math.round(o.enemyPower || 0));
  if (o.war === 'invade' && o.win) {
    loot = Math.round(enemy * (o.friend ? 30 : 46));
    money += loot;
    xp = Math.round(enemy * 3);
    if (!o.friend) mood = Math.max(WAR.MOOD_MIN, mood * 0.72);
  } else if (o.war === 'invade') {
    xp = Math.round(enemy);
    if (!o.friend) mood = Math.min(WAR.MOOD_MAX, mood * 1.06);
  } else if (o.war === 'repel' && (o.win || o.spared)) {
    xp = o.spared ? 0 : Math.round(enemy * 2);
    if (!o.friend) mood = Math.max(WAR.MOOD_MIN, mood * 0.84);
  } else if (o.war === 'repel') {
    if (o.hasFarm) {
      stolen = Math.floor(farmBank);
      farmBank = 0;
      raidUntil = (o.now || 0) + (o.raidBlock || WAR.RAID_BLOCK);
    } else {
      stolen = Math.min(money, Math.round(enemy * 12), 4000);
      money -= stolen;
    }
    xp = Math.round(enemy);
    if (!o.friend) mood = Math.min(WAR.MOOD_MAX, mood * 1.05);
  }
  return { army, gar, freed, money, farmBank, viveres, mood, raidUntil, lost, loot, stolen, xp, win: !!o.win && !o.spared, spared: !!o.spared };
}

function lossTxt(lost) {
  const bits = [];
  if (lost.inf) bits.push(`${lost.inf} infantes`);
  if (lost.cab) bits.push(`${lost.cab} jinetes`);
  if (lost.cart) bits.push(`${lost.cart} carreta${lost.cart > 1 ? 's' : ''}`);
  if (lost.garInf) bits.push(`${lost.garInf} de la guarnición`);
  if (lost.garCab) bits.push(`${lost.garCab} jinetes de la guarnición`);
  if (!bits.length) return 'Tu tropa volvió entera.';
  return `${bits.join(', ')} se dispersaron y volvieron a sus casas.`;
}

export function ensureWar(s) {
  s.ext ||= {};
  const M = s.ext.mambi;
  if (!M || typeof M !== 'object') return null;
  const d = obj(M.war);
  const rivals = {};
  const rawR = obj(d.rivals);
  for (const r of RIVALS) {
    let mood = num(obj(rawR[r.id]).mood, 1);
    if (mood < WAR.MOOD_MIN) mood = WAR.MOOD_MIN;
    if (mood > WAR.MOOD_MAX) mood = WAR.MOOD_MAX;
    rivals[r.id] = { mood };
  }
  let inbound = d.inbound && typeof d.inbound === 'object' ? d.inbound : null;
  if (inbound && (!RIVAL_BY[inbound.rivalId] || !CITY_BY_ID[inbound.city] || !(+inbound.power > 0) || !Number.isFinite(+inbound.hit))) inbound = null;
  if (inbound) inbound = { id: String(inbound.id || 'w'), rivalId: inbound.rivalId, city: inbound.city, power: Math.round(+inbound.power), at: num(inbound.at), hit: +inbound.hit };
  let friend = null;
  if (d.friend && typeof d.friend === 'object') {
    const f = d.friend;
    const inf = int(f.inf), cab = int(f.cab), garInf = int(f.garInf), garCab = int(f.garCab);
    if (f.name && (inf || cab || garInf || garCab)) {
      friend = {
        name: String(f.name).slice(0, 12),
        inf, cab, cart: Math.min(5, int(f.cart)), garInf, garCab,
        freed: Math.min(13, int(f.freed)),
        terrain: ['llano', 'monte', 'costa'].includes(f.terrain) ? f.terrain : 'llano',
        foe: 'amigo',
      };
    }
  }
  const st = obj(d.stats);
  M.war = {
    v: 1,
    rivals,
    friend,
    inbound,
    next: num(d.next),
    seq: int(d.seq),
    seen: num(d.seen),
    recoveredAt: num(d.recoveredAt),
    nick: slugNick(d.nick || 'Yarey'),
    stats: { invaded: int(st.invaded), won: int(st.won), lost: int(st.lost), held: int(st.held), raided: int(st.raided) },
    log: Array.isArray(d.log) ? d.log.filter((l) => typeof l === 'string').slice(-8) : [],
    report: d.report && Array.isArray(d.report.lines) ? { away: num(d.report.away), lines: d.report.lines.filter((l) => typeof l === 'string').slice(-8) } : null,
  };
  return M.war;
}

export function installWar(SimC) {
  const P = SimC.prototype;
  P.war = function () {
    const M = this.mb();
    return (M.war && M.war.v === 1 && M.war.rivals) ? M.war : ensureWar(this.s);
  };
  P.warCode = function () {
    const W = this.war(), a = this.mb().army;
    let gi = 0, gc = 0;
    try { for (const c of Object.values(this.cs().cities)) { gi += c.gar.inf; gc += c.gar.cab; } } catch { /* sin castro */ }
    return troopCode({ inf: a.inf, cab: a.cab, cart: a.cart, garInf: gi, garCab: gc, freed: this.mb().freed.length, nick: W.nick });
  };
  P.warUseCode = function (raw) {
    const f = readTroopCode(raw);
    if (!f) { this.h.toast('Ese código no vale. Pídele a tu amigo el de su finca: empieza por LAF-.'); this.h.sfx('error'); return null; }
    this.war().friend = f;
    this.mbChanged();
    this.h.toast(`Código de ${f.name}: ${f.inf} infantes y ${f.cab} jinetes. El resultado no le llega.`);
    return f;
  };
  P.warSetNick = function (nick) {
    const W = this.war();
    W.nick = slugNick(nick);
    this.mbChanged();
    return W.nick;
  };
  P.warCanSend = function (det) { return detachmentError(this.mb().army, this.s.res.viveres || 0, det); };
  P.warCanRepel = function (cityId, det) {
    const W = this.war();
    if (!W?.inbound || W.inbound.city !== cityId) return 'Esa columna ya no está en camino.';
    if (!this.mbFreed(cityId)) return 'Esa ciudad ya no es tuya.';
    return reinforcementError(this.mb().army, this.s.res.viveres || 0, det || {});
  };
  P.warPower = function (id) {
    const r = RIVAL_BY[id];
    if (!r) return 0;
    const W = this.war();
    const mood = W.rivals[id]?.mood || 1;
    let gar = 0;
    try { gar = this.csGarTotal(); } catch { gar = 0; }
    let p = (r.base + this.mb().freed.length * 14 + this.mbSoldiers() * 0.28 + gar * 0.12) * mood;
    if (W.inbound && W.inbound.rivalId === id) p = Math.max(r.base * 0.45, p - W.inbound.power);
    return Math.max(16, Math.round(p));
  };
  P.warDefensePower = function (cityId, camp = {}) {
    let mil = 8, gar = 0, mult = 1;
    try { mil = this.csMilitia(cityId); gar = this.csGarPower(cityId); mult = this.csDefMult(cityId); } catch { /* sin castro */ }
    const extra = (camp.inf || 0) * 4 + (camp.cab || 0) * 10 + (camp.cart || 0) * 14;
    return Math.round((mil + gar) * mult + extra);
  };
  P.warInterval = function () {
    const n = this.mb().freed.length;
    return Math.max(WAR.INT_MIN, WAR.INT_MAX - 40 * n) * (0.85 + Math.random() * 0.3);
  };
  P.warPick = function () {
    const W = this.war();
    let best = RIVALS[0].id, s = -1;
    for (const r of RIVALS) {
      const w = (W.rivals[r.id]?.mood || 1) * (0.65 + Math.random() * 0.7);
      if (w > s) { s = w; best = r.id; }
    }
    return best;
  };
  P.warLaunch = function (rivalId, { warn = WAR.WARN, at = rt(), quiet = false } = {}) {
    const owned = this.mb().freed.filter((id) => CITY_BY_ID[id]);
    if (!owned.length) return null;
    const W = this.war();
    if (W.inbound) return W.inbound;
    const id = rivalId && RIVAL_BY[rivalId] ? rivalId : this.warPick();
    const farms = owned.filter((c) => this.mb().farms[c]);
    const city = farms.length && Math.random() < 0.7 ? farms[Math.floor(Math.random() * farms.length)] : owned[Math.floor(Math.random() * owned.length)];
    const full = this.warPower(id);
    const power = Math.max(8, Math.round(full * (0.4 + Math.random() * 0.18)));
    W.seq = (W.seq || 0) + 1;
    W.inbound = { id: `w${W.seq}`, rivalId: id, city, power, at, hit: at + warn };
    W.next = 0;
    if (!quiet) {
      this.h.toast(`¡Aviso! La tropa de ${RIVAL_BY[id].name} marcha sobre ${CITY_BY_ID[city].name}.`);
      this.h.sfx('horn');
    }
    this.mbChanged();
    return W.inbound;
  };
  P.warRecover = function (t) {
    const W = this.war();
    const prev = W.recoveredAt || t;
    const dtMin = Math.max(0, Math.min(180, (t - prev) / 60));
    W.recoveredAt = t;
    if (!dtMin) return;
    for (const r of RIVALS) {
      const row = W.rivals[r.id];
      if (!row) continue;
      if (row.mood < 1) row.mood = Math.min(1, row.mood + WAR.RECOVER * dtMin);
      else if (row.mood > 1) row.mood = Math.max(1, row.mood - WAR.RECOVER * dtMin);
    }
  };
  P.warApply = function (o) {
    const W = this.war();
    const M = this.mb();
    const freedBefore = M.freed.slice();
    if (o.war === 'repel') {
      if (!W.inbound || !this.mbFreed(o.cityId)) {
        W.inbound = null;
        W.next = rt() + this.warInterval();
        this.mbChanged();
        return { cancelled: true, war: 'repel', cityId: o.cityId };
      }
    }
    const a = M.army;
    let gar = { inf: 0, cab: 0 };
    if (o.war === 'repel') {
      try { gar = { ...this.csCity(o.cityId).gar }; } catch { gar = { inf: 0, cab: 0 }; }
    }
    const hasFarm = !!(o.war === 'repel' && M.farms[o.cityId]);
    const farmBank = hasFarm ? (M.farms[o.cityId].bank || 0) : 0;
    const rival = o.friend ? null : W.rivals[o.rivalId];
    const st = settleWar({
      army: a, gar, freed: freedBefore, money: this.s.money | 0, farmBank, viveres: this.s.res.viveres || 0, mood: rival?.mood ?? 1,
    }, { ...o, hasFarm, now: rt(), raidBlock: WAR.RAID_BLOCK });
    a.inf = st.army.inf; a.cab = st.army.cab; a.cart = st.army.cart;
    this.s.res.viveres = st.viveres;
    if (st.loot) this.addMoney(st.loot);
    else if (st.money !== (this.s.money | 0)) { this.s.money = st.money; this.h.changed('money'); }
    if (st.xp) this.addXp(st.xp);
    if (o.war === 'repel') {
      try {
        const c = this.csCity(o.cityId);
        c.gar.inf = st.gar.inf; c.gar.cab = st.gar.cab;
        if (!st.win && !st.spared && hasFarm) {
          const f = M.farms[o.cityId];
          f.bank = 0; f.vbank = 0;
          c.raidUntil = st.raidUntil;
        }
      } catch { /* sin ciudad */ }
      W.inbound = null;
      W.next = rt() + this.warInterval();
      if (st.win || st.spared) W.stats.held++;
      else W.stats.raided++;
    } else {
      W.stats.invaded++;
      if (st.win) W.stats.won++;
      else W.stats.lost++;
    }
    if (rival) rival.mood = st.mood;
    if (M.freed.length !== freedBefore.length || M.freed.some((id, i) => id !== freedBefore[i])) M.freed = freedBefore;
    const foeName = o.foeName || RIVAL_BY[o.rivalId]?.name || 'la otra finca';
    const place = o.war === 'invade'
      ? (o.friend ? `la finca de ${foeName}` : (RIVAL_BY[o.rivalId]?.finca || `la finca de ${foeName}`))
      : (CITY_BY_ID[o.cityId]?.name || 'la ciudad');
    const who = lossTxt(st.lost);
    let title, line;
    if (o.war === 'invade' && st.win) {
      title = `¡Tomaste ${place}!`;
      line = `La tropa de ${foeName} se dispersó y volvió a su casa. Botín: +${st.loot} pesos. +${st.xp} XP. ${who} Esto no cambia las ciudades de la campaña.`;
    } else if (o.war === 'invade') {
      title = `Retirada en ${place}`;
      line = `No se pudo tomar la plaza. ${who} +${st.xp} XP. Las ciudades de la campaña siguen igual.`;
    } else if (st.spared) {
      title = `${place} no fue tocada`;
      line = `La tropa de ${foeName} se acercó y se retiró sin atacar. ${place} sigue libre.`;
    } else if (o.war === 'repel' && st.win) {
      title = `¡${place} resistió!`;
      line = `La tropa de ${foeName} se dispersó y volvió a su casa. +${st.xp} XP. ${who} La ciudad sigue libre.`;
    } else {
      title = `Saqueo en ${place}`;
      const took = st.stolen ? ` Se llevaron ${st.stolen} pesos${hasFarm ? ' de la renta' : ''}.` : '';
      const pause = hasFarm ? ' La renta para unos 10 minutos.' : '';
      line = `La tropa de ${foeName} saqueó y se fue.${took}${pause} ${who} ${place} sigue libre: no vuelve al Régimen.`;
    }
    if (o.friend) line += ' El resultado se queda en tu teléfono: la finca de tu amigo no cambia.';
    W.log.push(line);
    if (W.log.length > 8) W.log.splice(0, W.log.length - 8);
    const res = {
      war: o.war, win: st.win, spared: st.spared, foeName, place, lost: st.lost, loot: st.loot, stolen: st.stolen,
      xp: st.xp, field: !!o.field, offline: !!o.offline, friend: !!o.friend, title, line, cityId: o.cityId, rivalId: o.rivalId,
    };
    this.h.changed('res');
    this.mbChanged();
    return res;
  };
  P.warQuick = function (o) {
    const sent = cleanDet(o.sent);
    const why = o.war === 'invade' ? this.warCanSend(sent) : this.warCanRepel(o.cityId, sent);
    if (why) { this.h.toast(why); this.h.sfx('error'); return null; }
    const mine = o.war === 'invade'
      ? sent.inf * 4 + sent.cab * 10 + sent.cart * 14
      : this.warDefensePower(o.cityId, sent);
    const enemy = o.enemyPower || 1;
    const swung = mine * (0.85 + 0.3 * Math.random());
    const win = swung >= enemy;
    const frac = win ? Math.min(0.42, 0.16 * (enemy / Math.max(1, swung))) : Math.min(0.6, 0.38);
    const lost = {
      inf: Math.round(sent.inf * frac),
      cab: Math.round(sent.cab * frac),
      cart: !win && sent.cart > 0 && frac >= 0.35 ? 1 : 0,
      garInf: 0,
      garCab: 0,
    };
    if (o.war === 'repel') {
      try {
        const g = this.csCity(o.cityId).gar;
        lost.garInf = Math.round(g.inf * frac * (win ? 0.85 : 1));
        lost.garCab = Math.round(g.cab * frac * (win ? 0.85 : 1));
      } catch { /* sin guarnición */ }
    }
    return this.warApply({ ...o, win, lost, sent, field: false });
  };
  P.warAutoInbound = function ({ lossOk = true, offline = false, roll = Math.random() } = {}) {
    const A = this.war().inbound;
    if (!A) return null;
    const mine = this.warDefensePower(A.city, {});
    const swung = mine * (0.85 + 0.3 * roll);
    let win = swung >= A.power;
    let spared = false;
    if (!win && lossOk === false) { win = true; spared = true; }
    const frac = spared ? 0 : win ? Math.min(0.4, 0.16 * (A.power / Math.max(1, swung))) : Math.min(0.55, 0.36);
    let gar = { inf: 0, cab: 0 };
    try { gar = this.csCity(A.city).gar; } catch { /* nada */ }
    const lost = { inf: 0, cab: 0, cart: 0, garInf: Math.round((gar.inf || 0) * frac), garCab: Math.round((gar.cab || 0) * frac) };
    return this.warApply({
      war: 'repel', win, spared, lost, sent: { inf: 0, cab: 0, cart: 0 },
      rivalId: A.rivalId, cityId: A.city, foeName: RIVAL_BY[A.rivalId]?.name || 'Otra finca',
      enemyPower: A.power, field: false, offline,
    });
  };
  P.warOffline = function () {
    const W = this.war(), t = rt();
    const away = W.seen ? Math.max(0, t - W.seen) : 0;
    W.seen = t;
    if (!this.mbUnlocked() || !this.mb().freed.length) return null;
    if (!W.next && !W.inbound) W.next = t + WAR.FIRST;
    const lines = [];
    let losses = 0, n = 0;
    while (n < WAR.OFF_MAX) {
      if (!W.inbound) {
        if (!W.next || W.next > t) break;
        if (W.next + WAR.WARN > t) { this.warLaunch(null, { at: W.next, quiet: true }); break; }
        this.warLaunch(null, { at: W.next, quiet: true });
      }
      if (!W.inbound || W.inbound.hit > t) break;
      const r = this.warAutoInbound({ lossOk: losses < 1, offline: true });
      n++;
      if (!r || r.cancelled) continue;
      if (!r.win && !r.spared) losses++;
      lines.push(r.line);
    }
    if (!W.inbound && W.next && W.next < t) W.next = t + WAR.FIRST;
    if (lines.length) W.report = { away, lines: lines.slice(-8) };
    return lines.length ? W.report : null;
  };
  P.warUpdate = function () {
    const t = rt();
    if (t - (this.warTick || 0) < 0.5) return;
    this.warTick = t;
    const W = this.war();
    if (!W) return;
    this.warRecover(t);
    if (!this.mbUnlocked()) return;
    W.seen = t;
    if (this.warHold || this.csHold) {
      if (W.inbound && t >= W.inbound.hit) W.inbound.hit = t + 25;
      return;
    }
    if (!this.mb().freed.length) { if (!W.inbound) W.next = 0; return; }
    if (W.inbound) {
      if (t >= W.inbound.hit) {
        const r = this.warAutoInbound();
        if (r && !r.cancelled) (this.warEvents ||= []).push(r);
      }
      return;
    }
    if (!W.next) W.next = t + (W.seq ? this.warInterval() : WAR.FIRST);
    if (t >= W.next) this.warLaunch();
  };
  P.warCheat = function (k) {
    const W = this.war();
    if (k === 'raid') { W.inbound = null; return this.warLaunch(null, { warn: 20 }); }
    if (k === 'strong') { W.inbound = null; const a = this.warLaunch(null, { warn: 20 }); if (a) a.power = Math.round(a.power * 3); return a; }
    if (k === 'now') { if (W.inbound) W.inbound.hit = rt(); return W.inbound; }
    return null;
  };
}

try {
  installWar(Sim);
  registerMigration((s) => { if (s.ext?.mambi) ensureWar(s); });
  registerSimModule({
    id: 'war',
    init: (sim) => { ensureWar(sim.s); try { sim.warOffline(); } catch (e) { console.warn('[guerra] ausencia', e); } },
    update: (sim) => { try { sim.warUpdate(); } catch (e) { if (!sim.warErr) console.warn('[guerra]', e); sim.warErr = 1; } },
  });
} catch (e) { console.warn('[guerra] no se pudo instalar', e); }
