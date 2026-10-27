// Kit de modelos 3D para las fincas regionales (arrozal, cafetal, cacaotal, vega de tabaco, naranjal,
// potrero, puerto de pesca, ron) y piezas genéricas (bohío, almacén, cerca, palma).
// Mismo estilo que models.js: low-poly con color por vértice + matId (texturas procedurales de shaders.js).
// Sin assets externos. Cada modelo se arma en 3 capas fusionadas — sólido, follaje (doble cara, viento)
// y agua — así un modelo cuesta como mucho 3 llamadas de dibujo, y con createInstanced() N copias
// siguen costando 3. Materiales y geometrías se comparten (caché); disposeKit() libera todo.
//
// Tamaño: todo cabe en un lote regional de FOOT×FOOT (2.0, centrado en el origen, base en y=0;
// CELL = 2.2 en regional-data.js deja 0.2 de pasillo). Para la finca principal (1 tile = 1) usar { size: 0.5 }.
import * as THREE from 'three';
import * as M from '../models.js';
import { patchMaterial } from '../shaders.js';

const { Builder, part, rng, worn, P } = M;

export const FOOT = 2.0;
export const STAGES = 4; // 0 brote · 1 creciendo · 2 casi (flor / fruta verde) · 3 listo para cosechar
const clamp01 = (v) => Math.max(0, Math.min(1, +v || 0));
// growth 0..1 → etapa 0..3 (3 solo con growth = 1, o sea "listo")
export const stageOf = (growth) => (growth >= 1 ? 3 : Math.min(2, Math.floor(clamp01(growth) * 3)));

const lerpHex = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t).getHex();
const sph = (r, w = 8, h = 6) => new THREE.SphereGeometry(r, w, h);
const C = {
  mud: 0x5a3a24, bund: 0x7a4a2c, paddyWater: 0x7aa59a, sea: 0x2f8aa0, seaDeep: 0x1f6f8a,
  riceYoung: 0x9fd05a, riceGreen: 0x6f9f3a, riceGold: 0xd8b84a, riceGrain: 0xe4c860,
  coffeeLeaf: 0x2f5a26, coffeeGreen: 0x8fbf3a, coffeeRed: 0xc8332b, coffeeYellow: 0xe0b030, flowerWhite: 0xf6f2e6,
  cacaoLeaf: 0x3f6a2a, cacaoNew: 0x9a4a32, cacaoBark: 0x8a7a62, podGreen: 0x9fb040, podOrange: 0xe0902a, podRed: 0xb8502a,
  tobLeaf: 0x6f9a3a, tobLeafLite: 0x8fb04a, tobFlower: 0xe8a0b8, cureGreen: 0x8a9a3a, cureGold: 0xc09848, cureBrown: 0x7a4a22,
  citrusLeaf: 0x3f7a2c, orangeGreen: 0x8fae3a, orange: 0xf09a20,
  caneStalk: 0x8fae4a, caneRipe: 0xb0a050, caneLeaf: 0x6f9a3a, canePlume: 0xd8d0c0,
  brick: 0x9c5a3c, soot: 0x3a2e28, copper: 0xc07a42, barrel: 0x6b4a2a, iron: 0x3a3a3a,
  hullWhite: 0xe8e0c8, hullBlue: 0x2f5da8, hullRed: 0xb5594a, hullYellow: 0xe0b85a, net: 0x55665a, float: 0xe8702a,
  hay: 0xd8b860, dirt: 0xa08a5a, jute: 0xc8b088, doorGreen: 0x6f8f8a, shutterBlue: 0x6f8fa8, lime: 0xe8e0d0,
};
// tipos de material de los colores propios del kit (0 genérico, 1 madera, 2 guano, 3 metal, 4 zinc, 5 follaje, 6 piedra, 7 tierra)
M.setMat(1, C.barrel);
M.setMat(2, C.hay, C.jute);
M.setMat(5, C.riceYoung, C.riceGreen, C.coffeeLeaf, C.cacaoLeaf, C.tobLeaf, C.tobLeafLite, C.citrusLeaf, C.caneLeaf, C.caneStalk);
M.setMat(6, C.brick, C.lime);
M.setMat(7, C.mud, C.bund, C.dirt);

// ---------------------------------------------------------------- capas (sólido / follaje / agua)
class Parts {
  constructor() { this.s = new Builder(); this.f = new Builder(); this.w = new Builder(); }
  build() {
    const out = {};
    for (const [k, b] of [['solid', this.s], ['fol', this.f], ['water', this.w]]) {
      if (!b.parts.length) { out[k] = null; continue; }
      const g = b.build(); g.computeBoundingSphere(); g.computeBoundingBox(); out[k] = g;
    }
    return out;
  }
}
// hoja ancha (elipsoide aplastado), inclinada hacia afuera en el ángulo a
function leaf(b, x, y, z, a, len, wid, color, tilt = 0.5) {
  b.add(part(sph(1, 5, 3), color, { x: x + Math.cos(a) * len * 0.5, y, z: z - Math.sin(a) * len * 0.5, sx: len * 0.5, sy: 0.012, sz: wid * 0.5, ry: a, rz: tilt * 0.6, order: 'YXZ', m: 5 }));
}
// hoja larga y fina que se arquea (caña, arroz): dos tramos
function blade(b, x, y, z, a, len, color, lift = 0.9) {
  const dx = Math.cos(a), dz = -Math.sin(a);
  const l1 = len * 0.55, l2 = len * 0.5;
  b.add(part(new THREE.PlaneGeometry(l1, 0.05).rotateX(-Math.PI / 2), color, { x: x + dx * l1 * 0.45 * Math.cos(lift * 0.6), y: y + Math.sin(lift * 0.6) * l1 * 0.5, z: z + dz * l1 * 0.45 * Math.cos(lift * 0.6), ry: a, rz: lift * 0.6, order: 'YZX', m: 5 }));
  const ex = x + dx * l1 * 0.9 * Math.cos(lift * 0.6), ey = y + Math.sin(lift * 0.6) * l1, ez = z + dz * l1 * 0.9 * Math.cos(lift * 0.6);
  b.add(part(new THREE.PlaneGeometry(l2, 0.04).rotateX(-Math.PI / 2), color, { x: ex + dx * l2 * 0.45, y: ey - l2 * 0.12, z: ez + dz * l2 * 0.45, ry: a, rz: -0.3, order: 'YZX', m: 5 }));
}
// caja dentro de la que cabe el lote: puntos en cuadrícula n×m sobre [-e, e]
const gridPts = (nx, nz, ex = 0.75, ez = ex) => { const o = []; for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) o.push([nx === 1 ? 0 : -ex + (2 * ex * i) / (nx - 1), nz === 1 ? 0 : -ez + (2 * ez * j) / (nz - 1)]); return o; };

// ================================================================ CULTIVOS
// ---- arroz: aniego con bordos de tierra, agua y matas en hileras (verde tierno → verde → espiga → dorado)
function riceParts(stage, seed = 1) {
  const p = new Parts(), r = rng(100 + seed * 7 + stage);
  const S = FOOT;
  p.s.box(S - 0.24, 0.04, S - 0.24, C.mud, { m: 7 });
  for (const [x, z, w, d] of [[0, -0.93, S, 0.14], [0, 0.93, S, 0.14], [-0.93, 0, 0.14, S - 0.28], [0.93, 0, 0.14, S - 0.28]]) {
    p.s.box(w, 0.13, d, worn(C.bund, r, 0.08), { x, z, m: 7 });
    p.s.box(w * 0.98, 0.02, d * 0.6, worn(P.grassC, r, 0.1), { x, z, y: 0.13, m: 5 }); // yerba en el lomo del bordo
  }
  p.s.box(0.16, 0.06, 0.14, C.mud, { x: 0.45, z: 0.93, y: 0.07, m: 7 }); // portillo por donde entra el agua
  const lvl = stage === 3 ? 0.06 : 0.09; // al madurar se baja el agua
  p.w.box(S - 0.26, 0.02, S - 0.26, stage === 3 ? 0x8a9a78 : C.paddyWater, { y: lvl - 0.02, m: 0 });
  const h = [0.16, 0.36, 0.52, 0.56][stage];
  const col = [C.riceYoung, C.riceGreen, lerpHex(C.riceGreen, C.riceGold, 0.25), C.riceGold][stage];
  const n = stage === 0 ? 5 : 6, blades = stage === 0 ? 3 : 5;
  for (const [x0, z0] of gridPts(n, n, 0.7)) {
    const x = x0 + (r() - 0.5) * 0.05, z = z0 + (r() - 0.5) * 0.05;
    for (let k = 0; k < blades; k++) {
      const a = (k / blades) * Math.PI * 2 + r(), lean = 0.12 + r() * 0.18 + (stage === 3 ? 0.1 : 0);
      p.f.add(part(new THREE.ConeGeometry(0.022, h * (0.85 + r() * 0.3), 3), worn(col, r, 0.12), { x: x + Math.cos(a) * 0.03, y: 0.02 + h * 0.5, z: z - Math.sin(a) * 0.03, rz: Math.cos(a) * lean, rx: Math.sin(a) * lean, m: 5 }));
    }
    if (stage >= 2) for (let k = 0; k < 3; k++) { // espigas que se doblan con el peso del grano
      const a = (k / 3) * Math.PI * 2 + r();
      p.f.add(part(new THREE.CylinderGeometry(0.012, 0.022, 0.16, 4), stage === 3 ? C.riceGrain : lerpHex(C.riceGreen, C.riceGrain, 0.4), { x: x + Math.cos(a) * 0.07, y: h * 0.95, z: z - Math.sin(a) * 0.07, rz: Math.cos(a) * 1.1, rx: Math.sin(a) * 1.1, m: 5 }));
    }
  }
  return p.build();
}

