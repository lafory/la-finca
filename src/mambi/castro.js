// Contraataques del Régimen (ejército gris): después de liberar ciudades, columnas grises vienen a retomarlas o a
// saquear las fincas regionales. Aviso con cuenta atrás, guarniciones y defensas (trinchera, fortín), batalla con las
// mismas probabilidades que la campaña, ciudades perdidas que se recuperan con una batalla normal y ataques resueltos
// al volver (con tope justo). Estado en s.ext.mambi.castro. Ver docs/PLAN-CASTRO.md.
//
// Estructura por ciudad pensada para reutilizarla en un futuro multijugador (otros jugadores atacando fincas):
//   cities[id] = { owner: 'jugador' | 'regimen' | <id de jugador>, gar: { inf, cab }, def: { trinchera, fortin }, raidUntil, since }
// Aquí NO hay red: solo el Régimen ataca, en el propio teléfono.
import { registerSimModule, registerMigration, registerAct, registerGameModule } from '../registry.js';
import { Sim } from '../sim.js';
import { CITY_BY_ID, UNITS } from './data.js';
import { CastroUI } from './castro-ui.js';

// ---- parámetros (en segundos de tiempo REAL: ⏩ no adelanta los ataques)
export const CS = {
  WARN: 150, // cuenta atrás desde el aviso hasta el golpe
  FIRST: 12 * 60, // primer ataque tras liberar la primera ciudad
  INT_MAX: 18 * 60, INT_MIN: 7 * 60, INT_PER_CITY: 50, // intervalo entre ataques: baja con cada ciudad libre
  WAVE_CAP: 25, // la fuerza deja de crecer tras 25 oleadas
  MILITIA: 0.25, // el pueblo defiende con un cuarto de lo que tenía la guardia del Régimen
  RAID_MULT: 0.7, RAID_BLOCK: 10 * 60, // saqueo: columna más chica; si gana, se lleva la renta y la finca para 10 min
  OFF_MAX: 4, // ataques resueltos como mucho al volver
  OFF_LOSS_SHORT: 1, OFF_LOSS_LONG: 2, OFF_LONG: 8 * 3600, // ciudades perdidas como mucho por ausencia (1, o 2 si fueron más de 8 h)
  RETAKE_LOOT: 0.5, // al recuperar una ciudad el botín es la mitad
  DEF_LOSS: 0.8, // los que defienden en trinchera se dispersan menos
};
export const DEFENSES = {
  trinchera: { name: 'Trinchera', max: 3, bonus: 0.2, detail: 'Zanjas y sacos de arena: +20 % de defensa por nivel.', cost: (L, n) => ({ pesos: Math.round(800 * L * (1 + n * 0.3)), viveres: 30 * L, azucar: 2 * L }) },
  fortin: { name: 'Fortín', max: 2, bonus: 0.5, detail: 'Fortín de piedra con aspilleras: +50 % de defensa por nivel. Hace falta trinchera.', cost: (L, n) => ({ pesos: Math.round(4000 * L * (1 + n * 0.3)), viveres: 80 * L, azucar: 10 * L }) },
};
export const DEF_ORDER = ['trinchera', 'fortin'];
export const KIND = { retomar: 'Columna para retomar la ciudad', saqueo: 'Saqueo de la finca regional' };

export const rt = () => Date.now() / 1000;
const int = (v) => Math.max(0, Math.floor(+v || 0));
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

