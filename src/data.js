// Economía, mapa y progresión de La Finca. Todo en una cuadrícula W×H (1 tile = 1 unidad).
// v3.1: el mapa creció (4×): la finca original queda arriba a la izquierda y la tierra se extiende al este y al sur.
export const W = 46; // la finca (tierra comprable)
export const H = 40;
// v4: cuadrícula global (finca + camino del sur + manigua + batey + campos + central); ver zones.js
export const GW = 88;
export const GH = 80;
export const WOOD_CAP = 500; // tope de madera (recurso 'madera')

export const SAVE_KEY = 'lafinca-v2';

// Niveles: XP acumulada necesaria para llegar a cada nivel (índice = nivel).
// Balance oct 2026 (docs/BALANCE.md): curva más empinada desde el 6; del 11 en adelante 4800 + 600k + 220k² + 15k³ (k = nivel − 10).
export const LEVEL_XP = [0, 0, 20, 55, 110, 190, 440, 950, 1800, 3000, 4800];
export const MAX_LEVEL = 40;
export const XP_CURVE = 2; // versión de la curva guardada en la partida (s.xpCurve)
export function xpForLevel(l) {
  if (l < LEVEL_XP.length) return LEVEL_XP[l];
  const k = l - LEVEL_XP.length + 1; // 1 = nivel 11
  return Math.round(4800 + 600 * k + 220 * k * k + 15 * k * k * k);
}
// Curva vieja (hasta oct 2026), solo para pasar las partidas guardadas a la nueva
const LEVEL_XP_V1 = [0, 0, 20, 55, 110, 190, 300, 450, 650, 900, 1200];
export function xpForLevelV1(l) {
  if (l < LEVEL_XP_V1.length) return LEVEL_XP_V1[l];
  const k = l - LEVEL_XP_V1.length + 1;
  return 1200 + k * 300 + k * k * 45;
}
// Partida vieja → misma nivel y mismo % de avance hacia el siguiente, en la curva nueva. Nunca baja de nivel ni da XP negativa.
export function migrateXp(level, xp) {
  const L = Math.max(1, Math.min(MAX_LEVEL, Math.floor(+level || 1)));
  const a = xpForLevelV1(L), b = xpForLevelV1(L + 1);
  const frac = Math.max(0, Math.min(0.99, ((+xp || 0) - a) / Math.max(1, b - a)));
  const na = xpForLevel(L), nb = xpForLevel(L + 1);
  return Math.max(na, Math.floor(na + frac * (nb - na)));
}

export const ITEMS = {
  egg: { name: 'Huevo', plural: 'Huevos', sell: 5, xp: 1 },
  tomato: { name: 'Tomate', plural: 'Tomates', sell: 12, xp: 3 },
  cane: { name: 'Caña', plural: 'Cañas', sell: 32, xp: 6 },
  tobacco: { name: 'Tabaco', plural: 'Hojas de tabaco', sell: 70, xp: 6 }, // balance: 10 → 6
  ketchup: { name: 'Kétchup', plural: 'Pomos de kétchup', sell: 48, xp: 6 },
  guarapo: { name: 'Guarapo', plural: 'Jarras de guarapo', sell: 85, xp: 8 },
  leche: { name: 'Leche', plural: 'Cantinas de leche', sell: 30, xp: 3 },
  queso: { name: 'Queso de cabra', plural: 'Quesos de cabra', sell: 55, xp: 5 },
  carne: { name: 'Carne de puerco', plural: 'Piezas de puerco', sell: 95, xp: 8 },
  melao: { name: 'Melao de caña', plural: 'Botellas de melao', sell: 80, xp: 7 },
  azucar: { name: 'Azúcar', plural: 'Sacos de azúcar', sell: 125, xp: 10 },
  puros: { name: 'Tabacos', plural: 'Cajas de tabacos', sell: 260, xp: 18 },
  // v4: de la manigua
  mango: { name: 'Mango', plural: 'Mangos', sell: 8, xp: 1 },
  guayaba: { name: 'Guayaba', plural: 'Guayabas', sell: 10, xp: 1 },
  coco: { name: 'Coco', plural: 'Cocos', sell: 14, xp: 2 },
  jutia: { name: 'Jutía', plural: 'Jutías', sell: 40, xp: 4 },
  jibaro: { name: 'Puerco jíbaro', plural: 'Puercos jíbaros', sell: 70, xp: 6 },
};
export const SELLABLE = ['egg', 'tomato', 'cane', 'tobacco', 'ketchup', 'guarapo', 'leche', 'queso', 'carne', 'melao', 'azucar', 'puros', 'mango', 'guayaba', 'coco', 'jutia', 'jibaro'];

