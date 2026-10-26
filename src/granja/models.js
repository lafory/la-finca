// Modelos de la granja grande (API Builder de ../models.js): nidales, techo de zinc del corral, segunda caseta,
// rancho de ordeño, casa de mampostería, consultorio, panadería, placita del dominó y calles del batey.
import { Builder, P, rng, worn, place } from '../models.js';

// Fila de nidales de madera con paja (n cajones a lo largo de X, centrados)
export function nestRowGeo(n, seed = 1) {
  const r = rng(seed);
  const b = new Builder();
  const w = 0.42;
  b.box(n * w + 0.06, 0.06, 0.46, worn(P.woodGrey, r, 0.12), { y: 0.28, m: 1 });
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * w;
    b.box(w - 0.04, 0.26, 0.4, worn(P.wood, r, 0.15), { x, y: 0.34, m: 1 });
    b.box(w - 0.12, 0.18, 0.04, 0x3a2a1e, { x, y: 0.38, z: 0.19 });
    b.box(w - 0.12, 0.05, 0.3, 0xd8bf6a, { x, y: 0.36, z: 0.02, m: 2 }); // paja
    if (r() < 0.6) b.ico(0.045, 0xf3ead8, { x: x + (r() - 0.5) * 0.1, y: 0.42, z: 0.06, sy: 1.25 }, 1);
  }
  b.box(n * w + 0.1, 0.04, 0.55, worn(P.tin, r, 0.2), { y: 0.62, z: -0.05, rx: -0.18, m: 4 });
  for (const x of [-(n * w) / 2, (n * w) / 2]) b.box(0.06, 0.32, 0.06, P.woodGrey, { x, y: 0, z: 0.15, m: 1 });
  return b.build();
}

// Sombra de zinc sobre postes, con percha de palos para las gallinas
export function henShadeGeo(w, d, seed = 3) {
  const r = rng(seed);
  const b = new Builder();
  for (const [x, z] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) b.box(0.08, 1.15, 0.08, worn(P.wood, r, 0.15), { x, z, m: 1 });
  b.box(w + 0.3, 0.04, d + 0.3, worn(P.tin, r, 0.25), { y: 1.18, rx: 0.08, m: 4 });
  for (let i = 0; i < 3; i++) b.box(0.6, 0.02, 0.4, worn(P.rust, r, 0.2), { x: -w / 3 + i * (w / 3), y: 1.22, z: (r() - 0.5) * d * 0.5, rx: 0.08, m: 3 });
  for (let k = 0; k < 3; k++) b.cyl(0.025, 0.025, w, 5, worn(P.woodLite, r, 0.2), { y: 0.35 + k * 0.22, z: -0.2 + k * 0.18, rz: Math.PI / 2, center: true, m: 1 });
  b.box(0.7, 0.12, 0.25, 0x7a7068, { x: w / 2 - 0.5, z: d / 2 - 0.3, m: 6 }); // comedero
  b.box(0.6, 0.03, 0.18, 0xc9a85a, { x: w / 2 - 0.5, y: 0.1, z: d / 2 - 0.3 });
  return b.build();
}

// Segunda caseta del gallinero (granja avícola): tablas pintadas, techo de zinc y rampa
export function henHouseGeo(seed = 5) {
  const r = rng(seed);
  const b = new Builder();
  b.box(1.5, 0.2, 1.1, P.stone, { m: 6 });
  for (const [x, z] of [[-0.65, -0.45], [0.65, -0.45], [-0.65, 0.45], [0.65, 0.45]]) b.box(0.08, 0.3, 0.08, P.wood, { x, z, m: 1 });
  b.box(1.4, 0.75, 1.0, worn(0xd9c7a0, r, 0.12), { y: 0.3, m: 1 });
  for (let i = 0; i < 6; i++) b.box(0.22, 0.72, 0.03, worn(0xd9c7a0, r, 0.25), { x: -0.58 + i * 0.233, y: 0.31, z: 0.51, m: 1 });
  b.box(0.3, 0.3, 0.04, 0x2c2420, { x: 0.3, y: 0.38, z: 0.53 });
  b.box(0.22, 0.03, 0.6, P.woodLite, { x: 0.3, y: 0.2, z: 0.82, rx: 0.5, m: 1 }); // rampa
  b.gable(1.7, 1.3, 0.45, worn(P.tin, r, 0.22), { y: 1.05, m: 4 });
  b.box(0.5, 0.02, 0.3, worn(P.rust, r, 0.2), { x: -0.3, y: 1.25, z: 0.2, rx: 0.6, m: 3 });
  return b.build();
}

