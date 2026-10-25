// Modelos low-poly procedurales con colores por vértice. Sin assets externos.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const _c = new THREE.Color();

// Color "gastado": variación leve de luminosidad/saturación.
export function worn(hex, r, amt = 0.08) {
  _c.set(hex);
  const hsl = {};
  _c.getHSL(hsl);
  const k = (r() - 0.5) * 2 * amt;
  _c.setHSL(hsl.h + k * 0.08, Math.max(0, Math.min(1, hsl.s * (1 - Math.abs(k)))), Math.max(0, Math.min(1, hsl.l * (1 + k))));
  return _c.getHex();
}

export function part(geo, color, t = {}) {
  let g = geo.index ? geo.toNonIndexed() : geo.clone();
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
  if (!g.attributes.normal) g.computeVertexNormals();
  _e.set(t.rx || 0, t.ry || 0, t.rz || 0, t.order || 'XYZ');
  _q.setFromEuler(_e);
  _m.compose(_v.set(t.x || 0, t.y || 0, t.z || 0), _q, _s.set(t.sx ?? 1, t.sy ?? 1, t.sz ?? 1));
  g.applyMatrix4(_m);
  const n = g.attributes.position.count;
  const arr = new Float32Array(n * 3);
  _c.set(color);
  for (let i = 0; i < n; i++) { arr[i * 3] = _c.r; arr[i * 3 + 1] = _c.g; arr[i * 3 + 2] = _c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

// Prisma triangular (techo a dos aguas) a lo largo de X.
function gableGeo(len, w, h) {
  const l = len / 2, hw = w / 2;
  const A = [-l, 0, -hw], B = [-l, 0, hw], C = [-l, h, 0], D = [l, 0, -hw], E = [l, 0, hw], F = [l, h, 0];
  const tris = [A, C, B, D, E, F, A, D, F, A, F, C, B, C, F, B, F, E, A, B, E, A, E, D];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3));
  g.computeVertexNormals();
  return g;
}

export class Builder {
  constructor() { this.parts = []; }
  add(g) { this.parts.push(g); return this; }
  // y = base del objeto (no el centro)
  box(w, h, d, color, t = {}) { return this.add(part(new THREE.BoxGeometry(w, h, d), color, { ...t, y: (t.y || 0) + (t.center ? 0 : h / 2) })); }
  cyl(rt, rb, h, seg, color, t = {}) { return this.add(part(new THREE.CylinderGeometry(rt, rb, h, seg), color, { ...t, y: (t.y || 0) + (t.center ? 0 : h / 2) })); }
  cone(r, h, seg, color, t = {}) { return this.add(part(new THREE.ConeGeometry(r, h, seg), color, { ...t, y: (t.y || 0) + (t.center ? 0 : h / 2) })); }
  ico(r, color, t = {}, detail = 0) { return this.add(part(new THREE.IcosahedronGeometry(r, detail), color, t)); }
  gable(len, w, h, color, t = {}) { return this.add(part(gableGeo(len, w, h), color, t)); }
  merge(geo) { if (geo) this.parts.push(geo); return this; }
  build() {
    if (!this.parts.length) return new THREE.BufferGeometry();
    const g = mergeGeometries(this.parts, false);
    this.parts.forEach((p) => p.dispose());
    this.parts = [];
    return g;
  }
}

export function place(geo, x, z, ry = 0, y = 0, s = 1) {
  const g = geo.clone();
  _q.setFromEuler(_e.set(0, ry, 0));
  _m.compose(_v.set(x, y, z), _q, _s.set(s, s, s));
  g.applyMatrix4(_m);
  return g;
}

// ---------------------------------------------------------------- Paleta
export const P = {
  earth: 0xa8502e, earthDark: 0x8a3f24, furrow: 0x6e3220, earthWet: 0x6b2c1a,
  grass: 0x7d8f45, grassB: 0x93a050, grassC: 0x6a7a3a, wild: 0x5f7436, dust: 0xc9a477,
  thatch: 0xb48a4a, thatchDark: 0x8d6a38, wood: 0x8b6a45, woodLite: 0xa68a62, woodGrey: 0x8e8577,
  paintBlue: 0x6f8fa8, cream: 0xe8d9b5, mint: 0x8fb3a3, rust: 0x8a4b2a, chrome: 0xb9b2a2,
  tire: 0x2b2622, glass: 0x3d4e57, palmTrunk: 0xbdb5a6, palmShaft: 0x7f9a4a, leaf: 0x4f7a34,
  leafDark: 0x3c6128, leafLite: 0x6c9441, brick: 0x9c5a3c, skin: 0xb07850, white: 0xf0e8d8,
  pants: 0x4b5a6e, hat: 0xd8bf83, red: 0xc0392b, blue: 0x1d3f86, flagWhite: 0xf3ecdc,
  tin: 0x8a8f8f, coopRed: 0x9a4a3a, stone: 0x9a9184, clay: 0xb5653d,
};