export const CROPS = {
  tomato: { name: 'Tomate', seedName: 'Semilla de tomate', seed: 5, grow: 60, level: 1, item: 'tomato', xpPlant: 1 },
  cane: { name: 'Caña de azúcar', seedName: 'Esqueje de caña', seed: 10, grow: 180, level: 3, item: 'cane', xpPlant: 1 },
  tobacco: { name: 'Tabaco', seedName: 'Semilla de tabaco', seed: 20, grow: 420, level: 4, item: 'tobacco', xpPlant: 2 },
};
export const CROP_ORDER = ['tomato', 'cane', 'tobacco'];

// where: en qué estructuras se puede hacer (kitchen = el fogón del batey)
export const RECIPES = {
  ketchup: { name: 'Kétchup', needs: { tomato: 3 }, time: 30, level: 2, out: 'ketchup', where: ['kitchen', 'fogon2'] },
  guarapo: { name: 'Guarapo', needs: { cane: 2 }, time: 45, level: 5, out: 'guarapo', where: ['kitchen', 'fogon2'] },
  melao: { name: 'Melao de caña', needs: { cane: 2 }, time: 60, level: 12, out: 'melao', where: ['trapiche'] },
  azucar: { name: 'Azúcar', needs: { cane: 3 }, time: 90, level: 12, out: 'azucar', where: ['trapiche'] },
  puros: { name: 'Tabacos torcidos', needs: { tobacco: 3 }, time: 120, level: 15, out: 'puros', where: ['casaTabaco'] },
};

// Precios que escalan: base * factor^cantidad
export const PRICES = {
  chicken: 28, chickenStep: 1.25,
  coop: 90,      // nivel 3
  abono: 120,    // nivel 4
  storage: [60, 220, 600, 1500], // niveles 2, 5, 9 y 14
};
export const STORAGE_CAPS = [20, 40, 80, 150, 250];
export const STORAGE_LEVELS = [2, 5, 9, 14];
export const STORAGE_WOOD = [0, 0, 15, 30]; // v4: las ampliaciones grandes llevan leña
export const WATER_BOOST = 0.3; // regar quita 30 % del tiempo restante
export const ABONO_FACTOR = 0.8;
export const ORDER_BONUS = 1.45;

export const EGG_INTERVAL = 30; // s por gallina
export const MAX_GROUND_EGGS = 10;
// Fila de camiones en el camino: el primero se parquea en TRUCK_SPOT, los demás esperan detrás (z crece hacia el sur).
export const TRUCK_SLOTS = [9.5, 13.8, 18.1, 22.4];
export const TRUCK_SPEED = 6.5;
export const TRUCK_RESPAWN = 4; // s hasta que llega otro camión al final de la fila
export const TRUCK_MODELS = 3;
export const TRUCK_COLORS = [0x8fb3a3, 0x7f97b0, 0xb5594a, 0xd9c9a0, 0x8c9a5e, 0x6f8f8a, 0xc98e4a];

