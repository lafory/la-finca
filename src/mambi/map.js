// Mapa low-poly de Cuba y escena corta de batalla. Reutilizan el WebGLRenderer del juego: mientras están abiertos,
// la finca no se dibuja (la simulación sigue). Terreno = 1 malla facetada; ciudades = 1 malla fusionada + banderas.
import * as THREE from 'three';
import * as M from '../models.js';
import { oxcartGeo } from '../central/models.js';
import { CUBA, PINOS, SIERRAS, PROVINCES, provinceAt, CITIES, K, toMap, UNITS } from './data.js';

const CELL = 0.9;
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpE = new THREE.Euler();
const setI = (mesh, i, x, y, z, ry = 0, s = 1) => { tmpQ.setFromEuler(tmpE.set(0, ry, 0)); tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.set(s, s, s)); mesh.setMatrixAt(i, tmpM); };
const std = (o = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, ...o });

function inPoly(poly, x, z) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
function hash(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }

// Bandera gris lisa (el Régimen, sin insignias)
function grayFlagGeo() {
  const g = M.part(new THREE.PlaneGeometry(0.9, 0.45, 6, 3).translate(0.45, 0, 0), 0x8a8d90);
  return g;
}
function cubanFlagGeo() { return M.flagGeo(); }

export class MambiScenes {
  constructor(game) {
    this.g = game;
    this.mode = null; // 'map' | 'battle'
    this.built = false;
    this.cam = new THREE.PerspectiveCamera(38, 1, 0.5, 400);
    this.view = { x: 0, z: 0, dist: 60 };
    this.goal = { x: 0, z: 0, dist: 60 };
    this.time = 0;
  }
  get renderer() { return this.g.world.renderer; }
  // ------------------------------------------------------------------ mapa
  buildMap() {
    const scene = (this.map = new THREE.Scene());
    scene.background = new THREE.Color(0x9fd0d8);
    scene.fog = new THREE.Fog(0x9fd0d8, 90, 230);
    scene.add(new THREE.HemisphereLight(0xfff1d6, 0x3b6a6a, 1.4));
    const sun = new THREE.DirectionalLight(0xffe2b0, 2.0); sun.position.set(-30, 60, 40); scene.add(sun);
    // mar con degradado (más hondo lejos de la costa) y olas facetadas
    const sea = new THREE.PlaneGeometry(320, 200, 48, 30).toNonIndexed();
    sea.rotateX(-Math.PI / 2);
    const sp = sea.attributes.position, sc = new Float32Array(sp.count * 3), deep = new THREE.Color(0x1f6f8f), shallow = new THREE.Color(0x48b0b8), c = new THREE.Color();
    for (let i = 0; i < sp.count; i++) { sp.setY(i, (hash(sp.getX(i), sp.getZ(i)) - 0.5) * 0.25); }
    for (let t = 0; t < sp.count; t += 3) {
      const x = (sp.getX(t) + sp.getX(t + 1) + sp.getX(t + 2)) / 3, z = (sp.getZ(t) + sp.getZ(t + 1) + sp.getZ(t + 2)) / 3;
      const d = Math.min(1, Math.abs(z - (x * -0.06)) / 45 + hash(x, z) * 0.12);
      c.copy(shallow).lerp(deep, d);
      for (let k = 0; k < 3; k++) sc.set([c.r, c.g, c.b], (t + k) * 3);
    }
    sea.setAttribute('color', new THREE.BufferAttribute(sc, 3));
    sea.computeVertexNormals();
    this.sea = new THREE.Mesh(sea, std({ flatShading: true, roughness: 0.55 }));
    this.sea.position.y = -0.1;
    scene.add(this.sea);
    const poly = CUBA.map(([lo, la]) => toMap(lo, la));
    const pinos = PINOS.map(([lo, la]) => toMap(lo, la));
    // base arenosa extruida (la costa)
    const sand = (pts, h) => {
      const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false });
      g.rotateX(-Math.PI / 2);
      return M.part(g, 0xdcc48e);
    };
    scene.add(new THREE.Mesh(sand(poly, 0.42), std()));
    scene.add(new THREE.Mesh(sand(pinos, 0.38), std()));
    // relieve facetado por celdas
    const xs = poly.map((p) => p[0]), zs = poly.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
    const height = (x, z) => {
      let h = 0.5 + hash(x * 0.7, z * 0.7) * 0.12;
      const lon = x / K - 79.5, lat = -z / K + 21.6;
      for (const [slo, sla, r, a] of SIERRAS) { const d2 = ((lon - slo) ** 2 + (lat - sla) ** 2) / (r * r); h += a * Math.exp(-d2 * 1.6); }
      return h;
    };
    const pos = [], faces = [];
    const inside = (x, z) => inPoly(poly, x, z) || inPoly(pinos, x, z);
    for (let z = z0; z < z1; z += CELL) for (let x = x0; x < x1; x += CELL) {
      const a = [x, z], b = [x + CELL, z], cc = [x + CELL, z + CELL], d = [x, z + CELL];
      if (![a, b, cc, d].every(([px, pz]) => inside(px, pz))) continue;
      const H = (p) => [p[0], height(p[0], p[1]), p[1]];
      const A = H(a), B = H(b), C = H(cc), D = H(d);
      const flip = hash(x, z) > 0.5;
      const tris = flip ? [[A, D, B], [B, D, C]] : [[A, D, C], [A, C, B]];
      for (const t of tris) { pos.push(...t[0], ...t[1], ...t[2]); faces.push({ x: x + CELL / 2, z: z + CELL / 2, h: (t[0][1] + t[1][1] + t[2][1]) / 3, r: hash(x + t[0][0], z) }); }
    }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    tg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.length), 3));
    tg.computeVertexNormals();
    this.faces = faces;
    this.terrain = new THREE.Mesh(tg, std({ flatShading: true }));
    scene.add(this.terrain);
    this.height = height;
    // palmas (instanciadas)
    const palm = new M.Builder();
    palm.cyl(0.05, 0.08, 1.1, 5, 0x9a8466);
    palm.cone(0.45, 0.35, 6, 0x4f7a32, { y: 1.0 });
    const pg = palm.build();
    const spots = [];
    for (let i = 0; i < 900 && spots.length < 380; i++) {
      const x = x0 + hash(i, 1.7) * (x1 - x0), z = z0 + hash(i, 9.1) * (z1 - z0);
      if (inside(x, z) && height(x, z) < 1.2) spots.push([x, z]);
    }
    const palms = new THREE.InstancedMesh(pg, std(), spots.length);
    spots.forEach(([x, z], i) => setI(palms, i, x, height(x, z) - 0.05, z, hash(x, z) * 6, 0.5 + hash(z, x) * 0.4));
    scene.add(palms);
    // ciudades: casitas fusionadas + banderas
    const town = new M.Builder();
    this.cityPos = {};
    for (const cty of CITIES) {
      const [x, z] = toMap(cty.lon, cty.lat), y = height(x, z);
      this.cityPos[cty.id] = new THREE.Vector3(x, y, z);
      const r = M.rng(cty.name.length * 7);
      const n = cty.id === 'habana' ? 9 : cty.id === 'santiago' || cty.id === 'camaguey' ? 7 : 5;
      for (let i = 0; i < n; i++) {
        const a = r() * 6.28, d = 0.25 + r() * 0.75, w = 0.32 + r() * 0.25, h = 0.25 + r() * 0.3;
        const col = [0xe9dcc0, 0xd9a07a, 0xc8d0b0, 0xe8c87a, 0xb8cfd8][Math.floor(r() * 5)];
        town.box(w, h, w, col, { x: x + Math.cos(a) * d, y: y - 0.05, z: z + Math.sin(a) * d, ry: r() * 3 });
        town.add(M.part(new THREE.ConeGeometry(w * 0.78, 0.2, 4), 0xa8502e, { x: x + Math.cos(a) * d, y: y - 0.05 + h + 0.1, z: z + Math.sin(a) * d, ry: Math.PI / 4 }));
      }
      town.box(0.32, 0.8, 0.32, 0xf0e8d8, { x, y: y - 0.05, z: z - 0.1 }); // torre de la iglesia
      town.add(M.part(new THREE.ConeGeometry(0.24, 0.35, 4), 0xa8502e, { x, y: y + 0.92, z: z - 0.1, ry: Math.PI / 4 }));
    }
    scene.add(new THREE.Mesh(town.build(), std()));
    // banderas: una cubana y una gris por ciudad; se muestra la que toca
    const fc = cubanFlagGeo(), fgray = grayFlagGeo(), pole = M.flagPoleGeo(1.4);
    this.flags = {};
    const fm = std({ side: THREE.DoubleSide });
    for (const cty of CITIES) {
      const p = this.cityPos[cty.id];
      const grp = new THREE.Group(); grp.position.set(p.x + 0.45, p.y - 0.05, p.z + 0.2);
      grp.add(new THREE.Mesh(pole, fm));
      const cu = new THREE.Mesh(fc, fm); cu.position.y = 1.2; cu.scale.setScalar(0.9);
      const gr = new THREE.Mesh(fgray, fm); gr.position.y = 1.2; gr.scale.setScalar(0.9);
      grp.add(cu, gr);
      scene.add(grp);
      this.flags[cty.id] = { grp, cu, gr };
    }
    // anillo que marca la próxima ciudad
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.09, 6, 24), new THREE.MeshBasicMaterial({ color: 0xffd25a }));
    this.ring.rotation.x = Math.PI / 2;
    scene.add(this.ring);
    this.recolor();
  }
  recolor() {
    const freed = new Set(this.g.sim.mb().freed);
    const freeProv = new Set(CITIES.filter((c) => freed.has(c.id)).map((c) => provinceAt(c.lon).id));
    const col = this.terrain.geometry.attributes.color, c = new THREE.Color(), rock = new THREE.Color(0x9a7a52), lib = new THREE.Color(0x6fae48);
    this.faces.forEach((f, i) => {
      const lon = f.x / K - 79.5, pv = provinceAt(lon);
      c.set(pv.tint);
      if (freeProv.has(pv.id)) c.lerp(lib, 0.45);
      else c.offsetHSL(0, -0.12, -0.02);
      if (f.h > 1.2) c.lerp(rock, Math.min(0.8, (f.h - 1.2) * 0.55));
      c.offsetHSL(0, 0, (f.r - 0.5) * 0.06);
      for (let k = 0; k < 3; k++) col.setXYZ(i * 3 + k, c.r, c.g, c.b);
    });
    col.needsUpdate = true;
    for (const cty of CITIES) { const F = this.flags[cty.id]; F.cu.visible = freed.has(cty.id); F.gr.visible = !freed.has(cty.id); }
    const nx = this.g.sim.mbNext();
    this.ring.visible = !!nx;
    if (nx) { const p = this.cityPos[nx.id]; this.ring.position.set(p.x, p.y + 0.05, p.z); }
  }
  ensure() { if (!this.built) { this.buildMap(); this.built = true; } }
  focus(id, dist) {
    const p = this.cityPos?.[id];
    if (!p) return;
    this.goal.x = p.x; this.goal.z = p.z; if (dist) this.goal.dist = dist;
  }
  pan(dx, dz) { this.goal.x = Math.max(-58, Math.min(56, this.goal.x + dx)); this.goal.z = Math.max(-20, Math.min(22, this.goal.z + dz)); }
  zoom(f) { this.goal.dist = Math.max(14, Math.min(130, this.goal.dist * f)); }
  fitAll() { this.goal.x = 0; this.goal.z = 1; const asp = this.aspect || 1; this.goal.dist = Math.min(130, Math.max(40, 125 / Math.max(0.5, asp))); }
  placeCam(dt) {
    const v = this.view, gl = this.goal, k = 1 - Math.exp(-dt * 6);
    v.x += (gl.x - v.x) * k; v.z += (gl.z - v.z) * k; v.dist += (gl.dist - v.dist) * k;
    const size = new THREE.Vector2(); this.renderer.getSize(size);
    this.aspect = size.x / Math.max(1, size.y);
    this.cam.aspect = this.aspect; this.cam.updateProjectionMatrix();
    this.cam.position.set(v.x, v.dist * 0.82, v.z + v.dist * 0.58);
    this.cam.lookAt(v.x, 0, v.z);
  }
  project(p) {
    tmpV.copy(p).project(this.cam);
    const size = new THREE.Vector2(); this.renderer.getSize(size);
    return { x: (tmpV.x * 0.5 + 0.5) * size.x, y: (-tmpV.y * 0.5 + 0.5) * size.y, vis: tmpV.z < 1 };
  }
  renderMap(dt, time) {
    this.ensure();
    this.placeCam(dt);
    for (const F of Object.values(this.flags)) { F.cu.rotation.y = Math.sin(time * 2 + F.grp.position.x) * 0.25; F.gr.rotation.y = F.cu.rotation.y; }
    this.ring.scale.setScalar(1 + Math.sin(time * 3) * 0.08);
    this.sea.position.y = -0.1 + Math.sin(time * 0.8) * 0.03;
    this.renderer.render(this.map, this.cam);
  }

  // ------------------------------------------------------------------ batalla
  buildBattle() {
    const scene = (this.bScene = new THREE.Scene());
    scene.background = new THREE.Color(0xe9c99a);
    scene.fog = new THREE.Fog(0xe9c99a, 28, 70);
    scene.add(new THREE.HemisphereLight(0xfff0d0, 0x6a5a3a, 1.5));
    const sun = new THREE.DirectionalLight(0xffd9a0, 2.0); sun.position.set(-10, 20, 12); scene.add(sun);
    const gg = new THREE.PlaneGeometry(90, 50, 30, 16).toNonIndexed(); gg.rotateX(-Math.PI / 2);
    const gp = gg.attributes.position, gc = new Float32Array(gp.count * 3), c = new THREE.Color();
    for (let i = 0; i < gp.count; i++) gp.setY(i, (hash(gp.getX(i), gp.getZ(i)) - 0.5) * 0.3);
    for (let t = 0; t < gp.count; t += 3) { c.set(hash(gp.getX(t), gp.getZ(t)) > 0.7 ? 0x9aa458 : 0x86983f); c.offsetHSL(0, 0, (hash(t, 3) - 0.5) * 0.08); for (let k = 0; k < 3; k++) gc.set([c.r, c.g, c.b], (t + k) * 3); }
    gg.setAttribute('color', new THREE.BufferAttribute(gc, 3)); gg.computeVertexNormals();
    scene.add(new THREE.Mesh(gg, std({ flatShading: true })));
    // camino de tierra y palmas
    const deco = new M.Builder();
    deco.box(40, 0.04, 3, 0xc9a477, { x: 2, y: 0.05 });
    const r = M.rng(5);
    for (let i = 0; i < 16; i++) { const x = -26 + r() * 48, z = r() > 0.3 ? -(6 + r() * 10) : 9 + r() * 4; deco.merge(M.place(M.palmGeo(i + 1, 3 + r() * 1.5), x, z, r() * 6)); }
    // fortín del Régimen: muros grises, torre y puerta
    const F = { x: 12 };
    deco.box(6, 1.6, 0.5, 0x9a9a94, { x: F.x, z: -3 }); deco.box(6, 1.6, 0.5, 0x9a9a94, { x: F.x, z: 3 });
    deco.box(0.5, 1.6, 6.5, 0x8e8e88, { x: F.x + 3 }); deco.box(0.5, 1.6, 2.2, 0x8e8e88, { x: F.x - 3, z: -2.1 }); deco.box(0.5, 1.6, 2.2, 0x8e8e88, { x: F.x - 3, z: 2.1 });
    deco.box(2, 3.2, 2, 0xa4a49c, { x: F.x + 1.5, z: 0 }); deco.box(2.3, 0.3, 2.3, 0x7a7a74, { x: F.x + 1.5, y: 3.2 });
    for (let i = 0; i < 6; i++) deco.box(0.4, 0.35, 0.5, 0x9a9a94, { x: F.x - 2.5 + i, y: 1.6, z: -3 });
    scene.add(new THREE.Mesh(deco.build(), std()));
    const fm = std({ side: THREE.DoubleSide });
    const pole = new THREE.Mesh(M.flagPoleGeo(3), fm); pole.position.set(F.x + 1.5, 3.5, 0); scene.add(pole);
    this.bGray = new THREE.Mesh(grayFlagGeo(), fm); this.bGray.scale.setScalar(1.6); this.bGray.position.set(F.x + 1.5, 6.2, 0); scene.add(this.bGray);
    this.bCuba = new THREE.Mesh(cubanFlagGeo(), fm); this.bCuba.scale.setScalar(1.6); this.bCuba.position.set(F.x + 1.5, 3.6, 0); scene.add(this.bCuba);
    // tropas instanciadas
    const person = (shirt, hat, o) => { const p = M.personParts(shirt, hat, 3, o); const b = new M.Builder(); b.merge(p.body); b.merge(M.place(p.leg, -0.08, 0, 0, 0.5)); b.merge(M.place(p.leg, 0.08, 0, 0, 0.5)); b.merge(M.place(p.arm, -0.2, 0, 0, 0.85)); b.merge(M.place(p.arm, 0.2, 0, 0, 0.85)); return b.build(); };
    const inf = new M.Builder(); inf.merge(person(0xeee4c8, 0xd9c08a, { scarf: 0xb83a2e })); inf.box(0.05, 0.05, 0.9, 0x5a4030, { x: 0.22, y: 0.9, z: -0.1, rx: -0.6 });
    const cab = new M.Builder(); cab.merge(M.horseGeo(1)); cab.merge(M.place(person(0xe8dcc0, 0xc9a86a, { scarf: 0x2f5d8a }), 0, 0, 0, 0.75));
    cab.box(0.04, 0.85, 0.07, 0xd8d8d0, { x: 0.3, y: 2.05, z: -0.1, rx: -0.3, m: 3 }); // machete en alto
    const foe = person(0x7c8084, null, { scarf: 0x5c6064 });
    const geo = { inf: inf.build(), cab: cab.build(), cart: oxcartGeo(), foe };
    const N = { inf: 24, cab: 14, cart: 5, foe: 18 };
    this.troops = {};
    for (const k of Object.keys(N)) { const m = new THREE.InstancedMesh(geo[k], std(), N[k]); m.frustumCulled = false; scene.add(m); this.troops[k] = m; }
    this.dust = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.28, 0), new THREE.MeshStandardMaterial({ color: 0xe0cfa8, transparent: true, opacity: 0.4, depthWrite: false, roughness: 1, flatShading: true }), 40);
    this.dust.frustumCulled = false; scene.add(this.dust);
    this.bCam = new THREE.PerspectiveCamera(40, 1, 0.3, 120);
  }
  startBattle(result) {
    if (!this.bScene) this.buildBattle();
    this.bt = 0;
    this.res = result;
    const b = result.before;
    this.counts = { inf: Math.min(24, b.inf), cab: Math.min(14, b.cab), cart: Math.min(5, b.cart), foe: Math.min(18, Math.max(4, Math.round(result.guards / 20))) };
    this.seed = Object.entries(this.counts).flatMap(([k, n]) => Array.from({ length: n }, (_, i) => ({ k, i, r: hash(i, k.length), r2: hash(k.length, i + 3) })));
  }
  renderBattle(dt) {
    const t = (this.bt += dt), win = this.res.win;
    const size = new THREE.Vector2(); this.renderer.getSize(size);
    this.bCam.aspect = size.x / Math.max(1, size.y); this.bCam.updateProjectionMatrix();
    const portrait = this.bCam.aspect < 1;
    if (portrait) { // en vertical: se mira a lo largo del camino, la columna avanza hacia arriba de la pantalla
      this.bCam.position.set(-27 + t * 0.6, 15, 9);
      this.bCam.lookAt(3 + t * 0.4, 0, -0.5);
    } else {
      const d = 21 / Math.min(1, this.bCam.aspect / 1.5);
      this.bCam.position.set(-3 + t * 0.4, d * 0.72, d * 0.78);
      this.bCam.lookAt(1 + t * 0.4, 0.5, 0);
    }
    const adv = Math.min(1, t / 3.2), back = !win && t > 3.6 ? Math.min(1, (t - 3.6) / 2.2) : 0;
    const used = { inf: 0, cab: 0, cart: 0, foe: 0 };
    for (const u of this.seed) {
      const m = this.troops[u.k], i = used[u.k]++;
      if (u.k === 'foe') {
        const row = i % 6, col = Math.floor(i / 6);
        let x = 8 + col * 0.9 + u.r * 0.4, z = -2.2 + row * 0.85, s = 1, ry = Math.PI / 2;
        if (win && t > 2.6) { const k = Math.min(1, (t - 2.6) / 2.2); x += k * k * 22; ry = -Math.PI / 2; s = 1 - k * 0.3; }
        setI(m, i, x, Math.abs(Math.sin(t * 9 + i)) * 0.06, z, ry, s);
        continue;
      }
      const speed = u.k === 'cab' ? 1.25 : u.k === 'cart' ? 0.55 : 1;
      const lane = u.k === 'cab' ? -1 : u.k === 'cart' ? 4 : 1;
      const row = i % 5, col = Math.floor(i / 5);
      const x0 = -16 - col * 1.3 - (u.k === 'cart' ? 4 : 0) - u.r * 0.5;
      let x = x0 + adv * (u.k === 'cart' ? 7 : 12.5) * speed, z = lane * 1.6 + (row - 2) * (u.k === 'cart' ? 2.2 : 0.9) + u.r2 * 0.3;
      let ry = -Math.PI / 2;
      if (back) { x -= back * 14; ry = Math.PI / 2; }
      const bob = Math.abs(Math.sin(t * (u.k === 'cab' ? 12 : 9) + i * 1.7)) * (u.k === 'cab' ? 0.12 : 0.07);
      setI(m, i, x, bob, z, ry, u.k === 'cart' ? 0.9 : 1);
    }
    for (const k of Object.keys(this.troops)) { this.troops[k].count = this.counts[k]; this.troops[k].instanceMatrix.needsUpdate = true; }
    // polvo detrás de la caballería
    for (let i = 0; i < 40; i++) {
      const life = ((t * 1.3 + i * 0.13) % 1.6) / 1.6;
      const x = -14 + adv * 15 - life * 4 + hash(i, 1) * 3, z = -2.5 + hash(i, 2) * 6;
      setI(this.dust, i, x - (back * 14), 0.2 + life * 0.8, z, i, (0.4 + life * 1.0) * (t < 4.5 ? 1 : Math.max(0, 1 - (t - 4.5))));
    }
    this.dust.instanceMatrix.needsUpdate = true;
    // banderas
    const fl = win ? Math.max(0, Math.min(1, (t - 4.2) / 1.5)) : 0;
    this.bGray.position.y = 6.2 - fl * 2.6; this.bGray.visible = fl < 0.98;
    this.bCuba.position.y = 3.6 + fl * 2.6; this.bCuba.visible = fl > 0.02;
    this.bGray.rotation.y = Math.sin(t * 3) * 0.2; this.bCuba.rotation.y = Math.sin(t * 3 + 1) * 0.2;
    this.renderer.render(this.bScene, this.bCam);
    return t;
  }
}
export { PROVINCES };
void UNITS;
