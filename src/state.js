import {
  W, H, SAVE_KEY, START_AREA, ROAD, PARCELS, START_PLOTS, BUILDINGS, PEN, TRUCK_TILES,
  EGG_INTERVAL, START_PALMS, FLAGPOLE, STORAGE_CAPS, STRUCTURES, OBSTACLE_LIST, GW, GH, WORKER_BASE_CAP, ITEMS, WORKER_LEVEL_CAP, XP_CURVE, migrateXp, xpForLevel,
} from './data.js';
import { zoneAt, zoneOpen, isAnyRoad, MANIGUA, BATEY, inFarm } from './zones.js';
import { resDefaults, runMigrations, FARM_HOOKS } from './registry.js';

// Reloj del juego: tiempo real + lo que se ha adelantado con ⏩ (se guarda en la partida).
export const CLOCK = { offset: 0 };
export const now = () => Date.now() / 1000 + CLOCK.offset;

export function newGame() {
  const t = now();
  const s = {
    v: 2,
    money: 10,
    xp: 0,
    level: 1,
    xpCurve: XP_CURVE,
    inv: Object.fromEntries(Object.keys(ITEMS).map((k) => [k, 0])),
    seeds: { tomato: 2, cane: 0, tobacco: 0 },
    selectedSeed: 'tomato',
    parcels: [],
    plots: START_PLOTS.map(([x, z]) => ({ x, z, crop: null, at: 0 })),
    chickens: [],
    eggs: [],
    workers: [],
    built: {}, // estructuras construidas: id → { at, ready, recipe }
    cleared: [], // obstáculos quitados (ids)
    upgrades: { coop: false, abono: false, storage: 0 },
    trucks: null, // se crea la fila al iniciar (Sim.initTrucks)
    truckTrips: 0,
    nextTruckAt: 0,
    kitchen: { recipe: null, at: 0, ready: null },
    player: { x: 13.5, z: 8.5 },
    tutorial: 0,
    tutorialDone: false,
    settings: { music: true, sfx: true, joystick: false, quality: 'auto' },
    tod: 0.4, // hora del día (0 = medianoche, 0.5 = mediodía)
    ffUsed: false,
    hireHint: false,
    stats: { eggs: 0, harvests: 0, sold: 0, earned: 0, madera: 0, caught: 0, fruit: 0 },
    // v4: fuera de la finca
    res: resDefaults(), // recursos (madera, y los que registren otros módulos)
    ext: {}, // estado propio de cada extensión registrada (p. ej. ext.central)
    chopped: {}, // id de planta de la manigua → momento en que se tumbó (vuelve a crecer)
    fruit: {}, // id de frutal → momento en que se recogió
    wild: [], // animales sueltos en la manigua { id, kind, x, z }
    carry: [], // lo que el guajiro lleva en brazos (se entrega al entrar a la finca)
    horse: false,
    tame: {}, // intentos de domar por id de caballo
    hints: {}, // avisos de apertura ya mostrados
    nextId: 1,
    savedAt: t,
  };
  for (let i = 0; i < 3; i++) addChicken(s, t - i * 7);
  // Unos huevos ya en el piso para empezar.
  [[8.6, 7.4], [10.3, 6.8], [9.5, 8.3]].forEach(([x, z]) => s.eggs.push({ id: s.nextId++, x, z }));
  return s;
}

export function addChicken(s, t = now()) {
  const x = PEN.x0 + 0.5 + Math.random() * (PEN.x1 - PEN.x0);
  const z = PEN.z0 + 0.5 + Math.random() * (PEN.z1 - PEN.z0);
  s.chickens.push({ id: s.nextId++, x, z, nextLay: t + EGG_INTERVAL * (0.5 + Math.random() * 0.7), hue: Math.random() });
}

export function storageCap(s) {
  return STORAGE_CAPS[Math.min(s.upgrades.storage, STORAGE_CAPS.length - 1)];
}
export function invCount(s) {
  return Object.values(s.inv).reduce((a, b) => a + b, 0);
}
export function chickenCap(s) {
  const base = (s.upgrades.coop ? 8 : 4) + (s.extraHens || 0);
  return FARM_HOOKS.henCap ? FARM_HOOKS.henCap(s, base) : base;
}
// ¿La estructura está en tierra propia (finca) o en una zona abierta (batey)?
export function structOpen(s, st) { return st.zone ? zoneOpen(s, st.zone) : s.parcels.includes(st.parcel); }
// Tope de trabajadores según las casas del batey
export function workerCap(s) {
  let cap = WORKER_BASE_CAP + Math.floor((s.level || 1) / WORKER_LEVEL_CAP);
  for (const [id, st] of Object.entries(STRUCTURES)) if (st.kind === 'house' && s.built?.[id]) cap += s.built[id].tier === 3 && st.upgrade2 ? st.upgrade2.cap : s.built[id].tier === 2 ? st.upgrade.cap : st.cap;
  return cap;
}
export const inGrid = (x, z) => x >= 0 && z >= 0 && x < GW && z < GH;

