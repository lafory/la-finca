// Modelos de las fincas regionales (mismo estilo low-poly con color por vértice que la finca principal).
import * as THREE from 'three';
import * as M from '../models.js';
import * as C from '../central/models.js';
import * as G from '../granja/models.js';

const { Builder, part, rng, worn, P } = M;
const fit = (g, s, x = 0, z = 0, ry = 0) => M.place(g, x, z, ry, 0, s);
const sph = (r, w = 8, h = 6) => new THREE.SphereGeometry(r, w, h);

// ---------------------------------------------------------------- base del lote (2×2 aprox.)
export function plotBaseGeo(T) {
  const b = new Builder(), S = 2.0;
  if (T.prod.boat) { // agua del puerto con boyas
    b.box(S, 0.03, S, 0x2f7f9f, { y: -0.02, m: 0 });
    for (const [x, z] of [[-0.9, -0.9], [0.9, 0.9]]) b.cyl(0.07, 0.09, 0.18, 6, 0xd8502e, { x, z, y: -0.02 });
    return b.build();
  }
  if (T.prod.water) { // arrozal: bordo de tierra y agua
    b.box(S, 0.1, S, P.earthDark, { m: 7 });
    b.box(S - 0.3, 0.02, S - 0.3, 0x6f9a9a, { y: 0.1, m: 0 });
    return b.build();
  }
  if (T.prod.animal) { // potrero cercado
    b.box(S, 0.05, S, 0x93a050, { m: 5 });
    for (const [x, z, ry] of [[0, -0.98, 0], [0, 0.98, 0], [-0.98, 0, Math.PI / 2], [0.98, 0, Math.PI / 2]]) {
      for (const d of [-0.5, 0.5]) b.merge(M.place(M.wireFenceGeo(3), x + (ry ? 0 : d), z + (ry ? d : 0), ry, 0.02, 0.95));
    }
    b.box(0.6, 0.18, 0.25, 0x8a8a84, { x: 0.55, z: 0.6, m: 6 }); b.box(0.5, 0.02, 0.18, 0x4f8fa8, { x: 0.55, z: 0.6, y: 0.17 });
    return b.build();
  }
  if (T.slope) { // terraza de cafetal
    b.box(S, 0.22, S, 0x8a5a34, { m: 7 }); b.box(S, 0.06, 0.18, 0x9a9184, { y: 0.16, z: 0.92, m: 6 });
    for (const z of [-0.5, 0.2]) b.box(S - 0.2, 0.06, 0.3, P.earthDark, { y: 0.22, z, m: 7 });
    return b.build();
  }
  // surcos de tierra colorada, como en la finca principal
  b.box(S, 0.05, S, P.furrow, { m: 7 });
  for (const z of [-0.7, -0.23, 0.23, 0.7]) { b.box(S - 0.1, 0.08, 0.3, P.earthDark, { y: 0.04, z, m: 7 }); b.box(S - 0.1, 0.04, 0.2, P.earth, { y: 0.1, z, m: 7 }); }
  return b.build();
}

