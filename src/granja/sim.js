// Lógica de la granja grande: niveles del gallinero (corral más grande), surcos arados en bloque,
// potrero de vacas ampliable y casas de mampostería. Se instala en Sim.prototype (como el central).
import { PEN, STRUCTURES, BUILDINGS, TRUCK_TILES, W, H, GW } from '../data.js';
import { isOwned, isRoad, chickenCap } from '../state.js';
import { OBSTACLE_LIST } from '../data.js';
import { COOP_LEVELS, COOP_MAX, coopLevel, VACAS_LEVELS, VACAS_MAX, PLOW } from './data.js';

export function ensureGranja(s) {
  s.ext ||= {};
  const g = (s.ext.granja ||= {});
  g.coop = Math.max(g.coop || 1, s.upgrades?.coop ? 2 : 1);
  g.vacas = Math.min(VACAS_MAX, Math.max(1, g.vacas || 1));
  g.plowed = Math.max(0, g.plowed || 0);
  return g;
}

// El corral (PEN) cambia de tamaño con el nivel. PEN es el objeto compartido que usan sim/world/state.
export function applyCoop(s) {
  const L = COOP_LEVELS[Math.min(COOP_MAX, coopLevel(s))];
  PEN.x0 = L.pen.x0; PEN.z0 = L.pen.z0; PEN.x1 = L.pen.x1; PEN.z1 = L.pen.z1;
  PEN.gate = L.pen.gate.map((g) => [...g]);
}
export function applyVacas(s) {
  const L = VACAS_LEVELS[s.ext.granja.vacas];
  const st = STRUCTURES.vacas;
  if (!st) return;
  st.w = L.w; st.h = L.h; st.n = L.n;
  st.produce = { ...st.produce, qty: L.qty };
  st.detail = `${L.n} vacas dan ${L.qty} cantinas de leche cada ${Math.round(st.produce.time / 60)} min.`;
}

// Zonas que no se aran: corral en su tamaño mayor (y su salida) y el potrero en su tamaño mayor.
const VMAX = VACAS_LEVELS[VACAS_MAX];
const NO_PLOW = [
  { x0: 8, z0: 6, x1: 13, z1: 10 },
  () => (STRUCTURES.vacas ? { x0: STRUCTURES.vacas.x - 1, z0: STRUCTURES.vacas.z - 1, x1: STRUCTURES.vacas.x + VMAX.w, z1: STRUCTURES.vacas.z + VMAX.h } : null),
];
const inR = (r, x, z) => r && x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;

