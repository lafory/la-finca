// Campos grandes, central azucarero y tren cañero: economía y trazado (módulo autocontenido).
// Las zonas 'campos' (x32–87, z42–79) y 'central' (x0–30, z58–79) están reservadas en ../zones.js.
import { ITEMS } from '../data.js';

export const CAMPOS_LEVEL = 25;
export const CENTRAL_LEVEL = 32;

// ---------------------------------------------------------------- productos industriales
// Se guardan en el acopio / los almacenes del central (no en la canasta). Precio base por unidad.
export const IND = {
  cane: { name: 'Caña', plural: 'Arrobas de caña', sell: ITEMS.cane?.sell ?? 32 },
  tobacco: { name: 'Tabaco', plural: 'Hojas de tabaco', sell: ITEMS.tobacco?.sell ?? 70 },
  tomato: { name: 'Tomate', plural: 'Cajas de tomate', sell: ITEMS.tomato?.sell ?? 12 },
  azucar: { name: 'Azúcar crudo', plural: 'Sacos de azúcar', sell: ITEMS.azucar?.sell ?? 125 },
  melaza: { name: 'Melaza', plural: 'Barriles de melaza', sell: 60 },
  ron: { name: 'Ron', plural: 'Cajas de ron', sell: 320 },
};
export const IND_ORDER = ['cane', 'tobacco', 'tomato', 'azucar', 'melaza', 'ron'];
export const WHOLESALE = 0.75; // venta al por mayor en el acopio
export const ACOPIO_CAP = 1200; // tope antes de los almacenes del central
export const ALMACEN_CAP = 4000; // con la etapa 4

// ---------------------------------------------------------------- campos de 6×6
// Cultivo en bloque: se siembra y se cosecha entero. seed = costo por bloque, yield = unidades por bloque.
export const FIELD_CROPS = {
  cane: { name: 'Caña', level: 25, seed: 360, grow: 480, yield: 108, xpPlant: 30, xpHarvest: 110, verb: 'Sembrar caña' },
  tobacco: { name: 'Tabaco', level: 27, seed: 720, grow: 720, yield: 72, xpPlant: 40, xpHarvest: 140, verb: 'Sembrar tabaco' },
  tomato: { name: 'Tomate', level: 29, seed: 180, grow: 240, yield: 144, xpPlant: 20, xpHarvest: 70, verb: 'Sembrar tomate' },
};
export const FIELD_CROP_ORDER = ['cane', 'tobacco', 'tomato'];
export const PLANT_WORK = 12; // s de juego: la cuadrilla y el tractor siembran
export const HARVEST_WORK = 18; // s de juego: corte y alza
export const FIELD = 6;
// Columnas y filas de bloques (esquina superior izquierda, en tiles)
export const FIELD_XS = [37, 44, 51, 58];
export const FIELD_ZS = [44, 51, 65, 71];
// Orden de compra (los más cercanos al acopio primero): [col, fila, nivel, precio]
const FIELD_LIST = [
  [0, 1, 25, 6000], [1, 1, 25, 6800], [0, 0, 26, 7600], [1, 0, 27, 8600],
  [0, 2, 28, 9800], [1, 2, 29, 11000], [2, 1, 30, 12500], [2, 0, 30, 14000],
  [0, 3, 31, 15500], [1, 3, 33, 17500], [2, 2, 34, 19500], [2, 3, 35, 22000],
  [3, 1, 36, 25000], [3, 0, 37, 28000], [3, 2, 38, 32000], [3, 3, 39, 36000],
];
export const FIELDS = FIELD_LIST.map(([c, r, level, price], i) => ({ id: `f${i + 1}`, n: i + 1, x: FIELD_XS[c], z: FIELD_ZS[r], level, price }));
export const FIELD_BY_ID = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