// ---------------------------------------------------------------- Palma real
export function palmGeo(seed = 1, height = 4.2) {
  const r = rng(seed);
  const b = new Builder();
  const segs = 5;
  const lean = (r() - 0.5) * 0.25;
  let y = 0;
  for (let i = 0; i < segs; i++) {
    const h = height / segs;
    const bulge = 1 + Math.sin((i / segs) * Math.PI) * 0.25;
    const rad = 0.13 * bulge;
    b.cyl(rad * 0.95, rad, h, 7, worn(P.palmTrunk, r, 0.06), { y, x: lean * (y / height) * 0.6 });
    y += h;
  }
  const tx = lean * 0.6;
  b.cyl(0.1, 0.12, 0.75, 7, P.palmShaft, { y, x: tx });
  y += 0.75;
  b.ico(0.1, P.palmShaft, { y, x: tx });
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.3;
    let p = 0.45 + r() * 0.3;
    let px = tx, py = y, pz = 0;
    const segLen = 0.62 + r() * 0.12;
    for (let k = 0; k < 3; k++) {
      const dx = Math.cos(p) * Math.cos(a), dy = Math.sin(p), dz = -Math.cos(p) * Math.sin(a);
      const cx = px + dx * segLen / 2, cy = py + dy * segLen / 2, cz = pz + dz * segLen / 2;
      const col = k === 0 ? P.leafDark : (k === 1 ? P.leaf : P.leafLite);
      b.add(part(new THREE.BoxGeometry(segLen, 0.03, 0.42 - k * 0.1), worn(col, r, 0.08), { x: cx, y: cy, z: cz, ry: a, rz: p, order: 'YXZ' }));
      px += dx * segLen; py += dy * segLen; pz += dz * segLen;
      p -= 0.7 + r() * 0.15;
    }
  }
  return b.build();
}

// ---------------------------------------------------------------- Ceiba
export function ceibaGeo(seed = 7) {
  const r = rng(seed);
  const b = new Builder();
  b.cyl(0.38, 0.55, 2.3, 9, 0x9a9282);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    b.box(0.7, 0.55, 0.1, 0x8f8778, { x: Math.cos(a) * 0.45, z: -Math.sin(a) * 0.45, ry: a });
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    b.cyl(0.08, 0.14, 1.4, 5, 0x8f8778, { x: Math.cos(a) * 0.45, z: -Math.sin(a) * 0.45, y: 1.9, rz: Math.cos(a) * 0.8, rx: Math.sin(a) * 0.8 });
  }
  const greens = [0x557d34, 0x4a7030, 0x638a3c, 0x6f9444];
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, d = 0.4 + r() * 1.2;
    b.ico(0.75 + r() * 0.45, greens[i % greens.length], { x: Math.cos(a) * d, z: Math.sin(a) * d, y: 2.8 + r() * 0.5, sy: 0.55 }, 0);
  }
  return b.build();
}