// ---- café: tres terrazas en la loma, con muros de piedra y matas en hilera (flor blanca → grano verde → rojo)
function coffeeParts(stage, seed = 1) {
  const p = new Parts(), r = rng(200 + seed * 7 + stage);
  const rows = [[-0.62, 0.44], [0.02, 0.22], [0.64, 0.0]]; // z, altura de la terraza (sube hacia el fondo, -z)
  for (const [z, y] of rows) {
    p.s.box(FOOT, 0.12 + y, 0.64, worn(P.earthDark, r, 0.06), { z, m: 7 });
    p.s.box(FOOT, 0.03, 0.6, worn(0x6a5a32, r, 0.1), { z, y: 0.12 + y, m: 7 }); // hojarasca
    for (let i = 0; i < 7; i++) p.s.box(0.28, 0.12 + y, 0.08, worn(P.stone, r, 0.15), { x: -0.86 + i * 0.287, z: z + 0.31, m: 6 }); // muro de piedra seca
  }
  const s = [0.42, 0.72, 0.95, 1][stage];
  for (const [z, y] of rows) for (const x of [-0.6, 0, 0.6]) {
    const bx = x + (r() - 0.5) * 0.08, bz = z - 0.04, by = 0.15 + y;
    p.s.cyl(0.02, 0.028, 0.18 * s, 5, P.wood, { x: bx, z: bz, y: by, m: 1 });
    // copa en pisos (el cafeto tiene ramas horizontales)
    for (let k = 0; k < 3; k++) {
      const rr = (0.27 - k * 0.07) * s, yy = by + (0.14 + k * 0.17) * s;
      p.f.ico(rr, worn(C.coffeeLeaf, r, 0.14), { x: bx, z: bz, y: yy, sy: 0.62, ry: r() * 3, m: 5 }, 1);
    }
    if (stage === 1) for (let k = 0; k < 4; k++) { const a = r() * 6.28; p.f.add(part(new THREE.OctahedronGeometry(0.025, 0), C.flowerWhite, { x: bx + Math.cos(a) * 0.2 * s, z: bz - Math.sin(a) * 0.2 * s, y: by + (0.12 + r() * 0.3) * s, m: 0 })); }
    if (stage >= 2) for (let k = 0; k < 9; k++) {
      const a = r() * 6.28, rad = (0.22 + r() * 0.06) * s;
      const c = stage === 2 ? worn(C.coffeeGreen, r, 0.1) : r() < 0.8 ? worn(C.coffeeRed, r, 0.1) : C.coffeeYellow;
      const cx = bx + Math.cos(a) * rad, cz = bz - Math.sin(a) * rad, cy = by + (0.1 + r() * 0.38) * s;
      p.s.add(part(new THREE.OctahedronGeometry(0.03, 0), c, { x: cx, z: cz, y: cy, sx: 1.6, m: 0 })); // racimo en la rama
    }
  }
  return p.build();
}

// ---- cacao: árboles de tronco gris con mazorcas colgando del tronco y las ramas gruesas
function cacaoParts(stage, seed = 1) {
  const p = new Parts(), r = rng(300 + seed * 7 + stage);
  p.s.box(FOOT - 0.1, 0.03, FOOT - 0.1, 0x6a5232, { m: 7 }); // hojarasca
  for (let i = 0; i < 26; i++) p.s.box(0.09, 0.01, 0.05, worn(r() < 0.5 ? 0x8a6a3a : 0x6e5a30, r, 0.15), { x: (r() - 0.5) * 1.8, z: (r() - 0.5) * 1.8, y: 0.03, ry: r() * 3, m: 5 });
  const s = [0.32, 0.62, 0.9, 1][stage];
  for (const [x, z, k0] of [[-0.48, -0.45, 1], [0.5, -0.1, 0.92], [-0.12, 0.55, 0.85]]) {
    const k = s * k0, th = 0.62 * k;
    p.s.cyl(0.045 * k + 0.015, 0.07 * k + 0.02, th, 7, worn(C.cacaoBark, r, 0.08), { x, z, m: 1 });
    // horqueta de 3 ramas
    for (let j = 0; j < 3; j++) {
      const a = (j / 3) * Math.PI * 2 + r();
      p.s.add(part(new THREE.CylinderGeometry(0.02 * k + 0.01, 0.035 * k + 0.01, 0.42 * k, 5), C.cacaoBark, { x: x + Math.cos(a) * 0.12 * k, y: th + 0.15 * k, z: z - Math.sin(a) * 0.12 * k, rz: -Math.cos(a) * 0.7, rx: -Math.sin(a) * 0.7, m: 1 }));
    }
    // copa: varias masas de hojas grandes, alguna rojiza (hojas nuevas)
    for (let j = 0; j < 6; j++) {
      const a = (j / 6) * Math.PI * 2 + r() * 0.5, d = j === 5 ? 0 : 0.3 * k;
      const c = j === 2 && r() < 0.5 ? worn(lerpHex(C.cacaoNew, C.cacaoLeaf, 0.45), r, 0.1) : worn(C.cacaoLeaf, r, 0.14);
      p.f.ico((0.24 + r() * 0.08) * k, c, { x: x + Math.cos(a) * d, z: z - Math.sin(a) * d, y: th + (0.32 + (j === 5 ? 0.18 : r() * 0.1)) * k, sy: 0.7, m: 5 }, 1);
    }
    if (stage >= 2) {
      const n = stage === 2 ? 5 : 8;
      for (let j = 0; j < n; j++) {
        const a = r() * 6.28, onTrunk = j % 2 === 0;
        const px = x + Math.cos(a) * (onTrunk ? 0.08 * k + 0.03 : 0.17 * k), pz = z - Math.sin(a) * (onTrunk ? 0.08 * k + 0.03 : 0.17 * k);
        const py = onTrunk ? 0.18 + r() * th * 0.6 : th + 0.08 * k;
        const c = stage === 2 ? worn(C.podGreen, r, 0.1) : worn(r() < 0.65 ? C.podOrange : C.podRed, r, 0.1);
        p.s.add(part(sph(0.055, 7, 5), c, { x: px, y: py, z: pz, sx: 0.75, sy: 1.75, sz: 0.75, rz: Math.cos(a) * 0.25, m: 0 }));
        p.s.cyl(0.008, 0.008, 0.06, 3, 0x5a4a2a, { x: px, y: py + 0.08, z: pz, m: 1 });
      }
    }
  }
  return p.build();
}