export function installGranja(Sim) {
  const P = Sim.prototype;

  P.granjaInit = function () {
    ensureGranja(this.s);
    applyCoop(this.s);
    applyVacas(this.s);
    this.rebuildGrid();
    this.clampHens();
    this.coopApplied = coopLevel(this.s);
  };
  // si el gallinero cambió por otro camino (la «Ampliación» de la tienda), rehacer corral y cuadrícula
  P.granjaUpdate = function () {
    const l = coopLevel(this.s);
    if (l === this.coopApplied) return;
    ensureGranja(this.s); applyCoop(this.s); this.rebuildGrid(); this.clampHens();
    this.coopApplied = l;
    this.h.changed('land'); this.h.changed('granja');
  };
  P.clampHens = function () {
    for (const c of this.s.chickens) {
      c.x = Math.min(PEN.x1 + 0.75, Math.max(PEN.x0 + 0.25, c.x));
      c.z = Math.min(PEN.z1 + 0.75, Math.max(PEN.z0 + 0.25, c.z));
    }
    const rt = this.chickRT; if (rt) rt.clear?.();
  };

  // ---------------------------------------------------------------- gallinero
  P.coopLevel = function () { return coopLevel(this.s); };
  P.upgradeCoop = function () {
    const s = this.s, cur = coopLevel(s);
    if (cur >= COOP_MAX) return false;
    const L = COOP_LEVELS[cur + 1];
    if (s.level < L.level) { this.h.toast(`${L.name}: se hace en el nivel ${L.level}.`); this.h.sfx('error'); return false; }
    if (!this.pay({ pesos: L.price, madera: L.madera || 0 })) return false;
    const g = ensureGranja(s);
    g.coop = cur + 1;
    s.upgrades.coop = true;
    this.coopApplied = g.coop;
    applyCoop(s);
    this.rebuildGrid();
    this.clampHens();
    this.addXp(10 + cur * 10);
    this.h.sfx('level');
    this.h.toast(`¡${L.name}! Caben ${chickenCap(s)} gallinas.`);
    this.h.changed('land');
    this.h.changed('granja');
    return true;
  };

  // ---------------------------------------------------------------- surcos
  P.canPlow = function (x, z) {
    const s = this.s;
    if (x < 0 || z < 0 || x >= W || z >= H) return false;
    if (!isOwned(s, x, z) || isRoad(x)) return false;
    if (s.plots.some((p) => p.x === x && p.z === z)) return false;
    if (this.grid.blocked[z * GW + x]) return false;
    for (const r of NO_PLOW) if (inR(typeof r === 'function' ? r() : r, x, z)) return false;
    for (const b of Object.values(BUILDINGS)) if (x >= b.x - 0 && x < b.x + b.w && z >= b.z && z < b.z + b.h + 1) return false; // y la puerta
    for (const st of Object.values(STRUCTURES)) if (!st.zone && x >= st.x - 1 && x <= st.x + st.w && z >= st.z - 1 && z <= st.z + st.h) return false;
    if (TRUCK_TILES.some(([tx, tz]) => tx === x && tz === z)) return false;
    if (x === 14) return false; // orilla del camino: por ahí se carga el camión
    return true;
  };
  // tiles de un bloque n×n que se pueden arar (el toque queda en el centro)
  P.plowBlock = function (cx, cz, n) {
    const o = Math.floor((n - 1) / 2), out = [];
    for (let z = cz - o; z < cz - o + n; z++) for (let x = cx - o; x < cx - o + n; x++) if (this.canPlow(x, z)) out.push([x, z]);
    return out;
  };
  P.plow = function (cx, cz, n = 1) {
    const s = this.s, g = ensureGranja(s);
    let tiles = this.plowBlock(cx, cz, n);
    if (!tiles.length) { this.h.toast('Ahí no se puede arar: tiene que ser tierra tuya, libre y lejos del camino y los corrales.'); this.h.sfx('error'); return 0; }
    const room = PLOW.max - g.plowed;
    if (room <= 0) { this.h.toast(`Ya araste ${PLOW.max} surcos: es el máximo.`); return 0; }
    tiles = tiles.slice(0, room);
    const afford = Math.floor(s.money / PLOW.price);
    if (afford <= 0) { this.h.toast(`Arar cuesta ${PLOW.price} pesos por cantero.`); this.h.sfx('error'); return 0; }
    tiles = tiles.slice(0, afford);
    this.spend(tiles.length * PLOW.price);
    for (const [x, z] of tiles) s.plots.push({ x, z, crop: null, at: 0, plowed: 1 });
    g.plowed += tiles.length;
    this.addXp(tiles.length);
    this.h.sfx('buy');
    const [mx, mz] = tiles[Math.floor(tiles.length / 2)];
    this.h.float(mx + 0.5, mz + 0.5, `+${tiles.length} surco${tiles.length > 1 ? 's' : ''}`, 'xp');
    this.h.changed('plots');
    this.h.changed('land');
    return tiles.length;
  };
  // quitar un surco arado vacío (deja el pasto)
  P.unplow = function (x, z) {
    const s = this.s, i = s.plots.findIndex((p) => p.x === x && p.z === z && p.plowed);
    if (i < 0 || s.plots[i].crop) return false;
    s.plots.splice(i, 1);
    ensureGranja(s).plowed = Math.max(0, s.ext.granja.plowed - 1);
    this.h.changed('plots'); this.h.changed('land');
    return true;
  };

  // ---------------------------------------------------------------- potrero de vacas
  P.vacasLevel = function () { return ensureGranja(this.s).vacas; };
  P.upgradeVacas = function () {
    const s = this.s, g = ensureGranja(s), st = STRUCTURES.vacas;
    if (!st || !s.built.vacas) { this.h.toast('Primero construye el corral de vacas.'); return false; }
    if (g.vacas >= VACAS_MAX) return false;
    const L = VACAS_LEVELS[g.vacas + 1];
    if (s.level < L.level) { this.h.toast(`${L.name}: se hace en el nivel ${L.level}.`); this.h.sfx('error'); return false; }
    const R = { x0: st.x, z0: st.z, x1: st.x + L.w - 1, z1: st.z + L.h - 1 };
    const busy = s.plots.filter((p) => inR(R, p.x, p.z));
    if (busy.some((p) => p.crop)) { this.h.toast('Cosecha primero los canteros donde va a crecer el potrero.'); this.h.sfx('error'); return false; }
    if (!this.pay({ pesos: L.price, madera: L.madera || 0 })) return false;
    s.plots = s.plots.filter((p) => !inR(R, p.x, p.z));
    for (const o of OBSTACLE_LIST) if (inR(R, o.x, o.z) && !s.cleared.includes(o.id)) s.cleared.push(o.id); // el potrero se come el monte
    g.vacas += 1;
    applyVacas(s);
    this.rebuildGrid();
    for (const e of [this.player, ...this.workers]) if (inR(R, Math.floor(e.x), Math.floor(e.z))) { e.x = R.x1 + 1.5; e.z = R.z1 + 1.5; e.path = null; }
    this.h.changed('obstacles');
    this.addXp(30);
    this.h.sfx('level');
    this.h.toast(`¡${L.name}! Ahora tienes ${L.n} vacas.`);
    this.h.changed('plots');
    this.h.changed('land');
    this.h.changed('granja');
    return true;
  };

  // ---------------------------------------------------------------- casas: tercer nivel (mampostería)
  const baseUpgrade = P.upgradeHouse;
  P.upgradeHouse = function (id) {
    const s = this.s, st = STRUCTURES[id], b = s.built[id];
    if (b && b.tier === 3) return false;
    if (!st || st.kind !== 'house' || !b || b.tier !== 2 || !st.upgrade2) return baseUpgrade.call(this, id);
    const u = st.upgrade2;
    if (s.level < u.level) { this.h.toast(`La casa de mampostería se hace en el nivel ${u.level}.`); return false; }
    if (!this.pay({ pesos: u.price, madera: u.madera })) return false;
    b.tier = 3;
    this.addXp(40);
    this.h.sfx('level');
    this.h.toast(`¡Casa de mampostería lista! Tope de trabajadores: ${this.workerCap()}.`);
    this.h.changed('land');
    return true;
  };
}