// ---------------------------------------------------------------- Bohío (3x3)
export function bohioGeo() {
  const r = rng(11);
  const b = new Builder();
  // zócalo de piedra
  b.box(2.5, 0.15, 2.0, P.stone, { z: -0.25 });
  // paredes de tabla de palma
  const W = 2.3, D = 1.8, Hh = 1.35;
  b.box(W, Hh, D, P.wood, { y: 0.15, z: -0.25 });
  // tablas verticales en caras visibles (+z, +x)
  for (let i = 0; i < 9; i++) {
    const x = -W / 2 + 0.13 + i * (W - 0.26) / 8;
    b.box(0.2, Hh - 0.05, 0.03, worn(P.woodLite, r, 0.18), { x, y: 0.17, z: -0.25 + D / 2 + 0.015 });
  }
  for (let i = 0; i < 7; i++) {
    const z = -0.25 - D / 2 + 0.13 + i * (D - 0.26) / 6;
    b.box(0.03, Hh - 0.05, 0.2, worn(P.woodLite, r, 0.18), { x: W / 2 + 0.015, y: 0.17, z });
  }
  // puerta y ventanas con pintura azul desteñida
  b.box(0.5, 0.95, 0.05, 0x3a2a1e, { x: -0.35, y: 0.15, z: -0.25 + D / 2 + 0.04 });
  b.box(0.08, 0.95, 0.06, P.paintBlue, { x: -0.62, y: 0.15, z: -0.25 + D / 2 + 0.05 });
  b.box(0.08, 0.95, 0.06, worn(P.paintBlue, r, 0.2), { x: -0.08, y: 0.15, z: -0.25 + D / 2 + 0.05 });
  b.box(0.5, 0.42, 0.05, 0x2c2420, { x: 0.55, y: 0.65, z: -0.25 + D / 2 + 0.04 });
  b.box(0.26, 0.46, 0.04, worn(P.paintBlue, r, 0.25), { x: 0.92, y: 0.63, z: -0.25 + D / 2 + 0.1, ry: -0.6 });
  b.box(0.05, 0.42, 0.5, 0x2c2420, { x: W / 2 + 0.04, y: 0.65, z: -0.3 });
  b.box(0.04, 0.46, 0.26, worn(P.paintBlue, r, 0.25), { x: W / 2 + 0.12, y: 0.63, z: 0.04, ry: 0.5 });
  // techo de guano a dos aguas, alero hacia el portal
  b.gable(2.9, 3.0, 1.25, P.thatch, { y: 0.15 + Hh, z: -0.05 });
  b.gable(3.0, 3.15, 0.3, P.thatchDark, { y: 0.1 + Hh, z: -0.05 });
  b.box(3.0, 0.08, 0.12, P.thatchDark, { y: 0.15 + Hh + 1.2, z: -0.05 });
  // remiendos en el guano
  // horcones del portal
  for (const x of [-1.15, 0.0, 1.15]) b.box(0.1, 1.45, 0.1, worn(P.wood, r, 0.15), { x, z: 1.2 });
  // taburetes y tinajón
  for (const x of [0.25, 0.75]) {
    b.box(0.32, 0.05, 0.32, P.woodLite, { x, y: 0.4, z: 0.95 });
    b.box(0.3, 0.4, 0.04, 0x9b7a50, { x, y: 0.42, z: 0.8, rx: -0.2 });
    for (const [dx, dz] of [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]]) b.box(0.04, 0.4, 0.04, P.wood, { x: x + dx, z: 0.95 + dz });
  }
  b.ico(0.28, P.clay, { x: 1.25, y: 0.3, z: 0.75, sy: 1.15 }, 1);
  b.cyl(0.14, 0.18, 0.12, 8, 0x9c5432, { x: 1.25, y: 0.58, z: 0.75 });
  return b.build();
}

// ---------------------------------------------------------------- Gallinero (2x2)
export function coopGeo() {
  const r = rng(21);
  const b = new Builder();
  for (const [x, z] of [[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]]) b.box(0.1, 0.35, 0.1, P.wood, { x, z });
  b.box(1.6, 0.95, 1.2, P.coopRed, { y: 0.35 });
  for (let i = 0; i < 7; i++) b.box(0.21, 0.9, 0.03, worn(P.coopRed, r, 0.22), { x: -0.68 + i * 0.227, y: 0.37, z: 0.615 });
  for (let i = 0; i < 5; i++) b.box(0.03, 0.9, 0.22, worn(P.coopRed, r, 0.22), { x: 0.815, y: 0.37, z: -0.46 + i * 0.23 });
  // pintura caída: parches de madera cruda
  for (let i = 0; i < 4; i++) b.box(0.18 + r() * 0.2, 0.12 + r() * 0.2, 0.02, P.woodGrey, { x: -0.6 + r() * 1.2, y: 0.45 + r() * 0.5, z: 0.635 });
  b.box(0.32, 0.36, 0.04, 0x231a14, { x: 0.15, y: 0.4, z: 0.64 });
  // rampa
  b.box(0.3, 0.04, 0.75, P.woodLite, { x: 0.15, y: 0.18, z: 0.95, rx: 0.5 });
  // techo de zinc oxidado
  for (let i = 0; i < 8; i++) {
    const rust = r() < 0.35;
    b.box(0.24, 0.04, 1.6, rust ? worn(P.rust, r, 0.2) : worn(P.tin, r, 0.1), { x: -0.84 + i * 0.24, y: 1.38 - 0, z: 0, rx: 0.0, rz: 0, sy: 1, center: false });
  }
  // inclinación: segunda capa como cumbrera
  b.box(1.95, 0.06, 0.1, P.rust, { y: 1.42 });
  b.box(0.06, 0.5, 0.06, P.wood, { x: -0.8, y: 1.3, z: -0.6 });
  return b.build();
}