// Trabajadores: un pago único para contratarlos y mejoras de rapidez (nivel 1–3). Sin salario diario.
// look: camisa, sombrero, pañuelo (null = sin pañuelo), falda (mujeres), piel.
export const WORKERS = {
  recolector: { who: 'Pancho', name: 'Recolector de huevos', detail: 'Junta los huevos del corral y los guarda en la canasta.', price: 30, level: 1, icon: 'egg',
    look: { shirt: 0x6f8fa8, hat: 0xd9c08a, scarf: 0xb83a2e, skin: 0xc58c5c } },
  regador: { who: 'Yoel', name: 'Regador', detail: 'Riega las matas que están creciendo (crecen un 30 % más rápido).', price: 55, level: 2, icon: 'water',
    look: { shirt: 0xe8e2d0, hat: 0x7a5a36, scarf: 0x3f6fa6, skin: 0x8a5a3a } },
  sembrador: { who: 'María', name: 'Sembradora', detail: 'Siembra en canteros vacíos con tus semillas. Puede comprarlas sola si quieres.', price: 70, level: 2, icon: 'seed',
    look: { shirt: 0xd7a94a, hat: 0xe0c896, scarf: null, skin: 0xd9a77a, skirt: 0x5c6f8a } },
  cosechador: { who: 'Cachita', name: 'Cosechadora', detail: 'Cosecha lo que está maduro y lo guarda.', price: 90, level: 3, icon: 'tomato',
    look: { shirt: 0xc9566a, hat: 0xd9c08a, scarf: 0xf2e6c4, skin: 0x7a4a2e, skirt: 0xe8dcc0 } },
  cocinera: { who: 'Caridad', name: 'Cocinera', detail: 'Prende el fogón, hace kétchup y guarapo y recoge lo que sale.', price: 180, level: 4, icon: 'ketchup',
    look: { shirt: 0xf0ece0, hat: null, scarf: 0xd94a3a, skin: 0xb07850, skirt: 0xb8574a } },
  camionero: { who: 'Chucho', name: 'Camionero', tag: 'Vende a los camiones por ti', detail: 'Espera en el andén, trae del bohío lo que pide el camión, lo carga y cobra. Si piden lo que no hay, espera un poco y lo despide. Puede vender lo que sobra.', price: 45, level: 2, icon: 'truck',
    look: { shirt: 0x5f7f4f, hat: 0x3a3028, scarf: 0xe0b84a, skin: 0xe0b08a } },
  lenador: { who: 'Tato', name: 'Leñador', detail: 'Va a la manigua con su machete, tumba guásimas y marabú y trae la madera al bohío.', price: 120, level: 4, icon: 'wood', zone: 'manigua',
    look: { shirt: 0x8a5a3a, hat: 0xc9a86a, scarf: 0x2f5d3a, skin: 0x9a6440 } },
};
// Tope de trabajadores: 4 + lo que den las casas del batey (bohío +1, casa de zinc +2)
export const WORKER_BASE_CAP = 4;
export const LENADOR_LOAD = 3; // árboles que tumba antes de volver con la leña
// Camionero: segundos que espera mercancía antes de despedir un camión; cuántos de cada cosa guarda al vender sobrantes.
export const CAM_WAIT = 20;
export const CAM_KEEP = [5, 10, 20, 40];
export const WORKER_ORDER = ['recolector', 'regador', 'sembrador', 'cosechador', 'cocinera', 'camionero', 'lenador'];
// Mejora de rapidez: nivel → (multiplicador de velocidad al caminar, segundos de trabajo, espera entre tareas)
export const WORKER_SPEED = [null, { walk: 2.6, work: 1.4, rest: 1.6 }, { walk: 3.3, work: 0.9, rest: 0.9 }, { walk: 4.1, work: 0.55, rest: 0.4 }];
export const workerUpgradePrice = (role, lvl) => Math.round(WORKERS[role].price * (lvl === 1 ? 0.8 : 1.6) + 20);
// Adelantar el tiempo
export const FF_SPEEDS = [1, 5, 20];
export const FF_STEP = 0.1; // s de juego por subpaso de simulación

