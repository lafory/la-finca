// Modelos procedurales del central, el tren y los campos grandes (mismo estilo: low-poly, color por vértice, gastado).
import * as THREE from 'three';
import { Builder, part, worn, rng, P } from '../models.js';
import { loopAt, LOOP_LEN } from './track.js';

const sph = (r, w = 10, h = 8) => new THREE.SphereGeometry(r, w, h);
// colores propios
export const C = {
  iron: 0x2b2b2a, ironB: 0x3a3a36, boiler: 0x2f3b33, brass: 0xc8a050, redOx: 0x8f3324, red: 0xa83a2a,
  brick: 0x9c5a3c, brickDark: 0x7a4430, soot: 0x2a2420, concrete: 0xb8ad98, rail: 0x6a625a, sleeper: 0x5c4632,
  ballast: 0x8a7e6c, cane: 0xb9b05a, caneDark: 0x9a9446, caneLeaf: 0x7f9c3c, cream: 0xe8d9b5, ochre: 0xd9a54a,
  tractor: 0xa8432e, oxen: 0xd8d0c0, oxenB: 0xb8a890, sack: 0xd8c8a0, steelBlue: 0x5f7380,
};

function wheelX(b, x, y, z, r, w, color = C.iron, rim = C.red) {
  b.add(part(new THREE.CylinderGeometry(r, r, w, 14), color, { x, y, z, rz: Math.PI / 2, m: 3 }));
  b.add(part(new THREE.CylinderGeometry(r * 0.55, r * 0.55, w + 0.02, 10), rim, { x, y, z, rz: Math.PI / 2, m: 3 }));
}

// ---------------------------------------------------------------- locomotora de vapor (mira hacia −z)
export function locoGeo() {
  const r = rng(301);
  const b = new Builder();
  b.box(1.05, 0.2, 3.1, C.iron, { y: 0.32, m: 3 });
  // ruedas motrices con bielas
  for (const z of [-0.85, 0, 0.85]) for (const x of [-0.5, 0.5]) wheelX(b, x, 0.33, z, 0.31, 0.1);
  for (const x of [-0.57, 0.57]) b.box(0.03, 0.05, 1.8, C.ironB, { x, y: 0.31, m: 3 });
  // caldera
  b.add(part(new THREE.CylinderGeometry(0.42, 0.42, 1.95, 18), worn(C.boiler, r, 0.06), { y: 0.98, z: -0.55, rx: Math.PI / 2, m: 3 }));
  for (const z of [-1.3, -0.65, 0.05]) b.add(part(new THREE.CylinderGeometry(0.435, 0.435, 0.05, 18), C.brass, { y: 0.98, z, rx: Math.PI / 2 }));
  b.add(part(new THREE.CylinderGeometry(0.44, 0.44, 0.35, 18), C.soot, { y: 0.98, z: -1.6, rx: Math.PI / 2, m: 3 }));
  b.add(part(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 16), 0x1e1c1a, { y: 0.98, z: -1.79, rx: Math.PI / 2 }));
  // chimenea de diamante, domos y farol
  b.cyl(0.11, 0.13, 0.42, 10, C.soot, { y: 1.3, z: -1.45, m: 3 });
  b.cone(0.26, 0.32, 12, C.soot, { y: 1.72, z: -1.45, rx: Math.PI, m: 3 });
  b.cyl(0.25, 0.25, 0.06, 12, C.iron, { y: 1.72, z: -1.45 });
  b.cyl(0.14, 0.16, 0.24, 12, C.brass, { y: 1.35, z: -0.55 });
  b.add(part(sph(0.14), C.brass, { y: 1.6, z: -0.55, sy: 0.6 }));
  b.cyl(0.11, 0.12, 0.16, 10, worn(C.boiler, r, 0.1), { y: 1.36, z: -0.05, m: 3 });
  b.box(0.2, 0.18, 0.18, C.iron, { y: 1.36, z: -1.83 });
  b.add(part(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 12), 0xfff0b0, { y: 1.45, z: -1.93, rx: Math.PI / 2 }));
  // tanques de agua a los lados
  for (const x of [-0.5, 0.5]) {
    b.box(0.22, 0.5, 1.3, worn(C.boiler, r, 0.08), { x, y: 0.45, z: -0.5, m: 3 });
    b.box(0.23, 0.04, 1.32, C.brass, { x, y: 0.95, z: -0.5 });
  }
  // cabina de madera roja con techo curvo y carbonera
  b.box(1.12, 0.9, 0.95, worn(C.redOx, r, 0.08), { y: 0.42, z: 0.72, m: 1 });
  for (const x of [-0.565, 0.565]) b.box(0.02, 0.32, 0.42, 0x1c1a18, { x, y: 0.92, z: 0.65 });
  b.box(0.7, 0.3, 0.02, 0x1c1a18, { y: 0.95, z: 0.245 });
  b.add(part(new THREE.CylinderGeometry(0.9, 0.9, 1.15, 16, 1, false, -0.62, 1.24), 0x3a3530, { y: 0.55, z: 0.72, rz: Math.PI / 2, ry: Math.PI / 2, sx: 1, sy: 1, m: 4 }));
  b.box(1.0, 0.45, 0.6, C.iron, { y: 0.42, z: 1.43, m: 3 });
  for (let i = 0; i < 6; i++) b.ico(0.1, 0x1a1816, { x: -0.3 + (i % 3) * 0.3, y: 0.9, z: 1.3 + Math.floor(i / 3) * 0.2 });
  // limpiavías y topes
  b.box(1.1, 0.16, 0.08, C.red, { y: 0.32, z: -1.6 });
  for (const x of [-0.35, 0.35]) b.add(part(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 8), C.iron, { x, y: 0.4, z: -1.7, rx: Math.PI / 2 }));
  for (let i = 0; i < 5; i++) b.box(0.05, 0.05, 0.35, C.red, { x: -0.4 + i * 0.2, y: 0.18, z: -1.75, rx: 0.6 });
  // óxido
  for (let i = 0; i < 8; i++) b.box(0.02, 0.08 + r() * 0.1, 0.12 + r() * 0.2, worn(P.rust, r, 0.2), { x: (r() < 0.5 ? -1 : 1) * 0.62, y: 0.4 + r() * 0.4, z: -1.2 + r() * 1.4, m: 3 });
  return b.build();
}
// vagón cañero: plataforma de acero con estacas (mira hacia −z)
export function wagonGeo() {
  const r = rng(311);
  const b = new Builder();
  b.box(1.08, 0.12, 2.3, C.iron, { y: 0.4, m: 3 });
  for (const z of [-0.75, 0.75]) {
    b.box(0.95, 0.1, 0.5, C.ironB, { y: 0.2, z, m: 3 });
    for (const zz of [-0.18, 0.18]) for (const x of [-0.45, 0.45]) wheelX(b, x, 0.2, z + zz, 0.17, 0.06, C.iron, C.ironB);
  }
  for (const x of [-0.52, 0.52]) for (let i = 0; i < 6; i++) b.box(0.05, 0.85, 0.05, worn(C.ironB, r, 0.15), { x, y: 0.5, z: -1.05 + i * 0.42, m: 3 });
  for (const z of [-1.12, 1.12]) for (const y of [0.85, 1.25]) b.box(1.05, 0.05, 0.04, worn(P.rust, r, 0.1), { y, z, m: 3 });
  for (const x of [-0.52, 0.52]) b.box(0.03, 0.04, 2.3, worn(P.rust, r, 0.12), { x, y: 1.1, m: 3 });
  b.add(part(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 6), C.iron, { y: 0.4, z: -1.3, rx: Math.PI / 2 }));
  return b.build();
}
// carga de caña (se escala en y con lo que lleva)
export function caneLoadGeo() {
  const r = rng(321);
  const b = new Builder();
  b.box(0.98, 0.78, 2.18, C.cane, { y: 0, m: 0 });
  for (let i = 0; i < 14; i++) b.add(part(new THREE.CylinderGeometry(0.035, 0.035, 2.25, 5), r() < 0.5 ? C.caneDark : 0xc4bc6a, { x: -0.42 + r() * 0.84, y: 0.78 + r() * 0.06, z: (r() - 0.5) * 0.06, rx: Math.PI / 2 }));
  for (let i = 0; i < 8; i++) b.box(0.4, 0.02, 0.07, worn(C.caneLeaf, r, 0.15), { x: -0.35 + r() * 0.7, y: 0.86, z: -0.9 + r() * 1.8, ry: r() * 3, rz: 0.2 });
  return b.build();
}