// ---------------------------------------------------------------- Fogón / cocina (2x2)
export function kitchenGeo() {
  const r = rng(31);
  const b = new Builder();
  b.box(1.7, 0.08, 1.7, P.stone);
  for (const [x, z] of [[-0.75, -0.75], [0.75, -0.75], [-0.75, 0.75], [0.75, 0.75]]) b.box(0.1, 1.5, 0.1, worn(P.wood, r, 0.15), { x, z });
  b.gable(2.0, 2.0, 0.85, P.thatch, { y: 1.45 });
  b.gable(2.1, 2.12, 0.2, P.thatchDark, { y: 1.42 });
  // fogón de ladrillo
  b.box(1.1, 0.6, 0.65, P.brick, { z: -0.35 });
  for (let i = 0; i < 6; i++) b.box(0.25, 0.1, 0.02, worn(0xb06a48, r, 0.2), { x: -0.4 + (i % 3) * 0.38, y: 0.15 + Math.floor(i / 3) * 0.22, z: -0.02 });
  b.box(0.18, 0.2, 0.02, 0x1f1612, { x: 0.05, y: 0.12, z: -0.015 });
  b.box(0.2, 0.9, 0.2, P.brick, { x: -0.42, y: 0.6, z: -0.55 });
  b.cyl(0.22, 0.18, 0.3, 9, 0x2d2a28, { x: 0.15, y: 0.6, z: -0.35 });
  // mesa con tomates
  b.box(0.6, 0.05, 0.4, P.woodLite, { x: 0.45, y: 0.55, z: 0.45 });
  for (const [x, z] of [[0.2, 0.3], [0.7, 0.3], [0.2, 0.6], [0.7, 0.6]]) b.box(0.05, 0.55, 0.05, P.wood, { x, z });
  for (let i = 0; i < 3; i++) b.ico(0.07, P.red, { x: 0.3 + i * 0.12, y: 0.66, z: 0.45 });
  b.cyl(0.05, 0.05, 0.16, 6, 0xb33a26, { x: 0.65, y: 0.6, z: 0.5 });
  return b.build();
}

// ---------------------------------------------------------------- Tanque de agua (1x1)
export function tankGeo() {
  const r = rng(41);
  const b = new Builder();
  for (const [x, z] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) b.box(0.07, 1.2, 0.07, P.wood, { x, z, rz: x * 0.08, rx: -z * 0.08 });
  b.box(0.7, 0.05, 0.7, P.woodGrey, { y: 1.2 });
  b.cyl(0.36, 0.36, 0.7, 10, 0x6f7b80, { y: 1.25 });
  b.cyl(0.37, 0.37, 0.12, 10, P.rust, { y: 1.55 });
  b.cyl(0.38, 0.38, 0.04, 10, worn(P.rust, r), { y: 1.95 });
  return b.build();
}

// ---------------------------------------------------------------- Casa de tabaco (3x2)
export function tobaccoHouseGeo() {
  const r = rng(51);
  const b = new Builder();
  b.box(2.6, 1.3, 1.5, 0x6e5640);
  for (let i = 0; i < 11; i++) b.box(0.22, 1.25, 0.03, worn(0x7c6249, r, 0.2), { x: -1.2 + i * 0.24, z: 0.765 });
  b.box(0.5, 0.9, 0.04, 0x241a12, { x: 0.4, z: 0.78 });
  b.gable(2.8, 1.9, 1.7, P.thatch, { y: 1.3 });
  b.gable(2.9, 2.0, 0.25, P.thatchDark, { y: 1.27 });
  // hojas colgadas secándose en una vara
  b.box(1.6, 0.04, 0.04, P.wood, { x: -0.3, y: 1.15, z: 0.95 });
  for (let i = 0; i < 7; i++) b.box(0.12, 0.4, 0.03, 0x9a6a2e, { x: -1.0 + i * 0.22, y: 0.75, z: 0.95, rz: (r() - 0.5) * 0.2 });
  for (const x of [-1.05, 0.45]) b.box(0.06, 1.2, 0.06, P.wood, { x, z: 0.95 });
  return b.build();
}

// ---------------------------------------------------------------- Cercas
// Segmento de cerca de tablas (corral), centrado en el origen, a lo largo de X (1 tile).
export function plankFenceGeo(seed) {
  const r = rng(seed);
  const b = new Builder();
  b.box(0.09, 0.62, 0.09, worn(P.woodGrey, r, 0.15), { x: -0.5, rz: (r() - 0.5) * 0.08 });
  for (const y of [0.18, 0.42]) {
    if (r() < 0.12) continue; // tabla que falta
    b.box(1.0, 0.09, 0.04, worn(r() < 0.2 ? P.woodLite : P.woodGrey, r, 0.18), { y, rz: (r() - 0.5) * 0.08 });
  }
  return b.build();
}
// Cerca de palos con alambre (límite de la finca).
export function wireFenceGeo(seed) {
  const r = rng(seed);
  const b = new Builder();
  b.box(0.07, 0.55 + r() * 0.12, 0.07, worn(0x7d6c58, r, 0.2), { x: -0.5, rz: (r() - 0.5) * 0.12, rx: (r() - 0.5) * 0.1 });
  for (const y of [0.22, 0.4]) b.box(1.0, 0.015, 0.015, 0x8c8a86, { y: y + (r() - 0.5) * 0.04 });
  return b.build();
}
export function fencePost() {
  const b = new Builder();
  b.box(0.09, 0.62, 0.09, P.woodGrey);
  return b.build();
}

