// Modelos de las fincas de provincia: cultivos nuevos (reusan el kit regional), animales (caballo, mulo, buey),
// obras de proceso de cada región y el paisaje de fondo (sierra, Yunque, Morro, mogotes, bahía…).
// Todo low-poly con color por vértice, como models.js: cada cosa es UNA geometría fusionada.
import * as THREE from 'three';
import * as M from '../models.js';
import { kitGeometry } from '../mambi/regional-kit.js';

const { Builder, part, rng, worn, place, P } = M;

// capas del kit (sólido + follaje [+ agua]) → una geometría, escalada (el kit mide 2.0; un cantero mide 1.0)
function kit(kind, opts, s = 0.5, withWater = true) {
  const g = kitGeometry(kind, opts), b = new Builder();
  for (const k of withWater ? ['solid', 'fol', 'water'] : ['solid', 'fol']) if (g[k]) b.merge(place(g[k], 0, 0, 0, 0, s));
  return b.build();
}

// ---------------------------------------------------------------- cultivos (etapa 1 creciendo, 2 listo)
function henequenGeo(stage) {
  const r = rng(31 + stage), b = new Builder();
  for (const [x, z] of [[-0.24, -0.24], [0.24, 0.24], [0.24, -0.24], [-0.24, 0.24]]) {
    const n = stage === 2 ? 11 : 7, L = stage === 2 ? 0.42 : 0.28;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + r() * 0.3, tilt = 0.5 + r() * 0.5;
      b.add(part(new THREE.ConeGeometry(0.035, L, 4), worn(0x6f9a8a, r, 0.1), { x: x + Math.cos(a) * L * 0.25, y: 0.08 + L * 0.45, z: z - Math.sin(a) * L * 0.25, rz: Math.cos(a) * tilt, rx: Math.sin(a) * tilt, m: 5 }));
    }
    if (stage === 2) b.box(0.025, 0.55, 0.025, 0x8a7a4a, { x, y: 0.2, z });
  }
  return b.build();
}
function cocoteroGeo(stage) {
  const r = rng(71 + stage), b = new Builder();
  const h = stage === 2 ? 1.25 : 0.7;
  b.cyl(0.035, 0.055, h, 6, P.palmTrunk, { x: 0.05, rz: 0.08 });
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2 + r() * 0.3;
    b.box(0.55, 0.02, 0.1, worn(P.leaf, r, 0.12), { x: 0.1 + Math.cos(a) * 0.24, y: h - 0.02, z: -Math.sin(a) * 0.24, ry: a, rz: -0.35 });
  }
  if (stage === 2) for (let k = 0; k < 4; k++) b.ico(0.07, k % 2 ? 0x6a8a3a : 0x8a6a3a, { x: 0.08 + Math.cos(k * 1.6) * 0.07, y: h - 0.1, z: Math.sin(k * 1.6) * 0.07 });
  return b.build();
}
export const CROP_MODELS = {
  arroz: (st) => kit('rice', { stage: st === 2 ? 3 : 1 }),
  cacao: (st) => kit('cacao', { stage: st === 2 ? 3 : 1 }),
  cafe: (st) => kit('coffee', { stage: st === 2 ? 3 : 1 }),
  naranja: (st) => kit('citrus', { stage: st === 2 ? 3 : 1 }),
  henequen: (st) => henequenGeo(st),
  cocotero: (st) => cocoteroGeo(st),
};

// ---------------------------------------------------------------- animales
const sph = (r, w = 8, h = 6) => new THREE.SphereGeometry(r, w, h);
export function muleGeo(v = 0) {
  const b = new Builder();
  const main = [0x6a5a4e, 0x4a3e36, 0x8a7a6a][v % 3];
  b.merge(place(M.horseGeo(1), 0, 0, 0, 0, 0.82));
  b.add(part(new THREE.CapsuleGeometry(0.21, 0.55, 4, 8), main, { y: 0.79, rx: Math.PI / 2 }));
  for (const x of [-0.05, 0.05]) b.add(part(new THREE.ConeGeometry(0.03, 0.22, 4), main, { x, y: 1.32, z: -0.6, rx: -0.3 })); // orejas largas
  // serones de carga con sacos de café
  for (const x of [-0.26, 0.26]) b.box(0.12, 0.26, 0.4, 0xc8b088, { x, y: 0.72 });
  b.box(0.5, 0.06, 0.5, 0x6b4a2a, { y: 0.98 });
  return b.build();
}
export function oxGeo(v = 0) {
  const b = new Builder();
  b.merge(place(M.cowGeo(v === 1 ? 2 : 1), 0, 0, 0, 0, 1.1));
  for (const sx of [-1, 1]) b.add(part(new THREE.ConeGeometry(0.05, 0.42, 6), 0xe8dcc0, { x: sx * 0.24, y: 1.48, z: -0.95, rz: -sx * 1.1 }));
  b.box(0.95, 0.08, 0.1, 0x6b4a2a, { y: 1.33, z: -0.82 }); // yugo
  return b.build();
}
export const ANIMAL_MODELS = { horse: (v) => M.horseGeo(v), mule: muleGeo, ox: oxGeo };