// --- Mapa ---------------------------------------------------------------
// Terreno inicial (x 4..14, z 4..12) y camino del camión (x 15..16, toda la altura).
export const START_AREA = { x0: 4, z0: 4, x1: 14, z1: 12 };
export const ROAD = { x0: 15, x1: 16 };

const BASE_PARCELS = [
  {
    id: 'este', name: 'El cantero del este', blurb: 'Tierra roja al otro lado del camino.',
    price: 40, level: 1, rect: { x0: 17, z0: 3, x1: 20, z1: 13 },
    plots: rectTiles(18, 5, 19, 9),
    palms: [[20, 4], [20, 12], [17, 12]],
  },
  {
    id: 'norte', name: 'La vega de tabaco', blurb: 'Canteros grandes y la casa de tabaco.',
    price: 150, level: 3, rect: { x0: 4, z0: 0, x1: 14, z1: 3 },
    plots: rectTiles(9, 1, 13, 2),
    palms: [[4, 0], [14, 0], [7, 3]],
    decor: [{ kind: 'tobaccoHouse', x: 4, z: 1, w: 3, h: 2 }],
  },
  {
    id: 'oeste', name: 'El patio de atrás', blurb: 'Más canteros detrás del bohío.',
    price: 320, level: 5, rect: { x0: 0, z0: 3, x1: 3, z1: 13 },
    plots: rectTiles(1, 6, 2, 11),
    palms: [[0, 3], [3, 4], [0, 13]],
  },
  {
    id: 'sur', name: 'El cañaveral', blurb: 'El pedazo grande, para cuando la finca crezca.',
    price: 600, level: 7, rect: { x0: 4, z0: 13, x1: 14, z1: 17 },
    plots: rectTiles(5, 14, 12, 15),
    palms: [[4, 16], [14, 17], [9, 17], [4, 13]],
  },
];