export function ensureCastro(s) {
  s.ext ||= {};
  const M = s.ext.mambi;
  if (!M || typeof M !== 'object') return null;
  const d = obj(M.castro), st = obj(d.stats);
  const freed = new Set(Array.isArray(M.freed) ? M.freed : []);
  const cities = {};
  for (const [id, c0] of Object.entries(obj(d.cities))) {
    if (!CITY_BY_ID[id]) continue;
    const c = obj(c0), g = obj(c.gar), df = obj(c.def);
    cities[id] = {
      owner: typeof c.owner === 'string' && c.owner ? c.owner : (freed.has(id) ? 'jugador' : 'regimen'),
      gar: { inf: int(g.inf), cab: int(g.cab) },
      def: { trinchera: Math.min(DEFENSES.trinchera.max, int(df.trinchera)), fortin: Math.min(DEFENSES.fortin.max, int(df.fortin)) },
      raidUntil: num(c.raidUntil), since: num(c.since),
    };
  }
  let a = d.attack && typeof d.attack === 'object' ? d.attack : null;
  if (a && (!CITY_BY_ID[a.city] || !KIND[a.kind] || !Number.isFinite(+a.hit) || !(+a.power > 0))) a = null;
  if (a) a = { id: String(a.id || 'a'), city: a.city, kind: a.kind, power: Math.round(+a.power), at: num(a.at), hit: +a.hit };
  const rep = d.report && typeof d.report === 'object' && Array.isArray(d.report.lines) ? { away: num(d.report.away), lines: d.report.lines.filter((l) => typeof l === 'string').slice(0, 12) } : null;
  M.castro = {
    v: 1,
    cities,
    attack: a,
    next: num(d.next),
    waves: int(d.waves),
    seen: num(d.seen),
    stats: { attacks: int(st.attacks), held: int(st.held), lost: int(st.lost), retaken: int(st.retaken), raids: int(st.raids) },
    log: Array.isArray(d.log) ? d.log.filter((l) => typeof l === 'string').slice(-8) : [],
    report: rep,
  };
  return M.castro;
}