// ---------------------------------------------------------------- vía estrecha (una malla para todo el lazo)
export function trackGeo() {
  const b = new Builder();
  const p = {}, q = {};
  const step = 0.55;
  const n = Math.ceil(LOOP_LEN / step);
  // balasto: cinta continua
  const bal = [], idx = [];
  for (let i = 0; i <= n; i++) {
    loopAt((i / n) * LOOP_LEN, p);
    const nx = -p.dz, nz = p.dx;
    bal.push(p.x + nx * 0.85, 0.03, p.z + nz * 0.85, p.x - nx * 0.85, 0.03, p.z - nz * 0.85);
    if (i < n) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute('position', new THREE.Float32BufferAttribute(bal, 3));
  bg.setIndex(idx);
  bg.computeVertexNormals();
  b.add(part(bg, C.ballast, { m: 6 }));
  const rr = rng(5);
  for (let i = 0; i < n; i++) {
    loopAt(i * step, p);
    const ang = Math.atan2(p.dx, p.dz);
    b.box(1.25, 0.07, 0.2, worn(C.sleeper, rr, 0.18), { x: p.x, y: 0.03, z: p.z, ry: ang, m: 1 });
  }
  // rieles: tramos cortos entre muestras
  const rs = 1.1, m = Math.ceil(LOOP_LEN / rs);
  for (let i = 0; i < m; i++) {
    loopAt(i * rs, p); loopAt((i + 1) * rs, q);
    for (const side of [-0.36, 0.36]) {
      const ax = p.x - p.dz * side, az = p.z + p.dx * side, bx = q.x - q.dz * side, bz = q.z + q.dx * side;
      const len = Math.hypot(bx - ax, bz - az);
      b.box(0.06, 0.07, len + 0.02, C.rail, { x: (ax + bx) / 2, y: 0.1, z: (az + bz) / 2, ry: Math.atan2(bx - ax, bz - az), m: 3 });
    }
  }
  return b.build();
}
// paso a nivel: tablones sobre la vía y cruces de San Andrés
export function crossingGeo() {
  const b = new Builder();
  for (let i = 0; i < 5; i++) b.box(2.3, 0.05, 0.26, worn(P.woodGrey, rng(i), 0.15), { z: -0.6 + i * 0.3, y: 0.11, m: 1 });
  for (const [x, z] of [[-1.4, -1.5], [1.4, 1.5]]) {
    b.box(0.07, 1.5, 0.07, P.woodGrey, { x, z, m: 1 });
    b.box(0.9, 0.12, 0.03, 0xf2ece0, { x, z, y: 1.3, rz: 0.6 });
    b.box(0.9, 0.12, 0.03, 0xf2ece0, { x, z, y: 1.3, rz: -0.6 });
    b.box(0.25, 0.13, 0.035, C.red, { x: x - 0.25, z, y: 1.13, rz: 0.6 });
    b.box(0.25, 0.13, 0.035, C.red, { x: x + 0.25, z, y: 1.13, rz: -0.6 });
  }
  return b.build();
}

// ---------------------------------------------------------------- central azucarero
// Etapas: 1 cimientos · 2 basculador, tanque de agua · 3 calderas, chimenea, molinos · 4 (aparte) estación, almacenes, destilería
// Coordenadas locales: origen en la esquina (19, 66) del solar 11×8.
export function millGeo(stage) {
  const r = rng(401 + stage);
  const b = new Builder();
  // patio de tierra apisonada con cimientos de ladrillo
  b.box(11, 0.08, 8, worn(C.concrete, r, 0.05), { x: 5.5, z: 4, m: 6 });
  if (stage < 3) {
    for (const [x, z, w, d] of [[1, 1, 5.5, 4.5], [6.8, 4.2, 4.2, 3.2], [8, 1, 2, 2]]) {
      b.box(w, 0.35, d, worn(C.brick, r, 0.1), { x: x + w / 2, z: z + d / 2, m: 6 });
      for (let i = 0; i < 6; i++) b.box(0.35, 0.5 + r() * 0.4, 0.35, worn(C.brick, r, 0.12), { x: x + 0.3 + r() * (w - 0.6), z: z + 0.3 + r() * (d - 0.6), y: 0.35, m: 6 });
    }
    // ladrillos y madera apilados
    for (let i = 0; i < 4; i++) b.box(0.9, 0.35, 0.5, worn(C.brick, r, 0.15), { x: 9.6, z: 6 + i * 0.55, m: 6 });
    for (let i = 0; i < 6; i++) b.box(1.6, 0.1, 0.1, worn(P.wood, r, 0.2), { x: 3, y: 0.1 + Math.floor(i / 3) * 0.1, z: 6.4 + (i % 3) * 0.14, m: 1 });
  }
  if (stage >= 2) {
    // basculador: pórtico de acero sobre la vía (al sur del solar) y estera hacia los molinos
    for (const x of [2.0, 5.2]) for (const z of [9.6, 12.2]) b.box(0.2, 3.0, 0.2, worn(C.steelBlue, r, 0.1), { x, z, m: 3 });
    for (const z of [9.6, 12.2]) b.box(3.6, 0.25, 0.25, worn(C.steelBlue, r, 0.1), { x: 3.6, z, y: 3.0, m: 3 });
    for (const x of [2.0, 5.2]) b.box(0.25, 0.25, 2.85, worn(C.steelBlue, r, 0.1), { x, z: 10.9, y: 3.0, m: 3 });
    b.box(3.8, 0.12, 3.0, worn(P.tin, r, 0.2), { x: 3.6, z: 10.9, y: 3.25, m: 4 });
    b.box(1.2, 0.5, 0.8, worn(P.rust, r, 0.15), { x: 3.6, z: 10.9, y: 2.4, m: 3 }); // garfio
    b.box(3.2, 0.5, 1.4, worn(C.steelBlue, r, 0.1), { x: 3.6, z: 8.6, y: 0.08, m: 3 }); // tolva
    b.add(part(new THREE.BoxGeometry(0.9, 0.12, 4.6), worn(P.rust, r, 0.1), { x: 3.6, y: 1.5, z: 6.2, rx: -0.42, m: 3 })); // estera
    for (const z of [5, 7]) b.box(0.08, 1.3 + (7 - z) * 0.3, 0.08, C.ironB, { x: 3.2, z, m: 3 });
    for (let i = 0; i < 10; i++) b.add(part(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 5), C.cane, { x: 2.4 + r() * 2.4, y: 0.25 + r() * 0.15, z: 8.2 + r() * 0.8, rz: Math.PI / 2, ry: r() }));
  }
  if (stage >= 3) {
    // casa de calderas: ladrillo, ventanas en arco, techo de zinc con lucernario
    const bw = 5.6, bd = 4.4, bh = 3.1;
    b.box(bw, bh, bd, worn(C.brick, r, 0.06), { x: 0.6 + bw / 2, z: 0.6 + bd / 2, m: 6 });
    for (let i = 0; i < 5; i++) {
      for (const z of [0.58, 0.6 + bd + 0.02]) {
        b.box(0.55, 1.1, 0.04, 0x241e1a, { x: 1.3 + i * 1.05, y: 1.1, z });
        b.add(part(new THREE.CylinderGeometry(0.275, 0.275, 0.04, 10, 1, false, 0, Math.PI), 0x241e1a, { x: 1.3 + i * 1.05, y: 2.2, z, rx: Math.PI / 2, rz: Math.PI / 2 * 0, ry: 0 }));
        b.box(0.62, 0.08, 0.06, 0xe8dcc0, { x: 1.3 + i * 1.05, y: 1.05, z });
      }
    }
    b.box(bw + 0.1, 0.18, bd + 0.1, 0xe8dcc0, { x: 0.6 + bw / 2, z: 0.6 + bd / 2, y: bh - 0.2 }); // cornisa encalada
    b.gable(bw + 0.4, bd + 0.6, 1.3, worn(P.tin, r, 0.2), { x: 0.6 + bw / 2, z: 0.6 + bd / 2, y: bh, m: 4 });
    b.gable(bw - 1, 1.4, 0.5, worn(P.tin, r, 0.25), { x: 0.6 + bw / 2, z: 0.6 + bd / 2, y: bh + 1.25, m: 4 });
    b.box(bw - 1, 0.35, 1.0, 0x2a2420, { x: 0.6 + bw / 2, z: 0.6 + bd / 2, y: bh + 1.0 });
    for (let i = 0; i < 6; i++) b.box(0.6, 0.03, 0.5, worn(P.rust, r, 0.2), { x: 1 + r() * 4.6, y: bh + 0.5 + r() * 0.4, z: 1.2 + r() * 3.2, rx: r() < 0.5 ? 0.5 : -0.5, m: 3 });
    // chimenea alta de ladrillo con anillo blanco
    const cx = 7.1, cz = 1.9;
    b.box(1.6, 0.9, 1.6, worn(C.brickDark, r, 0.08), { x: cx, z: cz, m: 6 });
    b.cyl(0.48, 0.66, 8.6, 14, worn(C.brick, r, 0.05), { x: cx, z: cz, y: 0.9, m: 6 });
    b.cyl(0.5, 0.5, 0.35, 14, 0xe8dcc0, { x: cx, z: cz, y: 7.7 });
    b.cyl(0.56, 0.5, 0.3, 14, C.soot, { x: cx, z: cz, y: 9.35, m: 6 });
    b.cyl(0.4, 0.4, 0.02, 12, 0x0e0c0a, { x: cx, z: cz, y: 9.66 });
    for (let i = 0; i < 4; i++) b.cyl(0.495 + i * 0.03, 0.5 + i * 0.03, 0.06, 14, C.ironB, { x: cx, z: cz, y: 2.5 + i * 1.6, m: 3 });
    // casa de molinos: nave de zinc
    b.box(4.0, 2.4, 3.0, worn(0xa8a49a, r, 0.1), { x: 3.6, z: 6.2, m: 4 });
    b.gable(4.3, 3.4, 0.9, worn(P.tin, r, 0.2), { x: 3.6, z: 6.2, y: 2.4, ry: Math.PI / 2, m: 4 });
    b.box(1.4, 1.6, 0.05, 0x241e1a, { x: 3.6, y: 0, z: 7.72 });
    // tanques de melaza y tubería
    for (const [x, z, rr] of [[8.6, 5.2, 0.8], [10.0, 5.2, 0.6], [9.3, 6.9, 0.7]]) {
      b.cyl(rr, rr, 1.8, 16, worn(C.iron, r, 0.1), { x, z, m: 3 });
      b.cone(rr * 1.02, 0.3, 16, worn(C.iron, r, 0.1), { x, z, y: 1.8, m: 3 });
      b.box(0.04, 0.6, rr * 1.2, worn(P.rust, r, 0.2), { x: x + rr, z, y: 0.5, m: 3 });
    }
    b.add(part(new THREE.CylinderGeometry(0.08, 0.08, 3.4, 8), C.ironB, { x: 7.6, z: 4.4, y: 2.0, rz: Math.PI / 2, m: 3 }));
    b.cyl(0.08, 0.08, 2.0, 8, C.ironB, { x: 6.0, z: 4.4, m: 3 });
    // bandera cubana pintada en el frontón del central
    const fx = 0.6 + bw / 2, fz = 0.56;
    for (let i = 0; i < 5; i++) b.box(1.2, 0.12, 0.03, i % 2 ? 0xf3ecdc : P.blue, { x: fx, y: 2.1 + i * 0.12, z: fz });
    b.add(part(new THREE.CylinderGeometry(0.42, 0.42, 0.031, 3), P.red, { x: fx - 0.48, y: 2.34, z: fz - 0.002, rx: Math.PI / 2, rz: -Math.PI / 2, sy: 1, sx: 1.0 }));
  }
  return b.build();
}
// andamios de obra (sobre la huella de la etapa que se construye)
export function scaffoldGeo(w, d, h) {
  const b = new Builder();
  const r = rng(w * 7 + d);
  for (let x = 0; x <= w; x += Math.max(1, w / 4)) for (const z of [0, d]) b.box(0.07, h, 0.07, worn(P.woodLite, r, 0.2), { x, z, m: 1 });
  for (let z = 0; z <= d; z += Math.max(1, d / 3)) for (const x of [0, w]) b.box(0.07, h, 0.07, worn(P.woodLite, r, 0.2), { x, z, m: 1 });
  for (let y = 0.9; y < h; y += 0.9) {
    for (const z of [0, d]) b.box(w, 0.05, 0.25, worn(P.wood, r, 0.2), { x: w / 2, z, y, m: 1 });
    for (const x of [0, w]) b.box(0.25, 0.05, d, worn(P.wood, r, 0.2), { x, z: d / 2, y, m: 1 });
  }
  for (let i = 0; i < 3; i++) b.box(w * 0.9, 0.06, 0.06, worn(P.woodLite, r, 0.2), { x: w / 2, z: 0, y: h * 0.5, rz: (i - 1) * 0.5 });
  return b.build();
}
// tanque de agua elevado para la locomotora
export function waterTowerGeo() {
  const r = rng(411);
  const b = new Builder();
  for (const [x, z] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) b.box(0.1, 2.2, 0.1, worn(P.wood, r, 0.15), { x, z, m: 1 });
  b.cyl(0.6, 0.6, 0.9, 14, worn(P.woodGrey, r, 0.1), { y: 2.2, m: 1 });
  b.cone(0.66, 0.4, 14, worn(P.tin, r, 0.2), { y: 3.1, m: 4 });
  for (const y of [2.35, 2.9]) b.cyl(0.62, 0.62, 0.05, 14, C.ironB, { y, m: 3 });
  b.add(part(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 6), C.ironB, { x: 0, y: 2.3, z: -0.9, rx: Math.PI / 2 + 0.5, m: 3 }));
  return b.build();
}

