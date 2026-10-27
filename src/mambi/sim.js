// Lógica de la Campaña Mambisa sobre Sim (estado en s.ext.mambi; víveres en s.res.viveres).
import { now } from '../state.js';
import { ITEMS } from '../data.js';
import {
  MAMBI_LEVEL, MAMBI_CENTRAL_STAGE, CITIES, CITY_BY_ID, UNITS, ARMY_BASE, ARMY_PER_CITY, CART_POWER, CART_SAFE, TACTICS,
  FARM_LEVELS, FARM_OFFLINE_CAP, LOOT_PER_GUARD, FOOD, GOODS,
} from './data.js';
import { normFarm } from './regional-sim.js';

const int = (v) => Math.max(0, Math.floor(+v || 0));
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

export function ensureMambi(s) {
  s.ext ||= {};
  const d = obj(s.ext.mambi), a = obj(d.army), st = obj(d.stats);
  const farms = {};
  for (const [id, f] of Object.entries(obj(d.farms))) if (CITY_BY_ID[id] && f && typeof f === 'object') farms[id] = normFarm(id, f);
  s.ext.mambi = {
    army: { inf: int(a.inf), cab: int(a.cab), cart: Math.min(UNITS.cart.max, int(a.cart)) },
    freed: Array.isArray(d.freed) ? d.freed.filter((id) => CITY_BY_ID[id]) : [],
    farms,
    stats: { battles: int(st.battles), won: int(st.won), lost: int(st.lost), loot: int(st.loot), income: int(st.income) },
    intro: !!d.intro,
    // Por ciudad (reservado para contraataques del Régimen): dueño y guarnición mambisa que la defiende.
    garrison: Object.fromEntries(Object.entries(obj(d.garrison)).filter(([id]) => CITY_BY_ID[id]).map(([id, g]) => [id, { owner: obj(g).owner === 'regimen' ? 'regimen' : 'mambi', troops: int(obj(g).troops) }])),
    castro: d.castro, // contraataques del Régimen (src/mambi/castro.js)
    cur: d.cur && CITY_BY_ID[d.cur] ? d.cur : undefined, // finca de provincia donde está el guajiro (src/provincias)
    pvNote: d.pvNote, // aviso pendiente de la conversión de fincas viejas
  };
  if (!s.res) s.res = {};
  s.res.viveres = int(s.res.viveres);
  return s.ext.mambi;
}