// ---- Cuadrícula ----------------------------------------------------------
export function inBounds(x, z) {
  return x >= 0 && z >= 0 && x < W && z < H;
}
export function isRoad(x) {
  return x >= ROAD.x0 && x <= ROAD.x1;
}
export function parcelAt(x, z) {
  for (const p of PARCELS) {
    const r = p.rect;
    if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return p;
  }
  return null;
}
export function isOwned(s, x, z) {
  if (!inBounds(x, z)) return false;
  if (isRoad(x)) return true;
  const a = START_AREA;
  if (x >= a.x0 && x <= a.x1 && z >= a.z0 && z <= a.z1) return true;
  const p = parcelAt(x, z);
  return !!(p && s.parcels.includes(p.id));
}

// ¿La parcela toca tierra propia o el camino real? (si no, no se podría llegar caminando)
export function parcelReachable(s, p) {
  const r = p.rect;
  if (r.x1 === ROAD.x0 - 1 || r.x0 === ROAD.x1 + 1) return true;
  for (let z = r.z0 - 1; z <= r.z1 + 1; z++) for (let x = r.x0 - 1; x <= r.x1 + 1; x++) {
    if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) continue;
    if (inBounds(x, z) && !isRoad(x) && isOwned(s, x, z)) return true;
  }
  return false;
}

// Mapa de bloqueos (edificios, troncos). Se recalcula al comprar tierra.
export function buildGrid(s) {
  const blocked = new Uint8Array(GW * GH);
  const mark = (x, z) => { if (inGrid(x, z)) blocked[z * GW + x] = 1; };
  // v4: la manigua (agua, mogotes, árboles en pie) y el batey
  for (const k of MANIGUA.water) blocked[k] = 1;
  for (const k of MANIGUA.hills) blocked[k] = 1;
  for (const p of MANIGUA.plants) if (!(s.chopped && s.chopped[p.id])) mark(p.x, p.z);
  for (let z = BATEY.ceiba.z; z < BATEY.ceiba.z + BATEY.ceiba.h; z++) for (let x = BATEY.ceiba.x; x < BATEY.ceiba.x + BATEY.ceiba.w; x++) mark(x, z);
  for (const [x, z] of BATEY.lamps) mark(x, z);
  for (const b of Object.values(BUILDINGS)) {
    for (let z = b.z; z < b.z + b.h; z++) for (let x = b.x; x < b.x + b.w; x++) mark(x, z);
  }
  for (const [x, z] of START_PALMS) mark(x, z);
  mark(FLAGPOLE[0], FLAGPOLE[1]);
  const cleared = new Set(s.cleared || []);
  for (const o of OBSTACLE_LIST) if (s.parcels.includes(o.parcel) && !cleared.has(o.id)) mark(o.x, o.z);
  for (const [id, b] of Object.entries(STRUCTURES)) if (s.built?.[id]) for (let z = b.z; z < b.z + b.h; z++) for (let x = b.x; x < b.x + b.w; x++) mark(x, z);
  for (const p of PARCELS) {
    if (!s.parcels.includes(p.id)) continue;
    for (const [x, z] of p.palms) mark(x, z);
    for (const d of p.decor || []) for (let z = d.z; z < d.z + d.h; z++) for (let x = d.x; x < d.x + d.w; x++) mark(x, z);
  }
  // Bordes bloqueados: cerca del corral (con portón al sur).
  const edges = new Set();
  const ek = (ax, az, bx, bz) => (ax < bx || (ax === bx && az < bz)) ? `${ax},${az}|${bx},${bz}` : `${bx},${bz}|${ax},${az}`;
  for (let x = PEN.x0; x <= PEN.x1; x++) {
    if (!PEN.gate.some(([gx]) => gx === x)) edges.add(ek(x, PEN.z1, x, PEN.z1 + 1));
  }
  for (let z = PEN.z0; z <= PEN.z1; z++) {
    edges.add(ek(PEN.x0 - 1, z, PEN.x0, z));
    edges.add(ek(PEN.x1, z, PEN.x1 + 1, z));
  }
  for (let x = PEN.x0; x <= PEN.x1; x++) edges.add(ek(x, PEN.z0 - 1, x, PEN.z0));
  return { blocked, edges, ek };
}

export function walkable(s, grid, x, z) {
  if (!inGrid(x, z)) return false;
  if (grid.blocked[z * GW + x]) return false;
  if (inFarm(x, z)) return isOwned(s, x, z);
  if (isAnyRoad(x, z)) return true;
  const zn = zoneAt(x, z);
  return !!zn && zoneOpen(s, zn);
}

