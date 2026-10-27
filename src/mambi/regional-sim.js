// Lógica de las fincas regionales jugables (sembrar, cosechar, construir, comprar tierra) sobre Sim.
// Estado en s.ext.mambi.farms[id] = { v:2, lvl (tramo de tierra 1–3), at, bank, vbank, cells:{ 'x,z': {k:'p',t0} | {k:'b',b} } }.
import { now } from '../state.js';
import { CITY_BY_ID, FARM_LEVELS } from './data.js';
import { TYPES, GRID, AUTO, BOOST_CAP, typeOf, goodOf, yieldOf, seedCost, buildCost, key, inGrid, cellsOf } from './regional-data.js';

const int = (v) => Math.max(0, Math.floor(+v || 0));
const rtNow = () => Date.now() / 1000;

// Partida vieja (nivel 1–3 sin lotes) → disposición equivalente: 4 lotes por nivel ya sembrados, bohío de jornaleros
// y las construcciones del tipo según el nivel. Lo nuevo se respeta tal cual (filtrando lo inválido).
export function normFarm(id, f) {
  const T = TYPES[CITY_BY_ID[id].farm[0]], t = now();
  const lvl = Math.min(3, Math.max(1, int(f.lvl) || 1));
  const out = { v: 2, lvl, at: +f.at || t, bank: Math.max(0, +f.bank || 0), vbank: Math.max(0, +f.vbank || 0), cells: {} };
  // finca grande de provincia (src/provincias): se conserva tal cual
  if (f.conv) { out.conv = f.conv; out.full = f.full && typeof f.full === 'object' ? f.full : null; out.sum = f.sum && typeof f.sum === 'object' ? f.sum : null; return out; }
  const builtIds = new Set();
  if (f.cells && typeof f.cells === 'object') {
    for (const [k, c] of Object.entries(f.cells)) {
      const [x, z] = k.split(',').map(Number);
      if (!c || !inGrid(lvl, x, z)) continue;
      if (c.k === 'p') out.cells[key(x, z)] = { k: 'p', t0: Number.isFinite(+c.t0) ? +c.t0 : t };
      else if (c.k === 'b' && T.build.some((b) => b.id === c.b) && !builtIds.has(c.b)) { builtIds.add(c.b); out.cells[key(x, z)] = { k: 'b', b: c.b }; }
    }
    return out;
  }
  // conversión de la finca vieja
  const cells = cellsOf(lvl), [cols] = GRID[lvl];
  const builds = T.build.slice(0, lvl); // casa · casa+proceso · casa+proceso+extra
  builds.forEach((b, i) => { out.cells[key(cols - 1, i)] = { k: 'b', b: b.id }; });
  let n = 0; const dur = T.prod.dur;
  for (const [x, z] of cells) { if (n >= 4 * lvl) break; const k = key(x, z); if (out.cells[k]) continue; out.cells[k] = { k: 'p', t0: t - dur }; n++; }
  out.migrated = true;
  return out;
}

