import {
  W, H, SAVE_KEY, START_AREA, ROAD, PARCELS, START_PLOTS, BUILDINGS, PEN, TRUCK_TILES,
  EGG_INTERVAL, START_PALMS, FLAGPOLE,
} from './data.js';

export const now = () => Date.now() / 1000;

export function newGame() {
  const t = now();
  const s = {
    v: 2,
    money: 10,
    xp: 0,
    level: 1,
    inv: { egg: 0, tomato: 0, cane: 0, tobacco: 0, ketchup: 0, guarapo: 0 },
    seeds: { tomato: 2, cane: 0, tobacco: 0 },
    selectedSeed: 'tomato',
    parcels: [],
    plots: START_PLOTS.map(([x, z]) => ({ x, z, crop: null, at: 0 })),
    chickens: [],
    eggs: [],
    workers: [],
    upgrades: { coop: false, abono: false, storage: 0 },
    truck: { phase: 'parked', at: t, cargo: {}, trips: 0 },
    kitchen: { recipe: null, at: 0, ready: null },
    player: { x: 13.5, z: 8.5 },
    tutorial: 0,
    tutorialDone: false,
    settings: { music: true, sfx: true, joystick: false },
    stats: { eggs: 0, harvests: 0, sold: 0, earned: 0 },
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
  return [20, 40, 80][s.upgrades.storage] ?? 80;
}
export function invCount(s) {
  return Object.values(s.inv).reduce((a, b) => a + b, 0);
}
export function chickenCap(s) {
  return s.upgrades.coop ? 8 : 4;
}

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

// Mapa de bloqueos (edificios, troncos). Se recalcula al comprar tierra.
export function buildGrid(s) {
  const blocked = new Uint8Array(W * H);
  const mark = (x, z) => { if (inBounds(x, z)) blocked[z * W + x] = 1; };
  for (const b of Object.values(BUILDINGS)) {
    for (let z = b.z; z < b.z + b.h; z++) for (let x = b.x; x < b.x + b.w; x++) mark(x, z);
  }
  for (const [x, z] of START_PALMS) mark(x, z);
  mark(FLAGPOLE[0], FLAGPOLE[1]);
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

export function walkable(s, grid, x, z, truckParked) {
  if (!isOwned(s, x, z)) return false;
  if (grid.blocked[z * W + x]) return false;
  if (truckParked && TRUCK_TILES.some(([tx, tz]) => tx === x && tz === z)) return false;
  return true;
}

// ---- Guardado ------------------------------------------------------------
export function save(s) {
  try {
    s.savedAt = now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || d.v !== 2) return null;
    const base = newGame();
    // Fusiona con valores por defecto para tolerar saves viejos.
    const s = { ...base, ...d };
    s.inv = { ...base.inv, ...d.inv };
    s.seeds = { ...base.seeds, ...d.seeds };
    s.upgrades = { ...base.upgrades, ...d.upgrades };
    s.settings = { ...base.settings, ...d.settings };
    s.stats = { ...base.stats, ...d.stats };
    s.kitchen = { ...base.kitchen, ...d.kitchen };
    s.truck = { ...base.truck, ...d.truck };
    for (const k of Object.keys(s.inv)) s.inv[k] = Math.max(0, Math.floor(+s.inv[k] || 0));
    s.money = Math.max(0, Math.floor(+s.money || 0));
    return s;
  } catch {
    return null;
  }
}

export function resetSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* nada */ }
}