// ---- tabaco: vega en surcos de tierra colorada; matas de hojas anchas (flor rosada al final)
function tobaccoParts(stage, seed = 1) {
  const p = new Parts(), r = rng(400 + seed * 7 + stage);
  p.s.box(FOOT, 0.04, FOOT, P.furrow, { m: 7 });
  for (const z of [-0.62, 0, 0.62]) { p.s.box(FOOT - 0.08, 0.08, 0.38, worn(P.earthDark, r, 0.05), { y: 0.03, z, m: 7 }); p.s.box(FOOT - 0.08, 0.04, 0.24, P.earth, { y: 0.1, z, m: 7 }); }
  const s = [0.3, 0.62, 0.9, 1][stage];
  for (const z of [-0.62, 0, 0.62]) for (const x of [-0.62, 0, 0.62]) {
    const px = x + (r() - 0.5) * 0.06, pz = z + (r() - 0.5) * 0.04, by = 0.13, H = 0.95 * s;
    p.s.cyl(0.014, 0.024, H, 5, 0x7f9a4a, { x: px, z: pz, y: by, m: 5 });
    const nl = stage === 0 ? 4 : 8;
    for (let k = 0; k < nl; k++) {
      const t = k / nl, a = k * 2.4 + r() * 0.3;
      const len = (0.42 - t * 0.24) * (0.55 + s * 0.45), wid = len * 0.55;
      const c = worn(t < 0.3 && stage === 3 ? lerpHex(C.tobLeaf, C.cureGold, 0.25) : t > 0.6 ? C.tobLeafLite : C.tobLeaf, r, 0.1);
      leaf(p.f, px, by + 0.05 + t * H * 0.85, pz, a, len, wid, c, -0.15 + t * 0.6);
    }
    if (stage === 3) for (let k = 0; k < 4; k++) p.f.add(part(new THREE.ConeGeometry(0.025, 0.07, 5), C.tobFlower, { x: px + (r() - 0.5) * 0.08, y: by + H + 0.04, z: pz + (r() - 0.5) * 0.08, rx: Math.PI, m: 0 }));
  }
  return p.build();
}

// ---- naranjos: cuatro árboles redondos de hoja oscura con naranjas (verdes → anaranjadas)
function citrusParts(stage, seed = 1) {
  const p = new Parts(), r = rng(500 + seed * 7 + stage);
  const s = [0.32, 0.64, 0.9, 1][stage];
  for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) {
    const px = x + (r() - 0.5) * 0.06, pz = z + (r() - 0.5) * 0.06;
    p.s.cyl(0.3 * s + 0.05, 0.32 * s + 0.06, 0.02, 10, 0x6e4a2a, { x: px, z: pz, m: 7 }); // cazuela de riego
    p.s.cyl(0.03 * s + 0.015, 0.045 * s + 0.02, 0.34 * s + 0.06, 6, 0x7a6248, { x: px, z: pz, m: 1 });
    if (stage === 0) p.s.box(0.025, 0.42, 0.025, P.woodLite, { x: px + 0.06, z: pz, m: 1 }); // tutor
    const R = 0.4 * s, cy = 0.34 * s + 0.06 + R * 0.82;
    p.f.ico(R, worn(C.citrusLeaf, r, 0.1), { x: px, z: pz, y: cy, sy: 0.92, m: 5 }, 1);
    p.f.ico(R * 0.62, worn(lerpHex(C.citrusLeaf, P.leafLite, 0.4), r, 0.1), { x: px + R * 0.25, z: pz + R * 0.25, y: cy + R * 0.35, m: 5 }, 1);
    if (stage >= 2) {
      const n = stage === 2 ? 9 : 14;
      for (let k = 0; k < n; k++) {
        const a = r() * 6.28, e = (r() - 0.35) * 1.1; // más fruta en los lados y abajo
        const c = stage === 2 ? worn(C.orangeGreen, r, 0.1) : worn(r() < 0.85 ? C.orange : 0xe8b030, r, 0.08);
        p.s.ico(0.055, c, { x: px + Math.cos(a) * Math.cos(e) * R * 0.98, y: cy + Math.sin(e) * R * 0.92, z: pz - Math.sin(a) * Math.cos(e) * R * 0.98, m: 0 });
      }
    }
  }
  return p.build();
}

// ---- caña (cañaveral para ron): macollas de tallos con nudos y hojas arqueadas; al final, el güin con pluma
function caneParts(stage, seed = 1) {
  const p = new Parts(), r = rng(600 + seed * 7 + stage);
  p.s.box(FOOT, 0.04, FOOT, P.furrow, { m: 7 });
  for (const z of [-0.66, -0.22, 0.22, 0.66]) p.s.box(FOOT - 0.08, 0.07, 0.24, worn(P.earthDark, r, 0.05), { y: 0.02, z, m: 7 });
  const H = [0.28, 0.75, 1.25, 1.55][stage];
  const stalkC = stage >= 2 ? lerpHex(C.caneStalk, C.caneRipe, stage === 3 ? 0.8 : 0.3) : C.caneStalk;
  const stalk = (x, y, z, h, rz, rx, c) => p.f.add(part(new THREE.CylinderGeometry(0.019, 0.023, h, 4, 1, true), c, { x, y: y + h / 2, z, rz, rx, m: 5 }));
  for (const z of [-0.66, -0.22, 0.22, 0.66]) for (const x of [-0.6, 0, 0.6]) {
    const cx = x + (r() - 0.5) * 0.1, cz = z + (r() - 0.5) * 0.05;
    const n = stage === 0 ? 3 : 5;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 6.28 + r(), ox = cx + Math.cos(a) * 0.06, oz = cz - Math.sin(a) * 0.06;
      const h = H * (0.8 + r() * 0.3), lean = 0.05 + r() * 0.1, tx = Math.cos(a) * lean, tz = -Math.sin(a) * lean;
      const segs = stage === 0 ? 1 : 2;
      for (let j = 0; j < segs; j++) { // entrenudos (el corte de color marca el nudo)
        const y0 = 0.06 + (h / segs) * j;
        stalk(ox + tx * (y0 + h / segs / 2), y0, oz + tz * (y0 + h / segs / 2), h / segs - 0.015, -tx, tz, worn(stalkC, r, 0.14));
      }
      const topx = ox + tx * h, topz = oz + tz * h, topy = 0.06 + h;
      const nl = stage === 0 ? 2 : 4;
      for (let j = 0; j < nl; j++) blade(p.f, topx, topy - 0.1 - j * 0.1, topz, a + j * 1.7 + r(), 0.35 + H * 0.3, worn(C.caneLeaf, r, 0.14), 0.85 - j * 0.12);
      if (stage === 3 && k === 0) { p.f.cyl(0.006, 0.008, 0.3, 3, C.caneRipe, { x: topx, z: topz, y: topy, m: 5 }); p.f.add(part(new THREE.ConeGeometry(0.05, 0.22, 5), C.canePlume, { x: topx, z: topz, y: topy + 0.36, rx: Math.PI, m: 0 })); }
    }
  }
  return p.build();
}

// ---- potrero: reses (ternero → vaca → rebaño gordo) sobre yerba con matojos
function cattleParts(stage, seed = 1) {
  const p = new Parts(), r = rng(700 + seed * 7 + stage);
  for (let i = 0; i < 14; i++) {
    const x = (r() - 0.5) * 1.8, z = (r() - 0.5) * 1.8;
    for (let k = 0; k < 4; k++) p.f.cone(0.02, 0.1 + r() * 0.08, 3, worn(P.grassC, r, 0.15), { x: x + (r() - 0.5) * 0.08, z: z + (r() - 0.5) * 0.08, rz: (r() - 0.5) * 0.5, m: 5 });
  }
  // de lado a la cámara (yaw ≈ 45°): el cuerpo va a lo largo de Z en cowGeo
  const herd = [[[0, 0, 1.9, 0.4]], [[-0.25, -0.2, 1.7, 0.6], [0.45, 0.45, 4.6, 0.36]], [[-0.3, -0.35, 1.8, 0.64], [0.35, 0.4, 4.5, 0.62]], [[-0.35, -0.45, 1.7, 0.68], [0.5, 0.0, 4.4, 0.66], [-0.2, 0.55, 2.2, 0.64]]][stage];
  herd.forEach(([x, z, ry, s], i) => p.s.merge(M.place(M.cowGeo((seed + i) % 3), x, z, ry, 0, s)));
  return p.build();
}