// Rancho de ordeño con techo de guano, bebedero largo y cantinas de leche
export function milkShedGeo(seed = 9) {
  const r = rng(seed);
  const b = new Builder();
  for (const [x, z] of [[-0.9, -0.6], [0.9, -0.6], [-0.9, 0.6], [0.9, 0.6]]) b.box(0.09, 1.3, 0.09, worn(P.wood, r, 0.15), { x, z, m: 1 });
  b.gable(2.3, 1.7, 0.6, worn(P.thatch, r, 0.12), { y: 1.3, m: 2 });
  b.box(1.6, 0.25, 0.35, 0x7a7068, { z: -0.4, m: 6 });
  b.box(1.5, 0.02, 0.27, 0x5f88a0, { z: -0.4, y: 0.24 });
  for (let i = 0; i < 3; i++) { b.cyl(0.11, 0.13, 0.42, 9, 0xb9b2a2, { x: -0.5 + i * 0.32, z: 0.35, m: 4 }); b.cyl(0.06, 0.06, 0.06, 8, 0x8a8f8f, { x: -0.5 + i * 0.32, y: 0.42, z: 0.35, m: 4 }); }
  b.box(0.35, 0.35, 0.35, P.woodLite, { x: 0.6, z: 0.3, m: 1 });
  return b.build();
}

// Casa de mampostería del batey: paredes de bloque pintadas, techo de tejas, portal con columnas
export function masonryHouseGeo(seed = 1) {
  const r = rng(seed + 90);
  const b = new Builder();
  const paints = [0xe8c87a, 0x8fc0c0, 0xe6a08a, 0xb9d39a, 0xf0e2c0, 0xc9a9d9];
  const paint = paints[seed % paints.length];
  b.box(2.6, 0.22, 2.4, P.stone, { z: -0.1, m: 6 });
  b.box(2.4, 1.45, 1.75, worn(paint, r, 0.08), { y: 0.22, z: -0.3, m: 6 });
  b.box(2.42, 0.18, 1.77, worn(0xf2ece0, r, 0.05), { y: 1.6, z: -0.3, m: 6 }); // cornisa
  b.box(0.5, 1.0, 0.05, 0x6a4028, { x: -0.45, y: 0.22, z: 0.58, m: 1 });
  for (const x of [0.45, 0.95]) { b.box(0.36, 0.5, 0.05, 0x2c2420, { x, y: 0.75, z: 0.58 }); b.box(0.42, 0.56, 0.04, 0x5f7f6a, { x, y: 0.72, z: 0.6, m: 1 }); }
  // techo de tejas criollas
  b.gable(2.8, 2.3, 0.75, worn(0xb5653d, r, 0.1), { y: 1.78, z: -0.3, m: 6 });
  for (let i = 0; i < 7; i++) b.box(0.05, 0.04, 2.3, worn(0x8a4a2a, r, 0.2), { x: -1.2 + i * 0.4, y: 2.1, z: -0.3, m: 6 });
  // portal con columnas y baranda
  b.box(2.5, 0.08, 0.75, worn(0xb5653d, r, 0.15), { y: 1.42, z: 0.95, rx: 0.1, m: 6 });
  for (const x of [-1.1, -0.35, 0.4, 1.1]) b.cyl(0.07, 0.08, 1.4, 8, 0xf2ece0, { x, z: 1.25, m: 6 });
  b.box(2.3, 0.06, 0.05, 0xf2ece0, { y: 0.5, z: 1.25, m: 6 });
  for (let i = 0; i < 10; i++) b.box(0.03, 0.45, 0.03, 0xe8e0d0, { x: -1.0 + i * 0.22, y: 0.05, z: 1.25 });
  b.box(0.35, 0.5, 0.35, 0x8a5a3a, { x: 0.75, y: 0.22, z: 0.85, m: 1 }); // sillón
  b.cyl(0.18, 0.14, 0.32, 9, 0xb5653d, { x: -1.15, y: 0.22, z: 0.75, m: 6 }); // maceta
  b.ico(0.22, worn(P.leaf, r, 0.15), { x: -1.15, y: 0.7, z: 0.75 });
  return b.build();
}

// Consultorio del médico de la familia: blanco, cruz roja, techo plano con baranda
export function consultorioGeo() {
  const r = rng(301);
  const b = new Builder();
  b.box(2.8, 0.22, 2.7, P.stone, { m: 6 });
  b.box(2.6, 1.7, 2.2, worn(0xf0ece2, r, 0.05), { y: 0.22, z: -0.15, m: 6 });
  b.box(2.7, 0.12, 2.3, 0xd8d0c0, { y: 1.92, z: -0.15, m: 6 });
  for (let i = 0; i < 9; i++) b.box(0.04, 0.3, 0.04, 0xd8d0c0, { x: -1.25 + i * 0.31, y: 2.02, z: 0.95 });
  b.box(0.6, 0.18, 0.06, P.red, { y: 1.35, z: 0.97 }); b.box(0.18, 0.6, 0.06, P.red, { y: 1.14, z: 0.97 });
  b.box(0.6, 1.1, 0.05, 0x4a6a8a, { x: -0.7, y: 0.22, z: 0.96, m: 1 });
  b.box(0.5, 0.5, 0.05, 0x2c3a44, { x: 0.75, y: 0.75, z: 0.96 });
  b.box(2.8, 0.06, 0.7, 0x6fa8b0, { y: 1.5, z: 1.25, rx: 0.15, m: 3 }); // alero azul
  b.box(1.1, 0.04, 0.3, 0xf0ece2, { x: 0.6, y: 0.4, z: 1.4 }); b.box(0.05, 0.4, 0.05, 0x4a3a2a, { x: 0.1, z: 1.4 }); b.box(0.05, 0.4, 0.05, 0x4a3a2a, { x: 1.1, z: 1.4 }); // banco
  return b.build();
}