// Estructuras que se construyen en solares de la tierra nueva (x,z = esquina; w×h tiles).
// kind: animal (produce solo, se recoge), proc (recetas), boost (mejora), dock (segundo andén de carga).
export const STRUCTURES = {
  anden: { name: 'Segundo andén', detail: 'Se cargan dos camiones a la vez.', price: 450, level: 6, kind: 'dock', parcel: 'esquinita', x: 17, z: 14, w: 2, h: 2 },
  vacas: { madera: 6, name: 'Corral de vacas', detail: 'Dos vacas dan 2 cantinas de leche cada 2 min.', price: 700, level: 8, kind: 'animal', parcel: 'potrero', x: 23, z: 2, w: 4, h: 3, animal: 'cow', n: 2, produce: { item: 'leche', qty: 2, time: 120 } },
  chivos: { madera: 6, name: 'Corral de chivos', detail: 'Las chivas dan queso cada 2 min y medio.', price: 820, level: 9, kind: 'animal', parcel: 'loma', x: 23, z: 13, w: 3, h: 3, animal: 'goat', n: 3, produce: { item: 'queso', qty: 1, time: 150 } },
  pozo: { madera: 8, name: 'Pozo con molino', detail: 'Regar quita 45 % del tiempo restante (antes 30 %).', price: 600, level: 10, kind: 'boost', parcel: 'platanal', x: 2, z: 20, w: 2, h: 2 },
  cerdos: { madera: 12, name: 'Chiquero', detail: 'Los puercos dan una pieza de carne cada 4 min.', price: 1000, level: 11, kind: 'animal', parcel: 'arrozal', x: 11, z: 19, w: 3, h: 3, animal: 'pig', n: 3, produce: { item: 'carne', qty: 1, time: 240 } },
  trapiche: { madera: 20, name: 'Trapiche', detail: 'Muele caña: melao y azúcar.', price: 1300, level: 12, kind: 'proc', parcel: 'trapiche', x: 19, z: 20, w: 3, h: 2 },
  gallinero2: { madera: 12, name: 'Gallinero grande', detail: 'Más gallinas: 4 huevos cada minuto y medio, en su cesta.', price: 900, level: 13, kind: 'animal', parcel: 'monte', x: 30, z: 4, w: 3, h: 3, animal: 'hen', n: 4, produce: { item: 'egg', qty: 4, time: 90 } },
  fogon2: { madera: 10, name: 'Segundo fogón', detail: 'Otro fogón para kétchup y guarapo.', price: 1100, level: 14, kind: 'proc', parcel: 'sabana', x: 30, z: 16, w: 2, h: 2 },
  casaTabaco: { madera: 20, name: 'Casa de curar tabaco', detail: 'Tuerce las hojas en tabacos.', price: 1800, level: 15, kind: 'proc', parcel: 'vega_sur', x: 3, z: 28, w: 3, h: 2 },
};
// v4: obras del batey (zone en vez de parcel). Casas: bohío (+1 trabajador), se mejoran a casa de zinc (+2).
const HOUSES = [[1, 43, 5, 120, 8], [5, 43, 5, 150, 10], [9, 43, 6, 190, 12], [18, 43, 7, 240, 14], [22, 43, 8, 300, 16], [26, 43, 10, 380, 18], [18, 53, 12, 480, 20], [22, 53, 14, 600, 22]];
HOUSES.forEach(([x, z, level, price, wood], i) => {
  STRUCTURES[`casa${i + 1}`] = { name: `Casa ${i + 1} del batey`, detail: 'Un bohío para los trabajadores: +1 al tope. Se mejora a casa de zinc (+2).', price, madera: wood, level, kind: 'house', zone: 'batey', x, z, w: 3, h: 3, cap: 1,
    upgrade: { level: Math.max(9, level + 2), price: Math.round(price * 2.2), madera: wood + 10, cap: 2, name: 'Casa de zinc' } };
});
Object.assign(STRUCTURES, {
  bodega: { name: 'La bodega', detail: 'La tiendita del batey: semillas y gallinas 15 % más baratas.', price: 250, madera: 12, level: 6, kind: 'civic', zone: 'batey', x: 18, z: 48, w: 4, h: 3, effect: { discount: 0.15 } },
  escuela: { name: 'La escuelita', detail: 'Los niños del batey aprenden y tú también: +10 % de XP.', price: 900, madera: 30, level: 12, kind: 'civic', zone: 'batey', x: 24, z: 48, w: 4, h: 3, effect: { xp: 0.1 } },
  iglesia: { name: 'La iglesita', detail: 'Campanas los domingos: +5 % en los pedidos de los camiones.', price: 1200, madera: 40, level: 14, kind: 'civic', zone: 'batey', x: 1, z: 53, w: 4, h: 4, effect: { pay: 0.05 } },
});
// Balance: desde el nivel 12 las obras (y sus mejoras) cuestan el doble: sumideros de pesos para el tramo medio.
export const LATE_LEVEL = 12;
export const LATE_MUL = 2;
for (const st of Object.values(STRUCTURES)) {
  if (st.level >= LATE_LEVEL) st.price *= LATE_MUL;
  if (st.upgrade && st.upgrade.level >= LATE_LEVEL) st.upgrade.price *= LATE_MUL;
}
export const STRUCTURE_ORDER = ['anden', 'vacas', 'chivos', 'pozo', 'cerdos', 'trapiche', 'gallinero2', 'fogon2', 'casaTabaco'];
export const BATEY_ORDER = ['casa1', 'casa2', 'casa3', 'bodega', 'casa4', 'casa5', 'casa6', 'escuela', 'casa7', 'iglesia', 'casa8'];
export const OBSTACLES = {
  rock: { name: 'Piedras', verb: 'Quitar las piedras', base: 6, xp: 2 },
  marabu: { name: 'Marabú', verb: 'Chapear el marabú', base: 10, xp: 3 },
  stump: { name: 'Tocón viejo', verb: 'Sacar el tocón', base: 8, xp: 2 },
};