// ================================================================ CONSTRUCCIONES
// ---- casa de tabaco: techo de guano en "A" casi hasta el suelo, testeros de tabla, cujes con hojas.
// growth = cura: 0 hojas verdes recién colgadas · 1 hojas curadas color tabaco; también regula cuántas hay.
function tobaccoHouseParts(stage, seed = 1) {
  const p = new Parts(), r = rng(800 + seed);
  const L = 1.55, W = 1.6, H = 1.6, y0 = 0.22, z0 = -0.25; // nave a lo largo de Z, puerta al frente (+z)
  p.s.box(W + 0.1, 0.05, L + 0.1, worn(C.dirt, r, 0.06), { z: z0, m: 7 });
  for (const x of [-W / 2 + 0.06, W / 2 - 0.06]) for (const z of [z0 - L / 2 + 0.06, z0, z0 + L / 2 - 0.06]) p.s.box(0.07, y0 + 0.05, 0.07, P.wood, { x, z, m: 1 });
  // testeros (triángulos de tabla) y puerta
  for (const zz of [z0 - L / 2 + 0.04, z0 + L / 2 - 0.04]) {
    p.s.gable(0.05, W - 0.1, H - 0.08, worn(0x6e5640, r, 0.1), { z: zz, y: y0, ry: Math.PI / 2, m: 1 });
    p.s.box(W - 0.14, y0 + 0.02, 0.05, worn(0x6e5640, r, 0.1), { z: zz, m: 1 });
  }
  const zf = z0 + L / 2 - 0.01;
  for (let i = 0; i < 6; i++) p.s.box(0.025, H * (1 - Math.abs(-0.6 + i * 0.24) / (W / 2)) * 0.9, 0.02, worn(0x8a7058, r, 0.2), { x: -0.6 + i * 0.24, y: y0, z: zf, m: 1 });
  p.s.box(0.42, 0.78, 0.03, 0x241a12, { y: y0 - 0.02, z: zf + 0.02, m: 0 }); // puerta abierta (oscuro)
  p.s.add(part(new THREE.BoxGeometry(0.03, 0.74, 0.4), worn(0x7c6249, r, 0.15), { x: 0.4, y: y0 + 0.35, z: zf + 0.2, ry: 0.3, m: 1 })); // hoja de la puerta
  // techo de guano: dos capas (la de abajo más oscura sobresale) y caballete
  p.s.gable(L + 0.18, W + 0.3, H, worn(P.thatch, r, 0.06), { z: z0, y: y0, ry: Math.PI / 2, m: 2 });
  p.s.gable(L + 0.24, W + 0.42, 0.28, worn(P.thatchDark, r, 0.06), { z: z0, y: y0 - 0.03, ry: Math.PI / 2, m: 2 });
  p.s.cyl(0.045, 0.045, L + 0.24, 6, P.thatchDark, { z: z0, y: y0 + H - 0.02, rx: Math.PI / 2, center: true, m: 2 });
  for (let i = 0; i < 5; i++) p.s.box(0.04, 0.02, 0.14, P.thatchDark, { z: z0 - L / 2 + 0.1 + i * 0.34, y: y0 + H + 0.02, m: 2 }); // amarres del caballete
  // cujes con hojas colgadas: dentro (se ven por la puerta) y en el tendal de afuera
  const cure = stage / 3, leafC = cure < 0.5 ? lerpHex(C.cureGreen, C.cureGold, cure * 2) : lerpHex(C.cureGold, C.cureBrown, (cure - 0.5) * 2);
  const hang = (x0, x1, y, z, n) => {
    p.s.box(x1 - x0 + 0.1, 0.025, 0.025, P.woodLite, { x: (x0 + x1) / 2, y, z, m: 1 });
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
      for (const side of [-1, 1]) p.f.add(part(new THREE.BoxGeometry(0.075, 0.3, 0.01), worn(leafC, r, 0.12), { x: x + side * 0.02, y: y - 0.16, z: z + side * 0.015, rx: side * 0.12, rz: (r() - 0.5) * 0.2, m: 5 }));
    }
  };
  const nIn = 3 + stage * 2;
  hang(-0.55, 0.55, y0 + 0.95, z0 + 0.3, nIn);
  hang(-0.55, 0.55, y0 + 0.95, z0 - 0.15, nIn);
  // tendal afuera
  for (const x of [-0.75, 0.75]) p.s.box(0.05, 0.75, 0.05, P.wood, { x, z: 0.78, m: 1 });
  hang(-0.72, 0.72, 0.72, 0.78, 3 + stage * 2);
  return p.build();
}

// ---- destilería chiquita: nave de ladrillo con zinc, chimenea alta tiznada, alambique de cobre y barriles
function distilleryParts(stage, seed = 1) {
  const p = new Parts(), r = rng(900 + seed);
  p.s.box(FOOT - 0.05, 0.06, FOOT - 0.05, worn(P.stone, r, 0.08), { m: 6 });
  const bx = -0.3, bz = -0.35, BW = 1.25, BD = 1.0, BH = 0.95;
  p.s.box(BW, BH, BD, worn(C.brick, r, 0.08), { x: bx, z: bz, y: 0.06, m: 6 });
  p.s.box(BW + 0.02, 0.1, BD + 0.02, worn(C.lime, r, 0.1), { x: bx, z: bz, y: 0.06, m: 6 }); // zócalo encalado
  p.s.gable(BW + 0.3, BD + 0.3, 0.42, worn(P.tin, r, 0.2), { x: bx, z: bz, y: 0.06 + BH, m: 4 });
  p.s.box(0.4, 0.62, 0.03, 0x3a2a1e, { x: bx - 0.15, z: bz + BD / 2 + 0.01, y: 0.06, m: 1 }); // portón
  p.s.box(0.24, 0.22, 0.03, 0x2c2420, { x: bx + 0.35, z: bz + BD / 2 + 0.01, y: 0.5, m: 0 });
  p.s.box(0.28, 0.04, 0.05, C.lime, { x: bx + 0.35, z: bz + BD / 2 + 0.02, y: 0.48, m: 6 });
  // chimenea de ladrillo con anillos de hierro y boca tiznada
  const cx = 0.62, cz = -0.62, CH = 2.5;
  p.s.box(0.36, 0.3, 0.36, worn(C.brick, r, 0.08), { x: cx, z: cz, y: 0.06, m: 6 });
  p.s.cyl(0.11, 0.15, CH, 8, worn(C.brick, r, 0.06), { x: cx, z: cz, y: 0.3, m: 6 });
  for (const t of [0.35, 0.65, 0.9]) p.s.cyl(0.16 - t * 0.04, 0.16 - t * 0.04, 0.04, 8, C.iron, { x: cx, z: cz, y: 0.3 + CH * t, m: 3 });
  p.s.cyl(0.125, 0.115, 0.22, 8, C.soot, { x: cx, z: cz, y: 0.3 + CH - 0.02, m: 6 });
  // alambique de cobre con cuello de cisne hacia el serpentín (tanque de madera)
  const sx = 0.55, sz = 0.35;
  p.s.box(0.5, 0.18, 0.5, worn(C.brick, r, 0.1), { x: sx, z: sz, y: 0.06, m: 6 }); // hornilla
  p.s.box(0.16, 0.1, 0.03, 0xd8582a, { x: sx, z: sz + 0.26, y: 0.09, m: 0 }); // candela
  p.s.cyl(0.2, 0.22, 0.32, 12, C.copper, { x: sx, z: sz, y: 0.24, m: 0 });
  p.s.add(part(sph(0.2, 12, 8), C.copper, { x: sx, z: sz, y: 0.56, sy: 0.7, m: 0 }));
  p.s.cyl(0.04, 0.07, 0.16, 8, C.copper, { x: sx, z: sz, y: 0.66, m: 0 });
  p.s.add(part(new THREE.CylinderGeometry(0.025, 0.035, 0.5, 6), C.copper, { x: sx + 0.18, z: sz - 0.0, y: 0.78, rz: -1.1, m: 0 }));
  p.s.cyl(0.13, 0.14, 0.38, 10, worn(C.barrel, r, 0.1), { x: sx + 0.42, z: sz + 0.05, y: 0.06, m: 1 });
  p.s.cyl(0.145, 0.145, 0.03, 10, C.iron, { x: sx + 0.42, z: sz + 0.05, y: 0.32, m: 3 });
  // barriles (más con la etapa = producción)
  const nb = [2, 3, 5, 6][stage];
  const spots = [[-0.75, 0.55, 0], [-0.4, 0.55, 0], [-0.05, 0.55, 0], [-0.575, 0.55, 1], [-0.225, 0.55, 1], [-0.4, 0.55, 2]];
  for (let i = 0; i < nb; i++) {
    const [x, z, lv] = spots[i];
    p.s.add(part(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 10), worn(C.barrel, r, 0.1), { x, z, y: 0.06 + 0.15 + lv * 0.27, rz: Math.PI / 2, m: 1 }));
    for (const dx of [-0.13, 0.13]) p.s.add(part(new THREE.CylinderGeometry(0.155, 0.155, 0.03, 10), C.iron, { x: x + dx, z, y: 0.06 + 0.15 + lv * 0.27, rz: Math.PI / 2, m: 3 }));
  }
  return p.build();
}