// ---------------------------------------------------------------- obras de proceso (centradas, a la medida del solar)
function shed(b, w, d, h, wall, roof, r) {
  b.box(w, h, d, wall);
  b.gable(w + 0.2, d + 0.3, h * 0.7, roof, { y: h });
  b.box(0.45, h * 0.7, 0.04, 0x241a12, { x: w * 0.15, z: d / 2 + 0.01 });
  void r;
}
export const STRUCT_GEOS = {
  mill: () => { const r = rng(5), b = new Builder(); shed(b, 1.8, 1.3, 1.1, 0xd9d0b8, P.tin, r); b.cyl(0.32, 0.32, 1.8, 10, 0xb9b2a2, { x: 1.05, z: -0.1 }); b.cone(0.36, 0.35, 10, P.tin, { x: 1.05, y: 1.8, z: -0.1 }); for (let i = 0; i < 4; i++) b.box(0.3, 0.22, 0.22, 0xd8c8a0, { x: -0.9 + i * 0.32, z: 0.82 }); return b.build(); },
  dairy: () => { const r = rng(6), b = new Builder(); shed(b, 2.2, 1.3, 1.05, 0xf0ece0, 0xb5594a, r); for (let i = 0; i < 3; i++) b.cyl(0.16, 0.16, 0.12, 12, 0xf2e6b0, { x: -0.7 + i * 0.4, y: 0, z: 0.9 }); b.cyl(0.13, 0.15, 0.4, 8, 0xb9b2a2, { x: 1.05, z: 0.85 }); return b.build(); },
  choco: () => { const r = rng(7), b = new Builder(); shed(b, 2.0, 1.3, 1.1, 0xc9a070, P.thatch, r); b.box(0.35, 2.0, 0.35, 0x9c5a3c, { x: -0.8, z: -0.3 }); for (let i = 0; i < 4; i++) b.box(0.28, 0.3, 0.22, 0x8a5a34, { x: 0.2 + (i % 2) * 0.32, y: Math.floor(i / 2) * 0.3, z: 0.85 }); return b.build(); },
  sweets: () => { const r = rng(8), b = new Builder(); shed(b, 1.9, 1.2, 1.0, 0xe8d9b5, P.thatch, r); b.box(1.2, 0.06, 0.5, P.wood, { y: 0.55, z: 0.95 }); for (const x of [-0.5, 0.5]) b.box(0.06, 0.55, 0.06, P.wood, { x, z: 0.95 }); for (let i = 0; i < 5; i++) b.cone(0.06, 0.2, 5, 0xc9a86a, { x: -0.45 + i * 0.22, y: 0.6, z: 0.95, rx: Math.PI }); return b.build(); },
  roaster: () => { const r = rng(9), b = new Builder(); shed(b, 1.9, 1.3, 1.05, 0x9c5a3c, P.tin, r); b.cyl(0.25, 0.25, 0.6, 10, 0x3a3a3a, { x: 1.1, z: 0.4, rz: Math.PI / 2, y: 0.3 }); b.box(0.2, 1.6, 0.2, 0x6f6f6f, { x: 1.1, z: -0.3 }); b.box(2.4, 0.04, 0.9, 0x6b4a2a, { y: 0.02, z: 1.0 }); return b.build(); },
  fiber: () => { const r = rng(10), b = new Builder(); shed(b, 1.6, 1.2, 1.0, 0xd9c9a0, P.tin, r); for (let i = 0; i < 4; i++) { b.box(0.05, 0.9, 0.05, P.wood, { x: 0.95 + (i % 2) * 0.4, z: -0.4 + Math.floor(i / 2) * 0.7 }); } for (let i = 0; i < 6; i++) b.box(0.4, 0.5, 0.02, 0xe8dcb0, { x: 1.15, y: 0.35, z: -0.45 + i * 0.16 }); return b.build(); },
  market: () => {
    const r = rng(11), b = new Builder();
    const cols = [0xc0392b, 0x2f5da8, 0xe0b85a, 0x5f7f4f];
    for (let i = 0; i < 4; i++) {
      const x = -1.1 + (i % 2) * 2.2, z = -1.0 + Math.floor(i / 2) * 2.0;
      b.box(1.3, 0.55, 0.7, P.wood, { x, z });
      for (const dx of [-0.6, 0.6]) b.box(0.05, 1.3, 0.05, P.wood, { x: x + dx, z: z - 0.3 });
      b.box(1.5, 0.05, 1.0, cols[i], { x, y: 1.3, z, rx: 0.15 });
      for (let k = 0; k < 5; k++) b.ico(0.1, [0xd2402c, 0xf09a20, 0x7aa648, 0xe0c040][(k + i) % 4], { x: x - 0.45 + k * 0.22, y: 0.62, z });
    }
    void r; return b.build();
  },
  distillery: () => kit('distillery', { stage: 2 }, 0.85, false),
  dock: () => { const b = new Builder(); b.merge(kit('dock', { stage: 2, sea: true }, 0.95)); b.merge(place(kit('boat', { stage: 3, sea: false }, 0.6, false), 0.7, 0.6)); return b.build(); },
  nets: () => kit('nets', { stage: 2 }, 0.85, false),
};