// Generador determinista de las parcelas nuevas: canteros en franjas de 2 filas, palmas en las esquinas,
// obstáculos (piedras, marabú, tocones) que hay que quitar; algunos tapan canteros.
function srng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function genParcel(d, seed) {
  const r = srng(seed);
  const { x0, z0, x1, z1 } = d.rect;
  const st = Object.entries(STRUCTURES).find(([, v]) => v.parcel === d.id);
  const site = st ? { id: st[0], x: st[1].x, z: st[1].z, w: st[1].w, h: st[1].h } : null;
  const nearSite = (x, z) => site && x >= site.x - 1 && x <= site.x + site.w && z >= site.z - 1 && z <= site.z + site.h;
  const palms = [[x0, z0], [x1, z1], [x1, z0]].filter(([x, z]) => !(x >= 15 && x <= 16) && !nearSite(x, z)).slice(0, 2 + (seed % 2));
  const taken = new Set(palms.map(([x, z]) => `${x},${z}`));
  const plots = [];
  for (let z = z0 + 1, row = 0; z <= z1 - 1; z++, row++) {
    if (row % 3 === 2) continue; // camino entre franjas
    for (let x = x0 + 1; x <= x1 - 1; x++) {
      if (x >= 15 && x <= 16) continue;
      if (nearSite(x, z) || taken.has(`${x},${z}`)) continue;
      if (plots.length < d.plots) plots.push([x, z]);
    }
  }
  plots.forEach(([x, z]) => taken.add(`${x},${z}`));
  const kinds = d.obstacles || ['rock', 'marabu', 'stump'];
  const obstacles = [];
  let i = 0;
  // algunos canteros tapados
  for (const [x, z] of plots) if (r() < (d.covered ?? 0.3)) obstacles.push({ id: `${d.id}-${i++}`, kind: kinds[Math.floor(r() * kinds.length)], x, z });
  // y monte suelto en el resto
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) {
    if (x >= 15 && x <= 16) continue;
    if (taken.has(`${x},${z}`) || nearSite(x, z)) continue;
    if (r() < (d.wild ?? 0.07)) obstacles.push({ id: `${d.id}-${i++}`, kind: kinds[Math.floor(r() * kinds.length)], x, z });
  }
  for (const o of obstacles) o.cost = OBSTACLES[o.kind].base + Math.round(d.level * (o.kind === 'marabu' ? 3 : 2));
  return { ...d, plots, palms, obstacles, site };
}
const NEW_PARCELS = [
  { id: 'cuarton', name: 'El cuartón', blurb: 'Un pedacito con piedras al norte del camino.', price: 90, level: 2, rect: { x0: 17, z0: 0, x1: 20, z1: 2 }, plots: 4, obstacles: ['rock'], covered: 0.5 },
  { id: 'rinconada', name: 'La rinconada', blurb: 'Rincón de marabú detrás del bohío.', price: 220, level: 4, rect: { x0: 0, z0: 14, x1: 3, z1: 17 }, plots: 4, obstacles: ['marabu'] },
  { id: 'esquinita', name: 'La esquinita', blurb: 'Junto al camino: solar para un segundo andén.', price: 380, level: 6, rect: { x0: 17, z0: 14, x1: 20, z1: 17 }, plots: 4, obstacles: ['stump', 'rock'] },
  { id: 'potrero', name: 'El potrero', blurb: 'Pasto para un corral de vacas.', price: 650, level: 8, rect: { x0: 21, z0: 0, x1: 27, z1: 8 }, plots: 10 },
  { id: 'loma', name: 'La loma', blurb: 'Lomita con espacio para chivos.', price: 800, level: 9, rect: { x0: 21, z0: 9, x1: 27, z1: 17 }, plots: 10 },
  { id: 'platanal', name: 'El platanal', blurb: 'Tierra húmeda: aquí va el pozo.', price: 950, level: 10, rect: { x0: 0, z0: 18, x1: 6, z1: 25 }, plots: 12, obstacles: ['marabu', 'stump'] },
  { id: 'arrozal', name: 'El arrozal', blurb: 'Llano grande con solar para el chiquero.', price: 1100, level: 11, rect: { x0: 7, z0: 18, x1: 14, z1: 25 }, plots: 14 },
  { id: 'trapiche', name: 'El batey del trapiche', blurb: 'Al otro lado del camino: muele tu caña.', price: 1300, level: 12, rect: { x0: 17, z0: 18, x1: 27, z1: 25 }, plots: 16 },
  { id: 'monte', name: 'El monte', blurb: 'Mucho marabú, pero tierra buena.', price: 1500, level: 13, rect: { x0: 28, z0: 0, x1: 35, z1: 12 }, plots: 18, obstacles: ['marabu'], covered: 0.45, wild: 0.12 },
  { id: 'sabana', name: 'La sabana', blurb: 'Abierta y llana, con solar para otro fogón.', price: 1750, level: 14, rect: { x0: 28, z0: 13, x1: 35, z1: 25 }, plots: 18 },
  { id: 'vega_sur', name: 'La vega del sur', blurb: 'Para tabaco del bueno y su casa de curar.', price: 2000, level: 15, rect: { x0: 0, z0: 26, x1: 14, z1: 32 }, plots: 22 },
  { id: 'lagunita', name: 'La lagunita', blurb: 'Tierra fresca junto al camino.', price: 2300, level: 16, rect: { x0: 17, z0: 26, x1: 27, z1: 32 }, plots: 16, obstacles: ['stump', 'rock'] },
  { id: 'canada', name: 'La cañada', blurb: 'Al fondo del monte, tierra negra.', price: 2600, level: 17, rect: { x0: 36, z0: 0, x1: 45, z1: 12 }, plots: 22, obstacles: ['marabu', 'stump'], covered: 0.4 },
  { id: 'mangos', name: 'Los mangos', blurb: 'Sombra de mangos viejos y buena tierra.', price: 2900, level: 18, rect: { x0: 36, z0: 13, x1: 45, z1: 25 }, plots: 22 },
  { id: 'fondo', name: 'El fondo', blurb: 'La parte más baja de la finca.', price: 3300, level: 19, rect: { x0: 0, z0: 33, x1: 14, z1: 39 }, plots: 24 },
  { id: 'caminoreal', name: 'El camino real', blurb: 'A los dos lados de la entrada de los camiones.', price: 3700, level: 20, rect: { x0: 17, z0: 33, x1: 27, z1: 39 }, plots: 18 },
  { id: 'ojodeagua', name: 'El ojo de agua', blurb: 'Manantial y monte cerrado.', price: 4200, level: 21, rect: { x0: 28, z0: 26, x1: 35, z1: 39 }, plots: 20, obstacles: ['marabu', 'rock'], covered: 0.4 },
  { id: 'lavuelta', name: 'La vuelta de abajo', blurb: 'La última esquina: ¡la finca completa!', price: 5000, level: 22, rect: { x0: 36, z0: 26, x1: 45, z1: 39 }, plots: 26 },
];
export const PARCELS = [...BASE_PARCELS.map((p) => ({ ...p, obstacles: [], site: null })), ...NEW_PARCELS.map((d, i) => genParcel({ ...d, price: d.level >= LATE_LEVEL ? d.price * LATE_MUL : d.price }, 1000 + i * 37))];
export const OBSTACLE_LIST = PARCELS.flatMap((p) => p.obstacles.map((o) => ({ ...o, parcel: p.id })));