// ---- bote de pesca (chalana pintada): growth = la pesca que trae a bordo
function hullInto(b, L, B, D, paint, stripe, bottom, r) {
  // casco por secciones: popa de espejo (t=0) y proa en punta (t=1) con arrufo
  const n = 9, ring = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, z = -L / 2 + t * L;
    const w = (B / 2) * (t < 0.55 ? 0.82 + 0.18 * Math.sin((t / 0.55) * Math.PI * 0.5) : Math.cos(((t - 0.55) / 0.45) * Math.PI * 0.5)) + 0.004;
    const top = D + 0.1 * t * t, keel = -0.02 + 0.05 * t * t;
    ring.push([[-w, top, z], [-w * 0.92, D * 0.55, z], [-w * 0.55, keel + 0.03, z], [0, keel, z], [w * 0.55, keel + 0.03, z], [w * 0.92, D * 0.55, z], [w, top, z]]);
  }
  const bands = [[0, 1, paint], [1, 2, bottom], [2, 3, bottom], [3, 4, bottom], [4, 5, bottom], [5, 6, paint]];
  for (const [a, c, col] of bands) {
    const pos = [], inn = [];
    for (let i = 0; i < n; i++) {
      const A = ring[i][a], Bp = ring[i][c], Cp = ring[i + 1][c], Dp = ring[i + 1][a];
      pos.push(...A, ...Dp, ...Cp, ...A, ...Cp, ...Bp);
      inn.push(...A, ...Cp, ...Dp, ...A, ...Bp, ...Cp);
    }
    for (const [arr, cc] of [[inn, col], [pos, 0x8a7a5a]]) { // inn = cara hacia afuera
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.computeVertexNormals();
      const q = part(g, worn(cc, r, 0.06), { m: cc === 0x8a7a5a ? 1 : 3 });
      if (cc === 0x8a7a5a) q.scale(0.97, 1, 0.98); // forro interior un poquito adentro
      b.add(q); g.dispose();
    }
  }
  // espejo de popa y franja
  const w0 = ring[0][6][0];
  b.add(part(new THREE.BoxGeometry(w0 * 2, D, 0.03), paint, { z: -L / 2, y: D / 2, m: 3 }));
  for (const sd of [-1, 1]) for (let i = 0; i < n; i++) {
    const A = ring[i][6], Bp = ring[i + 1][6], len = Math.hypot(Bp[0] - A[0], Bp[2] - A[2]);
    b.add(part(new THREE.BoxGeometry(0.035, 0.035, len + 0.01), stripe, { x: sd * (A[0] + Bp[0]) / 2, y: (A[1] + Bp[1]) / 2 - 0.02, z: (A[2] + Bp[2]) / 2, ry: Math.atan2(sd * (Bp[0] - A[0]), Bp[2] - A[2]), m: 0 })); // borda
  }
}
function boatParts(stage, seed = 1, sea = true) {
  const p = new Parts(), r = rng(1000 + seed);
  const paints = [[C.hullBlue, C.hullRed, C.hullWhite], [C.hullWhite, C.hullBlue, C.hullRed], [C.hullYellow, C.hullBlue, C.hullWhite]][seed % 3];
  const b = new Builder();
  hullInto(b, 1.5, 0.56, 0.24, paints[0], paints[1], paints[2], r);
  b.box(0.46, 0.025, 0.06, P.woodLite, { y: 0.16, z: -0.25, m: 1 }); b.box(0.42, 0.025, 0.06, P.woodLite, { y: 0.16, z: 0.2, m: 1 }); // bancadas
  b.box(0.36, 0.02, 1.0, worn(P.wood, r, 0.1), { y: 0.02, m: 1 }); // plan
  b.cyl(0.022, 0.026, 1.15, 6, P.wood, { y: 0.03, z: 0.25, m: 1 }); // palo
  b.add(part(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 6), 0xf0e6d0, { y: 0.4, z: -0.12, rx: Math.PI / 2 - 0.25, m: 0 })); // vela aferrada a la botavara
  b.add(part(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4), P.woodLite, { y: 0.36, z: -0.12, rx: Math.PI / 2 - 0.25, m: 1 }));
  for (const sd of [-1, 1]) b.add(part(new THREE.BoxGeometry(0.03, 0.025, 0.9), P.woodLite, { x: sd * 0.18, y: 0.2, z: 0.0, ry: sd * 0.1, m: 1 })); // remos
  // pesca a bordo
  const fish = [0, 3, 7, 12][stage];
  for (let i = 0; i < fish; i++) b.add(part(sph(0.05, 6, 4), worn(i % 3 ? 0xb8c8d0 : 0xd87858, r, 0.1), { x: (r() - 0.5) * 0.25, y: 0.07 + (i > 6 ? 0.04 : 0), z: -0.45 + r() * 0.3, sx: 0.6, sy: 0.45, sz: 2.2, ry: (r() - 0.5) * 1.2, m: 0 }));
  if (stage >= 2) b.box(0.26, 0.14, 0.2, worn(P.woodLite, r, 0.1), { y: 0.03, z: 0.45, m: 1 }); // cajón
  const g = b.build(); g.rotateY(1.2); g.translate(0, 0.0, 0); // de lado a la cámara, el casco hundido en el agua
  p.s.merge(g);
  if (sea) seaInto(p, r);
  return p.build();
}
function seaInto(p, r, s = FOOT) {
  p.w.box(s, 0.02, s, C.sea, { y: 0.0, m: 0 });
  for (let i = 0; i < 6; i++) p.w.box(0.3 + r() * 0.3, 0.005, 0.02, 0xd8eef0, { x: (r() - 0.5) * s * 0.8, z: (r() - 0.5) * s * 0.8, y: 0.021, ry: 0.6, m: 0 }); // espuma
}

// ---- muelle: tablones sobre pilotes, bitas, rollo de soga y cajas de pescado (con su agua)
function dockParts(stage, seed = 1, sea = true) {
  const p = new Parts(), r = rng(1100 + seed);
  const y = 0.22;
  for (let i = 0; i < 8; i++) p.s.box(0.24, 0.05, FOOT * 0.98, worn(r() < 0.2 ? P.woodGrey : P.woodLite, r, 0.15), { x: -0.88 + i * 0.25, y, m: 1 });
  for (const z of [-0.85, 0, 0.85]) p.s.box(FOOT * 0.98, 0.06, 0.08, P.wood, { z, y: y - 0.06, m: 1 });
  for (const x of [-0.92, 0.92]) for (const z of [-0.85, 0, 0.85]) {
    p.s.cyl(0.06, 0.07, y + 0.35, 6, worn(P.wood, r, 0.12), { x, z, y: -0.35, m: 1 });
    p.s.cyl(0.072, 0.072, 0.06, 6, 0x4a6a3a, { x, z, y: -0.1, m: 5 }); // lama en el pilote
  }
  for (const z of [-0.6, 0.6]) { p.s.cyl(0.05, 0.06, 0.16, 8, C.iron, { x: 0.86, z, y: y + 0.05, m: 3 }); p.s.cyl(0.075, 0.075, 0.025, 8, C.iron, { x: 0.86, z, y: y + 0.2, m: 3 }); }
  p.s.add(part(new THREE.TorusGeometry(0.11, 0.035, 5, 12), 0xc8b088, { x: 0.55, z: -0.6, y: y + 0.08, rx: Math.PI / 2, m: 2 })); // soga
  p.s.add(part(new THREE.TorusGeometry(0.065, 0.03, 5, 10), 0xc8b088, { x: 0.55, z: -0.6, y: y + 0.13, rx: Math.PI / 2, m: 2 }));
  const nCrates = 1 + stage;
  for (let i = 0; i < nCrates; i++) {
    const x = -0.6 + (i % 2) * 0.36, z = 0.45 + Math.floor(i / 2) * 0.0, lv = Math.floor(i / 2);
    p.s.box(0.32, 0.16, 0.24, worn(0x9b7a50, r, 0.12), { x, z, y: y + 0.03 + lv * 0.17, ry: (r() - 0.5) * 0.2, m: 1 });
    for (let k = 0; k < 3; k++) p.s.add(part(sph(0.045, 6, 4), 0xb8c8d0, { x: x - 0.08 + k * 0.08, z, y: y + 0.19 + lv * 0.17, sz: 0.5, sx: 2, m: 0 }));
  }
  p.s.box(0.05, 0.9, 0.05, P.wood, { x: -0.85, z: -0.85, y, m: 1 }); // farol
  p.s.box(0.12, 0.14, 0.12, 0x3a3a3a, { x: -0.85, z: -0.85, y: y + 0.9, m: 3 });
  p.s.box(0.08, 0.08, 0.08, 0xffd890, { x: -0.85, z: -0.85, y: y + 0.93, m: 0 });
  if (sea) seaInto(p, r);
  return p.build();
}