// ---------------------------------------------------------------- Bandera cubana (animada)
export function flagGeo() {
  const L = 0.9, Hf = 0.45, sx = 12, sy = 6;
  const g = new THREE.PlaneGeometry(L, Hf, sx, sy).toNonIndexed();
  g.translate(L / 2, 0, 0);
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const blue = new THREE.Color(P.blue), white = new THREE.Color(P.flagWhite), red = new THREE.Color(P.red);
  for (let t = 0; t < pos.count; t += 3) {
    let cx = 0, cy = 0;
    for (let k = 0; k < 3; k++) { cx += pos.getX(t + k); cy += pos.getY(t + k); }
    cx /= 3; cy /= 3;
    const u = cx / L, v = (cy + Hf / 2) / Hf;
    let c;
    if (u * 2 < 0.866 * (1 - 2 * Math.abs(v - 0.5)) * 1.0) c = red;
    else c = Math.floor(v * 5) % 2 === 0 ? blue : white;
    for (let k = 0; k < 3; k++) { col[(t + k) * 3] = c.r; col[(t + k) * 3 + 1] = c.g; col[(t + k) * 3 + 2] = c.b; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.deleteAttribute('uv');
  // estrella blanca a ambos lados
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
    const rr = i % 2 === 0 ? 0.055 : 0.022;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  const star = new THREE.ShapeGeometry(shape);
  const s1 = part(star, P.flagWhite, { x: 0.13, z: 0.004 });
  const s2 = part(star, P.flagWhite, { x: 0.13, z: -0.004, ry: Math.PI });
  const fg = part(g, 0xffffff);
  fg.setAttribute('color', g.attributes.color);
  const m = mergeGeometries([fg, s1, s2]);
  m.userData.length = L;
  return m;
}
export function flagPoleGeo(h = 2.6) {
  const b = new Builder();
  b.cyl(0.035, 0.045, h, 6, 0x9a948a);
  b.ico(0.06, 0xc9b27a, { y: h + 0.02 });
  b.box(0.3, 0.12, 0.3, P.stone);
  return b.build();
}

// ---------------------------------------------------------------- Camión de los 50
export function truckGeo() {
  const r = rng(61);
  const b = new Builder();
  const paint = P.mint;
  // chasis
  b.box(1.3, 0.18, 3.4, 0x2f2a26, { y: 0.32 });
  // capó (frente hacia -z)
  b.box(1.0, 0.5, 1.15, worn(paint, r), { y: 0.5, z: -1.05 });
  b.cyl(0.5, 0.5, 1.15, 10, worn(paint, r), { y: 0.82, z: -1.05, rx: Math.PI / 2, center: true, sy: 1, sx: 1, sz: 0.25 });
  // guardafangos redondeados
  for (const x of [-0.58, 0.58]) {
    b.cyl(0.42, 0.42, 0.28, 10, worn(paint, r, 0.12), { x, y: 0.55, z: -1.15, rz: Math.PI / 2, center: true, sx: 1, sz: 1.25 });
    b.cyl(0.42, 0.42, 0.28, 10, worn(paint, r, 0.12), { x, y: 0.55, z: 0.95, rz: Math.PI / 2, center: true, sz: 1.25 });
  }
  // óxido
  for (let i = 0; i < 7; i++) {
    const side = r() < 0.5 ? -1 : 1;
    b.box(0.03, 0.12 + r() * 0.15, 0.2 + r() * 0.3, worn(P.rust, r, 0.2), { x: side * 0.73, y: 0.42 + r() * 0.2, z: -1.4 + r() * 2.8 });
  }
  b.box(0.35, 0.02, 0.4, P.rust, { x: 0.2, y: 1.0, z: -1.2 });
  // cabina
  b.box(1.2, 0.72, 0.95, worn(paint, r), { y: 0.6, z: -0.05 });
  b.box(1.24, 0.08, 1.0, worn(paint, r, 0.05), { y: 1.32, z: -0.05 });
  b.box(1.02, 0.36, 0.03, P.glass, { y: 0.88, z: -0.535 });
  for (const x of [-0.605, 0.605]) b.box(0.03, 0.32, 0.55, P.glass, { x, y: 0.9, z: -0.1 });
  // parrilla cromada y faros
  b.box(0.8, 0.36, 0.06, P.chrome, { y: 0.45, z: -1.64 });
  for (let i = 0; i < 5; i++) b.box(0.04, 0.3, 0.02, 0x6f6a62, { x: -0.3 + i * 0.15, y: 0.48, z: -1.68 });
  for (const x of [-0.58, 0.58]) b.cyl(0.1, 0.1, 0.06, 8, 0xefe2b0, { x, y: 0.72, z: -1.66, rx: Math.PI / 2, center: true });
  b.box(1.4, 0.1, 0.12, P.chrome, { y: 0.28, z: -1.72 });
  // cama de madera
  b.box(1.3, 0.08, 1.75, P.woodGrey, { y: 0.42, z: 0.85 });
  for (const x of [-0.63, 0.63]) for (const y of [0.55, 0.78]) b.box(0.05, 0.14, 1.75, worn(P.woodLite, r, 0.2), { x, y, z: 0.85 });
  for (const y of [0.55, 0.78]) b.box(1.3, 0.14, 0.05, worn(P.woodLite, r, 0.2), { y, z: 1.71 });
  for (const [x, z] of [[-0.63, 0.0], [0.63, 0.0], [-0.63, 1.71], [0.63, 1.71]]) b.box(0.07, 0.6, 0.07, P.wood, { x, y: 0.42, z });
  // ruedas
  for (const [x, z] of [[-0.6, -1.15], [0.6, -1.15], [-0.6, 0.95], [0.6, 0.95]]) {
    b.cyl(0.31, 0.31, 0.24, 12, P.tire, { x, y: 0.31, z, rz: Math.PI / 2, center: true });
    b.cyl(0.14, 0.14, 0.26, 8, 0xd8d0bc, { x, y: 0.31, z, rz: Math.PI / 2, center: true });
  }
  return b.build();
}
export function crateGeo(kind = 0) {
  const b = new Builder();
  b.box(0.45, 0.3, 0.4, kind ? 0xb08a58 : 0x9c7a4c);
  b.box(0.47, 0.04, 0.42, 0x6f5536, { y: 0.28 });
  b.ico(0.08, kind ? P.red : 0xf4ead2, { y: 0.34, x: -0.1 });
  b.ico(0.08, kind ? P.red : 0xf4ead2, { y: 0.34, x: 0.1, z: 0.05 });
  return b.build();
}

// ---------------------------------------------------------------- Gallinas
const HEN_COLORS = [0x8a4a26, 0xe9ddc4, 0x5a3424, 0xb7743a];
export function chickenGeo(variant = 0) {
  const b = new Builder();
  const c = HEN_COLORS[variant % HEN_COLORS.length];
  b.ico(0.2, c, { y: 0.27, sx: 0.85, sz: 1.15 }, 1);
  b.ico(0.11, c, { y: 0.47, z: -0.17 }, 1);
  b.box(0.04, 0.08, 0.1, P.red, { y: 0.53, z: -0.17 });
  b.cone(0.035, 0.09, 4, 0xe0a030, { y: 0.45, z: -0.29, rx: -Math.PI / 2, center: true });
  b.box(0.03, 0.05, 0.03, P.red, { y: 0.39, z: -0.25 });
  b.box(0.14, 0.18, 0.06, variant === 1 ? 0xd8ccb0 : 0x3a2418, { y: 0.32, z: 0.24, rx: -0.5 });
  for (const x of [-0.06, 0.06]) b.box(0.025, 0.12, 0.025, 0xd59a3a, { x, y: 0.02 });
  return b.build();
}
export function roosterGeo() {
  const b = new Builder();
  b.ico(0.22, 0xa4401f, { y: 0.32, sx: 0.85, sz: 1.1 }, 1);
  b.ico(0.13, 0xc8742a, { y: 0.58, z: -0.17 }, 1);
  b.box(0.04, 0.14, 0.16, P.red, { y: 0.66, z: -0.17 });
  b.cone(0.04, 0.1, 4, 0xe0a030, { y: 0.56, z: -0.31, rx: -Math.PI / 2, center: true });
  b.box(0.04, 0.09, 0.04, P.red, { y: 0.48, z: -0.27 });
  for (let i = 0; i < 4; i++) b.box(0.05, 0.38, 0.1, i % 2 ? 0x1f3a2c : 0x14231c, { y: 0.4, z: 0.25 + i * 0.03, x: (i - 1.5) * 0.04, rx: -0.6 + i * 0.12 });
  for (const x of [-0.07, 0.07]) b.box(0.03, 0.16, 0.03, 0xd59a3a, { x, y: 0.02 });
  return b.build();
}
export function eggGeo() {
  return part(new THREE.IcosahedronGeometry(0.1, 1), 0xf4ead2, { y: 0.11, sy: 1.25 });
}

// ---------------------------------------------------------------- Personas
// Devuelve partes separadas para animar: cuerpo, piernas, brazos.
export function personParts(shirt = P.white, hatColor = P.hat, seed = 1) {
  const r = rng(seed);
  const body = new Builder();
  body.box(0.34, 0.42, 0.22, shirt, { y: 0.55 });
  body.box(0.36, 0.06, 0.24, worn(shirt, r, 0.2), { y: 0.55 });
  body.box(0.12, 0.08, 0.04, P.red, { y: 0.92, z: -0.1 });
  body.box(0.18, 0.2, 0.18, P.skin, { y: 0.97 });
  body.box(0.16, 0.06, 0.02, 0x3a2a20, { y: 1.04, z: -0.095 });
  body.cyl(0.32, 0.32, 0.03, 12, hatColor, { y: 1.15 });
  body.cyl(0.13, 0.16, 0.16, 10, worn(hatColor, r, 0.1), { y: 1.17 });
  body.cyl(0.165, 0.165, 0.04, 10, 0x6b4a2a, { y: 1.18 });
  const leg = new Builder();
  leg.box(0.13, 0.44, 0.14, P.pants, { y: -0.44 });
  leg.box(0.14, 0.08, 0.2, 0x3a2a1e, { y: -0.48, z: -0.03 });
  const arm = new Builder();
  arm.box(0.1, 0.38, 0.11, shirt, { y: -0.38 });
  arm.box(0.08, 0.08, 0.08, P.skin, { y: -0.45 });
  return { body: body.build(), leg: leg.build(), arm: arm.build() };
}
export function basketGeo() {
  const b = new Builder();
  b.cyl(0.16, 0.12, 0.14, 8, 0xb08850);
  b.ico(0.06, 0xf4ead2, { y: 0.15, x: -0.05 });
  b.ico(0.06, 0xf4ead2, { y: 0.15, x: 0.05, z: 0.03 });
  b.box(0.26, 0.02, 0.02, 0x8a6a3a, { y: 0.26 });
  return b.build();
}

// ---------------------------------------------------------------- Canteros y cultivos
export function plotGeo() {
  const b = new Builder();
  b.box(0.94, 0.08, 0.94, P.earth);
  for (let i = 0; i < 3; i++) b.box(0.84, 0.07, 0.16, P.earthDark, { y: 0.06, z: -0.3 + i * 0.3 });
  return b.build();
}

export function cropGeo(type, stage) {
  const r = rng(type.length * 10 + stage);
  const b = new Builder();
  const spots = [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]];
  if (stage === 0) {
    for (const [x, z] of spots) {
      b.box(0.12, 0.02, 0.05, P.leafLite, { x: x - 0.04, y: 0.13, z, rz: 0.4 });
      b.box(0.12, 0.02, 0.05, P.leafLite, { x: x + 0.04, y: 0.13, z, rz: -0.4 });
      b.box(0.02, 0.06, 0.02, P.leaf, { x, y: 0.09, z });
    }
    return b.build();
  }
  if (type === 'tomato') {
    const big = stage === 2;
    for (const [x, z] of spots) {
      b.box(0.03, big ? 0.62 : 0.42, 0.03, 0xb39a70, { x: x + 0.1, y: 0.08, z }); // estaca
      b.ico(big ? 0.17 : 0.12, worn(P.leaf, r, 0.12), { x, y: big ? 0.34 : 0.24, z, sy: 1.1 });
      b.ico(big ? 0.13 : 0.09, worn(P.leafLite, r, 0.12), { x: x + 0.03, y: big ? 0.5 : 0.36, z: z - 0.02 });
      if (big) for (let k = 0; k < 3; k++) b.ico(0.065, k === 2 ? 0xd2582e : P.red, { x: x + (r() - 0.5) * 0.25, y: 0.25 + r() * 0.25, z: z + 0.12 + r() * 0.05 }, 1);
      else b.ico(0.04, 0x8aa84a, { x: x + 0.08, y: 0.28, z: z + 0.1 });
    }
  } else if (type === 'cane') {
    const h = stage === 2 ? 1.25 : 0.7;
    for (const [x, z] of [[-0.25, -0.2], [0, -0.25], [0.25, -0.2], [-0.22, 0.2], [0.05, 0.22], [0.27, 0.18]]) {
      const segs = 4;
      for (let k = 0; k < segs; k++) b.cyl(0.035, 0.04, h / segs - 0.01, 5, k % 2 ? 0xb9b05a : 0x9fa24a, { x, y: 0.08 + k * (h / segs), z });
      for (let k = 0; k < 3; k++) {
        const a = r() * Math.PI * 2;
        b.box(0.5, 0.02, 0.06, worn(stage === 2 ? 0x7f9c3c : P.leafLite, r, 0.12), { x: x + Math.cos(a) * 0.18, y: 0.08 + h * (0.55 + k * 0.17), z: z - Math.sin(a) * 0.18, ry: a, rz: -0.5 });
      }
    }
  } else if (type === 'tobacco') {
    const big = stage === 2;
    for (const [x, z] of spots) {
      const h = big ? 0.75 : 0.4;
      b.cyl(0.025, 0.035, h, 5, 0x7d9a45, { x, y: 0.08, z });
      const n = big ? 6 : 4;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + r();
        const y = 0.12 + (k / n) * h * 0.85;
        const s = big ? 0.32 - k * 0.025 : 0.2;
        b.ico(1, worn(big ? 0x6f9a3a : P.leafLite, r, 0.1), { x: x + Math.cos(a) * s * 0.5, y, z: z - Math.sin(a) * s * 0.5, sx: s * 0.55, sy: 0.02, sz: s * 0.28, ry: a });
      }
      if (big) b.ico(0.05, 0xe7a3b6, { x, y: 0.08 + h + 0.04, z });
    }
  }
  return b.build();
}