export function installCastro(SimC) {
  const P = SimC.prototype;
  P.cs = function () { const M = this.mb(); return (M.castro && M.castro.v === 1 && M.castro.cities) ? M.castro : ensureCastro(this.s); };
  // entrada de la ciudad (se crea al liberarla)
  P.csCity = function (id) {
    const C = this.cs();
    if (!C.cities[id]) C.cities[id] = { owner: this.mbFreed(id) ? 'jugador' : 'regimen', gar: { inf: 0, cab: 0 }, def: { trinchera: 0, fortin: 0 }, raidUntil: 0, since: rt() };
    return C.cities[id];
  };
  P.csOwned = function () { return this.mb().freed.filter((id) => CITY_BY_ID[id]); };
  P.csOccupied = function (id) { const c = this.cs().cities[id]; return !!c && c.owner === 'regimen' && !this.mbFreed(id); };
  P.csLog = function (t) { const C = this.cs(); C.log.push(t); if (C.log.length > 8) C.log.splice(0, C.log.length - 8); };
  // ciudades libres ↔ dueño (libera/recupera la campaña normal)
  P.csSync = function () {
    const C = this.cs(); let changed = false;
    for (const id of this.csOwned()) {
      const c = this.csCity(id);
      if (c.owner !== 'jugador') {
        if (c.owner === 'regimen') { C.stats.retaken++; this.csLog(`${CITY_BY_ID[id].name} recuperada: la bandera cubana vuelve a la plaza.`); }
        c.owner = 'jugador'; c.since = rt(); changed = true;
      }
    }
    return changed;
  };

  // ---- fuerza y probabilidades (mismas reglas que la campaña: azar 0,85–1,15)
  P.csGarPower = function (id) { const c = this.cs().cities[id]; if (!c) return 0; return c.gar.inf * UNITS.inf.power + c.gar.cab * UNITS.cab.power; };
  P.csDefMult = function (id) { const c = this.cs().cities[id]; if (!c) return 1; return 1 + c.def.trinchera * DEFENSES.trinchera.bonus + c.def.fortin * DEFENSES.fortin.bonus; };
  P.csMilitia = function (id) { return Math.max(3, Math.round(CITY_BY_ID[id].guards * CS.MILITIA)); };
  P.csDefense = function (id) { return (this.csMilitia(id) + this.csGarPower(id)) * this.csDefMult(id); };
  P.csChance = function (id, power) { const d = this.csDefense(id); if (!d) return 0; return Math.max(0, Math.min(1, (1.15 - power / d) / 0.3)); };
  P.csColumn = function (id, kind, r = Math.random()) {
    const C = this.cs(), n = this.csOwned().length;
    const f = (0.45 + 0.035 * n + 0.04 * Math.min(C.waves, CS.WAVE_CAP)) * (kind === 'saqueo' ? CS.RAID_MULT : 1) * (0.9 + 0.2 * r);
    return Math.max(4, Math.round(CITY_BY_ID[id].guards * f));
  };
  P.csInterval = function (r = Math.random()) { const n = this.csOwned().length; return Math.max(CS.INT_MIN, CS.INT_MAX - CS.INT_PER_CITY * n) * (0.8 + 0.4 * r); };

  // ---- elegir objetivo: las fincas y las ciudades flojas atraen más
  P.csPick = function (r = Math.random()) {
    const owned = this.csOwned(); if (!owned.length) return null;
    const M = this.mb();
    const w = owned.map((id) => { const farm = M.farms[id] ? 1.5 : 0; const weak = Math.min(2, CITY_BY_ID[id].guards / Math.max(1, this.csDefense(id))); return 1 + farm + weak; });
    let t = r * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < owned.length; i++) { t -= w[i]; if (t <= 0) return owned[i]; }
    return owned[owned.length - 1];
  };
  // lanza una columna (aviso con cuenta atrás)
  P.csLaunch = function (cityId, { kind, warn = CS.WARN, mult = 1, at = rt(), quiet = false } = {}) {
    const C = this.cs();
    const id = cityId && this.mbFreed(cityId) ? cityId : this.csPick();
    if (!id) return null;
    const k = kind || (this.mb().farms[id] && Math.random() < 0.4 ? 'saqueo' : 'retomar');
    this.csCity(id);
    C.waves++; C.stats.attacks++;
    C.attack = { id: `a${C.waves}`, city: id, kind: k, power: Math.round(this.csColumn(id, k) * mult), at, hit: at + warn };
    C.next = 0;
    if (!quiet) { this.h.toast(`¡Aviso! Una columna del Régimen marcha sobre ${CITY_BY_ID[id].name}.`); this.h.sfx('horn'); }
    this.mbChanged();
    return C.attack;
  };

  // ---- guarnición: tropa del campamento ↔ ciudad
  P.csStation = function (id, k, n) {
    if (!this.mbFreed(id) || !(k === 'inf' || k === 'cab')) return false;
    const c = this.csCity(id), a = this.mb().army;
    const want = Math.trunc(+n || 0);
    n = want > 0 ? Math.min(want, a[k]) : -Math.min(-want, c.gar[k]);
    if (!n) { this.h.toast(want > 0 ? 'No quedan de esos en el campamento. Recluta más.' : 'No hay más en la guarnición.'); this.h.sfx('error'); return false; }
    a[k] -= n; c.gar[k] += n;
    this.h.sfx('tap');
    this.mbChanged();
    return true;
  };
  P.csGarTotal = function () { let n = 0; for (const c of Object.values(this.cs().cities)) n += c.gar.inf + c.gar.cab; return n; };

  // ---- obras de defensa
  P.csDefCost = function (id, k) { const c = this.cs().cities[id], D = DEFENSES[k]; const L = (c?.def[k] || 0) + 1; if (L > D.max) return null; return D.cost(L, CITY_BY_ID[id].n); };
  P.csCanBuild = function (id, k) {
    if (!this.mbFreed(id)) return 'Primero hay que tener la ciudad.';
    const c = this.csCity(id), cost = this.csDefCost(id, k);
    if (!cost) return 'Nivel máximo.';
    if (k === 'fortin' && !c.def.trinchera) return 'Primero cava una trinchera.';
    if ((this.s.res.viveres || 0) < cost.viveres) return `Hacen falta ${cost.viveres} víveres.`;
    if (this.mbSugar() < cost.azucar) return `Hacen falta ${cost.azucar} sacos de azúcar del central.`;
    if (this.s.money < cost.pesos) return 'Todavía no alcanzan los pesos.';
    return null;
  };
  P.csBuild = function (id, k) {
    const why = this.csCanBuild(id, k);
    if (why) { this.h.toast(why); this.h.sfx('error'); return false; }
    const cost = this.csDefCost(id, k);
    if (!this.spend(cost.pesos)) return false;
    this.s.res.viveres -= cost.viveres;
    if (cost.azucar) this.s.ext.central.stock.azucar -= cost.azucar;
    const c = this.csCity(id); c.def[k]++;
    this.addXp(20 + 15 * c.def[k]);
    this.h.sfx('buy');
    this.h.toast(`${DEFENSES[k].name} nivel ${c.def[k]} en ${CITY_BY_ID[id].name}.`);
    this.h.changed('res');
    this.mbChanged();
    return true;
  };

  // ---- resolver el golpe
  // opts.lossOk = false → si la defensa perdiera, la columna se retira sin tomar nada (tope de pérdidas offline)
  P.csResolve = function (roll = Math.random(), { lossOk = true, offline = false } = {}) {
    const C = this.cs(), A = C.attack;
    if (!A) return null;
    C.attack = null;
    C.next = (offline ? A.hit : rt()) + this.csInterval();
    const city = CITY_BY_ID[A.city];
    if (!this.mbFreed(A.city)) { this.mbChanged(); return { cancelled: true, city: A.city }; }
    const c = this.csCity(A.city), before = { inf: c.gar.inf, cab: c.gar.cab };
    const mult = this.csDefMult(A.city), militia = this.csMilitia(A.city);
    const power = this.csDefense(A.city) * (0.85 + 0.3 * roll);
    let held = power >= A.power;
    let spared = false;
    if (!held && !lossOk) { held = true; spared = true; }
    const frac = spared ? 0 : held ? Math.min(0.5, 0.18 * (A.power / Math.max(1, power)) * CS.DEF_LOSS) : Math.min(0.7, 0.4 * CS.DEF_LOSS);
    const lost = { inf: Math.round(c.gar.inf * frac), cab: Math.round(c.gar.cab * frac) };
    c.gar.inf -= lost.inf; c.gar.cab -= lost.cab;
    const M = this.mb();
    const res = { id: A.id, city: A.city, kind: A.kind, attack: A.power, power: Math.round(power), held, spared, lost, before, mult, militia, def: { ...c.def }, offline, stolen: 0, occupied: false, back: { inf: 0, cab: 0 } };
    this.mbAccrue?.();
    if (held) {
      C.stats.held++;
      const xp = spared ? 0 : Math.round(A.power * 2);
      if (xp) this.addXp(xp);
      res.xp = xp;
      this.csLog(spared ? `${city.name}: la columna del Régimen se retiró sin atacar.` : `${city.name} resistió a ${A.power} del Régimen.`);
    } else if (A.kind === 'saqueo' && M.farms[A.city]) {
      const f = M.farms[A.city];
      res.stolen = Math.floor(f.bank || 0); f.bank = 0; f.vbank = 0;
      c.raidUntil = rt() + CS.RAID_BLOCK;
      C.stats.raids++;
      this.csLog(`Saquearon la finca de ${city.name}: se llevaron ${res.stolen} pesos de renta.`);
    } else {
      // la ciudad cae: vuelve a gris, la finca se queda pero ocupada, la guarnición vuelve al campamento
      C.stats.lost++;
      M.freed = M.freed.filter((x) => x !== A.city);
      c.owner = 'regimen'; c.since = rt();
      res.back = { ...c.gar };
      M.army.inf += c.gar.inf; M.army.cab += c.gar.cab; c.gar = { inf: 0, cab: 0 };
      c.def.trinchera = Math.max(0, c.def.trinchera - 1); c.def.fortin = Math.max(0, c.def.fortin - 1);
      res.occupied = true;
      this.csLog(`${city.name} cayó en manos del Régimen.${M.farms[A.city] ? ' Su finca está ocupada.' : ''}`);
    }
    this.h.changed('res');
    this.mbChanged();
    return res;
  };

  // ---- ataques mientras el juego estaba cerrado (al cargar): tope justo y resumen en español
  P.csOffline = function () {
    const C = this.cs(), t = rt();
    const away = C.seen ? Math.max(0, t - C.seen) : 0;
    C.seen = t;
    if (!this.mbUnlocked() || !this.csOwned().length) return null;
    const cap = away > CS.OFF_LONG ? CS.OFF_LOSS_LONG : CS.OFF_LOSS_SHORT;
    const lines = []; let losses = 0, n = 0;
    while (n < CS.OFF_MAX) {
      if (!C.attack) {
        if (!C.next || C.next > t || !this.csOwned().length) break;
        if (C.next + CS.WARN > t) { this.csLaunch(null, { at: C.next, quiet: true }); break; } // el aviso sigue corriendo
        this.csLaunch(null, { at: C.next, quiet: true });
      }
      if (C.attack.hit > t) break;
      const r = this.csResolve(Math.random(), { lossOk: losses < cap, offline: true });
      n++;
      if (!r || r.cancelled) continue;
      const nm = CITY_BY_ID[r.city].name;
      if (r.spared) lines.push(`${nm}: una columna se acercó y se retiró sin atacar.`);
      else if (r.held) lines.push(`${nm} resistió a ${r.attack} soldados del Régimen.${r.lost.inf + r.lost.cab ? ` ${r.lost.inf + r.lost.cab} de la guarnición se dispersaron y volvieron a sus casas.` : ''}`);
      else if (r.occupied) { losses++; lines.push(`${nm} cayó en manos del Régimen.${this.mb().farms[r.city] ? ' Su finca regional está ocupada y no paga renta.' : ''} Recupérala con una batalla.`); }
      else { losses++; lines.push(`Saquearon la finca de ${nm}: se llevaron ${r.stolen} pesos de renta.`); }
    }
    // si siguen atrasados (ausencia muy larga), el próximo llega después de volver
    if (!C.attack && C.next && C.next < t) C.next = t + CS.FIRST / 2;
    if (lines.length) C.report = { away, lines: [...(C.report?.lines || []), ...lines].slice(-12) };
    return lines.length ? C.report : null;
  };

  // ---- cada segundo
  // se revisa por reloj real (cada medio segundo), aunque los cuadros vayan lentos
  P.csUpdate = function () {
    const t = rt();
    if (this.csFrozen || t - (this.csTick || 0) < 0.5) return;
    this.csTick = t;
    const C = this.cs();
    C.seen = t;
    if (this.csSync()) this.mbChanged();
    if (!this.mbUnlocked() || !this.csOwned().length) { if (!C.attack) C.next = 0; return; }
    if (C.attack) {
      if (t >= C.attack.hit && !this.csHold) { const r = this.csResolve(); if (r && !r.cancelled) (this.csEvents ||= []).push(r); }
      return;
    }
    if (!C.next) C.next = t + (C.waves ? this.csInterval() : CS.FIRST);
    if (t >= C.next) this.csLaunch();
  };

  // ---- recuperar una ciudad con la batalla normal: el botín es la mitad
  const battle = P.mbBattle;
  P.mbBattle = function (cityId, tactic, roll) {
    let was = false;
    try { was = this.csOccupied(cityId); } catch { /* sin castro */ }
    const r = battle.call(this, cityId, tactic, roll);
    try {
      if (r && r.win && was) {
        const cut = Math.floor(r.loot * CS.RETAKE_LOOT);
        this.s.money = Math.max(0, this.s.money - cut); r.loot -= cut; this.mb().stats.loot -= cut;
        r.retaken = true;
        this.csSync();
        this.h.changed('money');
      }
    } catch (e) { console.warn('[castro] recuperar', e); }
    return r;
  };
  // finca ocupada o saqueada: no paga renta
  const rate = P.mbFarmRate;
  P.mbFarmRate = function (id, lvl) {
    const r = rate.call(this, id, lvl);
    try {
      if (lvl == null) {
        const c = this.cs().cities[id];
        if (!this.mbFreed(id) || (c && c.raidUntil > rt())) return { pesos: 0, viveres: 0 };
      }
    } catch { /* sin castro */ }
    return r;
  };

  // ---- trucos (?dev=1)
  P.csCheat = function (k, o = {}) {
    const C = this.cs();
    if (k === 'attack') { if (C.attack) C.attack = null; return this.csLaunch(o.city || null, { kind: o.kind || 'retomar', warn: o.warn ?? 20, mult: o.mult ?? 1 }); }
    if (k === 'strong') { if (C.attack) C.attack = null; return this.csLaunch(o.city || null, { kind: 'retomar', warn: o.warn ?? 20, mult: 4 }); }
    if (k === 'now') { if (C.attack) C.attack.hit = rt(); return C.attack; }
    if (k === 'away') { // simula h horas fuera: el próximo ataque quedó atrás
      const h = o.h || 3; C.attack = null; C.seen = rt() - h * 3600; C.next = rt() - h * 3600 + 600;
      this.csFrozen = true; // hasta recargar: que el reloj no pise la ausencia simulada
      return C;
    }
    return null;
  };
}

// ---- registro (nunca debe impedir entrar a la finca)
try {
  installCastro(Sim);
  registerMigration((s) => { if (s.ext?.mambi) ensureCastro(s); });
  registerSimModule({
    id: 'castro',
    init: (sim) => { ensureCastro(sim.s); sim.csSync(); sim.csOffline(); },
    update: (sim, dt) => sim.csUpdate(dt),
  });
  registerGameModule({
    attach(game) { try { game.castro = new CastroUI(game); } catch (e) { console.warn('[castro] UI', e); } },
    frame(game, dt) { game.castro?.farmFrame(dt); },
  });
  for (const a of ['csgar', 'csdef', 'csgo', 'cscheat', 'csok']) registerAct(a, (ui, d) => ui.g.castro?.act(a, d));
} catch (e) { console.warn('[castro] no se pudo instalar', e); }