// ---------------------------------------------------------------- paisaje de fondo (fuera de la finca, al noroeste)
// La cámara mira hacia el noroeste: lo que está en x<0 y z<0 queda al fondo de la vista.
function mountain(b, x, z, rad, h, color, r) {
  b.add(part(new THREE.ConeGeometry(rad, h, 7), worn(color, r, 0.1), { x, y: h / 2, z, ry: r() * 6 }));
  b.add(part(new THREE.IcosahedronGeometry(rad * 0.6, 0), worn(color, r, 0.15), { x: x + rad * 0.3, y: h * 0.25, z: z + rad * 0.2, sy: 0.6 }));
}
function ridge(b, pts, color, r, scale = 1) { for (const [x, z, rad, h] of pts) mountain(b, x, z, rad * scale, h * scale, color, r); }
function castle(b, x, z, s = 1) {
  const stone = 0xc8b48a;
  b.box(6 * s, 1.6 * s, 4 * s, stone, { x, z });
  for (const [dx, dz] of [[-3, -2], [3, -2], [-3, 2], [3, 2]]) b.box(1.3 * s, 2.2 * s, 1.3 * s, 0xb8a47a, { x: x + dx * s, z: z + dz * s });
  b.cyl(0.55 * s, 0.7 * s, 5.5 * s, 10, 0xe8e0d0, { x: x + 2 * s, z: z - 0.5 * s }); // faro
  b.cyl(0.6 * s, 0.6 * s, 0.6 * s, 10, 0x3a3a3a, { x: x + 2 * s, y: 5.5 * s, z: z - 0.5 * s });
}
function tower(b, x, z) { // torre de Manaca Iznaga
  for (let i = 0; i < 7; i++) { const w = 1.6 - i * 0.16; b.box(w, 1.4, w, i % 2 ? 0xe8dcc0 : 0xd8c8a8, { x, y: i * 1.4, z }); }
  b.cone(0.5, 1.2, 8, 0x9c5a3c, { x, y: 9.8, z });
}
function tinajon(b, x, z, r) {
  b.add(part(sph(0.45, 10, 8), worn(0xb5653d, r, 0.08), { x, y: 0.5, z, sy: 1.25 }));
  b.cyl(0.25, 0.3, 0.14, 10, 0x9c5432, { x, y: 1.0, z });
}
// devuelve { solid, sea } (sea = plano de agua para las costas)
export function landmarkGeo(kind) {
  const r = rng(kind.length * 17), b = new Builder();
  let sea = null;
  const seaPlane = (x0, z0, x1, z1) => { const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0); g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, 0.02, (z0 + z1) / 2); return g; };
  const green = 0x4f6f3a, blue = 0x6a7f8a;
  if (kind === 'sierra') {
    ridge(b, [[-14, -18, 9, 16], [-4, -24, 10, 20], [8, -22, 9, 17], [20, -26, 11, 22], [34, -22, 9, 15], [-24, -6, 9, 14], [-22, 10, 8, 12], [-30, -22, 11, 21]], green, r);
    ridge(b, [[0, -40, 14, 26], [26, -42, 14, 28], [-26, -38, 14, 24]], blue, r);
  } else if (kind === 'yunque') {
    b.cyl(12, 14, 14, 9, worn(green, r, 0.1), { x: -10, z: -28 }); // el Yunque: montaña de tope plano
    b.cyl(11.5, 12, 0.6, 9, 0x5f7f42, { x: -10, y: 14, z: -28 });
    ridge(b, [[16, -26, 9, 12], [-30, -6, 9, 13], [30, -30, 10, 14]], green, r);
    for (let i = 0; i < 14; i++) b.merge(place(M.palmGeo(3 + i, 3.4), -4 - r() * 4, 2 + i * 2.6, r() * 6, 0, 0.9));
    sea = seaPlane(-60, -8, -8, 60);
  } else if (kind === 'morro') {
    ridge(b, [[20, -26, 10, 18], [34, -24, 9, 14], [-28, 14, 9, 14], [-30, 30, 9, 12]], green, r);
    castle(b, -14, -14, 1.1);
    sea = seaPlane(-70, -70, 6, -8);
  } else if (kind === 'tinajones') {
    for (let i = 0; i < 6; i++) tinajon(b, -1.4, 4.5 + i * 1.5, r);
    for (let i = 0; i < 4; i++) tinajon(b, 6 + i * 1.6, -1.4, r);
    for (let i = 0; i < 26; i++) b.merge(place(M.palmGeo(9 + i, 4), -6 - r() * 20, -6 - r() * 20, r() * 6, 0, 0.9 + r() * 0.3));
    ridge(b, [[-30, -34, 8, 5], [0, -40, 9, 6]], 0x8a9a5a, r);
  } else if (kind === 'iznaga') {
    tower(b, -9, -9);
    ridge(b, [[-24, -20, 10, 15], [-6, -28, 10, 17], [12, -26, 9, 13], [-30, 0, 9, 12], [28, -30, 10, 15]], green, r);
    for (let i = 0; i < 18; i++) b.merge(place(M.caneLowGeo(), -4 - r() * 14, -4 - r() * 14, r() * 6, 0, 1.2));
  } else if (kind === 'bahia') {
    castle(b, -20, -20, 0.6);
    for (let i = 0; i < 5; i++) b.merge(place(kit('boat', { stage: 3, sea: false }, 1.2, false), -12 - i * 6, -12 - (i % 2) * 5, r() * 6));
    ridge(b, [[24, -24, 9, 9], [-30, 20, 9, 9]], 0x6f8a4a, r);
    sea = seaPlane(-80, -80, 8, -7);
  } else if (kind === 'mogotes') {
    for (let i = 0; i < 9; i++) b.merge(place(M.mogoteGeo(20 + i), -12 - (i % 3) * 9 + r() * 4, -12 - Math.floor(i / 3) * 9 + r() * 4, r() * 6, 0, 1.6 + r() * 0.6));
    for (let i = 0; i < 4; i++) b.merge(place(M.mogoteGeo(40 + i), 8 + i * 10, -16 - r() * 6, r() * 6, 0, 1.5));
    for (let i = 0; i < 3; i++) b.merge(place(M.mogoteGeo(50 + i), -16 - r() * 6, 8 + i * 10, r() * 6, 0, 1.5));
    for (let i = 0; i < 3; i++) b.merge(place(M.tobaccoHouseGeo(), -3, 3 + i * 6, Math.PI / 2));
  } else if (kind === 'habana') {
    castle(b, -16, -16, 1.2);
    b.box(8, 3, 4, 0xe8e0d0, { x: 14, z: -24 }); // Capitolio a lo lejos
    b.cyl(1.6, 2.2, 4, 12, 0xe8e0d0, { x: 14, y: 3, z: -24 });
    b.add(part(sph(1.8, 12, 8), 0xd8d0c0, { x: 14, y: 7.2, z: -24, sy: 1.2 }));
    for (let i = 0; i < 10; i++) b.box(2.5 + r() * 2, 2 + r() * 5, 2.5 + r() * 2, [0xe8c8a0, 0xa8c8d8, 0xf0e0b0, 0xd8a890][i % 4], { x: 2 + i * 3.6, z: -16 - r() * 4 });
    sea = seaPlane(-80, -80, -2, -9);
  }
  return { solid: b.parts.length ? b.build() : null, sea };
}