export function installMambi(Sim) {
  const P = Sim.prototype;
  P.mb = function () { return this.s.ext.mambi || ensureMambi(this.s); };
  P.mbUnlocked = function () { return this.s.level >= MAMBI_LEVEL && (this.s.ext.central?.stage || 0) >= MAMBI_CENTRAL_STAGE; };
  P.mbSoldiers = function () { const a = this.mb().army; return a.inf + a.cab; };
  P.mbCap = function () { return ARMY_BASE + ARMY_PER_CITY * this.mb().freed.length; };
  P.mbNext = function () { const f = new Set(this.mb().freed); return CITIES.find((c) => !f.has(c.id)) || null; };
  P.mbFreed = function (id) { return this.mb().freed.includes(id); };
  P.mbSugar = function () { return this.s.ext.central?.stock?.azucar || 0; };
  P.mbChanged = function () { this.mbVer = (this.mbVer || 0) + 1; this.h.changed('mambi'); };

  // ---- tropas
  P.mbCanRecruit = function (k) {
    const u = UNITS[k], a = this.mb().army, s = this.s;
    if (k === 'cart') { if (a.cart >= u.max) return 'Ya tienes todas las carretas.'; if (this.mbSugar() < u.azucar) return `Hacen falta ${u.azucar} sacos de azúcar del central.`; }
    else { if (this.mbSoldiers() >= this.mbCap()) return `El campamento está lleno (${this.mbCap()}). Libera ciudades para que crezca.`; if ((s.res.viveres || 0) < u.viveres) return `Hacen falta ${u.viveres} víveres. Mándalos desde la finca.`; }
    if (s.money < u.price) return 'Todavía no alcanzan los pesos.';
    return null;
  };
  P.mbRecruit = function (k) {
    const why = this.mbCanRecruit(k);
    if (why) { this.h.toast(why); this.h.sfx('error'); return false; }
    const u = UNITS[k];
    if (!this.spend(u.price)) return false;
    if (u.viveres) this.s.res.viveres -= u.viveres;
    if (u.azucar) this.s.ext.central.stock.azucar -= u.azucar;
    this.mb().army[k]++;
    this.h.sfx('buy');
    this.h.changed('res');
    this.mbChanged();
    return true;
  };
  // Manda a la campaña todo lo que se come de la canasta → víveres
  P.mbFoodValue = function () { let v = 0; for (const k of FOOD) v += (this.s.inv[k] || 0) * Math.ceil(ITEMS[k].sell / 10); return v; };
  P.mbSendFood = function () {
    const s = this.s; let v = 0, n = 0;
    for (const k of FOOD) { const q = s.inv[k] || 0; if (!q) continue; v += q * Math.ceil(ITEMS[k].sell / 10); n += q; s.inv[k] = 0; }
    if (!v) { this.h.toast('La canasta no tiene comida para mandar (huevos, tomates, leche, carne, frutas…).'); this.h.sfx('error'); return 0; }
    s.res.viveres = (s.res.viveres || 0) + v;
    this.h.toast(`Salió una carreta con ${n} cosas: +${v} víveres para la tropa.`);
    this.h.sfx('load');
    this.h.changed('inv'); this.h.changed('res');
    this.mbChanged();
    return v;
  };

  // ---- batallas
  P.mbPower = function (tactic, cityId) {
    const a = this.mb().army, c = CITY_BY_ID[cityId];
    const base = a.inf * UNITS.inf.power + a.cab * UNITS.cab.power;
    if (!base) return 0;
    let m = 1;
    if (tactic === 'carga') m = 0.9 + 0.8 * ((a.cab * UNITS.cab.power) / base);
    if (tactic === 'emboscada') m = c?.terrain === 'monte' ? 1.25 : 1.0;
    if (tactic === 'asedio') m = 0.95 + 0.06 * a.cart;
    return base * m * (1 + CART_POWER * a.cart);
  };
  // Probabilidad de ganar: la fuerza se multiplica por un azar uniforme 0,85–1,15
  P.mbChance = function (tactic, cityId) {
    const p = this.mbPower(tactic, cityId), g = CITY_BY_ID[cityId].guards;
    if (!p) return 0;
    return Math.max(0, Math.min(1, (1.15 - g / p) / 0.3));
  };
  P.mbCanAttack = function (cityId, tactic) {
    const c = CITY_BY_ID[cityId], nx = this.mbNext();
    if (!this.mbUnlocked()) return 'La campaña empieza cuando el central esté completo.';
    if (!c || this.mbFreed(cityId)) return 'Esa ciudad ya es libre.';
    if (!nx || nx.id !== cityId) return `Primero hay que liberar ${nx?.name}.`;
    if (!this.mbSoldiers()) return 'No tienes tropa. Recluta en el campamento.';
    if (tactic === 'asedio' && !this.mb().army.cart) return 'El asedio necesita al menos una carreta.';
    if ((this.s.res.viveres || 0) < this.mbSoldiers()) return `La marcha gasta 1 víver por soldado (${this.mbSoldiers()}). Manda víveres.`;
    return null;
  };
  P.mbBattle = function (cityId, tactic, roll = Math.random(), tactical = null) {
    const why = this.mbCanAttack(cityId, tactic);
    if (why) { this.h.toast(why); this.h.sfx('error'); return null; }
    const M = this.mb(), a = M.army, c = CITY_BY_ID[cityId], T = TACTICS[tactic];
    const before = { ...a };
    const power = this.mbPower(tactic, cityId) * (0.85 + 0.3 * (tactical ? 0.5 : roll));
    const win = tactical ? !!tactical.win : power >= c.guards;
    this.s.res.viveres -= this.mbSoldiers();
    const safe = Math.max(0.5, 1 - CART_SAFE * a.cart);
    const frac = win ? Math.min(0.5, 0.18 * (c.guards / Math.max(1, power)) * T.loss * safe) : Math.min(0.7, 0.4 * T.loss * safe);
    const lost = tactical?.lost
      ? {
        inf: Math.min(a.inf, Math.max(0, Math.round(+tactical.lost.inf || 0))),
        cab: Math.min(a.cab, Math.max(0, Math.round(+tactical.lost.cab || 0))),
        cart: Math.min(a.cart, Math.max(0, Math.round(+tactical.lost.cart || 0))),
      }
      : { inf: Math.round(a.inf * frac), cab: Math.round(a.cab * frac), cart: win ? 0 : Math.floor(a.cart * frac * 0.5) };
    for (const k of Object.keys(lost)) a[k] = Math.max(0, a[k] - lost[k]);
    M.stats.battles++;
    let loot = 0, xp = 0;
    if (win) {
      M.freed.push(cityId); M.stats.won++;
      loot = c.guards * LOOT_PER_GUARD; xp = c.guards * 8;
      M.stats.loot += loot;
      this.addMoney(loot);
      this.addXp(xp);
    } else { M.stats.lost++; xp = Math.round(c.guards * 1.5); this.addXp(xp); }
    this.h.changed('res');
    this.mbChanged();
    return { win, city: cityId, tactic, power: Math.round(power), guards: c.guards, lost, before, loot, xp, done: M.freed.length === CITIES.length, field: !!tactical };
  };

  // ---- fincas regionales
  P.mbFarmRate = function (id, lvl) { // por minuto
    const c = CITY_BY_ID[id], g = GOODS[c.farm[0]], L = lvl ?? this.mb().farms[id]?.lvl ?? 1;
    const units = c.farm[2] * FARM_LEVELS[L].mult;
    return { pesos: units * g.value, viveres: units * g.viveres };
  };
  // Por qué no se puede fundar la finca (null = se puede). Siempre en español y concreto.
  P.mbCanFarm = function (id) {
    const c = CITY_BY_ID[id];
    if (!c) return 'Esa ciudad no existe.';
    if (!this.mbFreed(id)) return `Primero hay que liberar ${c.name}: la finca se funda en una ciudad libre.`;
    if (this.mb().farms[id]) return `${c.name} ya tiene su finca.`;
    const falta = c.farm[1] - Math.floor(this.s.money);
    if (falta > 0) return `Te faltan ${falta.toLocaleString('es')} pesos (cuesta ${c.farm[1].toLocaleString('es')}). Cobra la renta o vende en la finca.`;
    return null;
  };
  P.mbCanUpgrade = function (id) {
    const f = this.mb().farms[id];
    if (!f) return 'Primero funda la finca.';
    if (f.lvl >= 3) return 'La finca ya está en el nivel máximo.';
    const falta = this.mbUpgradePrice(id) - Math.floor(this.s.money);
    if (falta > 0) return `Te faltan ${falta.toLocaleString('es')} pesos para el nivel ${f.lvl + 1}.`;
    return null;
  };
  // Ciudades libres que todavía no tienen finca
  P.mbFarmless = function () { const M = this.mb(); return M.freed.filter((id) => !M.farms[id]); };
  P.mbBuyFarm = function (id) {
    const c = CITY_BY_ID[id], M = this.mb();
    const why = this.mbCanFarm(id);
    if (why) { this.h.toast(why); this.h.sfx('error'); return false; }
    if (!this.spend(c.farm[1])) return false;
    M.farms[id] = { lvl: 1, at: now(), bank: 0 };
    this.addXp(40 + c.n * 10);
    this.h.sfx('buy');
    this.h.toast(`¡Finca de ${GOODS[c.farm[0]].name.toLowerCase()} fundada en ${c.name}!`);
    this.mbChanged();
    return true;
  };
  P.mbUpgradePrice = function (id) { const f = this.mb().farms[id]; if (!f || f.lvl >= 3) return 0; return Math.round(CITY_BY_ID[id].farm[1] * FARM_LEVELS[f.lvl + 1].up); };
  P.mbUpgradeFarm = function (id) {
    const f = this.mb().farms[id], price = this.mbUpgradePrice(id);
    const why = this.mbCanUpgrade(id);
    if (why) { this.h.toast(why); this.h.sfx('error'); return false; }
    if (!f || !price) return false;
    this.mbAccrue();
    if (!this.spend(price)) return false;
    f.lvl++;
    this.addXp(60 + f.lvl * 30);
    this.h.sfx('buy');
    this.h.toast(`Finca de ${CITY_BY_ID[id].name} al nivel ${f.lvl}: ahora rinde ×${FARM_LEVELS[f.lvl].mult}.`);
    this.mbChanged();
    return true;
  };
  P.mbAccrue = function () {
    const t = now();
    for (const [id, f] of Object.entries(this.mb().farms)) {
      const dt = Math.min(FARM_OFFLINE_CAP, Math.max(0, t - f.at));
      const r = this.mbFarmRate(id);
      f.bank += (r.pesos * dt) / 60; f.vbank = (f.vbank || 0) + (r.viveres * dt) / 60;
      f.at = t;
    }
  };
  P.mbPending = function () { let p = 0, v = 0; for (const f of Object.values(this.mb().farms)) { p += f.bank; v += f.vbank || 0; } return { pesos: Math.floor(p), viveres: Math.floor(v) }; };
  P.mbCollect = function () {
    this.mbAccrue();
    const { pesos, viveres } = this.mbPending();
    if (pesos < 1 && viveres < 1) { this.h.toast('Las fincas regionales todavía no tienen renta.'); return 0; }
    for (const f of Object.values(this.mb().farms)) { f.bank -= Math.floor(f.bank); f.vbank = (f.vbank || 0) - Math.floor(f.vbank || 0); }
    this.addMoney(pesos);
    this.s.res.viveres = (this.s.res.viveres || 0) + viveres;
    this.mb().stats.income += pesos;
    this.h.sfx('coins');
    this.h.toast(`Renta de las fincas regionales: +${pesos} pesos y +${viveres} víveres.`);
    this.h.changed('res');
    this.mbChanged();
    return pesos;
  };

  // ---- trucos de desarrollo (?dev=1)
  P.mbCheat = function (k) {
    const s = this.s, M = this.mb();
    if (k === 'unlock') {
      if (this.cenCheat) { this.cenCheat('l35'); this.cenCheat('central'); }
      this.addMoney(300000);
      s.res.viveres = (s.res.viveres || 0) + 1500;
      if (s.ext.central) s.ext.central.stock.azucar = (s.ext.central.stock.azucar || 0) + 120;
    }
    if (k === 'army') { M.army.inf += 20; M.army.cab += 10; M.army.cart = Math.min(UNITS.cart.max, M.army.cart + 3); s.res.viveres = (s.res.viveres || 0) + 500; }
    if (k === 'free') { const c = this.mbNext(); if (c) M.freed.push(c.id); }
    if (k === 'rent') for (const f of Object.values(M.farms)) { f.at -= 3600; for (const c of Object.values(f.cells || {})) if (c.k === 'p') c.t0 -= 3600; }
    this.h.changed('res'); this.h.changed('money');
    this.mbChanged();
  };

  let acc = 0;
  P.mbUpdate = function (dt) { acc += dt; if (acc >= 1) { acc = 0; if (Object.keys(this.mb().farms).length) this.mbAccrue(); } };
}
