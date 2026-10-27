// Fincas regionales jugables: qué se siembra/cría y qué se construye en cada tipo de finca.
// Una finca tiene una cuadrícula de lotes (x,z) que crece con la tierra comprada (f.lvl = tramo de tierra 1–3).
// Cada lote puede estar vacío, sembrado ({k:'p', t0}) o con una construcción ({k:'b', b}).
import { CITY_BY_ID, GOODS } from './data.js';

export const CELL = 2.2; // tamaño del lote en la escena
export const GRID = [null, [4, 3], [5, 4], [6, 5]]; // columnas × filas por tramo de tierra
export const AUTO = 0.7; // los jornaleros cosechan solos al 70 %
export const BOOST_CAP = 8 * 3600; // horas que cuentan con el juego cerrado

// prod: lo que se pone en el lote · build: construcciones propias del tipo (cada una una vez).
// mult = multiplicador del valor de la cosecha; casa (jornaleros) = cosechan y resiembran solos.
const CASA = { id: 'casa', name: 'Bohío de jornaleros', cost: 0.3, mult: 1, detail: 'Los jornaleros cosechan y vuelven a sembrar solos, también con el juego cerrado (al 70 %).' };
export const TYPES = {
  arroz: { prod: { name: 'Arrozal', verb: 'Sembrar', dur: 120, color: 0x8fbf4a, water: true }, ground: 0x7f9a4a,
    build: [CASA, { id: 'secadero', name: 'Secadero de arroz', cost: 0.8, mult: 1.3, detail: 'Patio de cemento para secar el grano: +30 % de valor.' }, { id: 'molino', name: 'Molino arrocero', cost: 0.6, mult: 1.2, detail: 'Descascara el arroz: +20 %.' }] },
  ganado: { prod: { name: 'Potrero con reses', verb: 'Soltar reses', dur: 240, color: 0x9fbf5a, animal: true }, ground: 0x8aa850,
    build: [CASA, { id: 'corral', name: 'Corral y bebedero', cost: 0.8, mult: 1.3, detail: 'Las reses engordan más: +30 %.' }, { id: 'vaqueria', name: 'Vaquería', cost: 0.6, mult: 1.2, detail: 'Ordeño de leche: +20 %.' }] },
  cacao: { prod: { name: 'Matas de cacao', verb: 'Sembrar', dur: 200, color: 0x4f7a32, tree: true, fruit: 0xd8862a }, ground: 0x6f8a42,
    build: [CASA, { id: 'secadero', name: 'Secadero de cacao', cost: 0.8, mult: 1.3, detail: 'Fermenta y seca las semillas: +30 %.' }, { id: 'almacen', name: 'Almacén', cost: 0.6, mult: 1.2, detail: '+20 % al vender por sacos.' }] },
  cafe: { prod: { name: 'Cafetal', verb: 'Sembrar', dur: 180, color: 0x3f6a2a, bush: true, fruit: 0xc8332b }, ground: 0x7a8a48, slope: true,
    build: [CASA, { id: 'secadero', name: 'Secadero de café', cost: 0.8, mult: 1.3, detail: 'Tendales para secar el grano: +30 %.' }, { id: 'despulpadora', name: 'Despulpadora', cost: 0.6, mult: 1.2, detail: 'Café despulpado: +20 %.' }] },
  maiz: { prod: { name: 'Maizal', verb: 'Sembrar', dur: 100, color: 0x7fa83a, tall: true, fruit: 0xe8c040 }, ground: 0x8a9a4a,
    build: [CASA, { id: 'granero', name: 'Granero (cuje de mazorcas)', cost: 0.8, mult: 1.3, detail: '+30 % guardando el maíz seco.' }, { id: 'almacen', name: 'Almacén', cost: 0.6, mult: 1.2, detail: '+20 %.' }] },
  cana: { prod: { name: 'Cañaveral', verb: 'Sembrar', dur: 160, color: 0x8fa442, cane: true }, ground: 0x8a9a4a,
    build: [CASA, { id: 'trapiche', name: 'Trapiche', cost: 0.8, mult: 1.3, detail: 'Guarapo y melao: +30 %.' }, { id: 'almacen', name: 'Almacén', cost: 0.6, mult: 1.2, detail: '+20 %.' }] },
  tabaco: { prod: { name: 'Vega de tabaco', verb: 'Sembrar', dur: 220, color: 0x6f9a3a, tobacco: true }, ground: 0x8a7a4a,
    build: [CASA, { id: 'casatabaco', name: 'Casa de tabaco', cost: 0.8, mult: 1.3, detail: 'Se cuelgan las hojas a curar: +30 %.' }, { id: 'escogida', name: 'Escogida', cost: 0.6, mult: 1.2, detail: 'Se escogen las mejores hojas: +20 %.' }] },
  pesca: { prod: { name: 'Bote de pesca', verb: 'Echar bote', dur: 90, color: 0x2f7f9f, boat: true }, ground: 0xd8c08a, sea: true,
    build: [CASA, { id: 'muelle', name: 'Muelle', cost: 0.8, mult: 1.3, detail: 'Los botes descargan rápido: +30 %.' }, { id: 'salador', name: 'Salador de pescado', cost: 0.6, mult: 1.2, detail: 'Pescado salado que no se echa a perder: +20 %.' }] },
  citricos: { prod: { name: 'Naranjos', verb: 'Sembrar', dur: 200, color: 0x4f8a32, tree: true, fruit: 0xf0a020 }, ground: 0x7f9a48,
    build: [CASA, { id: 'empacadora', name: 'Empacadora', cost: 0.8, mult: 1.3, detail: 'Cajas de naranjas para el puerto: +30 %.' }, { id: 'almacen', name: 'Almacén', cost: 0.6, mult: 1.2, detail: '+20 %.' }] },
  ron: { prod: { name: 'Cañaveral (para ron)', verb: 'Sembrar', dur: 160, color: 0x8fa442, cane: true }, ground: 0x8a9a4a,
    build: [CASA, { id: 'destileria', name: 'Destilería de ron', cost: 0.8, mult: 2, detail: 'La caña se vuelve ron añejo: ×2 de valor.' }, { id: 'bodega', name: 'Bodega de barriles', cost: 0.6, mult: 1.2, detail: 'El ron se añeja en barriles: +20 %.' }] },
};
export const typeOf = (id) => TYPES[CITY_BY_ID[id].farm[0]];
export const goodOf = (id) => GOODS[CITY_BY_ID[id].farm[0]];
// unidades por cosecha de un lote: con 4 lotes y jornaleros, iguala la renta de la finca vieja de nivel 1
export const yieldOf = (id) => { const c = CITY_BY_ID[id]; return Math.max(1, Math.round((c.farm[2] * typeOf(id).prod.dur) / 60 / 4 / AUTO)); };
export const seedCost = (id) => Math.max(10, Math.round(yieldOf(id) * goodOf(id).value * 0.15));
export const buildCost = (id, b) => Math.round(CITY_BY_ID[id].farm[1] * b.cost);
export const key = (x, z) => `${x},${z}`;
export const inGrid = (lvl, x, z) => { const [c, r] = GRID[lvl] || GRID[1]; return x >= 0 && z >= 0 && x < c && z < r; };
export function cellsOf(lvl) { const [c, r] = GRID[lvl] || GRID[1]; const out = []; for (let z = 0; z < r; z++) for (let x = 0; x < c; x++) out.push([x, z]); return out; }