// ---------------------------------------------------------------- central azucarero (obra en 4 etapas)
// wood = leña (s.wood, la misma que la manigua). dur = s de juego de obra.
export const STAGES = [
  { id: 'cimientos', name: 'Cimientos y patio', detail: 'Se desbroza el terreno y se echan los cimientos de ladrillo.', level: 32, price: 15000, wood: 120, dur: 90 },
  { id: 'via', name: 'Vía estrecha y locomotora', detail: 'Vía de los campos al central y una locomotora de vapor con 4 vagones cañeros.', level: 33, price: 25000, wood: 150, dur: 120 },
  { id: 'calderas', name: 'Casa de calderas y chimenea', detail: 'El basculador, los molinos y las calderas: muele la caña en azúcar y melaza.', level: 34, price: 40000, wood: 200, dur: 150 },
  { id: 'estacion', name: 'Almacenes, estación y destilería', detail: 'Almacenes grandes, estación con pedidos del tren y destilería de ron.', level: 35, price: 60000, wood: 250, dur: 180 },
];
export const WOOD_PRICE = 30; // aserrío: pesos por leña si no alcanza la de la manigua

// Molienda (etapa 3): cada tanda muele caña → azúcar + melaza. Destilería (etapa 4): melaza → ron.
export const MILL = { cane: 20, azucar: 8, melaza: 3, time: 30, xp: 12 };
export const STILL = { melaza: 6, ron: 3, time: 60, xp: 15 };

// ---------------------------------------------------------------- tren cañero
// Lazo: recta norte (z=TOP) de XL a XR hacia el este, media vuelta por el este, recta sur (z=BOT) hacia el oeste, media vuelta por el oeste.
export const TRACK = { XL: 8, XR: 68, TOP: 63.5, BOT: 77.5 };
export const TRAIN = { wagons: 4, cap: 30, speed: 4.6, accel: 1.6, car: 2.55, loco: 3.3 };
// Paradas: s = distancia a lo largo del lazo de la punta de la locomotora
const R = (TRACK.BOT - TRACK.TOP) / 2;
const LS = TRACK.XR - TRACK.XL;
export const LOOP_LEN = 2 * LS + 2 * Math.PI * R;
export const STOPS = {
  station: { s: 30.5 - TRACK.XL, dwell: 4, name: 'Estación' },
  acopio: { s: 41 - TRACK.XL, dwell: 5, name: 'Acopio de caña' },
  basculador: { s: LS + Math.PI * R + (TRACK.XR - 19), dwell: 5, name: 'Basculador del central' },
};
export const STOP_ORDER = ['station', 'acopio', 'basculador'];

// Pedidos del tren (estación, etapa 4): más grandes que los de los camiones.
export const TRAIN_ORDER = { bonus: 1.6, base: 500, cooldown: 20 };

// ---------------------------------------------------------------- huella en la cuadrícula (bloquea al caminar)
export const BLOCKS = {
  acopio: { x: 32, z: 59, w: 4, h: 3 },
  station: { x: 21, z: 59, w: 7, h: 3 },
  mill: { x: 19, z: 66, w: 11, h: 8 },
  almacenes: { x: 5, z: 66, w: 8, h: 6 },
  tanque: { x: 31, z: 64, w: 1, h: 1 },
  destileria: { x: 2, z: 59, w: 3, h: 3 },
};
export const STAGE_BLOCKS = { cimientos: ['mill'], via: ['tanque'], calderas: ['mill'], estacion: ['station', 'almacenes', 'destileria'] };

// Qué abre en cada nivel (para el aviso de subir de nivel)
export function centralUnlocks(level) {
  const out = [];
  for (const [k, c] of Object.entries(FIELD_CROPS)) if (c.level === level) out.push(`Campo grande de ${c.name.toLowerCase()} (${c.yield} por cosecha)`);
  const nf = FIELDS.filter((f) => f.level === level).length;
  if (nf && level !== CAMPOS_LEVEL) out.push(`${nf} campo${nf > 1 ? 's' : ''} grande${nf > 1 ? 's' : ''} más a la venta`);
  for (const st of STAGES) if (st.level === level) out.push(`Central azucarero: ${st.name.toLowerCase()}`);
  if (level === 35) out.push('Pedidos del tren en la estación y ron de la destilería');
  return out;
}