// ---------------------------------------------------------------- lo sembrado, por etapa (0 brote · 1 creciendo · 2 listo)
export function stageGeo(T, stage) {
  const b = new Builder(), r = rng(31 + stage), pr = T.prod;
  const grid = (n, fn) => { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) fn(-0.75 + (1.5 * i) / (n - 1), -0.75 + (1.5 * j) / (n - 1), i * n + j); };
  if (pr.boat) {
    const boat = new Builder();
    boat.box(0.55, 0.22, 1.5, worn(0xe8d9b5, r, 0.1), { y: 0.0, m: 1 });
    boat.box(0.6, 0.08, 1.55, 0x2f5da8, { y: 0.2, m: 3 });
    boat.add(part(new THREE.ConeGeometry(0.3, 0.5, 4), 0xe8d9b5, { y: 0.11, z: -0.95, rx: -Math.PI / 2, sy: 0.6, ry: Math.PI / 4 }));
    boat.box(0.05, 1.3, 0.05, P.wood, { y: 0.2, z: -0.2, m: 1 });
    boat.add(part(new THREE.PlaneGeometry(0.7, 0.9), 0xf3ecdc, { x: 0.0, y: 0.95, z: 0.15, ry: Math.PI / 2 }));
    if (stage === 2) for (let i = 0; i < 4; i++) b.ico(0.09, 0x8fc0d8, { x: (r() - 0.5) * 0.3, y: 0.3, z: (r() - 0.5) * 0.8, sx: 2 });
    if (stage === 2) b.box(0.4, 0.2, 0.3, 0x9b7a50, { y: 0.24, z: 0.45, m: 1 });
    b.merge(boat.build());
    return M.place(b.build(), 0, 0, 0.3, 0, stage === 0 ? 0.6 : 1);
  }
  if (pr.water) { // arroz: matas en hileras
    const h = [0.2, 0.45, 0.6][stage], col = stage === 2 ? 0xc8b84a : stage === 1 ? 0x8fbf4a : 0x9fcf5a;
    grid(5, (x, z) => { for (const a of [0, 2.1, 4.2]) b.cone(0.05, h, 3, worn(col, r, 0.1), { x: x + Math.cos(a) * 0.06, z: z + Math.sin(a) * 0.06, y: 0.1, rz: Math.cos(a) * 0.25, rx: Math.sin(a) * 0.25, m: 5 }); if (stage === 2) b.ico(0.06, 0xe0c860, { x, z, y: 0.1 + h * 0.9, sy: 1.6 }); });
    return b.build();
  }
  if (pr.animal) {
    if (stage === 0) { b.merge(M.place(M.cowGeo(1), -0.3, 0.1, 0.6, 0.04, 0.6)); return b.build(); }
    b.merge(M.place(M.cowGeo(0), -0.35, -0.1, 0.5, 0.04, stage === 1 ? 0.8 : 0.9));
    if (stage === 2) b.merge(M.place(M.cowGeo(2), 0.45, 0.35, 2.4, 0.04, 0.9));
    return b.build();
  }
  if (pr.tree) { // cacao / naranjos
    const s = [0.35, 0.7, 1][stage];
    for (const [x, z] of [[-0.5, -0.5], [0.5, 0.5]]) {
      b.cyl(0.05 * s + 0.02, 0.07 * s + 0.03, 0.7 * s, 6, 0x7a5a3a, { x, z, m: 1 });
      b.ico(0.55 * s, worn(pr.color, r, 0.12), { x, z, y: 0.6 * s + 0.35 * s, sy: 0.85, m: 5 }, 1);
      if (stage === 2) for (let k = 0; k < 6; k++) { const a = k * 1.05 + r(); b.ico(0.08, pr.fruit, { x: x + Math.cos(a) * 0.42, z: z + Math.sin(a) * 0.42, y: 0.7 + r() * 0.35, sy: T === undefined ? 1 : 1.3 }); }
    }
    return b.build();
  }
  if (pr.bush) { // café
    const s = [0.4, 0.75, 1][stage];
    for (const z of [-0.5, 0.2]) for (const x of [-0.6, 0, 0.6]) {
      b.ico(0.26 * s, worn(pr.color, r, 0.12), { x, z, y: 0.22 + 0.2 * s, sy: 1.3, m: 5 });
      if (stage === 2) for (let k = 0; k < 3; k++) b.ico(0.045, pr.fruit, { x: x + (r() - 0.5) * 0.3, z: z + 0.18, y: 0.3 + r() * 0.3 });
    }
    return b.build();
  }
  if (pr.tall) { // maíz
    const h = [0.25, 0.8, 1.3][stage];
    grid(4, (x, z) => { b.box(0.05, h, 0.05, 0x7fa83a, { x, z, y: 0.08, m: 5 }); for (let k = 0; k < 2; k++) { const a = r() * 6.28; b.box(0.4 * (h / 1.3) + 0.1, 0.02, 0.06, worn(0x6f9a3a, r, 0.1), { x: x + Math.cos(a) * 0.1, z: z - Math.sin(a) * 0.1, y: 0.1 + h * (0.4 + k * 0.25), ry: a, rz: -0.4, m: 5 }); } if (stage === 2) b.box(0.08, 0.2, 0.08, pr.fruit, { x: x + 0.06, z, y: h * 0.55 }); });
    return b.build();
  }
  if (pr.cane) {
    const g = C.fieldCropGeo('cane'), s = [0.3, 0.65, 1][stage];
    for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) b.merge(M.place(g, x, z, 0, 0.05, 1)).parts.at(-1).scale(0.95, s, 0.95);
    g.dispose();
    // la escala en Y deja la base en el suelo porque la geometría arranca en y=0
    return b.build();
  }
  if (pr.tobacco) {
    const g = C.fieldCropGeo('tobacco'), s = [0.35, 0.7, 1][stage];
    for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) { const q = M.place(g, 0, 0, r() * 3, 0, 1); q.scale(s, s, s); q.translate(x, 0.08, z); b.merge(q); }
    g.dispose();
    return b.build();
  }
  b.ico(0.3, pr.color, { y: 0.3 });
  return b.build();
}