export function rectTiles(x0, z0, x1, z1) {
  const out = [];
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push([x, z]);
  return out;
}

// Estructuras fijas en el terreno inicial: huella en tiles (x,z,w,h).
export const BUILDINGS = {
  house: { x: 5, z: 4, w: 3, h: 3, name: 'El bohío' },
  coop: { x: 9, z: 4, w: 2, h: 2, name: 'El gallinero' },
  kitchen: { x: 12, z: 4, w: 2, h: 2, name: 'La cocina' },
  ceiba: { x: 1, z: 0, w: 2, h: 2, name: 'La ceiba' },
  tank: { x: 4, z: 7, w: 1, h: 1, name: 'El tanque' },
};
// Corral de las gallinas (tiles interiores) con portón al sur.
export const PEN = { x0: 8, z0: 6, x1: 11, z1: 8, gate: [[9, 9], [10, 9]] };
export const START_PLOTS = rectTiles(5, 9, 8, 10);
export const START_PALMS = [[4, 12], [10, 12], [14, 4], [8, 4]];
export const FLAGPOLE = [14, 7]; // una sola bandera en mástil (+ una en el bohío)
export const TRUCK_SPOT = { x: 15.5, z: 9.5 }; // centro del camión parqueado (ocupa x15-16, z8-11)
export const TRUCK_TILES = rectTiles(15, 8, 16, 11);

