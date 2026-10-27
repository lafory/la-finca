// Escena isométrica de una finca regional (se dibuja con el mismo WebGLRenderer; se libera al salir).
// Pocas llamadas de dibujo: suelo, decorado fusionado, construcciones fusionadas y lotes/etapas/jornaleros instanciados.
import * as THREE from 'three';
import * as M from '../models.js';
import { patchMaterial } from '../shaders.js';
import { CITY_BY_ID } from './data.js';
import { CELL, GRID, typeOf, key } from './regional-data.js';
import { plotBaseGeo, stageGeo, buildingGeo, workerGeo, readyGeo } from './regional-models.js';
import { TYPE_KIT, createInstanced, createModel, disposeKit } from './regional-kit.js';

const MAXC = 36;
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpE = new THREE.Euler();
const setI = (mesh, i, x, y, z, ry = 0, s = 1) => { tmpQ.setFromEuler(tmpE.set(0, ry, 0)); tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.set(s, s, s)); mesh.setMatrixAt(i, tmpM); };
const hash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
export const cellCenter = (x, z) => [(x + 0.5) * CELL, (z + 0.5) * CELL];

export class RegionalScene {
  constructor(game, id) {
    this.g = game; this.id = id; this.T = typeOf(id);
    this.kit = TYPE_KIT[CITY_BY_ID[id].farm[0]] || null; // modelos pulidos del kit (si el tipo los tiene)
    this.renderer = game.world.renderer;
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(30, 1, 0.5, 200);
    this.yaw = Math.PI / 4; this.pitch = THREE.MathUtils.degToRad(50);
    this.disposables = [];
    this.time = 0;
    const std = (o = {}) => { const m = patchMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0, ...o })); this.disposables.push(m); return m; };
    this.mat = std();
    this.matFol = std({ side: THREE.DoubleSide, roughness: 0.75 });
    this.matWater = new THREE.MeshStandardMaterial({ color: 0x3a8fa8, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.92 }); this.disposables.push(this.matWater);
    this.buildEnv();
    this.lvl = 0; this.layoutKey = '';
    this.sync(true);
  }
  geo(g) { this.disposables.push(g); return g; }
  add(o) { this.scene.add(o); return o; }
  get sim() { return this.g.sim; }
  get farm() { return this.sim.rgFarm(this.id); }

  buildEnv() {
    const s = this.scene, T = this.T;
    s.background = new THREE.Color(0xe9d2a8);
    s.fog = new THREE.Fog(0xe9d2a8, 40, 90);
    this.add(new THREE.HemisphereLight(0xffe6c4, 0x5a4026, 1.25));
    const sun = new THREE.DirectionalLight(0xffd8a8, 2.6); sun.position.set(-8, 22, 14); sun.target.position.set(6, 0, 5);
    const q = this.g.world.quality;
    if (q !== 'baja') { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04; }
    this.add(sun); this.add(sun.target); this.sun = sun;
    // jornaleros y "listo" (tamaño fijo)
    this.workers = this.add(new THREE.InstancedMesh(this.geo(workerGeo(2)), this.mat, 6)); this.workers.castShadow = true; this.workers.frustumCulled = false;
    this.ready = this.add(new THREE.InstancedMesh(this.geo(readyGeo()), new THREE.MeshBasicMaterial({ color: 0xffd84a }), MAXC)); this.disposables.push(this.ready.material); this.ready.frustumCulled = false;
    this.bases = this.add(new THREE.InstancedMesh(this.geo(plotBaseGeo(T)), this.mat, MAXC)); this.bases.receiveShadow = true; this.bases.frustumCulled = false;
    if (this.kit) { // 4 etapas del kit (cada una ≤3 mallas instanciadas; el lote ya trae su suelo)
      this.kstages = [0, 1, 2, 3].map((k) => this.add(createInstanced(this.kit.crop, MAXC, { stage: k, seed: 3, sea: true })));
      this.bases.visible = false;
    } else this.stages = [0, 1, 2].map((k) => { const m = this.add(new THREE.InstancedMesh(this.geo(stageGeo(T, k)), this.matFol, MAXC)); m.castShadow = true; m.frustumCulled = false; return m; });
    // lote libre: marco de estacas para tocar
    const lot = new M.Builder();
    lot.box(2.0, 0.02, 2.0, 0xb8a070, { m: 7 });
    for (const [x, z] of [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]]) lot.box(0.06, 0.3, 0.06, M.P.woodLite, { x, z, m: 1 });
    this.lots = this.add(new THREE.InstancedMesh(this.geo(lot.build()), this.mat, MAXC)); this.lots.frustumCulled = false; this.lots.receiveShadow = true;
    // tierra por comprar: un cartel «Se vende»
    this.sel = this.add(new THREE.Mesh(this.geo(new THREE.RingGeometry(1.05, 1.25, 4, 1).rotateX(-Math.PI / 2).rotateY(Math.PI / 4)), new THREE.MeshBasicMaterial({ color: 0xfff2a0 })));
    this.disposables.push(this.sel.material); this.sel.visible = false;
  }
  // suelo, decorado y cercas según el tramo de tierra
  buildGround() {
    for (const m of [this.ground, this.deco, this.water]) if (m) { this.scene.remove(m); m.geometry.dispose(); }
    const T = this.T, lvl = this.farm.lvl, [cols, rows] = GRID[lvl], W = cols * CELL, D = rows * CELL;
    this.W = W; this.D = D;
    const [nc, nr] = GRID[Math.min(3, lvl + 1)];
    const m = 30, gx0 = -m, gz0 = -m, gw = Math.max(W, nc * CELL) + 2 * m, gd = Math.max(D, nr * CELL) + 2 * m;
    const gg = new THREE.PlaneGeometry(gw, gd, 40, 40).toNonIndexed(); gg.rotateX(-Math.PI / 2); gg.translate(gx0 + gw / 2, 0, gz0 + gd / 2);
    const gp = gg.attributes.position, col = new Float32Array(gp.count * 3), c = new THREE.Color();
    for (let i = 0; i < gp.count; i++) {
      const x = gp.getX(i), z = gp.getZ(i);
      if (T.slope && z < -3) gp.setY(i, Math.min(6, (-z - 3) * 0.5) + hash(x, z) * 0.3); // lomas del cafetal
      else if (T.sea && z > D + 3) gp.setY(i, -0.5); // la playa baja al mar
    }
    for (let t = 0; t < gp.count; t += 3) {
      const x = gp.getX(t), z = gp.getZ(t);
      c.set(T.sea && z > D + 1.5 ? 0xd8c08a : T.ground); c.offsetHSL(0, 0, (hash(x, z) - 0.5) * 0.06);
      for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (t + k) * 3);
    }
    gg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    gg.setAttribute('matId', new THREE.BufferAttribute(new Float32Array(gp.count).fill(5), 1));
    gg.computeVertexNormals();
    this.ground = this.add(new THREE.Mesh(gg, this.mat)); this.ground.receiveShadow = true;
    if (T.sea || T.prod.boat) { // mar delante de la finca de pesca (los botes van en lotes de agua)
      const wg = new THREE.PlaneGeometry(gw + 40, 40, 1, 1); wg.rotateX(-Math.PI / 2); wg.translate(gx0 + gw / 2, -0.15, D + 3 + 20);
      this.water = this.add(new THREE.Mesh(wg, this.matWater));
    }
    // decorado: bohío de la familia, bandera, palmas, cerca de lo propio, estacas de lo que se vende
    const b = new M.Builder(), r = M.rng(this.id.length * 13 + lvl);
    b.merge(M.place(M.bohioGeo(), -4.2, D * 0.5, Math.PI / 2, 0, 0.9));
    b.merge(M.place(M.flagPoleGeo(3.2), -4.5, D * 0.5 + 2.6));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + r(), rad = Math.max(W, D) * 0.5 + 5 + r() * 4;
      const x = W / 2 + Math.cos(a) * rad, z = D / 2 + Math.sin(a) * rad * 0.9;
      if (T.sea && z > D + 2) continue;
      b.merge(M.place(i % 3 ? M.palmLowGeo(i + 2, 3.6 + r()) : M.palmGeo(i + 1, 3.8 + r()), x, z, r() * 6));
    }
    if (T.slope) for (let i = 0; i < 7; i++) { const z = -6 - r() * 3; b.merge(M.place(M.treeGeo(i + 2), -6 + i * 3.2, z, r() * 6, Math.min(6, (-z - 3) * 0.5) - 0.1)); }
    for (let x = 0; x < W; x += 1) { b.merge(M.place(M.plankFenceGeo(x), x + 0.5, -0.35)); if (!T.sea) b.merge(M.place(M.plankFenceGeo(x + 9), x + 0.5, D + 0.35)); }
    for (let z = 0; z < D; z += 1) { b.merge(M.place(M.plankFenceGeo(z + 3), -0.35, z + 0.5, Math.PI / 2)); b.merge(M.place(M.plankFenceGeo(z + 5), W + 0.35, z + 0.5, Math.PI / 2)); }
    if (lvl < 3) { // estacas de la tierra por comprar
      for (let x = 0; x <= nc * CELL; x += 2.2) b.merge(M.place(M.fencePost(), x, nr * CELL + 0.4));
      for (let z = 0; z <= nr * CELL; z += 2.2) b.merge(M.place(M.fencePost(), nc * CELL + 0.4, z));
      b.merge(M.place(M.signGeo(), nc * CELL + 0.6, nr * CELL + 0.6, -Math.PI / 4));
    }
    this.deco = this.add(new THREE.Mesh(b.build(), this.mat)); this.deco.castShadow = true; this.deco.receiveShadow = true;
    const fl = this.flag || (this.flag = this.add(new THREE.Mesh(this.geo(M.flagGeo()), this.matFol)));
    fl.position.set(-4.5, 2.9, D * 0.5 + 2.6);
    this.cam.far = 200;
    this.fit();
  }
  buildBuildings() {
    if (this.bld) { this.scene.remove(this.bld); this.bld.geometry.dispose(); }
    for (const m of this.kitBld || []) m.dispose();
    this.kitBld = [];
    const b = new M.Builder();
    for (const [k, c] of Object.entries(this.farm.cells)) {
      if (c.k !== 'b') continue;
      const [x, z] = k.split(',').map(Number), [cx, cz] = cellCenter(x, z);
      const kind = this.kit?.build?.[c.b];
      if (kind) { const m = createModel(kind, { growth: 1, seed: x + z * 7, sea: true }); m.position.set(cx, 0, cz); this.add(m); this.kitBld.push(m); continue; }
      b.merge(M.place(buildingGeo(c.b, this.T), cx, cz, 0));
    }
    this.bld = this.add(new THREE.Mesh(b.build(), this.mat)); this.bld.castShadow = true; this.bld.receiveShadow = true;
  }
  // rehace lo que cambió (tierra, construcciones); los lotes se actualizan cada cuadro
  sync(force) {
    const f = this.farm; if (!f) return;
    if (force || f.lvl !== this.lvl) { this.lvl = f.lvl; this.buildGround(); }
    const bk = Object.entries(f.cells).filter(([, c]) => c.k === 'b').map(([k, c]) => k + c.b).join('|');
    if (force || bk !== this.layoutKey) { this.layoutKey = bk; this.buildBuildings(); }
    this.gray = this.sim.rgBlock(this.id) === 'occ';
    const tint = this.gray ? 0x9a9c9e : 0xffffff;
    for (const m of [this.mat, this.matFol]) m.color.setHex(tint);
    if (this.kit) { const km = this.kstages?.[0]?.meshes?.[0]?.material; if (km) for (const g of this.kstages) for (const mm of g.meshes) mm.material.color.setHex(tint); for (const m of this.kitBld || []) m.traverse((o) => o.material?.color?.setHex(tint)); }
  }
  fit() {
    const W = this.W, D = this.D;
    this.target = new THREE.Vector3(W / 2 - 1, 0, D / 2);
    const size = new THREE.Vector2(); this.renderer.getSize(size); const asp = size.x / Math.max(1, size.y);
    const span = (W + D) * Math.SQRT1_2 + 9;
    const hf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(15)) * asp);
    this.dist = this.goalDist = Math.max(16, Math.min(70, Math.max(span / 2 / Math.tan(hf / 2), (span * 0.75) / 2 / Math.tan(THREE.MathUtils.degToRad(15)))));
    this.minDist = 9; this.maxDist = this.dist * 1.6;
  }
  zoom(f) { this.goalDist = THREE.MathUtils.clamp(this.goalDist * f, this.minDist, this.maxDist); }
  pan(dx, dy) {
    const k = this.dist / 600, c = Math.cos(this.yaw), s = Math.sin(this.yaw);
    const mx = -(dx * c + dy * s) * k * 1.4, mz = (dx * s - dy * c) * k * 1.4;
    this.target.x = THREE.MathUtils.clamp(this.target.x + mx, -4, this.W + 4); this.target.z = THREE.MathUtils.clamp(this.target.z + mz, -4, this.D + 4);
  }
  placeCam(dt) {
    this.dist += (this.goalDist - this.dist) * (1 - Math.exp(-dt * 8));
    const size = new THREE.Vector2(); this.renderer.getSize(size);
    this.cam.aspect = size.x / Math.max(1, size.y); this.cam.updateProjectionMatrix();
    const t = this.target, d = this.dist, cp = Math.cos(this.pitch);
    this.cam.position.set(t.x - Math.sin(this.yaw) * cp * d * -1, Math.sin(this.pitch) * d, t.z + Math.cos(this.yaw) * cp * d);
    this.cam.lookAt(t);
    this.scene.fog.near = d + 6; this.scene.fog.far = d * 1.9 + 30;
  }
  // pantalla → lote (x,z) dentro de la cuadrícula grande (o null)
  pick(cx, cy) {
    const el = this.renderer.domElement, r = el.getBoundingClientRect();
    const nd = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster(); ray.setFromCamera(nd, this.cam);
    const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1), p)) return null;
    const x = Math.floor(p.x / CELL), z = Math.floor(p.z / CELL);
    if (x < 0 || z < 0 || x >= 6 || z >= 6) return null;
    return { x, z };
  }
  project(x, z, y = 0.4) {
    const [cx, cz] = cellCenter(x, z); tmpV.set(cx, y, cz).project(this.cam);
    const el = this.renderer.domElement, r = el.getBoundingClientRect();
    return { x: r.left + (tmpV.x * 0.5 + 0.5) * r.width, y: r.top + (-tmpV.y * 0.5 + 0.5) * r.height };
  }
  select(c) { this.selCell = c; }
  render(dt) {
    const f = this.farm; if (!f) return;
    this.time += dt;
    this.sync(false);
    this.placeCam(dt);
    const T = this.T, sim = this.sim, [cols, rows] = GRID[f.lvl], dur = T.prod.dur, t = this.time;
    const n = [0, 0, 0], kn = [0, 0, 0, 0]; let nb = 0, nl = 0, nr = 0;
    const plots = [];
    for (let z = 0; z < rows; z++) for (let x = 0; x < cols; x++) {
      const c = f.cells[key(x, z)], [cx, cz] = cellCenter(x, z);
      if (!c) { setI(this.lots, nl++, cx, 0.01, cz); continue; }
      if (c.k !== 'p') continue;
      setI(this.bases, nb++, cx, 0.0, cz);
      const left = sim.rgLeft(this.id, x, z), st = left <= 0 ? 2 : left < dur * 0.5 ? 1 : 0;
      const bob = T.prod.boat ? Math.sin(t * 1.6 + x + z * 2) * 0.05 : 0;
      if (this.kit) { const ks = left <= 0 ? 3 : Math.min(2, Math.floor((1 - left / dur) * 3)); this.kstages[ks].setAt(kn[ks]++, cx, cz, 0, 1, T.prod.boat ? bob : 0); }
      else setI(this.stages[st], n[st]++, cx, bob + (T.slope ? 0.2 : 0), cz, T.prod.animal ? Math.sin(t * 0.3 + x * 2 + z) * 0.4 : T.prod.boat ? Math.sin(t * 0.7 + x) * 0.08 : 0);
      if (st === 2 && !this.gray) setI(this.ready, nr++, cx, 2.1 + Math.sin(t * 3 + x + z) * 0.12, cz, t * 2);
      plots.push([cx, cz]);
    }
    this.lots.count = nl; this.bases.count = nb; this.ready.count = nr;
    if (this.kit) this.kstages.forEach((g, i) => { g.count = kn[i]; g.visible = kn[i] > 0; });
    else this.stages.forEach((m, i) => { m.count = n[i]; m.instanceMatrix.needsUpdate = true; });
    for (const m of [this.lots, this.bases, this.ready]) m.instanceMatrix.needsUpdate = true;
    // jornaleros: van de lote en lote (sin bohío de jornaleros, solo uno)
    const nw = this.gray ? 0 : Math.min(6, sim.rgHas(this.id, 'casa') ? 2 + Math.floor(plots.length / 4) : 1);
    for (let i = 0; i < nw; i++) {
      if (!plots.length) { setI(this.workers, i, -2 + i, 0, this.D * 0.5 + 1.5, 0); continue; }
      const seg = t / 6 + i * 1.7, a = plots[Math.floor(seg) % plots.length], b = plots[(Math.floor(seg) + 1 + i) % plots.length];
      const u = seg % 1, mv = Math.min(1, u * 2.2); // camina y luego trabaja
      const x = a[0] + (b[0] - a[0]) * mv + 0.8, z = a[1] + (b[1] - a[1]) * mv + 0.6;
      const ry = Math.atan2(b[0] - a[0], b[1] - a[1]) + Math.PI;
      setI(this.workers, i, x, mv < 1 ? Math.abs(Math.sin(t * 9 + i)) * 0.05 : 0, z, ry);
    }
    this.workers.count = nw; this.workers.instanceMatrix.needsUpdate = true;
    if (this.flag) this.flag.rotation.y = Math.sin(t * 2) * 0.2;
    if (this.water) this.water.position.y = Math.sin(t * 0.8) * 0.04;
    if (this.selCell) { const [cx, cz] = cellCenter(this.selCell.x, this.selCell.z); this.sel.position.set(cx, 0.35, cz); this.sel.visible = true; } else this.sel.visible = false;
    this.renderer.render(this.scene, this.cam);
  }
  dispose() {
    for (const g of this.kstages || []) g.dispose();
    for (const m of this.kitBld || []) m.dispose();
    this.kstages = null; this.kitBld = null;
    disposeKit();
    this.scene.traverse((o) => { if (o.isMesh && o.geometry) o.geometry.dispose(); if (o.isInstancedMesh) o.dispose(); });
    for (const d of this.disposables) d.dispose?.();
    this.disposables = [];
    this.scene.clear();
    this.disposed = true;
    void CITY_BY_ID;
  }
}