// ---- Guardado ------------------------------------------------------------
export function save(s) {
  try {
    s.savedAt = now();
    s.clockOffset = CLOCK.offset;
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export const RESCUE_KEY = 'lafinca-v2-rescate';
// Una partida que no se pudo leer NO se pierde: se copia aparte antes de empezar otra (Ajustes → Restaurar).
function keepRescue(raw) {
  try {
    if (!raw) return;
    const old = localStorage.getItem(RESCUE_KEY);
    if (old === raw) return;
    if (old) localStorage.setItem(`${RESCUE_KEY}-${Date.now()}`, old);
    localStorage.setItem(RESCUE_KEY, raw);
  } catch { /* sin espacio: no se puede hacer más */ }
}
export function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || typeof d !== 'object' || d.v !== 2) { keepRescue(raw); return null; }
    CLOCK.offset = +d.clockOffset || 0;
    const base = newGame();
    // Fusiona con valores por defecto para tolerar saves viejos.
    const s = { ...base, ...d };
    s.inv = { ...base.inv, ...d.inv };
    s.seeds = { ...base.seeds, ...d.seeds };
    s.upgrades = { ...base.upgrades, ...d.upgrades };
    s.settings = { ...base.settings, ...d.settings };
    s.stats = { ...base.stats, ...d.stats };
    s.kitchen = { ...base.kitchen, ...d.kitchen };
    // Campos básicos siempre con forma válida (partidas viejas, a medias o editadas)
    const arr = (v, def) => (Array.isArray(v) ? v.filter((x) => x != null) : def);
    s.parcels = arr(d.parcels, []);
    s.plots = arr(d.plots, base.plots).filter((p) => typeof p === 'object' && Number.isFinite(+p.x) && Number.isFinite(+p.z));
    s.chickens = arr(d.chickens, base.chickens).filter((c) => typeof c === 'object');
    s.eggs = arr(d.eggs, []).filter((e) => typeof e === 'object');
    s.player = d.player && Number.isFinite(+d.player.x) && Number.isFinite(+d.player.z) ? { x: +d.player.x, z: +d.player.z } : base.player;
    s.level = Math.max(1, Math.floor(+d.level || 1));
    s.xp = Math.max(0, +d.xp || 0);
    // balance oct 2026: curva de XP nueva. Mismo nivel y mismo % de avance; nunca baja de nivel ni queda XP negativa.
    if ((+d.xpCurve || 1) < XP_CURVE) s.xp = migrateXp(s.level, s.xp);
    s.xp = Math.max(s.xp, xpForLevel(s.level));
    s.xpCurve = XP_CURVE;
    s.built = d.built && typeof d.built === 'object' ? { ...d.built } : {};
    s.cleared = Array.isArray(d.cleared) ? d.cleared : [];
    // v4: saves viejos sin manigua ni batey
    s.res = { ...resDefaults(), ...(d.res || {}) };
    if (d.wood && !d.res) s.res.madera = d.wood; // v4a guardaba la madera como "wood"
    for (const k of Object.keys(s.res)) s.res[k] = Math.max(0, Math.floor(+s.res[k] || 0));
    s.ext = d.ext && typeof d.ext === 'object' ? d.ext : {};
    runMigrations(s, d);
    s.chopped = d.chopped && typeof d.chopped === 'object' ? d.chopped : {};
    s.fruit = d.fruit && typeof d.fruit === 'object' ? d.fruit : {};
    s.wild = Array.isArray(d.wild) ? d.wild : [];
    s.carry = Array.isArray(d.carry) ? d.carry : [];
    s.tame = d.tame && typeof d.tame === 'object' ? d.tame : {};
    s.hints = d.hints && typeof d.hints === 'object' ? d.hints : {};
    if (!Array.isArray(d.trucks)) { s.trucks = null; s.truck = d.truck; }
    for (const k of Object.keys(ITEMS)) s.inv[k] = Math.max(0, Math.floor(+s.inv[k] || 0));
    s.money = Math.max(0, Math.floor(+s.money || 0));
    // trabajadores de saves viejos
    s.workers = arr(d.workers, []).filter((w) => typeof w === 'object' && w.role).map((w) => ({ ...w, role: w.role === 'cocinero' ? 'cocinera' : w.role, lvl: w.lvl || 1 }));
    // v4: cada trabajador con id propio (los viejos son el original de su oficio)
    for (const w of s.workers) { if (!w.id) w.id = w.role; if (w.n == null) w.n = 0; }
    return s;
  } catch (e) {
    console.warn('[partida] no se pudo leer', e);
    keepRescue(raw);
    return null;
  }
}

export function resetSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* nada */ }
}