// ---------------------------------------------------------------- construcciones (caben en un lote de 2,2)
function dryPatio(grain) {
  const b = new Builder(), r = rng(5);
  b.box(2.0, 0.1, 2.0, 0xc8c0b0, { m: 6 });
  for (let i = 0; i < 6; i++) b.box(0.55, 0.03, 0.55, worn(grain, r, 0.15), { x: -0.6 + (i % 3) * 0.6, z: -0.5 + Math.floor(i / 3) * 0.9, y: 0.1 });
  b.box(0.06, 0.6, 0.06, P.wood, { x: 0.9, z: 0.9, m: 1 }); b.box(0.5, 0.06, 0.06, P.wood, { x: 0.7, z: 0.9, y: 0.55, m: 1 });
  return b.build();
}
function dock() {
  const b = new Builder(), r = rng(9);
  for (let i = 0; i < 7; i++) b.box(0.28, 0.06, 2.0, worn(P.woodLite, r, 0.15), { x: -0.9 + i * 0.3, y: 0.3, m: 1 });
  for (const x of [-0.9, 0.9]) for (const z of [-0.9, 0, 0.9]) b.cyl(0.07, 0.07, 0.6, 6, P.wood, { x, z, y: -0.25, m: 1 });
  b.cyl(0.18, 0.18, 0.3, 8, 0x6b4a2a, { x: 0.6, z: -0.6, y: 0.36, m: 1 });
  b.box(0.4, 0.3, 0.3, 0x9b7a50, { x: -0.5, z: 0.5, y: 0.36, m: 1 });
  return b.build();
}
function racks(color) {
  const b = new Builder(), r = rng(13);
  for (const z of [-0.5, 0.4]) { for (const x of [-0.8, 0.8]) b.box(0.06, 1.0, 0.06, P.wood, { x, z, m: 1 }); b.box(1.7, 0.04, 0.04, P.wood, { z, y: 0.95, m: 1 }); for (let i = 0; i < 7; i++) b.box(0.12, 0.35, 0.03, worn(color, r, 0.15), { x: -0.7 + i * 0.23, z, y: 0.58 }); }
  b.box(1.6, 0.1, 0.5, 0xc8c0b0, { z: 0.9, m: 6 });
  return b.build();
}
function barrels() {
  const b = new Builder(), r = rng(21);
  b.merge(fit(M.zincHouseGeo(4), 0.62, 0, -0.35));
  for (let i = 0; i < 5; i++) b.cyl(0.18, 0.2, 0.42, 10, worn(0x6b4a2a, r, 0.12), { x: -0.7 + i * 0.35, z: 0.75, m: 1 });
  return b.build();
}
function corral() {
  const b = new Builder();
  for (const [x, z, ry] of [[0, -0.95, 0], [0, 0.95, 0], [-0.95, 0, Math.PI / 2], [0.95, 0, Math.PI / 2]]) for (const d of [-0.5, 0.5]) b.merge(M.place(M.plankFenceGeo(2), x + (ry ? 0 : d), z + (ry ? d : 0), ry, 0, 0.95));
  b.box(1.2, 0.22, 0.35, 0x8a8a84, { z: 0.3, m: 6 }); b.box(1.1, 0.02, 0.26, 0x4f8fa8, { z: 0.3, y: 0.21 });
  b.box(1.9, 0.03, 1.9, 0xa08a5a, { m: 7 });
  b.merge(fit(M.tankGeo(), 0.7, -0.6, -0.5));
  return b.build();
}
function crates(color) {
  const b = new Builder();
  b.merge(fit(M.zincHouseGeo(2), 0.62, 0, -0.35));
  for (let i = 0; i < 4; i++) { b.merge(M.place(M.crateGeo(i % 2), -0.6 + i * 0.4, 0.75)); b.ico(0.07, color, { x: -0.6 + i * 0.4, z: 0.75, y: 0.42 }); }
  return b.build();
}
export function buildingGeo(bid, T) {
  switch (bid) {
    case 'casa': return fit(M.smallBohioGeo(3), 0.8);
    case 'secadero': return dryPatio(T.prod.fruit || 0xd8c070);
    case 'molino': { const b = new Builder(); b.merge(fit(M.zincHouseGeo(1), 0.6, -0.2, -0.3)); b.merge(fit(M.tankGeo(), 0.8, 0.7, 0.6)); return b.build(); }
    case 'corral': return corral();
    case 'vaqueria': return fit(G.milkShedGeo(9), 0.85);
    case 'almacen': return fit(M.zincHouseGeo(5), 0.75);
    case 'despulpadora': { const b = new Builder(); b.merge(fit(M.zincHouseGeo(3), 0.55, -0.3, -0.3)); b.merge(fit(M.tankGeo(), 0.7, 0.7, 0.5)); b.merge(fit(M.tankGeo(), 0.55, 0.2, 0.8)); return b.build(); }
    case 'granero': return racks(0xe8c040);
    case 'trapiche': return fit(M.trapicheGeo(), 0.7);
    case 'casatabaco': return fit(M.tobaccoHouseGeo(), 0.68);
    case 'escogida': return fit(M.zincHouseGeo(2), 0.75);
    case 'muelle': return dock();
    case 'salador': return racks(0xc8d0d0);
    case 'empacadora': return crates(0xf0a020);
    case 'destileria': { const g = C.destileriaGeo(); g.translate(-1.5, 0, -1.5); g.scale(0.65, 0.65, 0.65); return g; }
    case 'bodega': return barrels();
    default: return fit(M.smallBohioGeo(1), 0.7);
  }
}