// ---------------------------------------------------------------- estación, almacenes, destilería, acopio
export function stationGeo() {
  const r = rng(421);
  const b = new Builder();
  // andén de concreto a lo largo de la vía (local: x 0..7, z 0..3; la vía queda al sur en z≈4.5)
  b.box(9, 0.32, 1.3, worn(C.concrete, r, 0.06), { x: 4.5, z: 3.35, m: 6 });
  b.box(9, 0.04, 0.12, 0xe8dcc0, { x: 4.5, z: 3.95, y: 0.32 });
  // casa de la estación: madera crema con molduras rojas y portal
  b.box(4.6, 0.22, 2.4, P.stone, { x: 3.5, z: 1.3, m: 6 });
  b.box(4.4, 1.6, 2.1, worn(C.ochre, r, 0.06), { x: 3.5, z: 1.3, y: 0.22, m: 1 });
  for (let i = 0; i < 4; i++) {
    b.box(0.5, 0.95, 0.04, i === 1 ? 0x5a3a24 : 0x2c2420, { x: 1.85 + i * 1.1, y: i === 1 ? 0.22 : 0.65, z: 2.37 });
    b.box(0.58, 0.06, 0.06, worn(C.red, r, 0.1), { x: 1.85 + i * 1.1, y: i === 1 ? 1.2 : 1.63, z: 2.38 });
  }
  b.box(4.5, 0.14, 2.2, worn(C.red, r, 0.1), { x: 3.5, z: 1.3, y: 1.78, m: 1 });
  b.gable(5.0, 2.8, 0.9, worn(P.tin, r, 0.2), { x: 3.5, z: 1.3, y: 1.9, m: 4 });
  // marquesina del andén sobre ménsulas
  b.box(6.4, 0.06, 1.5, worn(P.tin, r, 0.2), { x: 3.5, z: 3.05, y: 2.1, rx: -0.12, m: 4 });
  for (const x of [0.8, 3.5, 6.2]) { b.box(0.09, 1.9, 0.09, worn(C.red, r, 0.1), { x, z: 3.55, y: 0.32, m: 1 }); b.box(0.06, 0.06, 0.9, C.red, { x, z: 3.1, y: 1.95, rx: 0.5 }); }
  // letrero, banco, farol, campana y sacos
  b.box(2.4, 0.42, 0.06, 0xf3ecdc, { x: 3.5, z: 2.5, y: 2.35 });
  b.box(2.5, 0.06, 0.07, C.red, { x: 3.5, z: 2.5, y: 2.78 });
  for (let i = 0; i < 6; i++) b.box(0.26, 0.08, 0.04, 0x2c2420, { x: 2.6 + i * 0.36, z: 2.54, y: 2.52 });
  b.box(1.1, 0.06, 0.35, P.woodGrey, { x: 5.4, z: 3.0, y: 0.62, m: 1 });
  for (const x of [4.95, 5.85]) b.box(0.06, 0.3, 0.3, C.iron, { x, z: 3.0, y: 0.32 });
  b.box(0.06, 1.8, 0.06, C.iron, { x: 7.6, z: 3.5, y: 0.32 });
  b.add(part(sph(0.12), 0xfff0b0, { x: 7.6, z: 3.5, y: 2.2 }));
  b.cone(0.12, 0.18, 8, C.brass, { x: 1.2, z: 2.55, y: 1.5, rx: Math.PI });
  for (let i = 0; i < 7; i++) b.add(part(new THREE.CapsuleGeometry(0.16, 0.25, 3, 6), worn(C.sack, r, 0.1), { x: 0.2 + (i % 4) * 0.36, z: 3.25 + Math.floor(i / 4) * 0.02, y: 0.48 + Math.floor(i / 4) * 0.28, rz: Math.PI / 2 }));
  return b.build();
}
export function almacenesGeo() {
  const r = rng(431);
  const b = new Builder();
  // dos naves largas de zinc con portones (local: 0..8 × 0..6)
  for (const [z, paint] of [[1.3, 0xd9c9a0], [4.4, 0xa8b8a0]]) {
    b.box(7.6, 0.2, 2.4, P.stone, { x: 4, z, m: 6 });
    b.box(7.4, 1.8, 2.2, worn(paint, r, 0.1), { x: 4, z, y: 0.2, m: 1 });
    for (let i = 0; i < 3; i++) {
      b.box(1.1, 1.3, 0.05, worn(0x5a4a3a, r, 0.12), { x: 1.4 + i * 2.6, y: 0.2, z: z + 1.12, m: 1 });
      b.box(0.04, 1.3, 0.06, 0x2c2420, { x: 1.4 + i * 2.6, y: 0.2, z: z + 1.14 });
    }
    b.gable(7.9, 2.9, 0.75, worn(P.tin, r, 0.22), { x: 4, z, y: 2.0, m: 4 });
    for (let i = 0; i < 5; i++) b.box(0.7, 0.025, 0.5, worn(P.rust, r, 0.25), { x: 0.6 + r() * 6.8, y: 2.25 + r() * 0.2, z: z + (r() - 0.5) * 1.6, rx: r() < 0.5 ? 0.45 : -0.45, m: 3 });
  }
  // sacos de azúcar en paletas
  for (let i = 0; i < 12; i++) b.add(part(new THREE.CapsuleGeometry(0.16, 0.26, 3, 6), worn(C.sack, r, 0.1), { x: 0.4 + (i % 4) * 0.38, z: 2.85 + Math.floor(i / 8) * 0.1, y: 0.18 + Math.floor(i / 4) * 0.22, rz: Math.PI / 2 }));
  return b.build();
}
export function destileriaGeo() {
  const r = rng(441);
  const b = new Builder();
  b.box(3, 0.15, 2.4, P.stone, { x: 1.5, z: 1.2, m: 6 });
  b.box(2.8, 1.5, 2.2, worn(C.brick, r, 0.08), { x: 1.5, z: 1.2, y: 0.15, m: 6 });
  b.gable(3.2, 2.7, 0.7, worn(P.tin, r, 0.2), { x: 1.5, z: 1.2, y: 1.65, m: 4 });
  b.cyl(0.35, 0.45, 1.3, 12, 0xb86a3a, { x: 2.6, z: 2.6, m: 3 }); // alambique de cobre
  b.add(part(sph(0.35), 0xc87a4a, { x: 2.6, z: 2.6, y: 1.35, sy: 0.7 }));
  b.add(part(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 6), 0xb86a3a, { x: 2.1, z: 2.6, y: 1.6, rz: 1.1 }));
  for (let i = 0; i < 6; i++) b.cyl(0.2, 0.2, 0.45, 10, worn(0x6b4a2a, r, 0.12), { x: 0.2 + (i % 3) * 0.45, z: 2.75, y: Math.floor(i / 3) * 0.45, m: 1 });
  return b.build();
}
export function acopioGeo() {
  const r = rng(451);
  const b = new Builder();
  // plataforma de carga techada (local 0..4 × 0..3; la vía al sur, z≈4.5)
  b.box(4.2, 0.5, 2.8, worn(C.concrete, r, 0.08), { x: 2, z: 1.6, m: 6 });
  for (const [x, z] of [[0.1, 0.4], [3.9, 0.4], [0.1, 2.8], [3.9, 2.8]]) b.box(0.12, 2.3, 0.12, worn(P.wood, r, 0.15), { x, z, y: 0.5, m: 1 });
  b.box(4.6, 0.06, 3.2, worn(P.tin, r, 0.2), { x: 2, z: 1.6, y: 2.8, rx: 0.08, m: 4 });
  // báscula con su caseta
  b.box(1.1, 1.3, 1.0, worn(0x6fa8b0, r, 0.1), { x: 0.6, z: 0.6, y: 0.5, m: 1 });
  b.box(1.3, 0.05, 1.2, worn(P.tin, r, 0.2), { x: 0.6, z: 0.6, y: 1.8, m: 4 });
  b.box(0.4, 0.4, 0.04, 0x2c2420, { x: 0.6, z: 1.11, y: 1.1 });
  // grúa de alce (pluma)
  b.box(0.15, 3.6, 0.15, worn(C.steelBlue, r, 0.1), { x: 3.4, z: 3.2, m: 3 });
  b.add(part(new THREE.BoxGeometry(0.12, 0.12, 2.6), worn(C.steelBlue, r, 0.1), { x: 3.4, z: 3.9, y: 3.4, rx: 0.35, m: 3 }));
  b.box(0.02, 1.1, 0.02, C.iron, { x: 3.4, z: 5.0, y: 2.4 });
  return b.build();
}
// montón de caña en el acopio (se escala con lo que hay)
export function canePileGeo() {
  const r = rng(461);
  const b = new Builder();
  b.add(part(sph(1, 12, 6), C.cane, { y: 0, sy: 0.45, sx: 1.6, sz: 1.0, m: 0 }));
  for (let i = 0; i < 30; i++) b.add(part(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 5), r() < 0.5 ? C.caneDark : 0xc4bc6a, { x: (r() - 0.5) * 2.2, y: 0.1 + r() * 0.3, z: (r() - 0.5) * 1.2, rz: Math.PI / 2, ry: r() * 3 }));
  return b.build();
}

