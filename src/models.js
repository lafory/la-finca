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

// Tipo de material por color base (lo usa el shader para texturas procedurales):
// 0 genérico, 1 madera, 2 guano, 3 metal pintado/óxido, 4 zinc, 5 follaje, 6 piedra/barro, 7 tierra colorada
const WORN_BASE = new Map();
const MAT_OF = new Map();
export function setMat(id, ...hexes) { for (const h of hexes) MAT_OF.set(h, id); }
// Color "gastado": variación leve de luminosidad/saturación.
export function worn(hex, r, amt = 0.08) {
  const out = wornRaw(hex, r, amt);
  WORN_BASE.set(out, WORN_BASE.get(hex) ?? hex);
  return out;
}
function wornRaw(hex, r, amt) {
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
  if (g.morphAttributes) g.morphAttributes = {};
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
  const base = WORN_BASE.get(color) ?? color;
  const mid = t.m ?? MAT_OF.get(base) ?? 0;
  g.setAttribute('matId', new THREE.BufferAttribute(new Float32Array(n).fill(mid), 1));
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

setMat(1, P.wood, P.woodLite, P.woodGrey, P.coopRed, 0x7c6249, 0x6e5640, 0x9b7a50, 0x7d6c58, 0x6f5536, 0x9c7a4c, 0xb08a58, 0xb39a70, 0x6e5a42, 0x4a3a2a, 0x3a2a1e, 0x6b4a2a, 0x8f8778, 0x9a9282);
setMat(2, P.thatch, P.thatchDark, 0x9a6a2e, P.hat, 0xe8d6a8, 0xb08850, 0x8a6a3a);
setMat(3, P.mint, P.rust, 0x7f97b0, 0xb5594a, 0xd9c9a0, 0x8c9a5e, 0x6f8f8a, 0xc98e4a, 0x6f7b80, 0x2f2a26);
setMat(4, P.tin);
setMat(5, P.leaf, P.leafDark, P.leafLite, P.palmShaft, 0x557d34, 0x4a7030, 0x638a3c, 0x6f9444, 0x7f9c3c, 0x6f9a3a, 0x7d9a45, 0x6f8f34, 0x86a444, 0x5d7a45, 0x6f8a3a, P.grassC);
setMat(6, P.stone, P.brick, P.clay, 0xb06a48, 0x9c5432, P.palmTrunk);
setMat(7, P.earth, P.earthDark, P.furrow);

// ---------------------------------------------------------------- Palma real
// Hoja curva con foliolos a ambos lados (tira con caída), más segmentos que v1.
function frondGeo(len, a, p0, r) {
  const pos = [], col = [];
  const cA = new THREE.Color(P.leafDark), cB = new THREE.Color(P.leafLite), tmp = new THREE.Color();
  const segs = 8;
  let px = 0, py = 0, pz = 0, p = p0;
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    pts.push([px, py, pz]);
    const dl = len / segs;
    px += Math.cos(p) * Math.cos(a) * dl; py += Math.sin(p) * dl; pz += -Math.cos(p) * Math.sin(a) * dl;
    p -= (1.15 / segs) * (1 + r() * 0.3);
  }
  // perpendicular horizontal
  const sx = Math.sin(a), sz = Math.cos(a);
  for (let i = 0; i < segs; i++) {
    const [x0, y0, z0] = pts[i], [x1, y1, z1] = pts[i + 1];
    const u0 = i / segs, u1 = (i + 1) / segs;
    const w0 = Math.sin(Math.PI * Math.min(1, u0 * 1.2 + 0.08)) * 0.42, w1 = Math.sin(Math.PI * Math.min(1, u1 * 1.2 + 0.08)) * 0.42;
    const d0 = 0.12 + u0 * 0.18, d1 = 0.12 + u1 * 0.18; // caída de los foliolos
    for (const side of [-1, 1]) {
      const A = [x0, y0, z0], B = [x1, y1, z1];
      const C = [x1 + side * sx * w1, y1 - d1, z1 + side * sz * w1];
      const D = [x0 + side * sx * w0, y0 - d0, z0 + side * sz * w0];
      pos.push(...A, ...B, ...C, ...A, ...C, ...D);
      for (let k = 0; k < 6; k++) {
        const t = k === 2 || k === 4 || k === 5 ? 1 : 0;
        tmp.copy(cA).lerp(cB, (u0 + u1) * 0.35 + t * 0.3 + r() * 0.05);
        col.push(tmp.r, tmp.g, tmp.b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('matId', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3).fill(5), 1));
  g.computeVertexNormals();
  return g;
}
export function palmGeo(seed = 1, height = 4.2) {
  const r = rng(seed);
  const b = new Builder();
  const segs = 6;
  const lean = (r() - 0.5) * 0.25;
  let y = 0;
  for (let i = 0; i < segs; i++) {
    const h = height / segs;
    const bulge = 1 + Math.sin((i / segs) * Math.PI * 0.9) * 0.28;
    const rad = 0.12 * bulge + (i === 0 ? 0.04 : 0);
    b.cyl(rad * 0.96, rad, h, 10, worn(P.palmTrunk, r, 0.05), { y, x: lean * (y / height) * 0.6 });
    y += h;
  }
  const tx = lean * 0.6;
  b.cyl(0.1, 0.125, 0.8, 10, P.palmShaft, { y, x: tx });
  y += 0.8;
  b.add(part(new THREE.SphereGeometry(0.1, 8, 6), P.palmShaft, { y, x: tx }));
  const n = 13;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.3;
    const p0 = i % 3 === 0 ? 0.9 : 0.35 + r() * 0.35;
    const f = frondGeo(1.9 + r() * 0.4, a, p0, r);
    f.translate(tx, y, 0);
    b.add(f);
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

// ---------------------------------------------------------------- Camiones de los 50 (3 modelos)
function wheels(b, xs, zs, r = 0.31) {
  for (const x of xs) for (const z of zs) {
    b.cyl(r, r, 0.24, 16, P.tire, { x, y: r, z, rz: Math.PI / 2, center: true });
    b.cyl(r * 0.5, r * 0.5, 0.26, 12, 0xd8d0bc, { x, y: r, z, rz: Math.PI / 2, center: true, m: 3 });
    b.cyl(r * 0.18, r * 0.18, 0.28, 8, 0x8a8a84, { x, y: r, z, rz: Math.PI / 2, center: true });
  }
}
function roundFender(b, x, z, paint, r) {
  b.add(part(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16, 1, false, 0, Math.PI), worn(paint, r, 0.08), { x, y: 0.42, z, rz: Math.PI / 2, ry: 0, m: 3, sz: 1.2 }));
}
export function truckGeo(model = 0, paint = P.mint) {
  const r = rng(61 + model * 7 + (paint & 0xff));
  const b = new Builder();
  const pm = (c, k = 0.1) => worn(c, r, k);
  // chasis y defensas cromadas
  b.box(1.25, 0.16, model === 1 ? 4.0 : 3.4, 0x2f2a26, { y: 0.3, z: model === 1 ? 0.3 : 0 });
  b.add(part(new THREE.CapsuleGeometry(0.07, 1.25, 4, 8), P.chrome, { y: 0.32, z: -1.74, rz: Math.PI / 2, m: 0 }));
  // capó redondeado
  const hoodL = model === 2 ? 1.0 : 1.15;
  b.box(0.95, 0.42, hoodL, pm(paint), { y: 0.42, z: -1.08, m: 3 });
  b.add(part(new THREE.CylinderGeometry(0.48, 0.48, hoodL, 18, 1, false, -Math.PI / 2, Math.PI), pm(paint), { y: 0.82, z: -1.08, rx: Math.PI / 2, sx: 1, sz: 0.32, m: 3 }));
  // guardafangos (medio cilindro)
  roundFender(b, -0.6, -1.15, paint, r); roundFender(b, 0.6, -1.15, paint, r);
  // óxido en los bordes
  for (let i = 0; i < 6; i++) {
    const side = r() < 0.5 ? -1 : 1;
    b.box(0.02, 0.1 + r() * 0.12, 0.18 + r() * 0.25, pm(P.rust, 0.2), { x: side * 0.76, y: 0.35 + r() * 0.15, z: -1.5 + r() * 2.6, m: 3 });
  }
  // parrilla y faros
  b.box(0.78, 0.34, 0.05, P.chrome, { y: 0.4, z: -1.68 });
  for (let i = 0; i < 6; i++) b.box(0.025, 0.28, 0.02, 0x5f5a52, { x: -0.3 + i * 0.12, y: 0.43, z: -1.71 });
  for (const x of [-0.6, 0.6]) {
    b.add(part(sph(0.1, 10, 8), 0xf2e6b8, { x, y: 0.74, z: -1.5 }));
    b.add(part(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 12), P.chrome, { x, y: 0.74, z: -1.45, rx: Math.PI / 2 }));
  }
  // cabina con techo redondeado
  const cabZ = -0.08;
  b.box(1.2, 0.7, 0.95, pm(paint), { y: 0.55, z: cabZ, m: 3 });
  b.add(part(new THREE.CapsuleGeometry(0.3, 0.6, 4, 12), pm(paint), { y: 1.22, z: cabZ, rz: Math.PI / 2, sy: 1, sz: 1.55, sx: 0.55, m: 3 }));
  b.box(0.98, 0.32, 0.03, P.glass, { y: 0.92, z: cabZ - 0.49 });
  for (const x of [-0.61, 0.61]) b.box(0.03, 0.3, 0.5, P.glass, { x, y: 0.95, z: cabZ - 0.08 });
  for (const x of [-0.7, 0.7]) b.box(0.04, 0.1, 0.08, P.chrome, { x, y: 1.0, z: cabZ - 0.45 });
  // estribos
  for (const x of [-0.68, 0.68]) b.box(0.16, 0.04, 1.2, 0x3a3530, { x, y: 0.26, z: cabZ + 0.05 });
  if (model === 0) {
    // pickup: cama de madera
    roundFender(b, -0.6, 0.95, paint, r); roundFender(b, 0.6, 0.95, paint, r);
    b.box(1.25, 0.06, 1.75, P.woodGrey, { y: 0.42, z: 0.85 });
    for (const x of [-0.62, 0.62]) for (const y of [0.5, 0.72]) b.box(0.05, 0.16, 1.75, pm(P.woodLite, 0.2), { x, y, z: 0.85 });
    for (const y of [0.5, 0.72]) b.box(1.25, 0.16, 0.05, pm(P.woodLite, 0.2), { y, z: 1.71 });
    wheels(b, [-0.6, 0.6], [-1.15, 0.95]);
  } else if (model === 1) {
    // camión de acopio: cama larga con estacas altas
    b.box(1.45, 0.08, 2.4, P.woodGrey, { y: 0.48, z: 1.3 });
    for (const x of [-0.7, 0.7]) {
      for (let i = 0; i < 6; i++) b.box(0.06, 0.8, 0.06, pm(P.wood, 0.2), { x, y: 0.5, z: 0.2 + i * 0.44 });
      for (const y of [0.75, 1.1]) b.box(0.04, 0.12, 2.4, pm(P.woodLite, 0.25), { x, y, z: 1.3 });
    }
    for (const y of [0.75, 1.1]) b.box(1.45, 0.12, 0.04, pm(P.woodLite, 0.25), { y, z: 2.48 });
    wheels(b, [-0.62, 0.62], [-1.15, 1.75, 2.1], 0.33);
  } else {
    // pickup redondeado con lona
    roundFender(b, -0.6, 0.9, paint, r); roundFender(b, 0.6, 0.9, paint, r);
    b.box(1.2, 0.45, 1.6, pm(paint), { y: 0.42, z: 0.85, m: 3 });
    b.add(part(new THREE.CylinderGeometry(0.62, 0.62, 1.5, 14, 1, false, -Math.PI / 2, Math.PI), 0xa89a72, { y: 0.88, z: 0.85, rx: Math.PI / 2, sz: 0.5, m: 2 }));
    for (let i = 0; i < 3; i++) b.box(1.26, 0.04, 0.05, 0x6b5a3a, { y: 0.88 + 0.3, z: 0.25 + i * 0.6 });
    wheels(b, [-0.6, 0.6], [-1.15, 0.9]);
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
const sph = (r, ws = 12, hs = 9) => new THREE.SphereGeometry(r, ws, hs);
export function chickenGeo(variant = 0) {
  const b = new Builder();
  const c = HEN_COLORS[variant % HEN_COLORS.length];
  const dark = new THREE.Color(c).multiplyScalar(0.7).getHex();
  b.add(part(sph(0.2), c, { y: 0.27, sx: 0.85, sz: 1.15 }));
  b.add(part(sph(0.13, 10, 7), dark, { y: 0.28, x: 0.15, sx: 0.35, sz: 0.9 }));
  b.add(part(sph(0.13, 10, 7), dark, { y: 0.28, x: -0.15, sx: 0.35, sz: 0.9 }));
  b.add(part(sph(0.105, 10, 8), c, { y: 0.47, z: -0.17 }));
  for (let i = 0; i < 3; i++) b.add(part(sph(0.03, 6, 4), P.red, { y: 0.575 - i * 0.012, z: -0.21 + i * 0.04 }));
  b.cone(0.03, 0.08, 6, 0xe0a030, { y: 0.46, z: -0.29, rx: -Math.PI / 2, center: true });
  b.add(part(sph(0.025, 6, 4), P.red, { y: 0.4, z: -0.25, sy: 1.6 }));
  b.add(part(sph(0.012, 5, 4), 0x111111, { y: 0.49, z: -0.25, x: 0.06 }));
  b.add(part(sph(0.012, 5, 4), 0x111111, { y: 0.49, z: -0.25, x: -0.06 }));
  b.add(part(sph(0.12, 8, 6), variant === 1 ? 0xd8ccb0 : 0x3a2418, { y: 0.38, z: 0.22, sx: 0.5, sz: 0.6, rx: -0.6 }));
  for (const x of [-0.06, 0.06]) b.cyl(0.015, 0.015, 0.12, 5, 0xd59a3a, { x, y: 0.02 });
  return b.build();
}
export function roosterGeo() {
  const b = new Builder();
  b.add(part(sph(0.22), 0xa4401f, { y: 0.34, sx: 0.85, sz: 1.1 }));
  b.add(part(sph(0.13, 10, 8), 0xc8742a, { y: 0.6, z: -0.17 }));
  b.add(part(sph(0.1, 8, 6), 0xd8902a, { y: 0.48, z: -0.12, sy: 1.3 }));
  for (let i = 0; i < 4; i++) b.add(part(sph(0.04, 6, 4), P.red, { y: 0.72 - Math.abs(i - 1.5) * 0.02, z: -0.24 + i * 0.045 }));
  b.cone(0.035, 0.1, 6, 0xe0a030, { y: 0.58, z: -0.31, rx: -Math.PI / 2, center: true });
  b.add(part(sph(0.035, 6, 4), P.red, { y: 0.5, z: -0.27, sy: 1.6 }));
  for (let i = 0; i < 5; i++) b.add(part(sph(0.16, 8, 6), i % 2 ? 0x1f3a2c : 0x14231c, { y: 0.5 + i * 0.03, z: 0.26 + i * 0.02, x: (i - 2) * 0.03, sx: 0.18, sy: 1.2, sz: 0.45, rx: -0.5 + i * 0.15 }));
  for (const x of [-0.07, 0.07]) b.cyl(0.018, 0.018, 0.16, 5, 0xd59a3a, { x, y: 0.02 });
  return b.build();
}
export function eggGeo() {
  return part(new THREE.SphereGeometry(0.09, 10, 8), 0xf4ead2, { y: 0.11, sy: 1.3 });
}

// ---------------------------------------------------------------- Personas
// Partes separadas para animar: cuerpo, piernas, brazos. Formas redondeadas (cápsulas).
export function personParts(shirt = P.white, hatColor = P.hat, seed = 1, o = {}) {
  const r = rng(seed);
  const skin = o.skin ?? P.skin;
  const cap = (rad, len) => new THREE.CapsuleGeometry(rad, len, 4, 10);
  const body = new Builder();
  body.add(part(cap(0.15, 0.24), shirt, { y: 0.72, sz: 0.72 }));
  body.add(part(new THREE.CylinderGeometry(0.16, 0.15, 0.08, 12), P.pants, { y: 0.52, sz: 0.75 }));
  body.add(part(new THREE.CylinderGeometry(0.155, 0.155, 0.03, 12), 0x3a2a1e, { y: 0.565, sz: 0.75 }));
  for (let i = 0; i < 4; i++) body.add(part(sph(0.012, 5, 4), 0xe8e0d0, { y: 0.84 - i * 0.07, z: -0.115 }));
  body.add(part(new THREE.ConeGeometry(0.07, 0.1, 4), P.red, { y: 0.9, z: -0.1, rx: Math.PI, sz: 0.4 }));
  body.add(part(sph(0.115, 12, 10), skin, { y: 1.0 }));
  body.add(part(sph(0.03, 6, 5), new THREE.Color(skin).multiplyScalar(0.9).getHex(), { y: 0.99, z: -0.11 }));
  body.add(part(new THREE.BoxGeometry(0.12, 0.025, 0.02), 0x3a2a20, { y: 0.955, z: -0.1 }));
  if (hatColor != null) {
    // sombrero de yarey: ala ancha, copa y cinta
    body.add(part(new THREE.CylinderGeometry(0.33, 0.34, 0.025, 20), hatColor, { y: 1.1, m: 2 }));
    body.add(part(new THREE.CylinderGeometry(0.12, 0.15, 0.15, 14), worn(hatColor, r, 0.08), { y: 1.18, m: 2 }));
    body.add(part(new THREE.CylinderGeometry(0.152, 0.152, 0.035, 14), 0x6b4a2a, { y: 1.13 }));
  } else {
    // pañuelo amarrado en la cabeza
    body.add(part(sph(0.125, 12, 8), o.scarf ?? P.red, { y: 1.04, z: 0.01, sy: 0.85 }));
    body.add(part(sph(0.05, 8, 6), o.scarf ?? P.red, { y: 1.02, z: 0.13 }));
  }
  if (o.scarf != null && hatColor != null) body.add(part(new THREE.ConeGeometry(0.11, 0.14, 4), o.scarf, { y: 0.84, z: -0.06, rx: Math.PI, sz: 0.5 }));
  if (o.skirt != null) {
    body.add(part(new THREE.CylinderGeometry(0.15, 0.24, 0.36, 14), o.skirt, { y: 0.4, sz: 0.85 }));
    body.add(part(sph(0.07, 8, 6), 0x2e2018, { y: 1.02, z: 0.12 })); // moño
  }
  const leg = new Builder();
  leg.add(part(cap(0.062, 0.34), P.pants, { y: -0.24 }));
  leg.add(part(sph(0.07, 8, 6), 0x3a2a1e, { y: -0.47, z: -0.03, sy: 0.6, sz: 1.4 }));
  const arm = new Builder();
  arm.add(part(cap(0.052, 0.26), shirt, { y: -0.17 }));
  arm.add(part(sph(0.045, 8, 6), P.skin, { y: -0.36 }));
  return { body: body.build(), leg: leg.build(), arm: arm.build() };
}
// Herramienta en la mano de cada trabajador
export function toolGeo(role) {
  const b = new Builder();
  switch (role) {
    case 'recolector': case 'cosechador':
      b.cyl(0.11, 0.08, 0.1, 10, 0xb08850, { m: 1 });
      b.box(0.2, 0.015, 0.015, 0x8a6a3a, { y: 0.12 });
      if (role === 'recolector') { b.ico(0.04, 0xf4ead2, { y: 0.07, x: -0.03 }); b.ico(0.04, 0xf4ead2, { y: 0.07, x: 0.03 }); }
      else { b.ico(0.045, 0xd2402c, { y: 0.07 }); }
      break;
    case 'regador':
      b.cyl(0.07, 0.08, 0.14, 12, 0x8a9aa0, { m: 4 });
      b.add(part(new THREE.CylinderGeometry(0.012, 0.02, 0.18, 6), 0x8a9aa0, { y: 0.05, z: -0.1, rx: -0.9, m: 4 }));
      break;
    case 'sembrador':
      b.box(0.12, 0.14, 0.08, 0xd9c49a, { m: 2 });
      b.box(0.13, 0.03, 0.09, 0x8a6a3a, { y: 0.07 });
      break;
    case 'cocinera':
      b.add(part(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), 0x8a6a3a, { y: 0.05, m: 1 }));
      b.add(part(sph(0.035, 8, 6), 0x8a6a3a, { y: -0.1, sy: 0.5 }));
      break;
    default:
      b.box(0.18, 0.12, 0.14, 0xa07848, { m: 1 });
  }
  return b.build();
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

// Mata de hierba: hojas finas con degradado (base oscura, punta clara).
export function grassClumpGeo(seed = 1, h = 0.32) {
  const r = rng(seed);
  const pos = [], col = [];
  const base = new THREE.Color(0x4f6a2a), tip = new THREE.Color(0xa9b25a);
  for (let i = 0; i < 7; i++) {
    const a = r() * Math.PI, ox = (r() - 0.5) * 0.22, oz = (r() - 0.5) * 0.22;
    const w = 0.035, hh = h * (0.6 + r() * 0.6), lean = (r() - 0.5) * 0.25;
    const dx = Math.cos(a) * w, dz = Math.sin(a) * w;
    pos.push(ox - dx, 0, oz - dz, ox + dx, 0, oz + dz, ox + lean, hh, oz + lean * 0.5);
    col.push(base.r, base.g, base.b, base.r, base.g, base.b, tip.r, tip.g, tip.b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('matId', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3).fill(5), 1));
  g.computeVertexNormals();
  // normales hacia arriba: se ven parejas desde la cámara
  const n = g.attributes.normal;
  for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);
  return g;
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

// ---------------------------------------------------------------- v3.1: obstáculos, animales y estructuras nuevas
export function rockPileGeo(seed) {
  const r = rng(seed);
  const b = new Builder();
  for (let i = 0; i < 3 + Math.floor(r() * 2); i++) b.add(part(new THREE.DodecahedronGeometry(0.16 + r() * 0.14, 0), worn(P.stone, r, 0.2), { x: (r() - 0.5) * 0.5, z: (r() - 0.5) * 0.5, y: 0.08, sy: 0.65, ry: r() * 3, m: 6 }));
  return b.build();
}
export function marabuGeo(seed) {
  const r = rng(seed);
  const b = new Builder();
  // arbusto espinoso: varias copas bajas y ramitas secas
  for (let i = 0; i < 5; i++) b.add(part(new THREE.IcosahedronGeometry(0.22 + r() * 0.14, 0), worn(0x55682e, r, 0.2), { x: (r() - 0.5) * 0.5, z: (r() - 0.5) * 0.5, y: 0.25 + r() * 0.3, sy: 0.75, m: 5 }));
  for (let i = 0; i < 6; i++) b.add(part(new THREE.CylinderGeometry(0.012, 0.02, 0.6, 4), 0x6b5236, { x: (r() - 0.5) * 0.6, z: (r() - 0.5) * 0.6, y: 0.3, rx: (r() - 0.5) * 1.2, rz: (r() - 0.5) * 1.2, m: 1 }));
  return b.build();
}
export function stumpGeo(seed) {
  const r = rng(seed);
  const b = new Builder();
  b.add(part(new THREE.CylinderGeometry(0.22, 0.3, 0.32, 9), worn(0x6e5238, r, 0.15), { y: 0.16, m: 6 }));
  b.add(part(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 9), 0xc9a878, { y: 0.33 }));
  for (let i = 0; i < 3; i++) { const a = r() * 6.28; b.add(part(new THREE.CylinderGeometry(0.04, 0.07, 0.45, 5), 0x5e4630, { x: Math.cos(a) * 0.3, z: Math.sin(a) * 0.3, y: 0.05, rz: Math.cos(a) * 1.3, rx: -Math.sin(a) * 1.3, m: 6 })); }
  return b.build();
}
const sph2 = (r, w = 10, h = 8) => new THREE.SphereGeometry(r, w, h);
export function cowGeo(variant = 0) {
  const b = new Builder();
  const main = [0xe8e0d0, 0x8a5a3a, 0xd9c7a8][variant % 3];
  b.add(part(new THREE.CapsuleGeometry(0.26, 0.55, 4, 10), main, { y: 0.62, rx: Math.PI / 2 }));
  if (variant % 3 === 0) for (let i = 0; i < 4; i++) b.add(part(sph2(0.12), 0x2e2620, { x: (i % 2 ? 0.2 : -0.2), y: 0.7 + (i % 3) * 0.05, z: -0.25 + i * 0.16, sx: 0.5 }));
  b.add(part(new THREE.BoxGeometry(0.26, 0.26, 0.34), main, { y: 0.78, z: -0.6 }));
  b.add(part(new THREE.BoxGeometry(0.2, 0.14, 0.12), 0xd9a89a, { y: 0.7, z: -0.8 }));
  for (const x of [-0.12, 0.12]) b.add(part(new THREE.ConeGeometry(0.03, 0.14, 5), 0xe8dcc0, { x, y: 0.97, z: -0.58, rz: x * 3 }));
  for (const [x, z] of [[-0.16, -0.3], [0.16, -0.3], [-0.16, 0.3], [0.16, 0.3]]) b.add(part(new THREE.CylinderGeometry(0.05, 0.045, 0.42, 6), main, { x, y: 0.21, z }));
  b.add(part(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4), main, { y: 0.55, z: 0.55, rx: 0.3 }));
  return b.build();
}
export function goatGeo(variant = 0) {
  const b = new Builder();
  const main = [0xece4d4, 0x5a4434, 0xb08a5a][variant % 3];
  b.add(part(new THREE.CapsuleGeometry(0.14, 0.32, 4, 8), main, { y: 0.4, rx: Math.PI / 2 }));
  b.add(part(new THREE.BoxGeometry(0.13, 0.15, 0.22), main, { y: 0.58, z: -0.32, rx: 0.3 }));
  for (const x of [-0.04, 0.04]) b.add(part(new THREE.ConeGeometry(0.02, 0.15, 5), 0x8a7a64, { x, y: 0.72, z: -0.28, rx: 0.6 }));
  b.add(part(new THREE.ConeGeometry(0.025, 0.08, 4), 0xd8d0c0, { y: 0.47, z: -0.42, rx: Math.PI }));
  for (const [x, z] of [[-0.08, -0.16], [0.08, -0.16], [-0.08, 0.16], [0.08, 0.16]]) b.add(part(new THREE.CylinderGeometry(0.025, 0.022, 0.28, 5), main, { x, y: 0.14, z }));
  return b.build();
}
export function pigGeo(variant = 0) {
  const b = new Builder();
  const main = [0xe0a898, 0x3a302c, 0xd99a8a][variant % 3];
  b.add(part(new THREE.CapsuleGeometry(0.2, 0.36, 4, 10), main, { y: 0.3, rx: Math.PI / 2, sy: 1 }));
  b.add(part(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 10), new THREE.Color(main).multiplyScalar(0.85).getHex(), { y: 0.3, z: -0.48, rx: Math.PI / 2 }));
  for (const x of [-0.1, 0.1]) b.add(part(new THREE.ConeGeometry(0.05, 0.08, 4), main, { x, y: 0.47, z: -0.3, rx: -0.4 }));
  for (const [x, z] of [[-0.11, -0.18], [0.11, -0.18], [-0.11, 0.18], [0.11, 0.18]]) b.add(part(new THREE.CylinderGeometry(0.04, 0.035, 0.14, 5), main, { x, y: 0.07, z }));
  return b.build();
}
// Corral con cerca de tablas, bebedero y un rancho de guano en una esquina (w×h tiles, centrado).
export function penGeo(w, h, seed) {
  const r = rng(seed);
  const b = new Builder();
  const hw = w / 2, hh = h / 2;
  const post = (x, z) => b.box(0.08, 0.7, 0.08, worn(P.woodGrey, r, 0.15), { x, z, rz: (r() - 0.5) * 0.06, m: 1 });
  for (let x = -hw; x <= hw + 1e-6; x += 1) { post(x, -hh); post(x, hh); }
  for (let z = -hh + 1; z <= hh - 1 + 1e-6; z += 1) { post(-hw, z); post(hw, z); }
  for (const y of [0.25, 0.5]) {
    b.box(w, 0.06, 0.04, worn(P.woodGrey, r, 0.12), { y, z: -hh, m: 1 });
    b.box(w * 0.4, 0.06, 0.04, worn(P.woodGrey, r, 0.12), { y, z: hh, x: -w * 0.3, m: 1 });
    b.box(w * 0.4, 0.06, 0.04, worn(P.woodGrey, r, 0.12), { y, z: hh, x: w * 0.3, m: 1 });
    for (const x of [-hw, hw]) b.box(0.04, 0.06, h, worn(P.woodGrey, r, 0.12), { x, y, m: 1 });
  }
  b.box(0.9, 0.18, 0.3, 0x7a7068, { x: hw - 0.7, z: hh - 0.4, m: 6 });
  b.box(0.8, 0.02, 0.22, 0x5f88a0, { x: hw - 0.7, z: hh - 0.4, y: 0.17 });
  // rancho
  for (const [x, z] of [[-hw + 0.2, -hh + 0.2], [-hw + 1.4, -hh + 0.2], [-hw + 0.2, -hh + 1.2], [-hw + 1.4, -hh + 1.2]]) b.box(0.07, 0.95, 0.07, P.wood, { x, z, m: 1 });
  b.gable(1.6, 1.4, 0.55, P.thatch, { x: -hw + 0.8, z: -hh + 0.7, y: 0.95, m: 2 });
  return b.build();
}
export function trapicheGeo() {
  const r = rng(71);
  const b = new Builder();
  // base de piedra, tres mazas y la palanca para el buey
  b.box(2.6, 0.12, 1.6, P.stone, { m: 6 });
  for (let i = 0; i < 3; i++) b.cyl(0.18, 0.18, 0.7, 12, 0x6f665c, { x: -0.25 + i * 0.25, y: 0.12, m: 3 });
  b.box(0.9, 0.08, 0.5, P.wood, { y: 0.82, m: 1 });
  b.add(part(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), P.wood, { y: 0.95, rz: Math.PI / 2, ry: 0.4, m: 1 }));
  b.cyl(0.35, 0.3, 0.3, 12, 0x5a3a20, { x: 0.95, z: 0.4, m: 1 });
  b.cyl(0.3, 0.3, 0.02, 12, 0x6a3a14, { x: 0.95, z: 0.4, y: 0.29 });
  // rancho de guano encima
  for (const [x, z] of [[-1.2, -0.7], [1.2, -0.7], [-1.2, 0.7], [1.2, 0.7]]) b.box(0.09, 1.6, 0.09, worn(P.wood, r), { x, z, m: 1 });
  b.gable(2.8, 1.9, 0.8, P.thatch, { y: 1.6, m: 2 });
  // caña apilada
  for (let i = 0; i < 6; i++) b.add(part(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 5), 0xb9b05a, { x: -0.9, z: 0.45 + (i % 3) * 0.07, y: 0.15 + Math.floor(i / 3) * 0.06, rz: Math.PI / 2, m: 0 }));
  return b.build();
}
export function wellGeo() {
  const r = rng(81);
  const b = new Builder();
  b.cyl(0.42, 0.45, 0.5, 14, P.stone, { x: -0.4, z: 0.3, m: 6 });
  b.cyl(0.34, 0.34, 0.02, 14, 0x2a4a5a, { x: -0.4, z: 0.3, y: 0.46 });
  // molino de viento (torre de metal y aspas)
  for (const [x, z] of [[0.15, -0.55], [0.75, -0.55], [0.15, 0.05], [0.75, 0.05]]) b.add(part(new THREE.CylinderGeometry(0.025, 0.03, 3.0, 5), 0x8a8a84, { x: 0.45 + (x - 0.45) * 0.6, z: -0.25 + (z + 0.25) * 0.6, y: 1.5, rz: (0.45 - x) * 0.18, rx: (z + 0.25) * 0.18, m: 4 }));
  b.box(0.3, 0.2, 0.3, worn(P.rust, r), { x: 0.45, z: -0.25, y: 2.95, m: 3 });
  b.box(0.04, 0.3, 0.6, 0x9a4a3a, { x: 0.45, z: 0.15, y: 2.95, m: 3 });
  return b.build();
}
export function bladesGeo() {
  const b = new Builder();
  for (let i = 0; i < 8; i++) b.add(part(new THREE.BoxGeometry(0.08, 0.6, 0.015), 0xd8d0c0, { y: 0, rz: (i / 8) * Math.PI * 2, x: 0, center: true, m: 4 }));
  return b.build();
}
export function andenGeo() {
  const r = rng(91);
  const b = new Builder();
  b.box(1.8, 0.45, 1.8, worn(P.woodGrey, r, 0.1), { m: 1 });
  for (let i = 0; i < 8; i++) b.box(1.8, 0.02, 0.2, worn(P.wood, r, 0.15), { y: 0.45, z: -0.8 + i * 0.23, m: 1 });
  for (const [x, z] of [[-0.5, -0.4], [0.2, 0.3], [-0.4, 0.5]]) b.box(0.36, 0.3, 0.36, 0xa07848, { x, z, y: 0.47, m: 1 });
  b.box(0.06, 1.6, 0.06, P.wood, { x: 0.8, z: -0.8, m: 1 });
  b.box(0.7, 0.3, 0.04, P.cream, { x: 0.8, z: -0.78, y: 1.25 });
  return b.build();
}
// Solar marcado con estacas y cordel para construir
export function siteGeo(w, h) {
  const b = new Builder();
  const hw = w / 2 - 0.1, hh = h / 2 - 0.1;
  for (const [x, z] of [[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]]) b.box(0.05, 0.35, 0.05, 0xc9a878, { x, z });
  for (const z of [-hh, hh]) b.box(w - 0.2, 0.012, 0.012, 0xf2e6c4, { z, y: 0.28 });
  for (const x of [-hw, hw]) b.box(0.012, 0.012, h - 0.2, 0xf2e6c4, { x, y: 0.28 });
  b.box(0.07, 0.9, 0.07, P.wood, { x: hw - 0.2, z: hh - 0.1 });
  b.box(0.7, 0.36, 0.04, 0xf3e3bf, { x: hw - 0.2, z: hh - 0.06, y: 0.55 });
  return b.build();
}