// ---------------------------------------------------------------- jornalero sencillo (una malla) y destello de "listo"
export function workerGeo(seed = 1) {
  const p = M.personParts(seed % 2 ? P.white : 0xd8c8a8, P.hat, seed, { scarf: seed % 3 ? null : P.red });
  const b = new Builder(); b.merge(p.body); b.merge(M.place(p.leg, -0.08, 0, 0, 0.5)); b.merge(M.place(p.leg, 0.08, 0, 0, 0.5)); b.merge(M.place(p.arm, -0.2, 0, 0, 0.88)); b.merge(M.place(p.arm, 0.2, 0, 0, 0.88));
  b.merge(M.toolGeo ? M.place(M.machetGeo(), 0.25, -0.05, 0, 0.5) : null);
  return b.build();
}
export function readyGeo() { const b = new Builder(); b.add(part(new THREE.OctahedronGeometry(0.16, 0), 0xffd84a, { sy: 1.4 })); return b.build(); }

// ---------------------------------------------------------------- marcador pequeño de la finca en el mapa de Cuba
// n = lotes sembrados, k = construcciones, lvl = tramo de tierra; gris si está ocupada.
export function mapFarmGeo(T, n, k, lvl, gray) {
  const b = new Builder(), r = rng(n * 7 + k + lvl);
  const g = (c) => (gray ? new THREE.Color(c).lerp(new THREE.Color(0x8a8d90), 0.75).getHex() : c);
  const cols = 2 + lvl, rows = 2 + Math.min(lvl, 2), s = 0.34;
  const w = cols * s + 0.25, d = rows * s + 0.25;
  b.box(w, 0.06, d, g(T.ground), { m: 5 });
  let i = 0;
  for (let z = 0; z < rows; z++) for (let x = 0; x < cols; x++) {
    const px = -w / 2 + 0.12 + (x + 0.5) * s, pz = -d / 2 + 0.12 + (z + 0.5) * s;
    if (i < n) b.box(s * 0.85, 0.08 + (T.prod.tall || T.prod.cane ? 0.12 : 0), s * 0.85, g(worn(T.prod.color, r, 0.08)), { x: px, z: pz, y: 0.05 });
    else b.box(s * 0.85, 0.03, s * 0.85, g(P.earthDark), { x: px, z: pz, y: 0.05 });
    i++;
  }
  // bohío principal y uno por construcción
  for (let j = 0; j < 1 + Math.min(3, k); j++) {
    const x = w / 2 + 0.2, z = -d / 2 + 0.2 + j * 0.36;
    b.box(0.26, 0.2, 0.22, g(j ? 0xd9c8a0 : P.wood), { x, z });
    b.add(part(new THREE.ConeGeometry(0.22, 0.18, 4), g(j ? P.tin : P.thatch), { x, z, y: 0.29, ry: Math.PI / 4 }));
  }
  // palmas
  for (const [x, z] of [[-w / 2 - 0.15, d / 2], [w / 2 + 0.3, d / 2 + 0.1]]) { b.cyl(0.03, 0.04, 0.7, 5, g(0x9a8466), { x, z }); b.cone(0.24, 0.2, 6, g(0x4f7a32), { x, z, y: 0.62 }); }
  return b.build();
}
