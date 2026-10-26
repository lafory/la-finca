// v4: vistas de las zonas fuera de la finca (camino del sur, manigua, batey).
// Se construyen "perezosas": cuando la zona se abre o la cámara se acerca. Árboles y hierba en trozos instanciados
// (culling por trozo) con LOD: lejos se usa una copa simplificada.
import * as THREE from 'three';
import { GW, GH, W, H } from './data.js';
import { ZONES, MANIGUA, WILD_PLANTS, BATEY, zoneOpen, inRect } from './zones.js';
import * as M from './models.js';
import { patchMaterial } from './shaders.js';
import { now } from './state.js';

const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpE = new THREE.Euler();
const compose = (x, y, z, ry, s, sy = s) => { tmpQ.setFromEuler(tmpE.set(0, ry, 0)); return tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.set(s, sy, s)).clone(); };
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
const CH = 14; // tamaño del trozo (tiles)
const LOD_DIST = 46;

function canvasTex(wTiles, hTiles, px, paint) {
  const c = document.createElement('canvas');
  c.width = wTiles * px; c.height = hTiles * px;
  const g = c.getContext('2d');
  paint(g, px);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function noiseDots(g, w, h, n, colors, r0, r1, rnd) {
  for (let i = 0; i < n; i++) { g.fillStyle = colors[Math.floor(rnd() * colors.length)]; g.beginPath(); g.arc(rnd() * w, rnd() * h, r0 + rnd() * (r1 - r0), 0, 6.283); g.fill(); }
}

export class ZoneViews {
  constructor(world) {
    this.w = world;
    this.s = world.s;
    this.sim = world.sim;
    this.views = {};
    this.grass = [];
    this.chunks = []; // { cx, cz, hi:[], lo:[] }
    this.plantRef = new Map(); // id → { mesh(es), i, m }
    this.pickMeshes = [];
    this.wildViews = new Map();
    this.dirty = true;
    this.isSmall = world.isSmall;
    this.buildDynamic();
  }
  // ---------------------------------------------------------------- perezoso
  near(r, rig) {
    const t = rig.target, d = rig.dist;
    const dx = Math.max(r.x0 - t.x, 0, t.x - r.x1 - 1), dz = Math.max(r.z0 - t.z, 0, t.z - r.z1 - 1);
    return Math.hypot(dx, dz) < d * 0.9 + 18;
  }
  update(dt, time, rig) {
    for (const id of ['camino', 'manigua', 'batey']) {
      if (this.views[id]) continue;
      if (id === 'camino' || zoneOpen(this.s, id) || (rig && this.near(ZONES[id].rect, rig))) this.build(id);
    }
    if (this.views.manigua) {
      if (this.dirty) this.refreshPlants();
      this.fruitTick = (this.fruitTick || 0) - dt;
      if (this.fruitTick <= 0) { this.fruitTick = 1.5; this.refreshFruit(); }
      // LOD de árboles por trozo
      const cp = rig?.camera.position;
      if (cp) for (const c of this.chunks) {
        const far = Math.hypot(c.x - cp.x, c.z - cp.z, cp.y * 0.5) > LOD_DIST;
        if (c.far !== far) { c.far = far; for (const m of c.hi) m.visible = !far; for (const m of c.lo) m.visible = far; }
      }
      this.water.material.map && (this.water.material.map.offset.y = -time * 0.05);
    }
    this.updateWild(dt, time);
    this.updateHome(time);
  }
  build(id) {
    if (id === 'camino') this.buildCamino();
    if (id === 'manigua') this.buildManigua();
    if (id === 'batey') this.buildBatey();
    this.w.applyGrassCounts();
  }
  addGrass(rect, density, skip, seed) {
    const w = this.w, r = M.rng(seed);
    w.grassGeo ||= M.grassClumpGeo(3, 0.3);
    for (let cz = rect.z0; cz <= rect.z1; cz += 8) for (let cx = rect.x0; cx <= rect.x1; cx += 8) {
      const spots = [];
      for (let z = cz; z < Math.min(rect.z1 + 1, cz + 8); z++) for (let x = cx; x < Math.min(rect.x1 + 1, cx + 8); x++) {
        if (skip(x, z)) continue;
        for (let i = 0; i < density; i++) spots.push([x + r(), z + r()]);
      }
      if (!spots.length) continue;
      for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
      const mesh = new THREE.InstancedMesh(w.grassGeo, w.matGrass, spots.length);
      spots.forEach(([x, z], i) => mesh.setMatrixAt(i, compose(x, 0, z, r() * 6, 0.8 + r() * 0.7)));
      mesh.receiveShadow = true;
      mesh.computeBoundingSphere();
      w.scene.add(mesh);
      this.grass.push({ mesh, total: spots.length });
    }
  }
  groundMesh(rect, tex, y = 0.002) {
    const wt = rect.x1 - rect.x0 + 1, ht = rect.z1 - rect.z0 + 1;
    const g = new THREE.PlaneGeometry(wt, ht);
    g.rotateX(-Math.PI / 2);
    g.translate(rect.x0 + wt / 2, y, rect.z0 + ht / 2);
    const m = new THREE.Mesh(g, patchMaterial(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })));
    m.receiveShadow = true;
    this.w.scene.add(m);
    return m;
  }
  staticMesh(parts) {
    const b = new M.Builder();
    parts.forEach((p) => b.add(p));
    const m = new THREE.Mesh(b.build(), this.w.mat);
    m.castShadow = true; m.receiveShadow = true;
    this.w.scene.add(m);
    return m;
  }

  // ---------------------------------------------------------------- camino del sur y camino real hacia el sur
  buildCamino() {
    const r = M.rng(77);
    const tex = canvasTex(8, 2, 24, (g, px) => {
      g.fillStyle = '#b8936a'; g.fillRect(0, 0, 8 * px, 2 * px);
      noiseDots(g, 8 * px, 2 * px, 240, ['#a8835c', '#c4a072', '#9c7a54', '#cfae80'], 1, 4, r);
      g.fillStyle = 'rgba(110,80,50,.35)'; g.fillRect(0, px * 0.45, 8 * px, px * 0.18); g.fillRect(0, px * 1.35, 8 * px, px * 0.18);
    });
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    const mk = (x0, z0, w, h, rot) => {
      const t = tex.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rot ? h / 8 : w / 8, 1);
      if (rot) t.rotation = Math.PI / 2;
      const g = new THREE.PlaneGeometry(w, h); g.rotateX(-Math.PI / 2); g.translate(x0 + w / 2, 0.004, z0 + h / 2);
      const m = new THREE.Mesh(g, patchMaterial(new THREE.MeshStandardMaterial({ map: t, roughness: 1 })));
      m.receiveShadow = true; this.w.scene.add(m);
    };
    mk(0, 40, GW, 2, false);
    mk(15, 42, 2, GH - 42, true);
    // piedritas y un puente sobre el arroyo
    const parts = [];
    for (let i = 0; i < 40; i++) parts.push(M.place(M.rockGeo(500 + i), r() * GW, 40 + r() * 2));
    const rv = MANIGUA.river[MANIGUA.river.length - 1][0];
    parts.push(M.place(M.bridgeGeo(4), rv + 1, 41));
    // cartel de bienvenida al batey y a la manigua
    parts.push(M.place(M.signGeo(), 14.5, 41.8, Math.PI / 4));
    parts.push(M.place(M.signGeo(), 46.5, 39.6, Math.PI / 4));
    this.views.camino = { mesh: this.staticMesh(parts) };
    this.addGrass({ x0: 0, z0: 42, x1: 14, z1: 42 }, 2, () => false, 3);
  }

  // ---------------------------------------------------------------- la manigua
  buildManigua() {
    const R = ZONES.manigua.rect, wt = R.x1 - R.x0 + 1, ht = R.z1 - R.z0 + 1;
    const r = M.rng(61);
    const px = this.isSmall ? 8 : 12;
    const tex = canvasTex(wt, ht, px, (g) => {
      g.fillStyle = '#5f7436'; g.fillRect(0, 0, wt * px, ht * px);
      noiseDots(g, wt * px, ht * px, wt * ht * 3, ['#566c30', '#6a7e3c', '#4e6229', '#73843f', '#7a6a3a'], px * 0.3, px * 1.2, r);
      // trillos de tierra
      g.strokeStyle = 'rgba(150,110,70,.55)'; g.lineWidth = px * 0.7; g.lineCap = 'round';
      for (const zz of [7, 19, 31]) { g.beginPath(); g.moveTo(0, (zz + 0.5) * px); for (let x = 0; x <= wt; x += 3) g.lineTo(x * px, (zz + 0.5 + Math.sin(x * 0.4) * 0.8) * px); g.stroke(); }
      g.beginPath(); g.moveTo(2 * px, ht * px); g.quadraticCurveTo(8 * px, 28 * px, 18 * px, 19.5 * px); g.stroke();
      // orillas del arroyo y mogotes
      for (const k of MANIGUA.water) { const x = (k % GW) - R.x0, z = Math.floor(k / GW) - R.z0; g.fillStyle = '#4a5a2a'; g.fillRect((x - 0.5) * px, (z - 0.2) * px, px * 2, px * 1.4); }
      for (const k of MANIGUA.fords) { const x = (k % GW) - R.x0, z = Math.floor(k / GW) - R.z0; g.fillStyle = '#8f7a5a'; g.fillRect(x * px, z * px, px, px); }
      for (const k of MANIGUA.hills) { const x = (k % GW) - R.x0, z = Math.floor(k / GW) - R.z0; g.fillStyle = '#4b5f30'; g.fillRect(x * px, z * px, px, px); }
    });
    const ground = this.groundMesh(R, tex);
    // agua del arroyo
    const wb = new M.Builder();
    for (const k of MANIGUA.water) { const x = k % GW, z = Math.floor(k / GW); wb.add(M.part(new THREE.BoxGeometry(1.02, 0.04, 1.02), 0x3f7f8f, { x: x + 0.5, y: 0.0, z: z + 0.5 })); }
    const wtex = canvasTex(2, 2, 32, (g) => { g.fillStyle = '#4f8f9c'; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(220,240,240,${0.08 + Math.random() * 0.12})`; g.fillRect(Math.random() * 64, Math.random() * 64, 10 + Math.random() * 14, 2); } });
    wtex.wrapS = wtex.wrapT = THREE.RepeatWrapping;
    const wg = wb.build();
    // UV planos para la textura del agua
    const pos = wg.attributes.position, uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) { uv[i * 2] = pos.getX(i) * 0.5; uv[i * 2 + 1] = pos.getZ(i) * 0.5; }
    wg.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.water = new THREE.Mesh(wg, new THREE.MeshStandardMaterial({ color: 0xffffff, map: wtex, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.9 }));
    this.water.receiveShadow = true;
    this.w.scene.add(this.water);
    // mogotes, pasos de piedra
    const parts = [];
    MANIGUA.mogotes.forEach(([x, z, rad], i) => parts.push(M.place(M.mogoteGeo(30 + i), x, z, i * 1.3, -0.4, rad / 3.6)));
    let fi = 0;
    for (const k of MANIGUA.fords) parts.push(M.place(M.fordStoneGeo(fi++), (k % GW) + 0.5, Math.floor(k / GW) + 0.5));
    this.views.manigua = { ground, mesh: this.staticMesh(parts) };
    // plantas en trozos instanciados (hi/lo)
    const geos = {
      arbol: [[M.treeGeo(1), M.treeGeo(2), M.treeGeo(3)], M.treeGeo(1, true)],
      marabu: [[M.marabuGeo(11), M.marabuGeo(12)], M.marabuGeo(11)],
      ceiba: [[M.ceibaGeo(21)], M.ceibaGeo(21)],
      palma: [[this.w.palmGeo || M.palmGeo(3, 3.6)], M.palmLowGeo(4, 4)],
      coco: [[M.cocoteroGeo(9)], M.palmLowGeo(9, 3.4)],
      mango: [[M.mangoTreeGeo(3)], M.mangoTreeGeo(3, true)],
      guayaba: [[M.guayabaGeo(5)], M.guayabaGeo(5, true)],
    };
    const mats = { arbol: this.w.matFoliage, marabu: this.w.matFoliage, ceiba: this.w.mat, palma: this.w.matFoliage, coco: this.w.matFoliage, mango: this.w.mat, guayaba: this.w.matFoliage };
    const byChunk = new Map();
    for (const p of MANIGUA.plants) {
      const key = `${Math.floor((p.x - R.x0) / CH)},${Math.floor(p.z / CH)}`;
      if (!byChunk.has(key)) byChunk.set(key, []);
      byChunk.get(key).push(p);
    }
    const pr = M.rng(9);
    for (const list of byChunk.values()) {
      const c = { x: 0, z: 0, hi: [], lo: [], far: null };
      for (const p of list) { c.x += p.x; c.z += p.z; }
      c.x /= list.length; c.z /= list.length;
      for (const kind of Object.keys(geos)) {
        const L = list.filter((p) => p.kind === kind);
        if (!L.length) continue;
        const [his, lo] = geos[kind];
        const mats4 = L.map((p) => compose(p.x + 0.5, 0, p.z + 0.5, pr() * 6.28, kind === 'ceiba' ? 1.15 : kind === 'palma' ? 0.75 + pr() * 0.15 : 0.85 + pr() * 0.3));
        his.forEach((hg, vi) => {
          const sub = L.map((p, i) => [p, mats4[i]]).filter((_, i) => i % his.length === vi);
          if (!sub.length) return;
          const hm = new THREE.InstancedMesh(hg, mats[kind], sub.length);
          const lm = new THREE.InstancedMesh(lo, mats[kind], sub.length);
          lm.instanceMatrix = hm.instanceMatrix; // misma posición, otra geometría
          sub.forEach(([p, m], i) => { hm.setMatrixAt(i, m); this.plantRef.set(p.id, { hm, i, m }); hm.userData.ids ||= []; hm.userData.ids[i] = p.id; });
          for (const mm of [hm, lm]) { mm.castShadow = true; mm.receiveShadow = true; mm.computeBoundingSphere(); this.w.scene.add(mm); }
          lm.visible = false;
          c.hi.push(hm); c.lo.push(lm);
          this.pickMeshes.push(hm);
        });
      }
      this.chunks.push(c);
    }
    // tocones de lo tumbado y frutas
    this.stumps = new THREE.InstancedMesh(M.stumpGeo(3), this.w.mat, MANIGUA.plants.length);
    this.stumps.count = 0; this.stumps.castShadow = true;
    this.w.scene.add(this.stumps);
    this.fruitMeshes = {};
    for (const k of ['coco', 'mango', 'guayaba']) {
      const n = MANIGUA.plants.filter((p) => p.kind === k).length;
      const m = new THREE.InstancedMesh(M.fruitGeo(k), this.w.mat, Math.max(1, n));
      m.count = 0; this.w.scene.add(m); this.fruitMeshes[k] = m;
    }
    // hierba (menos donde hay agua y mogotes)
    const skip = (x, z) => MANIGUA.water.has(z * GW + x) || MANIGUA.hills.has(z * GW + x);
    this.addGrass(R, this.isSmall ? 2 : 3, skip, 71);
    this.dirty = true;
  }
  refreshPlants() {
    this.dirty = false;
    const s = this.s;
    const touched = new Set();
    let n = 0;
    for (const p of MANIGUA.plants) {
      const ref = this.plantRef.get(p.id);
      if (!ref) continue;
      const down = !!s.chopped[p.id];
      if (ref.down !== down) { ref.down = down; ref.hm.setMatrixAt(ref.i, down ? ZERO : ref.m); touched.add(ref.hm); }
      if (down) this.stumps.setMatrixAt(n++, compose(p.x + 0.5, 0, p.z + 0.5, p.x, p.kind === 'marabu' ? 0.6 : 0.9));
    }
    for (const m of touched) { m.instanceMatrix.needsUpdate = true; }
    this.stumps.count = n;
    this.stumps.instanceMatrix.needsUpdate = true;
    this.refreshFruit();
  }
  refreshFruit() {
    if (!this.fruitMeshes) return;
    const t = now(), counts = { coco: 0, mango: 0, guayaba: 0 };
    for (const p of MANIGUA.plants) {
      const Wp = WILD_PLANTS[p.kind];
      if (!Wp.fruit || !this.sim.fruitReady(p, t)) continue;
      const ref = this.plantRef.get(p.id);
      const m = this.fruitMeshes[p.kind];
      m.setMatrixAt(counts[p.kind]++, ref ? ref.m : compose(p.x + 0.5, 0, p.z + 0.5, 0, 1));
    }
    for (const [k, m] of Object.entries(this.fruitMeshes)) { m.count = counts[k]; m.instanceMatrix.needsUpdate = true; }
  }
  pickPlant(ray) {
    const vis = this.pickMeshes.filter((m) => m.visible);
    if (!vis.length) return null;
    const hits = ray.intersectObjects(vis, false);
    for (const h of hits) {
      const id = h.object.userData.ids?.[h.instanceId];
      if (id && !this.s.chopped[id]) return id;
    }
    return null;
  }

  // ---------------------------------------------------------------- el batey
  buildBatey() {
    const R = ZONES.batey.rect, wt = R.x1 - R.x0 + 1, ht = R.z1 - R.z0 + 1;
    const r = M.rng(81);
    const px = this.isSmall ? 10 : 16;
    const P = BATEY.plaza;
    const tex = canvasTex(wt, ht, px, (g) => {
      g.fillStyle = '#7d8f45'; g.fillRect(0, 0, wt * px, ht * px);
      noiseDots(g, wt * px, ht * px, wt * ht * 2, ['#74863f', '#8a9a4c', '#6a7a3a'], px * 0.3, px, r);
      // tierra apisonada del batey: plaza y calles
      g.fillStyle = '#c2a074';
      g.fillRect((P.x - R.x0) * px, (P.z - R.z0) * px, P.w * px, P.h * px);
      g.fillRect(0, (46 - R.z0) * px, wt * px, px * 1.2);
      g.fillRect(0, (52 - R.z0 + 0.2) * px, wt * px, px * 0.9);
      g.fillRect((12 - R.x0) * px, 0, px * 1.2, ht * px);
      noiseDots(g, wt * px, ht * px, wt * ht, ['rgba(160,120,80,.35)', 'rgba(210,180,140,.3)'], 1, px * 0.3, r);
      // baldosas de la plaza
      g.strokeStyle = 'rgba(120,90,60,.35)'; g.lineWidth = 1;
      for (let x = P.x; x <= P.x + P.w; x++) { g.beginPath(); g.moveTo((x - R.x0) * px, (P.z - R.z0) * px); g.lineTo((x - R.x0) * px, (P.z + P.h - R.z0) * px); g.stroke(); }
    });
    const ground = this.groundMesh(R, tex);
    const parts = [];
    parts.push(M.place(M.ceibaGeo(31), BATEY.ceiba.x + 1, BATEY.ceiba.z + 1, 0.7, 0, 1.2));
    BATEY.benches.forEach(([x, z], i) => parts.push(M.place(M.benchGeo(), x + 0.5, z + 0.5, i < 2 ? 0 : Math.PI)));
    BATEY.lamps.forEach(([x, z]) => parts.push(M.place(M.lampGeo(), x + 0.5, z + 0.5)));
    for (let i = 0; i < 10; i++) parts.push(M.place(M.rockGeo(700 + i), r() * wt, 42 + r() * ht));
    // palmas alrededor del batey (decorado)
    this.views.batey = { ground, mesh: this.staticMesh(parts) };
    const busy = (x, z) => (x >= P.x && x < P.x + P.w && z >= P.z && z < P.z + P.h) || x === 15 || x === 16 || z === 46 || x === 12;
    this.addGrass(R, 1, busy, 91);
  }

  // ---------------------------------------------------------------- dinámicos: animales del monte, caballo y leña en el bohío
  buildDynamic() {
    const w = this.w;
    this.wildGeos = { jutia: M.jutiaGeo(), jibaro: M.wildPigGeo(), guinea: M.guineaGeo(), gallina: M.chickenGeo(2), caballo: M.horseGeo(0) };
    this.horse = new THREE.Mesh(M.horseGeo(1), w.mat);
    this.horse.castShadow = true;
    this.horse.position.set(4.3, 0, 9.6); this.horse.rotation.y = 1.2;
    w.scene.add(this.horse);
    this.logs = new THREE.Mesh(M.logPileGeo(), w.mat);
    this.logs.castShadow = true;
    this.logs.position.set(8.6, 0, 6.3);
    w.scene.add(this.logs);
    this.carryMesh = new THREE.Group();
    w.player.root.add(this.carryMesh);
    this.machete = new THREE.Mesh(M.machetGeo(), w.mat);
    this.machete.position.set(0, -0.42, -0.02);
    w.player.armR.add(this.machete);
  }
  updateHome(time) {
    const s = this.s;
    this.horse.visible = !!s.horse;
    if (s.horse) this.horse.rotation.x = Math.max(0, Math.sin(time * 0.9)) * 0.06;
    this.logs.visible = s.wood > 0;
    const sc = Math.min(1.6, 0.6 + s.wood / 120);
    this.logs.scale.set(sc, sc, sc);
    // machete en la mano cuando está en la manigua
    const p = this.sim.player;
    this.machete.visible = zoneOpen(s, 'manigua') && p.x >= ZONES.manigua.rect.x0 - 2;
    this.w.basket.visible = this.w.basket.visible && !this.machete.visible;
    // lo que lleva en brazos
    const n = s.carry.length;
    if (this.carryN !== n || this.carryK !== s.carry.map((c) => c.kind).join()) {
      this.carryN = n; this.carryK = s.carry.map((c) => c.kind).join();
      while (this.carryMesh.children.length) this.carryMesh.remove(this.carryMesh.children[0]);
      s.carry.forEach((c, i) => {
        if (c.kind === 'caballo') return;
        const m = new THREE.Mesh(this.wildGeos[c.kind], this.w.mat);
        m.scale.setScalar(c.kind === 'jibaro' ? 0.55 : 0.75);
        m.position.set((i - (n - 1) / 2) * 0.28, 0.75, -0.3);
        this.carryMesh.add(m);
      });
    }
    // el caballo domado sigue al guajiro hasta la finca
    const led = s.carry.some((c) => c.kind === 'caballo');
    if (led) {
      this.ledHorse ||= (() => { const m = new THREE.Mesh(this.wildGeos.caballo, this.w.mat); m.castShadow = true; this.w.scene.add(m); return m; })();
      const h = this.ledHorse, dx = p.x - h.position.x, dz = p.z - h.position.z, d = Math.hypot(dx, dz);
      if (d > 6) h.position.set(p.x - 1, 0, p.z + 1);
      else if (d > 1.4) { h.position.x += dx * 0.05; h.position.z += dz * 0.05; h.rotation.y = Math.atan2(dx, dz) + Math.PI; }
      h.visible = true;
    } else if (this.ledHorse) this.ledHorse.visible = false;
  }
  updateWild(dt, time) {
    const s = this.s, seen = new Set();
    for (const a of s.wild) {
      seen.add(a.id);
      let v = this.wildViews.get(a.id);
      if (!v) {
        const m = new THREE.Mesh(this.wildGeos[a.kind], this.w.mat);
        m.castShadow = true; m.userData.wild = a.id;
        this.w.scene.add(m);
        v = { m };
        this.wildViews.set(a.id, v);
      }
      const rt = this.sim.wildRT.get(a.id);
      v.m.position.set(a.x, rt && rt.moving ? Math.abs(Math.sin(time * 12 + a.id)) * 0.04 : 0, a.z);
      if (rt) v.m.rotation.y = rt.face + Math.PI;
      v.m.rotation.x = rt && !rt.moving ? Math.max(0, Math.sin(time * 1.5 + a.id)) * 0.2 : 0;
    }
    for (const [id, v] of this.wildViews) if (!seen.has(id)) { this.w.scene.remove(v.m); this.wildViews.delete(id); }
  }
  pickWild(ray) {
    const ms = [...this.wildViews.values()].map((v) => v.m);
    if (!ms.length) return null;
    const hits = ray.intersectObjects(ms, false);
    return hits.length ? hits[0].object.userData.wild : null;
  }
  blobs(add) {
    for (const a of this.s.wild) add(a.x, a.z, a.kind === 'caballo' ? 0.9 : 0.5, a.kind === 'caballo' ? 1.6 : 0.7);
    if (this.s.horse) add(this.horse.position.x, this.horse.position.z, 0.9, 1.6, this.horse.rotation.y);
  }
  grassCounts(f) { for (const c of this.grass) c.mesh.count = Math.floor(c.total * f); }
}
export { inRect };