// ---- v4: varios trabajadores por oficio. Cada contratado tiene su nombre y su ropa.
export const WORKER_NAMES = {
  recolector: ['Pancho', 'Lázaro', 'Ramón', 'Nené', 'Felo', 'Cuco'],
  regador: ['Yoel', 'Osmany', 'Yordanis', 'Rafa', 'Pepe', 'Tony'],
  sembrador: ['María', 'Yamilé', 'Odalys', 'Mirta', 'Lourdes', 'Tania'],
  cosechador: ['Cachita', 'Iraida', 'Marisol', 'Yusimí', 'Dayana', 'Elena'],
  cocinera: ['Caridad', 'Fefa', 'Nilda', 'Clara', 'Zoila', 'Gladys'],
  camionero: ['Chucho', 'Reinaldo', 'Papo', 'Alexis', 'Manolo', 'Berto'],
  lenador: ['Tato', 'Cheo', 'Nando', 'Kiko', 'Lalo', 'Mingo'],
};
const SHIRTS = [0x6f8fa8, 0xe8e2d0, 0xd7a94a, 0xc9566a, 0x5f7f4f, 0x8a5a3a, 0x4a6a8a, 0xb8574a, 0x7a8a5a, 0xd9c9a0];
const SKINS = [0xc58c5c, 0x8a5a3a, 0xd9a77a, 0x7a4a2e, 0xb07850, 0xe0b08a, 0x9a6440, 0x5e3a24];
const HATS = [0xd9c08a, 0x7a5a36, 0xe0c896, 0x3a3028, 0xc9a86a];
// n = cuántos de ese oficio se contrataron antes (0 = el original)
export function workerName(role, n = 0) { const L = WORKER_NAMES[role] || [WORKERS[role]?.who || 'Trabajador']; return n < L.length ? L[n] : `${L[n % L.length]} ${Math.floor(n / L.length) + 1}`; }
export function workerLook(role, n = 0) {
  const base = WORKERS[role].look;
  if (!n) return base;
  const k = n * 3 + role.length;
  return { ...base, shirt: SHIRTS[k % SHIRTS.length], skin: SKINS[(k * 5) % SKINS.length], hat: base.hat == null ? null : HATS[k % HATS.length] };
}
// cada uno más del mismo oficio cuesta más (balance: precio × (1 + n)², antes × (1 + 0,75·n))
export const workerHirePrice = (role, have = 0) => Math.round((WORKERS[role].price * (1 + have) ** 2) / 5) * 5;
export const WORKER_LEVEL_CAP = 5; // +1 al tope cada 5 niveles (antes 4)