// ---------------------------------------------------------------- tractor, carreta de bueyes y cuadrilla
export function tractorGeo() {
  const r = rng(471);
  const b = new Builder();
  const paint = worn(C.tractor, r, 0.08);
  b.box(0.55, 0.45, 1.3, paint, { y: 0.45, z: -0.35, m: 3 }); // capó
  b.box(0.5, 0.06, 0.06, 0x2c2420, { y: 0.75, z: -1.0 });
  for (let i = 0; i < 5; i++) b.box(0.4, 0.02, 0.02, 0x2c2420, { y: 0.5 + i * 0.07, z: -1.01 });
  b.cyl(0.04, 0.05, 0.6, 6, C.iron, { x: 0.15, y: 0.9, z: -0.7, m: 3 }); // escape
  b.box(0.7, 0.35, 0.7, paint, { y: 0.4, z: 0.45, m: 3 });
  b.box(0.38, 0.08, 0.36, 0x2c2420, { y: 0.8, z: 0.5 }); // asiento
  b.box(0.04, 0.4, 0.04, C.iron, { y: 0.85, z: 0.1, rx: -0.4 });
  b.add(part(new THREE.TorusGeometry(0.13, 0.02, 4, 12), C.iron, { y: 1.05, z: 0.02, rx: -1.2 }));
  for (const x of [-0.5, 0.5]) {
    b.add(part(new THREE.CylinderGeometry(0.5, 0.5, 0.26, 14), 0x23201d, { x, y: 0.5, z: 0.45, rz: Math.PI / 2 }));
    b.add(part(new THREE.CylinderGeometry(0.28, 0.28, 0.27, 10), paint, { x, y: 0.5, z: 0.45, rz: Math.PI / 2, m: 3 }));
    b.add(part(new THREE.CylinderGeometry(0.25, 0.25, 0.14, 12), 0x23201d, { x: x * 0.7, y: 0.25, z: -0.75, rz: Math.PI / 2 }));
    b.box(0.32, 0.04, 0.7, paint, { x: x * 1.0, y: 1.02, z: 0.45, m: 3 }); // guardabarros
  }
  // chofer con sombrero
  b.add(part(new THREE.CapsuleGeometry(0.13, 0.22, 3, 8), 0x6f8fa8, { y: 1.12, z: 0.5 }));
  b.add(part(sph(0.1), P.skin, { y: 1.42, z: 0.48 }));
  b.cyl(0.26, 0.27, 0.02, 12, P.hat, { y: 1.5, z: 0.48, m: 2 });
  b.cyl(0.1, 0.12, 0.1, 10, P.hat, { y: 1.5, z: 0.48, m: 2 });
  // óxido
  for (let i = 0; i < 5; i++) b.box(0.02, 0.08, 0.15, worn(P.rust, r, 0.2), { x: (r() < 0.5 ? -1 : 1) * 0.28, y: 0.4 + r() * 0.3, z: -0.8 + r() * 0.9, m: 3 });
  return b.build();
}
// carreta de bueyes cargada de caña (mira hacia −z: los bueyes delante)
export function oxcartGeo() {
  const r = rng(481);
  const b = new Builder();
  for (const [x, col] of [[-0.32, C.oxen], [0.32, C.oxenB]]) {
    b.add(part(new THREE.CapsuleGeometry(0.2, 0.6, 4, 8), col, { x, y: 0.62, z: -1.6, rx: Math.PI / 2 }));
    b.add(part(sph(0.15), col, { x, y: 0.7, z: -2.12, sz: 1.3 }));
    b.add(part(sph(0.12), col, { x, y: 0.88, z: -1.45 })); // giba cebú
    for (const [lx, lz] of [[-0.1, -1.85], [0.1, -1.85], [-0.1, -1.35], [0.1, -1.35]]) b.box(0.07, 0.48, 0.07, col, { x: x + lx, z: lz });
    b.box(0.25, 0.04, 0.04, 0xe8dcc0, { x, y: 0.88, z: -2.1 }); // cuernos
  }
  b.box(0.95, 0.07, 0.07, P.wood, { y: 0.88, z: -1.95, m: 1 }); // yugo
  b.box(0.08, 0.06, 1.7, P.wood, { y: 0.6, z: -1.0, rx: 0.12, m: 1 }); // lanza
  b.box(1.0, 0.08, 1.6, worn(P.woodGrey, r, 0.1), { y: 0.55, z: 0.2, m: 1 });
  for (const x of [-0.48, 0.48]) for (let i = 0; i < 4; i++) b.box(0.05, 0.6, 0.05, worn(P.wood, r, 0.15), { x, y: 0.6, z: -0.5 + i * 0.47, m: 1 });
  for (const x of [-0.58, 0.58]) {
    b.add(part(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 12), worn(P.wood, r, 0.1), { x, y: 0.5, z: 0.2, rz: Math.PI / 2, m: 1 }));
    b.add(part(new THREE.TorusGeometry(0.48, 0.035, 4, 14), C.iron, { x, y: 0.5, z: 0.2, ry: Math.PI / 2 }));
  }
  b.box(0.9, 0.5, 1.5, C.cane, { y: 0.63, z: 0.2 });
  for (let i = 0; i < 10; i++) b.add(part(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 5), r() < 0.5 ? C.caneDark : 0xc4bc6a, { x: -0.4 + r() * 0.8, y: 1.15 + r() * 0.05, z: 0.2, rx: Math.PI / 2 }));
  // carretero
  b.add(part(new THREE.CapsuleGeometry(0.12, 0.2, 3, 8), 0xe8e2d0, { x: -0.65, y: 0.68, z: -1.0 }));
  b.add(part(sph(0.09), P.skin, { x: -0.65, y: 0.95, z: -1.0 }));
  b.cyl(0.24, 0.25, 0.02, 10, P.hat, { x: -0.65, y: 1.03, z: -1.0, m: 2 });
  for (const lx of [-0.06, 0.06]) b.box(0.06, 0.45, 0.06, P.pants, { x: -0.65 + lx, z: -1.0 });
  return b.build();
}
// macheteros de la cuadrilla (una sola malla instanciada). Variantes de camisa por seed.
export function crewGeo(seed = 1) {
  const shirts = [0xe8e2d0, 0x6f8fa8, 0xc9566a, 0x8a9a5e, 0xd7a94a];
  const r = rng(seed + 500);
  const b = new Builder();
  const shirt = shirts[seed % shirts.length];
  for (const x of [-0.07, 0.07]) b.box(0.09, 0.48, 0.1, P.pants, { x, y: 0 });
  b.add(part(new THREE.CapsuleGeometry(0.14, 0.22, 3, 8), shirt, { y: 0.72, sz: 0.75 }));
  b.add(part(sph(0.1, 8, 6), worn(P.skin, r, 0.15), { y: 1.0 }));
  b.cyl(0.29, 0.3, 0.02, 12, P.hat, { y: 1.08, m: 2 });
  b.cyl(0.1, 0.13, 0.12, 10, P.hat, { y: 1.08, m: 2 });
  b.box(0.06, 0.32, 0.06, shirt, { x: 0.18, y: 0.6, z: -0.08, rx: -0.6 });
  b.box(0.03, 0.42, 0.06, 0xb8b8b0, { x: 0.2, y: 0.55, z: -0.36, rx: -1.0, m: 3 }); // machete
  return b.build();
}