// Panadería: paredes amarillas, horno de leña con chimenea, letrero
export function panaderiaGeo() {
  const r = rng(302);
  const b = new Builder();
  b.box(1.9, 0.18, 2.8, P.stone, { m: 6 });
  b.box(1.7, 1.45, 2.4, worn(0xe0b85a, r, 0.1), { y: 0.18, z: -0.1, m: 6 });
  b.gable(2.7, 2.1, 0.6, worn(P.tin, r, 0.22), { y: 1.63, z: -0.1, ry: Math.PI / 2, m: 4 });
  b.box(0.6, 1.4, 0.6, P.brick, { x: 0.45, y: 0.18, z: -0.9, m: 6 });
  b.cyl(0.14, 0.16, 1.3, 8, P.brick, { x: 0.45, y: 1.55, z: -0.9, m: 6 });
  b.box(1.3, 0.32, 0.06, 0x7a3a2a, { y: 1.28, z: 1.12 });
  b.box(1.1, 0.18, 0.02, 0xf0e2c0, { y: 1.35, z: 1.16 });
  b.box(0.55, 0.95, 0.05, 0x6a4028, { x: -0.4, y: 0.18, z: 1.11, m: 1 });
  b.box(0.55, 0.5, 0.05, 0x2c2420, { x: 0.4, y: 0.6, z: 1.11 });
  b.box(0.8, 0.5, 0.4, P.woodLite, { x: 0.35, y: 0.18, z: 1.35, m: 1 }); // mostrador
  for (let i = 0; i < 4; i++) b.cyl(0.04, 0.04, 0.42, 6, 0xd8a050, { x: 0.15 + i * 0.12, y: 0.72, z: 1.35, rz: Math.PI / 2, center: true });
  return b.build();
}

// Placita del dominó: mesa, cuatro taburetes y una mata de mango que da sombra
export function dominoGeo() {
  const r = rng(303);
  const b = new Builder();
  b.box(1.9, 0.05, 1.9, 0xc9a477, { m: 6 });
  b.box(0.7, 0.05, 0.7, worn(P.woodLite, r, 0.1), { x: 0.3, y: 0.55, z: 0.3, m: 1 });
  b.box(0.08, 0.55, 0.08, P.wood, { x: 0.3, z: 0.3, m: 1 });
  for (let i = 0; i < 8; i++) b.box(0.08, 0.02, 0.04, 0xf3ecdc, { x: 0.12 + (i % 4) * 0.1, y: 0.59, z: 0.2 + Math.floor(i / 4) * 0.25, ry: r() });
  for (const [x, z] of [[-0.25, 0.3], [0.85, 0.3], [0.3, -0.25], [0.3, 0.85]]) b.cyl(0.13, 0.13, 0.35, 8, 0x8a5a3a, { x, z, m: 1 });
  b.cyl(0.1, 0.14, 1.3, 7, 0x6b4a2a, { x: -0.55, z: -0.55, m: 1 });
  b.ico(0.75, worn(P.leafDark, r, 0.1), { x: -0.45, y: 1.6, z: -0.45, sy: 0.75 }, 1);
  b.ico(0.5, worn(P.leaf, r, 0.1), { x: 0, y: 1.75, z: -0.2, sy: 0.7 }, 1);
  return b.build();
}

// Franja de calle de tierra apisonada con huellas (w×d tiles, centrada)
export function streetGeo(w, d, seed = 7) {
  const r = rng(seed);
  const b = new Builder();
  b.box(w, 0.025, d, 0xc2a074, { m: 6 });
  const along = w >= d;
  const L = along ? w : d;
  for (const o of [-0.22, 0.22]) b.box(along ? L : 0.1, 0.01, along ? 0.1 : L, 0xa88a60, { x: along ? 0 : o, z: along ? o : 0, y: 0.025, m: 6 });
  for (let i = 0; i < L * 0.6; i++) b.box(0.12, 0.03, 0.1, worn(P.stone, r, 0.2), { x: along ? (r() - 0.5) * L : (r() - 0.5) * d, z: along ? (r() - 0.5) * d : (r() - 0.5) * L, y: 0.01, ry: r() * 3, m: 6 });
  return b.build();
}

export { place };