export function sparkleGeo() {
  return part(new THREE.OctahedronGeometry(0.09, 0), 0xffe08a, { sy: 1.4 });
}

// ---------------------------------------------------------------- Detalles del entorno
export function tuftGeo(seed = 3, color = P.grassC, h = 0.22) {
  const r = rng(seed);
  const b = new Builder();
  for (let i = 0; i < 4; i++) b.cone(0.035, h * (0.7 + r() * 0.6), 3, worn(color, r, 0.15), { x: (r() - 0.5) * 0.18, z: (r() - 0.5) * 0.18, rz: (r() - 0.5) * 0.4 });
  return b.build();
}
export function signGeo() {
  const b = new Builder();
  b.box(0.07, 0.8, 0.07, P.wood);
  b.box(0.6, 0.32, 0.04, P.cream, { y: 0.55, z: 0.04 });
  b.box(0.5, 0.06, 0.01, P.red, { y: 0.68, z: 0.065 });
  return b.build();
}
export function rockGeo(seed) {
  const r = rng(seed);
  return part(new THREE.DodecahedronGeometry(0.18 + r() * 0.1, 0), worn(P.stone, r, 0.15), { y: 0.06, sy: 0.6, ry: r() * 3 });
}
export function wheelDecorGeo() {
  const b = new Builder();
  b.cyl(0.38, 0.38, 0.06, 12, 0x6e5a42, { y: 0.03 });
  b.cyl(0.08, 0.08, 0.1, 6, 0x4a3a2a, { y: 0.03 });
  return b.build();
}
// Mata de caña muy simple para los cañaverales de fondo (pocos triángulos).
export function caneLowGeo() {
  const b = new Builder();
  for (const [x, z, h] of [[-0.2, -0.1, 1.3], [0.15, -0.2, 1.15], [0.05, 0.2, 1.4], [-0.25, 0.25, 1.05]]) b.box(0.07, h, 0.07, 0xa9a650, { x, z });
  b.box(1.0, 0.03, 0.12, 0x7f9c3c, { y: 0.95, ry: 0.4, rz: 0.25 });
  b.box(0.9, 0.03, 0.12, 0x6f8f34, { y: 1.1, ry: -0.9, rz: -0.25 });
  b.box(0.9, 0.03, 0.12, 0x86a444, { y: 0.8, ry: 1.9, rz: 0.2 });
  return b.build();
}
export function palmLowGeo(seed = 2, height = 4) {
  const r = rng(seed);
  const b = new Builder();
  b.cyl(0.1, 0.15, height, 5, P.palmTrunk);
  b.cyl(0.09, 0.1, 0.6, 5, P.palmShaft, { y: height });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    b.add(part(new THREE.BoxGeometry(1.5, 0.03, 0.4), worn(P.leaf, r, 0.1), { x: Math.cos(a) * 0.65, y: height + 0.45, z: -Math.sin(a) * 0.65, ry: a, rz: -0.45, order: 'YXZ' }));
  }
  return b.build();
}
export function mogoteGeo(seed) {
  const r = rng(seed);
  const b = new Builder();
  for (let i = 0; i < 3; i++) b.ico(3 + r() * 2, worn(0x5d7a45, r, 0.12), { x: i * 3.2 - 3, y: 0.5, z: r() * 2, sy: 1.1 + r() * 0.5 }, 1);
  return b.build();
}