// ---------------------------------------------------------------- cultivos de los campos (una mata por tile; hi y lo)
export function fieldCropGeo(crop, lo = false) {
  const r = rng(crop.length * 31 + (lo ? 7 : 0));
  const b = new Builder();
  if (crop === 'cane') {
    if (lo) {
      for (const [x, z] of [[-0.25, -0.2], [0.2, 0.15], [0, -0.05]]) b.box(0.3, 1.5, 0.3, worn(0x8fa442, r, 0.12), { x, z, m: 5 });
      return b.build();
    }
    for (const [x, z, h] of [[-0.3, -0.25, 1.5], [0.05, -0.32, 1.35], [0.32, -0.15, 1.6], [-0.22, 0.2, 1.4], [0.12, 0.25, 1.55], [0.35, 0.3, 1.3]]) {
      b.box(0.06, h, 0.06, r() < 0.5 ? 0xb9b05a : 0xa9a650, { x, z, m: 0 });
      for (let k = 0; k < 3; k++) { const a = r() * 6.28; b.box(0.7, 0.02, 0.08, worn(0x7f9c3c, r, 0.15), { x: x + Math.cos(a) * 0.22, y: h * (0.6 + k * 0.14), z: z - Math.sin(a) * 0.22, ry: a, rz: -0.45, m: 5 }); }
    }
  } else if (crop === 'tobacco') {
    if (lo) { b.box(0.7, 0.75, 0.7, worn(0x6f9a3a, r, 0.1), { m: 5 }); return b.build(); }
    for (const [x, z] of [[-0.22, -0.22], [0.22, 0.22], [0.22, -0.2], [-0.2, 0.22]]) {
      b.box(0.04, 0.85, 0.04, 0x7d9a45, { x, z });
      for (let k = 0; k < 5; k++) { const a = k * 1.3 + r(); b.add(part(new THREE.IcosahedronGeometry(1, 0), worn(0x6f9a3a, r, 0.1), { x: x + Math.cos(a) * 0.12, y: 0.15 + k * 0.15, z: z - Math.sin(a) * 0.12, sx: 0.17 - k * 0.015, sy: 0.02, sz: 0.09, ry: a, m: 5 })); }
      b.add(part(sph(0.04, 5, 4), 0xe7a3b6, { x, y: 0.9, z }));
    }
  } else {
    if (lo) { b.box(0.75, 0.5, 0.3, worn(0x557d34, r, 0.1), { m: 5 }); b.box(0.6, 0.1, 0.25, P.red, { y: 0.25, z: 0.08 }); return b.build(); }
    // tomate en espaldera: estacas y alambre por surcos
    for (const x of [-0.4, 0, 0.4]) b.box(0.03, 0.75, 0.03, 0xb39a70, { x, m: 1 });
    b.box(0.95, 0.015, 0.015, 0xd8d0c0, { y: 0.62 });
    for (const x of [-0.25, 0.15]) {
      b.ico(0.18, worn(P.leaf, r, 0.12), { x, y: 0.32, sy: 1.2, m: 5 });
      b.ico(0.13, worn(P.leafLite, r, 0.12), { x: x + 0.05, y: 0.55, m: 5 });
      for (let k = 0; k < 3; k++) b.ico(0.055, k === 2 ? 0xd2582e : P.red, { x: x + (r() - 0.5) * 0.25, y: 0.25 + r() * 0.25, z: 0.14 });
    }
  }
  return b.build();
}
// humo (esfera suave)
export function puffGeo() { return new THREE.IcosahedronGeometry(0.5, 1); }