export function installRegional(Sim) {
  const P = Sim.prototype;
  P.rgFarm = function (id) { return this.mb().farms[id] || null; };
  P.rgType = (id) => typeOf(id);
  // 'occ' = ciudad en manos del Régimen (todo parado) · 'raid' = saqueada hace poco (los jornaleros no cosechan) · null
  P.rgBlock = function (id) {
    if (!this.mbFreed(id)) return 'occ';
    try { const c = this.cs?.().cities?.[id]; if (c && c.raidUntil > rtNow()) return 'raid'; } catch { /* sin castro */ }
    return null;
  };
  P.rgMult = function (id) { const f = this.rgFarm(id); let m = 1; if (!f) return m; for (const b of typeOf(id).build) if (this.rgHas(id, b.id)) m *= b.mult; return m; };
  P.rgHas = function (id, bid) { const f = this.rgFarm(id); return !!f && Object.values(f.cells).some((c) => c.k === 'b' && c.b === bid); };
  P.rgPlots = function (id) { const f = this.rgFarm(id); return f ? Object.values(f.cells).filter((c) => c.k === 'p').length : 0; };
  P.rgBuilt = function (id) { const f = this.rgFarm(id); return f ? Object.values(f.cells).filter((c) => c.k === 'b').length : 0; };
  P.rgScore = function (id) { return this.rgPlots(id) + this.rgBuilt(id) * 2; };
  P.rgHarvestValue = function (id, frac = 1) {
    const y = yieldOf(id) * frac, g = goodOf(id), m = this.rgMult(id);
    return { pesos: Math.round(y * g.value * m), viveres: Math.round(y * g.viveres), units: y };
  };
  P.rgCell = function (id, x, z) { const f = this.rgFarm(id); return f?.cells[key(x, z)] || null; };
  P.rgLeft = function (id, x, z) { const c = this.rgCell(id, x, z); if (!c || c.k !== 'p') return 0; return Math.max(0, typeOf(id).prod.dur - (now() - c.t0)); };
  P.rgReady = function (id, x, z) { const c = this.rgCell(id, x, z); return !!c && c.k === 'p' && this.rgLeft(id, x, z) <= 0; };
  P.rgFree = function (id) { const f = this.rgFarm(id); if (!f) return 0; return cellsOf(f.lvl).filter(([x, z]) => !f.cells[key(x, z)]).length; };
  P.rgChanged = function () { this.rgVer = (this.rgVer || 0) + 1; this.mbChanged(); };
  const deny = (sim, why) => { sim.h.toast(why); sim.h.sfx('error'); return false; };
  P.rgCanAct = function (id) {
    const f = this.rgFarm(id);
    if (!f) return 'Primero funda la finca.';
    if (this.rgBlock(id) === 'occ') return `${CITY_BY_ID[id].name} está en manos del Régimen: recupérala con una batalla para volver a trabajar la finca.`;
    return null;
  };
  P.rgPlant = function (id, x, z) {
    const why = this.rgCanAct(id); if (why) return deny(this, why);
    const f = this.rgFarm(id), k = key(x, z);
    if (!inGrid(f.lvl, x, z)) return deny(this, 'Ese lote no es tuyo todavía: compra más tierra.');
    if (f.cells[k]) return deny(this, 'Ese lote ya está ocupado.');
    const cost = seedCost(id);
    if (this.s.money < cost) return deny(this, `Te faltan ${cost - Math.floor(this.s.money)} pesos para ${typeOf(id).prod.verb.toLowerCase()}.`);
    this.spend(cost);
    f.cells[k] = { k: 'p', t0: now() };
    this.addXp(5);
    this.h.sfx('plant');
    this.rgChanged();
    return true;
  };
  P.rgHarvest = function (id, x, z) {
    const why = this.rgCanAct(id); if (why) return deny(this, why);
    const c = this.rgCell(id, x, z);
    if (!c || c.k !== 'p') return false;
    if (!this.rgReady(id, x, z)) return deny(this, `Todavía le faltan ${Math.ceil(this.rgLeft(id, x, z))} s.`);
    const v = this.rgHarvestValue(id);
    c.t0 = now();
    this.addMoney(v.pesos);
    this.s.res.viveres = (this.s.res.viveres || 0) + v.viveres;
    this.mb().stats.income += v.pesos;
    this.addXp(8);
    this.h.sfx('coins');
    this.h.changed('res');
    this.rgChanged();
    return v;
  };
  P.rgHarvestAll = function (id) {
    const f = this.rgFarm(id); if (!f) return 0;
    let n = 0, p = 0, vv = 0;
    if (this.rgCanAct(id)) return deny(this, this.rgCanAct(id));
    const v = this.rgHarvestValue(id);
    for (const [k, c] of Object.entries(f.cells)) { if (c.k !== 'p') continue; const [x, z] = k.split(',').map(Number); if (!this.rgReady(id, x, z)) continue; c.t0 = now(); n++; p += v.pesos; vv += v.viveres; }
    if (!n) { this.h.toast('Todavía no hay nada listo para cosechar.'); return 0; }
    this.addMoney(p); this.s.res.viveres = (this.s.res.viveres || 0) + vv; this.mb().stats.income += p;
    this.addXp(8 * n); this.h.sfx('coins'); this.h.changed('res');
    this.h.toast(`Cosecha: ${n} lotes · +${p} pesos y +${vv} víveres.`);
    this.rgChanged();
    return n;
  };
  P.rgCanBuild = function (id, bid) {
    const why = this.rgCanAct(id); if (why) return why;
    const b = typeOf(id).build.find((q) => q.id === bid);
    if (!b) return 'Esa construcción no existe.';
    if (this.rgHas(id, bid)) return 'Ya está construida.';
    if (!this.rgFree(id)) return 'No quedan lotes libres: compra más tierra.';
    const cost = buildCost(id, b), falta = cost - Math.floor(this.s.money);
    if (falta > 0) return `Te faltan ${falta.toLocaleString('es')} pesos.`;
    return null;
  };
  P.rgBuild = function (id, bid, x, z) {
    const why = this.rgCanBuild(id, bid); if (why) return deny(this, why);
    const f = this.rgFarm(id), k = key(x, z), b = typeOf(id).build.find((q) => q.id === bid);
    if (!inGrid(f.lvl, x, z) || f.cells[k]) return deny(this, 'Elige un lote libre.');
    this.mbAccrue();
    this.spend(buildCost(id, b));
    f.cells[k] = { k: 'b', b: bid };
    this.addXp(40);
    this.h.sfx('buy');
    this.h.toast(`${b.name} construido en ${CITY_BY_ID[id].name}.`);
    this.rgChanged();
    return true;
  };
  P.rgCollect = function (id) {
    this.mbAccrue();
    const f = this.rgFarm(id); if (!f) return 0;
    const p = Math.floor(f.bank), v = Math.floor(f.vbank || 0);
    if (p < 1 && v < 1) { this.h.toast(this.rgHas(id, 'casa') ? 'Los jornaleros todavía no han juntado renta.' : 'Construye el bohío de jornaleros para que la finca dé renta sola.'); return 0; }
    f.bank -= p; f.vbank = (f.vbank || 0) - v;
    this.addMoney(p); this.s.res.viveres = (this.s.res.viveres || 0) + v; this.mb().stats.income += p;
    this.h.sfx('coins'); this.h.toast(`Renta de ${CITY_BY_ID[id].name}: +${p} pesos y +${v} víveres.`);
    this.h.changed('res'); this.rgChanged();
    return p;
  };

  // renta por minuto: lo que cosechan los jornaleros con lo sembrado y construido (lvl dado = vista previa al fundar)
  P.mbFarmRate = function (id, lvl) {
    const T = typeOf(id), g = goodOf(id), per = 60 / T.prod.dur;
    if (lvl != null && !this.rgFarm(id)) { const u = 2 * yieldOf(id) * AUTO * per; return { pesos: Math.round(u * g.value), viveres: Math.round(u * g.viveres) }; }
    if (!this.rgHas(id, 'casa')) return { pesos: 0, viveres: 0 };
    const u = this.rgPlots(id) * yieldOf(id) * AUTO * per;
    return { pesos: Math.round(u * g.value * this.rgMult(id)), viveres: Math.round(u * g.viveres) };
  };
  // el tiempo corre: los lotes crecen; con jornaleros se cosechan solos (tope de 8 h fuera); ocupada = todo parado
  P.mbAccrue = function () {
    const t = now();
    for (const [id, f] of Object.entries(this.mb().farms)) {
      const dt = Math.max(0, t - f.at); f.at = t;
      const block = this.rgBlock(id);
      if (block === 'occ') { for (const c of Object.values(f.cells)) if (c.k === 'p') c.t0 += dt; continue; }
      if (block === 'raid' || !this.rgHas(id, 'casa')) continue;
      const dur = typeOf(id).prod.dur, v = this.rgHarvestValue(id, AUTO);
      for (const c of Object.values(f.cells)) {
        if (c.k !== 'p') continue;
        // lo listo espera media vuelta para que lo coseches tú (al 100 %); después lo recogen los jornaleros
        const el = t - c.t0, grace = dur * 0.5; if (el < dur + grace) continue;
        const n = Math.floor((Math.min(el, BOOST_CAP) - grace) / dur);
        if (n < 1) continue;
        f.bank += n * v.pesos; f.vbank = (f.vbank || 0) + n * v.viveres;
        c.t0 = el > BOOST_CAP ? t - (el % dur) : c.t0 + n * dur;
      }
    }
  };
  // fundar: la finca arranca con su bohío de jornaleros y dos lotes sembrados
  const buy = P.mbBuyFarm;
  P.mbBuyFarm = function (id) {
    const ok = buy.call(this, id);
    if (ok) { const f = this.mb().farms[id]; Object.assign(f, normFarm(id, { lvl: 1, at: now(), cells: { '0,0': { k: 'p', t0: now() }, '1,0': { k: 'p', t0: now() }, [`${GRID[1][0] - 1},0`]: { k: 'b', b: 'casa' } } })); this.rgChanged(); }
    return ok;
  };
  // «Mejorar» = comprar el siguiente tramo de tierra (más lotes)
  P.mbUpgradeFarm = function (id) {
    const f = this.mb().farms[id], price = this.mbUpgradePrice(id);
    const why = this.mbCanUpgrade(id) || this.rgCanAct(id);
    if (why) return deny(this, why);
    if (!f || !price) return false;
    this.mbAccrue();
    if (!this.spend(price)) return false;
    f.lvl++;
    const [c, r] = GRID[f.lvl];
    this.addXp(60 + f.lvl * 30);
    this.h.sfx('buy');
    this.h.toast(`Compraste más tierra en ${CITY_BY_ID[id].name}: ahora ${c * r} lotes.`);
    this.rgChanged();
    return true;
  };
  // saqueo: además de la renta juntada, se llevan lo que estaba listo para cosechar
  P.rgLoot = function (id) { const f = this.rgFarm(id); if (!f) return 0; let n = 0; const dur = typeOf(id).prod.dur, t = now(); for (const c of Object.values(f.cells)) if (c.k === 'p' && t - c.t0 >= dur) { c.t0 = t; n++; } return n; };
  // truco de desarrollo/pruebas: todo lo sembrado de una finca, listo ya
  P.rgCheatReady = function (id) { const f = this.rgFarm(id); if (!f) return 0; const t = now(), dur = typeOf(id).prod.dur; let n = 0; for (const c of Object.values(f.cells)) if (c.k === 'p') { c.t0 = t - dur - 1; n++; } this.rgChanged(); return n; };
  void FARM_LEVELS;
}