// ---- redes: tendal de redes a secar (se mecen con el viento), flotadores y mesa de salar pescado
function netsParts(stage, seed = 1) {
  const p = new Parts(), r = rng(1200 + seed);
  p.s.box(FOOT, 0.03, FOOT, worn(0xd8c08a, r, 0.05), { m: 6 }); // arena
  const posts = [-0.85, 0, 0.85], zr = -0.35, top = 1.0;
  for (const x of posts) p.s.cyl(0.03, 0.04, top + 0.05, 6, P.wood, { x, z: zr, m: 1 });
  p.s.box(1.75, 0.015, 0.015, 0xc8b088, { y: top, z: zr, m: 2 });
  // red colgada con comba: rejilla deformada
  const net = new THREE.PlaneGeometry(1.7, 0.8, 16, 8), np = net.attributes.position;
  for (let i = 0; i < np.count; i++) {
    const x = np.getX(i), yy = np.getY(i), t = (0.4 - yy) / 0.8; // 0 arriba → 1 abajo
    const span = Math.sin(Math.PI * ((((x + 0.85) / 0.85) % 1 + 1) % 1)); // comba entre postes
    np.setXYZ(i, x, top - t * 0.8 - span * 0.12 * (1 - t * 0.3), zr + Math.sin(x * 7 + t * 3) * 0.04 * t);
  }
  net.computeVertexNormals();
  p.f.add(part(net, C.net, { m: 0 })); net.dispose();
  for (let i = 0; i < 9; i++) p.s.ico(0.035, C.float, { x: -0.8 + i * 0.2, y: top - 0.03, z: zr + 0.02, m: 0 });
  // red amontonada en la arena con flotadores
  p.s.add(part(sph(0.26, 8, 5), C.net, { x: 0.55, z: 0.45, y: 0.02, sy: 0.35, m: 0 }));
  for (let i = 0; i < 5; i++) p.s.ico(0.04, C.float, { x: 0.45 + r() * 0.25, z: 0.35 + r() * 0.22, y: 0.09, m: 0 });
  // mesa de salar con pescado abierto
  p.s.box(0.8, 0.05, 0.4, worn(P.woodLite, r, 0.12), { x: -0.45, z: 0.5, y: 0.4, m: 1 });
  for (const [x, z] of [[-0.8, 0.35], [-0.1, 0.35], [-0.8, 0.65], [-0.1, 0.65]]) p.s.box(0.04, 0.4, 0.04, P.wood, { x, z, m: 1 });
  const fish = [2, 4, 6, 8][stage];
  for (let i = 0; i < fish; i++) p.s.add(part(sph(0.05, 6, 4), i % 2 ? 0xd8dde0 : 0xe8d8c0, { x: -0.75 + (i % 4) * 0.2, z: 0.42 + Math.floor(i / 4) * 0.16, y: 0.46, sx: 2, sy: 0.3, sz: 0.8, m: 0 }));
  p.s.cyl(0.12, 0.1, 0.22, 8, worn(C.barrel, r, 0.1), { x: 0.05, z: 0.75, m: 1 }); // barril de sal
  p.s.cyl(0.105, 0.105, 0.02, 8, 0xf4f0e8, { x: 0.05, z: 0.75, y: 0.21, m: 0 });
  return p.build();
}

// ---- corral de madera con portón, bebedero de piedra con agua y pesebre con heno
function corralParts(stage, seed = 1) {
  const p = new Parts(), r = rng(1300 + seed);
  p.s.box(FOOT - 0.06, 0.03, FOOT - 0.06, worn(C.dirt, r, 0.06), { m: 7 });
  const e = 0.94, step = 0.47;
  const post = (x, z) => p.s.box(0.08, 0.7 + r() * 0.06, 0.08, worn(P.woodGrey, r, 0.15), { x, z, rz: (r() - 0.5) * 0.06, rx: (r() - 0.5) * 0.06, m: 1 });
  const rails = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0), ry = Math.atan2(-(z1 - z0), x1 - x0);
    for (const y of [0.2, 0.4, 0.6]) if (r() > 0.08) p.s.box(len + 0.04, 0.07, 0.035, worn(r() < 0.25 ? P.woodLite : P.woodGrey, r, 0.18), { x: (x0 + x1) / 2, z: (z0 + z1) / 2, y: y - 0.035 + (r() - 0.5) * 0.03, ry, rz: (r() - 0.5) * 0.05, m: 1 });
  };
  for (let i = 0; i <= 4; i++) { const t = -e + i * step; post(t, -e); post(-e, t); post(e, t); post(t, e); }
  for (let i = 0; i < 4; i++) { const a = -e + i * step, b = a + step; rails(a, -e, b, -e); rails(-e, a, -e, b); rails(e, a, e, b); if (i !== 2) rails(a, e, b, e); }
  // portón abierto (bisagra en x = 0.94-2·0.47)
  const gx = -e + 2 * step;
  for (const y of [0.18, 0.4, 0.6]) p.s.add(part(new THREE.BoxGeometry(0.5, 0.06, 0.03), worn(P.woodLite, r, 0.1), { x: gx + 0.17, z: e + 0.17, y, ry: -0.75, m: 1 }));
  p.s.add(part(new THREE.BoxGeometry(0.62, 0.05, 0.03), P.woodLite, { x: gx + 0.17, z: e + 0.17, y: 0.4, ry: -0.75, rz: 0.65, order: 'YXZ', m: 1 }));
  // bebedero
  p.s.box(0.9, 0.24, 0.3, worn(P.stone, r, 0.1), { x: 0.3, z: -0.62, m: 6 });
  p.w.box(0.8, 0.02, 0.2, 0x4f8fa8, { x: 0.3, z: -0.62, y: 0.2, m: 0 });
  // pesebre con heno
  p.s.box(0.5, 0.3, 0.32, worn(P.wood, r, 0.1), { x: -0.55, z: -0.6, m: 1 });
  p.s.add(part(sph(0.26, 8, 5), worn(C.hay, r, 0.08), { x: -0.55, z: -0.6, y: 0.3, sy: 0.4, sz: 0.6, m: 2 }));
  // paca de heno según la etapa (lo que hay guardado)
  for (let i = 0; i < stage; i++) p.s.box(0.36, 0.22, 0.24, worn(C.hay, r, 0.08), { x: -0.6 + i * 0.4, z: 0.55, ry: (r() - 0.5) * 0.3, m: 2 });
  return p.build();
}

// ---- bohío: paredes de tabla de palma, techo de guano en capas con caballete, portal con horcones y taburete
function bohioParts(stage, seed = 1) {
  const p = new Parts(), r = rng(1400 + seed);
  const W = 1.55, D = 1.05, WH = 0.9, z0 = -0.2;
  p.s.box(W + 0.35, 0.06, D + 0.55, worn(C.dirt, r, 0.06), { z: z0 + 0.15, m: 7 }); // piso de tierra apisonada
  p.s.box(W, WH, D, worn(0x9a8468, r, 0.08), { z: z0, y: 0.06, m: 1 });
  for (let i = 0; i < 9; i++) p.s.box(0.15, WH - 0.04, 0.02, worn(r() < 0.3 ? 0x9a8468 : 0x7c6249, r, 0.2), { x: -W / 2 + 0.1 + i * 0.17, y: 0.08, z: z0 + D / 2 + 0.005, m: 1 });
  p.s.box(0.34, 0.6, 0.03, 0x2a2018, { x: -0.3, y: 0.06, z: z0 + D / 2 + 0.02, m: 0 }); // puerta
  p.s.add(part(new THREE.BoxGeometry(0.03, 0.58, 0.32), worn(C.shutterBlue, r, 0.1), { x: -0.47, y: 0.36, z: z0 + D / 2 + 0.17, ry: 0.3, m: 3 }));
  p.s.box(0.3, 0.24, 0.03, 0x2a2018, { x: 0.38, y: 0.38, z: z0 + D / 2 + 0.02, m: 0 }); // ventana
  for (const sd of [-1, 1]) p.s.box(0.15, 0.24, 0.025, worn(C.shutterBlue, r, 0.1), { x: 0.38 + sd * 0.23, y: 0.38, z: z0 + D / 2 + 0.03, m: 3 });
  // testeros
  for (const xx of [-W / 2, W / 2]) p.s.gable(0.04, D, 0.55, worn(0x7c6249, r, 0.1), { x: xx, y: 0.06 + WH, z: z0, m: 1 });
  // techo de guano: tres capas escalonadas que sobresalen (alero) y se extienden sobre el portal
  const ry0 = 0.06 + WH - 0.04, RD = D + 0.78, RH = 0.82, zr = z0 + 0.14;
  p.s.gable(W + 0.36, RD, RH, worn(P.thatch, r, 0.06), { y: ry0, z: zr, m: 2 });
  p.s.gable(W + 0.42, RD + 0.08, 0.22, worn(P.thatchDark, r, 0.05), { y: ry0 - 0.04, z: zr, m: 2 }); // alero grueso
  p.s.gable(W + 0.38, RD * 0.62, RH * 0.62, worn(lerpHex(P.thatch, P.thatchDark, 0.3), r, 0.05), { y: ry0 + RH * 0.4, z: zr, m: 2 });
  p.s.cyl(0.05, 0.05, W + 0.42, 6, P.thatchDark, { y: ry0 + RH + 0.01, z: zr, rz: Math.PI / 2, center: true, m: 2 }); // caballete
  for (let i = 0; i < 5; i++) p.s.box(0.035, 0.03, 0.2, P.thatchDark, { x: -W / 2 + 0.05 + i * (W / 4), y: ry0 + RH + 0.02, z: zr, m: 2 }); // horquetas
  // portal: horcones y taburete
  for (const x of [-W / 2 - 0.05, W / 2 + 0.05]) p.s.cyl(0.035, 0.04, WH - 0.05, 6, worn(P.wood, r, 0.1), { x, z: z0 + D / 2 + 0.42, y: 0.06, m: 1 });
  p.s.box(0.2, 0.03, 0.2, 0x8a6a3a, { x: 0.7, y: 0.26, z: z0 + D / 2 + 0.25, m: 2 });
  for (const [x, z] of [[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]]) p.s.box(0.025, 0.24, 0.025, P.wood, { x: 0.7 + x, z: z0 + D / 2 + 0.25 + z, y: 0.03, m: 1 });
  p.s.box(0.2, 0.22, 0.025, 0x8a6a3a, { x: 0.7, y: 0.28, z: z0 + D / 2 + 0.16, rx: -0.15, m: 2 });
  // tinaja
  p.s.add(part(sph(0.12, 8, 6), worn(P.clay, r, 0.1), { x: -0.88, z: z0 + D / 2 + 0.2, y: 0.17, sy: 1.2, m: 6 }));
  return p.build();
}

