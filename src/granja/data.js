// Granja grande: gallinero por niveles, surcos, potrero de vacas ampliable y batey más grande.
// Estado en s.ext.granja = { coop, vacas, plowed }. Todo es compatible con partidas viejas.
import { PRICES } from '../data.js';

// ---- Gallinero (nivel 1 = el de siempre; el 2 es la «Ampliación» de la tienda)
// pen = corral (tiles interiores) con portón al sur. cap = gallinas; lay = factor del tiempo entre huevos; nests = nidales.
export const COOP_LEVELS = [
  null,
  { name: 'Gallinero', cap: 4, lay: 1, nests: 2, pen: { x0: 8, z0: 6, x1: 11, z1: 8, gate: [[9, 9], [10, 9]] } },
  { name: 'Gallinero ampliado', cap: 8, lay: 0.9, nests: 4, price: PRICES.coop, madera: 0, level: 3, pen: { x0: 8, z0: 6, x1: 12, z1: 8, gate: [[9, 9], [10, 9]] }, detail: 'Corral más ancho, 8 gallinas y 4 nidales.' },
  { name: 'Gallinero de zinc', cap: 12, lay: 0.8, nests: 6, price: 600, madera: 10, level: 6, pen: { x0: 8, z0: 6, x1: 13, z1: 8, gate: [[9, 9], [10, 9]] }, detail: 'Techo de zinc con sombra, 12 gallinas, 6 nidales y huevos más seguidos.' },
  { name: 'Granja avícola', cap: 16, lay: 0.65, nests: 8, price: 1500, madera: 25, level: 10, pen: { x0: 9, z0: 6, x1: 13, z1: 9, gate: [[10, 10], [11, 10]] }, detail: 'Corral grande con segunda caseta, 16 gallinas y 8 nidales.' },
];
export const COOP_MAX = COOP_LEVELS.length - 1;
export const coopLevel = (s) => Math.max(s.ext?.granja?.coop || 1, s.upgrades?.coop ? 2 : 1);

// ---- Surcos: arar tierra propia en bloques
export const PLOW = { price: 3, max: 600, sizes: [1, 2, 3, 4] };

// ---- Potrero de vacas (la obra 'vacas' de data.js es el nivel 1)
export const VACAS_LEVELS = [
  null,
  { name: 'Corral de vacas', w: 4, h: 3, n: 2, qty: 2 },
  { name: 'Potrero mediano', w: 5, h: 4, n: 4, qty: 3, price: 950, madera: 15, level: 10, detail: '4 vacas y 3 cantinas de leche por ordeño.' },
  { name: 'Potrero grande', w: 5, h: 5, n: 6, qty: 5, price: 1900, madera: 30, level: 14, detail: '6 vacas, rancho de ordeño y 5 cantinas por ordeño.' },
];
export const VACAS_MAX = VACAS_LEVELS.length - 1;

// ---- Batey: más solares, calles, obras nuevas y casas de mampostería (tercer nivel)
export const NEW_HOUSES = [
  // [x, z, nivel, precio, madera]
  [5, 53, 9, 320, 14], [9, 53, 11, 420, 16], [26, 53, 13, 520, 18], [1, 48, 15, 640, 20],
];
export const NEW_CIVIC = {
  consultorio: { name: 'El consultorio', detail: 'El médico de la familia: los trabajadores rinden más (+5 % de XP).', price: 1100, madera: 30, level: 13, kind: 'civic', zone: 'batey', x: 28, z: 48, w: 3, h: 3, effect: { xp: 0.05 } },
  panaderia: { name: 'La panadería', detail: 'Pan de flauta caliente: +5 % en los pedidos de los camiones.', price: 1400, madera: 35, level: 16, kind: 'civic', zone: 'batey', x: 13, z: 48, w: 2, h: 3, effect: { pay: 0.05 } },
  domino: { name: 'La placita del dominó', detail: 'Mesa de dominó a la sombra: semillas y gallinas 5 % más baratas.', price: 700, madera: 20, level: 10, kind: 'civic', zone: 'batey', x: 13, z: 53, w: 2, h: 2, effect: { discount: 0.05 } },
};
// casa de mampostería: tercer nivel de todas las casas (+3)
export const MASONRY = (st) => ({ level: Math.max(12, st.level + 5), price: Math.round(st.price * 4), madera: (st.madera || 0) + 25, cap: 3, name: 'Casa de mampostería' });
// Calles nuevas del batey (franjas de tierra apisonada): [x0, z0, x1, z1]
export const STREETS = [[0, 57, 30, 57], [4, 47, 4, 52], [17, 42, 17, 57]];
