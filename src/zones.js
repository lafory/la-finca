// v4: zonas fuera de la finca. Cada zona es una región del mapa global (GW×GH) con su nivel de apertura.
// Pensado para crecer: más adelante un mapa del mundo puede listar otras regiones con la misma forma.
import { GW, GH, W, H } from './data.js';

export const ZONES = {
  camino: { name: 'Camino del sur', blurb: 'Une la finca con el batey y la manigua.', level: 1, rect: { x0: 0, z0: 40, x1: GW - 1, z1: 41 }, road: true },
  manigua: { name: 'La manigua', blurb: 'El monte salvaje: madera, frutas y animales.', level: 3, rect: { x0: 46, z0: 0, x1: GW - 1, z1: 39 }, sign: [47.5, 39] },
  batey: { name: 'El batey', blurb: 'El pueblito de los trabajadores.', level: 5, rect: { x0: 0, z0: 42, x1: 30, z1: 57 }, sign: [13, 43] },
  // libres para otros módulos (registerZone): x32–87 × z42–79 (campos) y x0–30 × z58–79 (central)
};
export const ZONE_ORDER = ['camino', 'manigua', 'batey'];
export const inRect = (r, x, z) => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
export const inFarm = (x, z) => x >= 0 && z >= 0 && x < W && z < H;
export function zoneAt(x, z) {
  if (inFarm(x, z)) return null;
  for (const id of ZONE_ORDER) if (inRect(ZONES[id].rect, x, z)) return id;
  return null;
}
export function zoneOpen(s, id) { const zn = ZONES[id]; return !!zn && !zn.soon && s.level >= zn.level; }
// el camino real (x15–16) sigue hasta el fondo del mapa y el camino del sur cruza de este a oeste
export const isAnyRoad = (x, z) => (x === 15 || x === 16) || (z === 40 || z === 41);

// ---------------------------------------------------------------- la manigua (generación determinista)
function srng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// kind: arbol (leña), marabu (leña), ceiba (sagrada: no se tumba), palma (palma real), coco/mango/guayaba (frutas)
export const WILD_PLANTS = {
  arbol: { name: 'Guásima', madera: 3, regrow: 300, chop: true },
  marabu: { name: 'Marabú', madera: 1, regrow: 200, chop: true },
  ceiba: { name: 'Ceiba', sacred: true },
  palma: { name: 'Palma real', royal: true },
  coco: { name: 'Cocotero', fruit: 'coco', qty: 2, regrow: 240 },
  mango: { name: 'Mango', fruit: 'mango', qty: 3, regrow: 200 },
  guayaba: { name: 'Guayabo', fruit: 'guayaba', qty: 3, regrow: 160 },
};
// Animales del monte: chance = probabilidad de atraparlo en un intento
export const WILD_ANIMALS = {
  jutia: { name: 'Jutía', max: 3, chance: 0.7, speed: 0.9 },
  jibaro: { name: 'Puerco jíbaro', max: 2, chance: 0.55, speed: 1.1 },
  guinea: { name: 'Guinea', max: 3, chance: 0.6, speed: 1.3 },
  gallina: { name: 'Gallina perdida', max: 2, chance: 0.9, speed: 0.8 },
  caballo: { name: 'Caballo cimarrón', max: 1, chance: 0.34, speed: 1.4, tame: 3 },
};
export const CARRY_MAX = 3;

function genManigua() {
  const r = srng(4242);
  const R = ZONES.manigua.rect;
  const water = new Set(), fords = new Set(), hills = new Set();
  const key = (x, z) => z * GW + x;
  const river = [];
  for (let z = R.z0; z <= R.z1; z++) {
    const cx = 66 + Math.round(Math.sin(z * 0.22) * 3 + Math.sin(z * 0.07 + 1) * 2);
    river.push([cx, z]);
    const ford = z === 7 || z === 19 || z === 31 || z >= 38;
    for (const x of [cx, cx + 1]) (ford ? fords : water).add(key(x, z));
  }
  const mogotes = [[52, 6, 2.2], [81, 9, 3.1], [77, 30, 2.6], [57, 27, 2.0]];
  for (const [mx, mz, mr] of mogotes) for (let z = Math.floor(mz - mr); z <= mz + mr; z++) for (let x = Math.floor(mx - mr); x <= mx + mr; x++) {
    if (Math.hypot(x + 0.5 - mx, z + 0.5 - mz) <= mr) hills.add(key(x, z));
  }
  const plants = [];
  const taken = new Set([...water, ...fords, ...hills]);
  const nearRiver = (x, z) => river.some(([rx, rz]) => Math.abs(rz - z) < 2 && Math.abs(rx - x) < 5);
  let i = 0;
  for (let z = R.z0; z <= R.z1; z++) for (let x = R.x0; x <= R.x1; x++) {
    const k = key(x, z);
    if (taken.has(k)) continue;
    if (z >= R.z1 - 2 && x < R.x0 + 6) continue; // entrada despejada
    if (x === R.x0) continue; // borde con la finca despejado
    // trillo despejado junto al arroyo y hacia los pasos
    const v = r();
    let kind = null;
    if (v < 0.075) kind = 'arbol';
    else if (v < 0.115) kind = 'marabu';
    else if (v < 0.121) kind = 'ceiba';
    else if (v < 0.139) kind = 'palma';
    else if (v < 0.149) kind = nearRiver(x, z) ? 'coco' : 'guayaba';
    else if (v < 0.157) kind = 'mango';
    else if (v < 0.166) kind = 'guayaba';
    if (!kind) continue;
    if (kind === 'ceiba') { // la ceiba necesita espacio
      let ok = true;
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) if (taken.has(key(x + dx, z + dz))) ok = false;
      if (!ok) kind = 'arbol';
    }
    plants.push({ id: `m${i++}`, kind, x, z });
    taken.add(k);
  }
  return { water, fords, hills, river, mogotes, plants };
}
export const MANIGUA = genManigua();
export const PLANT_BY_ID = new Map(MANIGUA.plants.map((p) => [p.id, p]));
export const PLANT_AT = new Map(MANIGUA.plants.map((p) => [p.z * GW + p.x, p]));

// ---------------------------------------------------------------- el batey
export const BATEY = {
  plaza: { x: 5, z: 47, w: 7, h: 6 },
  ceiba: { x: 7, z: 49, w: 2, h: 2 },
  benches: [[6, 48], [10, 48], [6, 51], [10, 51]],
  lamps: [[5, 47], [11, 47], [5, 52], [11, 52]],
};