// ---- almacén: zócalo de tabla, paredes de zinc, techo a dos aguas con alero, portón y andén con sacos.
// growth (etapa) = cuánto hay guardado en el andén.
function almacenParts(stage, seed = 1) {
  const p = new Parts(), r = rng(1500 + seed);
  const W = 1.75, D = 1.2, H = 0.95, z0 = -0.3;
  p.s.box(W + 0.1, 0.14, D + 0.1, worn(P.stone, r, 0.08), { z: z0, m: 6 });
  p.s.box(W, 0.38, D, worn(P.woodGrey, r, 0.1), { z: z0, y: 0.14, m: 1 });
  p.s.box(W - 0.01, H - 0.38, D - 0.01, worn(P.tin, r, 0.15), { z: z0, y: 0.52, m: 4 });
  for (const xx of [-W / 2, W / 2]) p.s.gable(0.03, D, 0.42, worn(P.tin, r, 0.15), { x: xx, y: 0.14 + H, z: z0, m: 4 });
  p.s.gable(W + 0.25, D + 0.35, 0.44, worn(P.tin, r, 0.22), { y: 0.14 + H - 0.02, z: z0, m: 4 });
  // portón corredizo de dos hojas, entreabierto
  const zf = z0 + D / 2 + 0.01;
  p.s.box(0.9, 0.82, 0.02, 0x2a241e, { y: 0.14, z: zf, m: 0 });
  for (const [x, sd] of [[-0.32, -1], [0.42, 1]]) {
    p.s.box(0.45, 0.82, 0.03, worn(C.doorGreen, r, 0.12), { x, y: 0.14, z: zf + 0.02, m: 3 });
    p.s.box(0.45, 0.04, 0.035, worn(C.doorGreen, r, 0.2), { x, y: 0.5, z: zf + 0.03, rz: sd * 0.6, m: 3 }); // travesaño en Z
  }
  p.s.box(1.1, 0.03, 0.04, C.iron, { y: 0.98, z: zf + 0.03, m: 3 }); // riel
  // andén de carga con sacos y cajas
  p.s.box(W, 0.16, 0.5, worn(0xb8b0a0, r, 0.08), { z: zf + 0.27, m: 6 });
  const n = [1, 3, 5, 7][stage];
  for (let i = 0; i < n; i++) {
    const x = -0.75 + (i % 4) * 0.2 + (i >= 4 ? 0.1 : 0), y = 0.16 + (i >= 4 ? 0.13 : 0);
    p.s.add(part(new THREE.CapsuleGeometry(0.07, 0.12, 3, 6), worn(C.jute, r, 0.1), { x, y: y + 0.07, z: zf + 0.27, rz: Math.PI / 2, ry: (r() - 0.5) * 0.4, sy: 0.9, sz: 1.2, m: 2 }));
  }
  if (stage >= 2) for (let i = 0; i < stage - 1; i++) p.s.merge(M.place(M.crateGeo(i % 2), 0.6 - i * 0.02, zf + 0.27, 0.2, 0.16 + i * 0.25, 0.55));
  // letrero
  p.s.box(0.62, 0.16, 0.03, worn(P.cream, r, 0.1), { y: 0.14 + H - 0.05, z: zf + 0.02, m: 1 });
  p.s.box(0.46, 0.04, 0.035, C.hullRed, { y: 0.14 + H + 0.01, z: zf + 0.03, m: 0 });
  return p.build();
}

// ---- cerca rústica (a lo largo de X, centrada, length en unidades); style: 'rail' tablas · 'wire' alambre de púas
function fenceParts(length = FOOT, seed = 1, style = 'rail') {
  const p = new Parts(), r = rng(1600 + seed);
  const n = Math.max(1, Math.round(length / 0.5)), step = length / n;
  for (let i = 0; i <= n; i++) {
    const x = -length / 2 + i * step;
    if (style === 'wire') p.s.cyl(0.03, 0.035, 0.6 + r() * 0.1, 5, worn(0x7d6c58, r, 0.2), { x, rz: (r() - 0.5) * 0.12, rx: (r() - 0.5) * 0.1, m: 1 });
    else p.s.box(0.08, 0.66 + r() * 0.06, 0.08, worn(P.woodGrey, r, 0.15), { x, rz: (r() - 0.5) * 0.06, m: 1 });
  }
  if (style === 'wire') for (const y of [0.2, 0.36, 0.52]) p.s.box(length, 0.012, 0.012, 0x8c8a86, { y, m: 3 });
  else for (let i = 0; i < n; i++) for (const y of [0.2, 0.46]) { if (r() < 0.07) continue; p.s.box(step + 0.06, 0.08, 0.035, worn(r() < 0.2 ? P.woodLite : P.woodGrey, r, 0.18), { x: -length / 2 + (i + 0.5) * step, y, z: 0.05, rz: (r() - 0.5) * 0.06, m: 1 }); }
  return p.build();
}

// ---- palma real (la de models.js, a escala del lote)
function palmParts(height = 3.4, seed = 1) {
  const p = new Parts(), s = height / 5.2;
  const g = M.palmGeo(seed, 4.2); g.scale(s, s, s); p.f.merge(g); // en follaje: la copa se mece con el viento
  return p.build();
}

