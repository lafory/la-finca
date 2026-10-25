// Economía, mapa y progresión de La Finca. Todo en una cuadrícula W×H (1 tile = 1 unidad).
export const W = 22;
export const H = 18;

export const SAVE_KEY = 'lafinca-v2';

// Niveles: XP acumulada necesaria para llegar a cada nivel (índice = nivel).
export const LEVEL_XP = [0, 0, 20, 55, 110, 190, 300, 450, 650, 900, 1200];
export function xpForLevel(l) {
  if (l < LEVEL_XP.length) return LEVEL_XP[l];
  return LEVEL_XP[LEVEL_XP.length - 1] + (l - LEVEL_XP.length + 1) * 260;
}

export const ITEMS = {
  egg: { name: 'Huevo', plural: 'Huevos', sell: 5, xp: 1 },
  tomato: { name: 'Tomate', plural: 'Tomates', sell: 12, xp: 3 },
  cane: { name: 'Caña', plural: 'Cañas', sell: 32, xp: 6 },
  tobacco: { name: 'Tabaco', plural: 'Hojas de tabaco', sell: 70, xp: 10 },
  ketchup: { name: 'Kétchup', plural: 'Pomos de kétchup', sell: 48, xp: 6 },
  guarapo: { name: 'Guarapo', plural: 'Jarras de guarapo', sell: 85, xp: 8 },
};
export const SELLABLE = ['egg', 'tomato', 'cane', 'tobacco', 'ketchup', 'guarapo'];

export const CROPS = {
  tomato: { name: 'Tomate', seedName: 'Semilla de tomate', seed: 5, grow: 60, level: 1, item: 'tomato', xpPlant: 1 },
  cane: { name: 'Caña de azúcar', seedName: 'Esqueje de caña', seed: 10, grow: 180, level: 3, item: 'cane', xpPlant: 1 },
  tobacco: { name: 'Tabaco', seedName: 'Semilla de tabaco', seed: 20, grow: 300, level: 4, item: 'tobacco', xpPlant: 2 },
};
export const CROP_ORDER = ['tomato', 'cane', 'tobacco'];

export const RECIPES = {
  ketchup: { name: 'Kétchup', needs: { tomato: 3 }, time: 30, level: 2, out: 'ketchup' },
  guarapo: { name: 'Guarapo', needs: { cane: 2 }, time: 45, level: 5, out: 'guarapo' },
};

// Precios que escalan: base * factor^cantidad
export const PRICES = {
  chicken: 28, chickenStep: 1.25,
  coop: 90,      // nivel 3
  abono: 120,    // nivel 4
  storage: [60, 220], // niveles 2 y 5
};
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
  camionero: { who: 'Chucho', name: 'Camionero', detail: 'Carga los camiones y despide a los que piden lo que no hay.', price: 300, level: 5, icon: 'truck',
    look: { shirt: 0x5f7f4f, hat: 0x3a3028, scarf: 0xe0b84a, skin: 0xe0b08a } },
};
export const WORKER_ORDER = ['recolector', 'regador', 'sembrador', 'cosechador', 'cocinera', 'camionero'];
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

export const PARCELS = [
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