// ================================================================ registro, materiales, caché
// kind → { crop: tiene etapas de crecimiento, fn(stage, seed, opts) → capas }
export const KINDS = {
  rice: { crop: true, fn: (st, sd) => riceParts(st, sd), label: 'Arrozal' },
  coffee: { crop: true, fn: (st, sd) => coffeeParts(st, sd), label: 'Cafetal en terrazas' },
  cacao: { crop: true, fn: (st, sd) => cacaoParts(st, sd), label: 'Cacaotal' },
  tobacco: { crop: true, fn: (st, sd) => tobaccoParts(st, sd), label: 'Vega de tabaco' },
  citrus: { crop: true, fn: (st, sd) => citrusParts(st, sd), label: 'Naranjal' },
  cane: { crop: true, fn: (st, sd) => caneParts(st, sd), label: 'Cañaveral' },
  cattle: { crop: true, fn: (st, sd) => cattleParts(st, sd), label: 'Potrero con reses' },
  boat: { crop: true, fn: (st, sd, o) => boatParts(st, sd, o.sea !== false), label: 'Bote de pesca' },
  tobaccoHouse: { crop: true, fn: (st, sd) => tobaccoHouseParts(st, sd), label: 'Casa de tabaco' },
  distillery: { crop: true, fn: (st, sd) => distilleryParts(st, sd), label: 'Destilería de ron' },
  dock: { crop: true, fn: (st, sd, o) => dockParts(st, sd, o.sea !== false), label: 'Muelle' },
  nets: { crop: true, fn: (st, sd) => netsParts(st, sd), label: 'Redes y salador' },
  corral: { crop: true, fn: (st, sd) => corralParts(st, sd), label: 'Corral de madera' },
  bohio: { crop: false, fn: (st, sd) => bohioParts(st, sd), label: 'Bohío de guano' },
  almacen: { crop: true, fn: (st, sd) => almacenParts(st, sd), label: 'Almacén' },
  fence: { crop: false, fn: (st, sd, o) => fenceParts(o.length ?? FOOT, sd, o.style || 'rail'), label: 'Cerca' },
  palm: { crop: false, fn: (st, sd, o) => palmParts(o.height ?? 3.4, sd), label: 'Palma real' },
};
// tipo de finca (regional-data.js TYPES) → modelos del kit: crop = lo sembrado en el lote, build = construcción por id
export const TYPE_KIT = {
  arroz: { crop: 'rice', build: { casa: 'bohio', almacen: 'almacen' } },
  cafe: { crop: 'coffee', build: { casa: 'bohio', almacen: 'almacen' } },
  cacao: { crop: 'cacao', build: { casa: 'bohio', almacen: 'almacen' } },
  tabaco: { crop: 'tobacco', build: { casa: 'bohio', casatabaco: 'tobaccoHouse', almacen: 'almacen' } },
  citricos: { crop: 'citrus', build: { casa: 'bohio', almacen: 'almacen' } },
  ganado: { crop: 'cattle', build: { casa: 'bohio', corral: 'corral', almacen: 'almacen' } },
  pesca: { crop: 'boat', build: { casa: 'bohio', muelle: 'dock', salador: 'nets', almacen: 'almacen' } },
  ron: { crop: 'cane', build: { casa: 'bohio', destileria: 'distillery', almacen: 'almacen' } },
  cana: { crop: 'cane', build: { casa: 'bohio', almacen: 'almacen' } },
};

let MATS = null;
// Materiales compartidos por todo el kit (los mismos parches de shaders.js que la finca principal).
export function kitMaterials() {
  if (MATS) return MATS;
  const std = (o = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0, ...o });
  MATS = {
    solid: patchMaterial(std()),
    foliage: patchMaterial(std({ side: THREE.DoubleSide, roughness: 0.75 }), { sway: 0.012 }),
    water: std({ roughness: 0.18, metalness: 0.05, transparent: true, opacity: 0.86, depthWrite: false }),
  };
  return MATS;
}
const LAYERS = [['solid', 'solid'], ['fol', 'foliage'], ['water', 'water']];
const CACHE = new Map();
const optKey = (o) => `${o.sea === false ? 0 : 1}|${o.length ?? ''}|${o.style ?? ''}|${o.height ?? ''}`;
// Capas de geometría compartidas (caché) de un modelo: { solid, fol, water } (BufferGeometry o null).
// No las liberes tú: las suelta disposeKit().
export function kitGeometry(kind, { growth = 1, stage, seed = 1, ...o } = {}) {
  const K = KINDS[kind];
  if (!K) throw new Error(`regional-kit: modelo desconocido «${kind}»`);
  const st = K.crop ? (stage ?? stageOf(growth)) : 0;
  const k = `${kind}|${st}|${seed}|${optKey(o)}`;
  let g = CACHE.get(k);
  if (!g) { g = K.fn(st, seed, o); CACHE.set(k, g); }
  return g;
}

// Un modelo como THREE.Group (≤3 mallas). opts: { growth 0..1 | stage 0..3, seed, size (escala, 1 = lote de 2.0),
// sea (pesca/muelle con agua debajo), length/style (cerca), height (palma), shadows }.
// Devuelve el grupo con setGrowth(g) y dispose() (lo saca de la escena; la geometría sigue en la caché compartida).
export function createModel(kind, opts = {}) {
  const mats = kitMaterials(), grp = new THREE.Group();
  grp.name = `kit:${kind}`;
  const { size = 1, shadows = true } = opts;
  grp.scale.setScalar(size);
  let cur = { ...opts };
  const meshes = {};
  const apply = () => {
    const g = kitGeometry(kind, cur);
    for (const [layer, mat] of LAYERS) {
      const geo = g[layer];
      if (!geo) { if (meshes[layer]) meshes[layer].visible = false; continue; }
      let m = meshes[layer];
      if (!m) { m = meshes[layer] = new THREE.Mesh(geo, mats[mat]); m.castShadow = shadows && layer !== 'water'; m.receiveShadow = shadows; grp.add(m); }
      m.geometry = geo; m.visible = true;
    }
  };
  apply();
  grp.userData.kind = kind;
  grp.setGrowth = (growth) => { cur = { ...cur, growth, stage: undefined }; apply(); return grp; };
  grp.setStage = (stage) => { cur = { ...cur, stage }; apply(); return grp; };
  grp.dispose = () => { grp.removeFromParent(); grp.clear(); };
  return grp;
}
// Fábricas con nombre (todas devuelven THREE.Group; ver createModel para opts).
export const createRicePaddy = (o) => createModel('rice', o);
export const createCoffeeTerrace = (o) => createModel('coffee', o);
export const createCacaoGrove = (o) => createModel('cacao', o);
export const createTobaccoField = (o) => createModel('tobacco', o);
export const createTobaccoHouse = (o) => createModel('tobaccoHouse', o); // growth = cura de las hojas colgadas
export const createCitrusGrove = (o) => createModel('citrus', o);
export const createCaneField = (o) => createModel('cane', o);
export const createCattle = (o) => createModel('cattle', o); // growth = rebaño (ternero → 3 reses)
export const createCorral = (o) => createModel('corral', o); // growth = pacas de heno
export const createFishingBoat = (o) => createModel('boat', o); // growth = pesca a bordo
export const createDock = (o) => createModel('dock', o); // growth = cajas de pescado
export const createNets = (o) => createModel('nets', o); // growth = pescado en la mesa de salar
export const createDistillery = (o) => createModel('distillery', o); // growth = barriles
export const createBohio = (o) => createModel('bohio', o);
export const createAlmacen = (o) => createModel('almacen', o); // growth = sacos en el andén
export const createFence = (o) => createModel('fence', o); // { length, style: 'rail'|'wire' }
export const createPalm = (o) => createModel('palm', o); // { height }

// N copias de un modelo con instancing: un THREE.Group con ≤3 InstancedMesh (3 llamadas de dibujo en total).
// inst.setAt(i, x, z, ry = 0, s = 1, y = 0) · inst.count = n (cuántas se dibujan) · inst.dispose() libera las instancias.
export function createInstanced(kind, max, opts = {}) {
  const mats = kitMaterials(), g = kitGeometry(kind, opts), grp = new THREE.Group();
  grp.name = `kit:${kind}:inst`;
  const list = [];
  for (const [layer, mat] of LAYERS) {
    if (!g[layer]) continue;
    const m = new THREE.InstancedMesh(g[layer], mats[mat], max);
    m.castShadow = opts.shadows !== false && layer !== 'water'; m.receiveShadow = opts.shadows !== false;
    m.frustumCulled = false; m.count = 0; grp.add(m); list.push(m);
  }
  const tm = new THREE.Matrix4(), tq = new THREE.Quaternion(), te = new THREE.Euler(), tv = new THREE.Vector3(), ts = new THREE.Vector3();
  const s0 = opts.size ?? 1;
  grp.setAt = (i, x, z, ry = 0, s = 1, y = 0) => {
    tm.compose(tv.set(x, y, z), tq.setFromEuler(te.set(0, ry, 0)), ts.setScalar(s * s0));
    for (const m of list) { m.setMatrixAt(i, tm); m.instanceMatrix.needsUpdate = true; if (i >= m.count) m.count = i + 1; }
    return grp;
  };
  Object.defineProperty(grp, 'count', { get: () => (list[0] ? list[0].count : 0), set: (n) => { for (const m of list) m.count = Math.min(n, max); } });
  grp.meshes = list;
  grp.dispose = () => { grp.removeFromParent(); for (const m of list) m.dispose(); grp.clear(); };
  return grp;
}

// Libera TODO lo compartido del kit (geometrías en caché y materiales). Llamar al salir de la escena regional.
export function disposeKit() {
  for (const g of CACHE.values()) for (const k of ['solid', 'fol', 'water']) g[k]?.dispose();
  CACHE.clear();
  if (MATS) { for (const m of Object.values(MATS)) m.dispose(); MATS = null; }
}
// Para pruebas: cuántas geometrías hay en caché.
export const kitCacheSize = () => CACHE.size;
