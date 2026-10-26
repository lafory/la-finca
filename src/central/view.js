// Vista 3D de los campos grandes, el central y el tren. Perezosa: se construye al acercarse al nivel o la cámara.
// Rendimiento: estáticos fusionados (central, acopio, vía = pocas mallas), cultivos/cuadrilla/tractores/carretas/humo
// instanciados con LOD por distancia, tren = locomotora + 1 malla instanciada de vagones + 1 de carga.
import * as THREE from 'three';
import * as M from '../models.js';
import { patchMaterial } from '../shaders.js';
import { now } from '../state.js';
import { GW } from '../data.js';
import {
  FIELDS, FIELD_BY_ID, FIELD, FIELD_CROPS, STAGES, TRAIN, STOPS, BLOCKS, CAMPOS_LEVEL, CENTRAL_LEVEL, TRACK, MILL,
} from './data.js';
import { loopAt, headingOf, wrap } from './track.js';
import * as CM from './models.js';

export const CAMPOS_RECT = { x0: 32, z0: 42, x1: 87, z1: 79 };
export const CENTRAL_RECT = { x0: 0, z0: 58, x1: 30, z1: 79 };
const inR = (r, x, z, m = 0) => x >= r.x0 - m && x <= r.x1 + 1 + m && z >= r.z0 - m && z <= r.z1 + 1 + m;
const inMine = (x, z) => inR(CAMPOS_RECT, x, z, 0.5) || inR(CENTRAL_RECT, x, z, 0.5);
const ACOPIO_PILE = { x: 34, z: 60.6 };
const MILL_O = { x: BLOCKS.mill.x, z: BLOCKS.mill.z };
const CHIMNEY = { x: MILL_O.x + 7.1, y: 9.7, z: MILL_O.z + 1.9 };
const LOD_FAR = 62;

const tM = new THREE.Matrix4(), tQ = new THREE.Quaternion(), tV = new THREE.Vector3(), tS = new THREE.Vector3(), tE = new THREE.Euler();
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
function setI(mesh, i, x, y, z, ry = 0, s = 1, sy = s, rx = 0) {
  tQ.setFromEuler(tE.set(rx, ry, 0, 'YXZ'));
  tM.compose(tV.set(x, y, z), tQ, tS.set(s, sy, s));
  mesh.setMatrixAt(i, tM);
}
function canvasTex(wT, hT, px, paint) {
  const c = document.createElement('canvas');
  c.width = wT * px; c.height = hT * px;
  paint(c.getContext('2d'), px);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function dots(g, w, h, n, colors, r0, r1, rnd) {
  for (let i = 0; i < n; i++) { g.fillStyle = colors[Math.floor(rnd() * colors.length)]; g.beginPath(); g.arc(rnd() * w, rnd() * h, r0 + rnd() * (r1 - r0), 0, 6.283); g.fill(); }
}

export class CentralView {
  constructor(game) {
    this.g = game;
    this.w = game.world;
    this.sim = game.sim;
    this.scene = this.w.scene;
    this.built = false;
    this.ver = -1;
    this.stageBuilt = -1;
    this.trips = [];
    this.parts = [];
    this.tick = 0;
    this.lastHarvestT = 0;
  }
  get s() { return this.sim.s; }

  near(rig) {
    const t = rig.target, d = rig.dist;
    for (const r of [CAMPOS_RECT, CENTRAL_RECT]) {
      const dx = Math.max(r.x0 - t.x, 0, t.x - r.x1 - 1), dz = Math.max(r.z0 - t.z, 0, t.z - r.z1 - 1);
      if (Math.hypot(dx, dz) < d * 0.9 + 16) return true;
    }
    return false;
  }
  // ---------------------------------------------------------------- construcción perezosa
  build() {
    this.built = true;
    const w = this.w, r = M.rng(901);
    this.isSmall = w.isSmall;
    // quitar decorado lejano que caiga en las zonas nuevas (hierba alta, palmas y mogotes de relleno)
    for (const m of [w.farGrass, w.farPalms]) {
      if (!m) continue;
      const mm = new THREE.Matrix4(), p = new THREE.Vector3();
      for (let i = 0; i < m.instanceMatrix.count; i++) { m.getMatrixAt(i, mm); p.setFromMatrixPosition(mm); if (inMine(p.x, p.z)) m.setMatrixAt(i, ZERO); }
      m.instanceMatrix.needsUpdate = true;
    }
    for (const o of this.scene.children) if (o.isMesh && !o.isInstancedMesh && o.scale.x > 1.5 && Math.abs(o.position.y) < 0.01 && inMine(o.position.x, o.position.z) && o.geometry.boundingSphere?.radius !== 0) {
      if (o.position.x > 0 && Math.abs(o.scale.x - 1.6) < 0.01) o.visible = false; // mogotes de relleno
    }
    this.matCrop = w.matCrop;
    // cultivos (uno por tile): 3 mallas instanciadas, geometría hi/lo
    const cap = FIELDS.length * FIELD * FIELD;
    this.cropGeos = {};
    this.crops = {};
    for (const c of Object.keys(FIELD_CROPS)) {
      this.cropGeos[c] = { hi: CM.fieldCropGeo(c, false), lo: CM.fieldCropGeo(c, true) };
      const m = new THREE.InstancedMesh(this.cropGeos[c].hi, c === 'cane' ? w.matCrop : w.matFoliage, cap);
      m.count = 0; m.castShadow = true; m.receiveShadow = true;
      m.frustumCulled = false;
      this.scene.add(m); this.crops[c] = m;
    }
    this.lod = 'hi';
    // tractores, cuadrillas y carretas
    this.tractors = new THREE.InstancedMesh(CM.tractorGeo(), w.mat, FIELDS.length);
    this.tractors.count = 0; this.tractors.castShadow = true; this.tractors.frustumCulled = false;
    this.crew = new THREE.InstancedMesh(CM.crewGeo(1), w.mat, FIELDS.length * 6);
    this.crew.count = 0; this.crew.castShadow = true; this.crew.frustumCulled = false;
    this.crew.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(FIELDS.length * 6 * 3).fill(1), 3);
    const tints = [[1, 1, 1], [0.75, 0.85, 1.05], [1.1, 0.8, 0.8], [0.9, 1.0, 0.8], [1.05, 0.95, 0.7], [0.85, 0.85, 0.85]];
    for (let i = 0; i < FIELDS.length * 6; i++) this.crew.setColorAt(i, new THREE.Color(...tints[i % 6]));
    this.carts = new THREE.InstancedMesh(CM.oxcartGeo(), w.mat, 6);
    this.carts.count = 0; this.carts.castShadow = true; this.carts.frustumCulled = false;
    this.scene.add(this.tractors, this.crew, this.carts);
    // montón de caña del acopio
    this.pile = new THREE.Mesh(CM.canePileGeo(), w.mat);
    this.pile.position.set(ACOPIO_PILE.x, 0.5, ACOPIO_PILE.z);
    this.pile.castShadow = true;
    this.scene.add(this.pile);
    // tren
    this.loco = new THREE.Mesh(CM.locoGeo(), w.mat);
    this.loco.castShadow = true; this.loco.userData.cen = 'train';
    this.wagons = new THREE.InstancedMesh(CM.wagonGeo(), w.mat, TRAIN.wagons);
    this.wagons.castShadow = true; this.wagons.frustumCulled = false; this.wagons.userData.cen = 'train';
    this.loads = new THREE.InstancedMesh(CM.caneLoadGeo(), w.mat, TRAIN.wagons);
    this.loads.castShadow = true; this.loads.frustumCulled = false;
    this.scene.add(this.loco, this.wagons, this.loads);
    // humo: una malla instanciada para la chimenea del central y la locomotora
    this.smokeN = 72;
    this.smoke = new THREE.InstancedMesh(CM.puffGeo(), new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false }), this.smokeN);
    this.smoke.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.smokeN * 3).fill(1), 3);
    this.smoke.frustumCulled = false; this.smoke.renderOrder = 3;
    this.puffs = Array.from({ length: this.smokeN }, () => ({ life: 0 }));
    this.scene.add(this.smoke);
    // selección (cajas invisibles)
    this.pickGroup = new THREE.Group();
    this.scene.add(this.pickGroup);
    this.inv = new THREE.MeshBasicMaterial({ visible: false });
    // etiquetas propias
    this.labelBox = document.createElement('div');
    this.labelBox.className = 'labels cen-labels';
    const ui = document.getElementById('ui');
    ui.insertBefore(this.labelBox, ui.children[1] || null);
    this.labels = new Map();
    this.refresh(true);
  }
  // reconstruye lo estático cuando cambia la tierra o la obra
  refresh(force) {
    const s = this.s, c = s.ext.central;
    const key = `${c.owned.join(',')}|${s.level >= CAMPOS_LEVEL}|${s.level >= CENTRAL_LEVEL - 3}`;
    if (force || key !== this.groundKey) { this.groundKey = key; this.buildCampos(); }
    const sk = `${c.stage}|${c.building ? c.building.stage : '-'}|${s.level >= CENTRAL_LEVEL - 3}`;
    if (force || sk !== this.stageKey) { this.stageKey = sk; this.buildCentral(); }
    this.buildPickers();
  }
  dispose(m) { if (!m) return; this.scene.remove(m); m.geometry?.dispose(); if (m.material?.map) m.material.map.dispose(); }
  // ---------------------------------------------------------------- suelo y estáticos de los campos
  buildCampos() {
    const s = this.s, c = s.ext.central, R = CAMPOS_RECT, wt = R.x1 - R.x0 + 1, ht = R.z1 - R.z0 + 1;
    const r = M.rng(77);
    const px = this.isSmall ? 8 : 12;
    const own = new Set(c.owned);
    const open = s.level >= CAMPOS_LEVEL;
    const tex = canvasTex(wt, ht, px, (g) => {
      g.fillStyle = '#7f8a45'; g.fillRect(0, 0, wt * px, ht * px);
      dots(g, wt * px, ht * px, wt * ht * 2, ['#76843f', '#8c964f', '#6d7a3a', '#94965a'], px * 0.3, px * 1.1, r);
      // guardarrayas de tierra entre los campos
      g.fillStyle = '#b8936a';
      for (const x of [36, 43, 50, 57, 64]) g.fillRect((x - R.x0) * px, 0, px, ht * px);
      for (const z of [43, 50, 57, 58, 64]) g.fillRect(0, (z - R.z0) * px, wt * px, px);
      dots(g, wt * px, ht * px, wt * ht, ['rgba(150,110,70,.25)', 'rgba(205,180,140,.25)'], 1, px * 0.25, r);
      for (const f of FIELDS) {
        const x0 = (f.x - R.x0) * px, z0 = (f.z - R.z0) * px, sz = FIELD * px;
        if (own.has(f.id)) {
          // tierra colorada con surcos
          g.fillStyle = '#9b4a2a'; g.fillRect(x0, z0, sz, sz);
          dots(g, sz, sz, 0, [], 0, 0, r);
          for (let i = 0; i < 80; i++) { g.fillStyle = r() < 0.5 ? 'rgba(120,52,30,.5)' : 'rgba(176,96,60,.45)'; g.beginPath(); g.arc(x0 + r() * sz, z0 + r() * sz, 1 + r() * px * 0.3, 0, 6.283); g.fill(); }
          g.fillStyle = 'rgba(80,32,18,.45)';
          for (let k = 0; k < FIELD * 2; k++) g.fillRect(x0 + 2, z0 + (k + 0.35) * px * 0.5, sz - 4, Math.max(1, px * 0.12));
        } else if (open) {
          g.strokeStyle = 'rgba(240,226,190,.55)'; g.lineWidth = Math.max(1, px * 0.12); g.setLineDash([px * 0.5, px * 0.4]);
          g.strokeRect(x0 + 2, z0 + 2, sz - 4, sz - 4); g.setLineDash([]);
        }
      }
    });
    this.dispose(this.camposGround);
    const gg = new THREE.PlaneGeometry(wt, ht); gg.rotateX(-Math.PI / 2); gg.translate(R.x0 + wt / 2, 0.003, R.z0 + ht / 2);
    this.camposGround = new THREE.Mesh(gg, patchMaterial(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })));
    this.camposGround.receiveShadow = true;
    this.scene.add(this.camposGround);
    // estáticos: acopio, estacas y letreros de los campos, palmas en las guardarrayas
    const parts = [];
    if (open) parts.push(M.place(CM.acopioGeo(), BLOCKS.acopio.x, BLOCKS.acopio.z));
    for (const f of FIELDS) {
      if (!open && f.level > s.level + 4) continue;
      for (const [dx, dz] of [[0, 0], [FIELD, 0], [0, FIELD], [FIELD, FIELD]]) parts.push(M.place(M.fencePost(), f.x + dx - (dx ? 0.05 : -0.05), f.z + dz - (dz ? 0.05 : -0.05)));
      if (!own.has(f.id) && open && f.level <= s.level + 2) parts.push(M.place(M.signGeo(), f.x + 0.6, f.z + 0.6, Math.PI / 4));
    }
    for (const [x, z] of [[36.5, 43.5], [64.5, 43.5], [36.5, 57.5], [50.5, 43.5], [64.5, 57.5], [43.5, 57.5]]) parts.push(M.place(M.palmGeo(3 + Math.round(x), 3.8), x, z, x));
    this.dispose(this.camposStatic);
    if (parts.length) {
      const b = new M.Builder(); parts.forEach((p) => b.add(p));
      this.camposStatic = new THREE.Mesh(b.build(), this.w.mat);
      this.camposStatic.castShadow = true; this.camposStatic.receiveShadow = true;
      this.scene.add(this.camposStatic);
    }
    this.pile.visible = open;
  }
  // ---------------------------------------------------------------- central (según la etapa) y vía
  buildCentral() {
    const s = this.s, c = s.ext.central, R = CENTRAL_RECT, wt = R.x1 - R.x0 + 1, ht = R.z1 - R.z0 + 1;
    const r = M.rng(55);
    const px = this.isSmall ? 8 : 12;
    const near = s.level >= CENTRAL_LEVEL - 3 || c.stage > 0;
    if (!this.centralGround) {
      const tex = canvasTex(wt, ht, px, (g) => {
        g.fillStyle = '#86904a'; g.fillRect(0, 0, wt * px, ht * px);
        dots(g, wt * px, ht * px, wt * ht * 2, ['#7c8744', '#909a52', '#717d3c'], px * 0.3, px, r);
        // batey del central: tierra apisonada
        g.fillStyle = '#b9a07a';
        g.fillRect((17 - R.x0) * px, (65 - R.z0) * px, 14 * px, 12 * px);
        g.fillRect((3 - R.x0) * px, (59 - R.z0) * px, 11 * px, 14 * px);
        g.fillRect((19 - R.x0) * px, (58 - R.z0) * px, 12 * px, 5 * px);
        dots(g, wt * px, ht * px, wt * ht * 1.5, ['rgba(150,120,90,.35)', 'rgba(90,70,55,.25)', 'rgba(210,190,150,.3)'], 1, px * 0.35, r);
        // hollín y bagazo junto a los molinos
        g.fillStyle = 'rgba(60,45,35,.25)'; g.beginPath(); g.ellipse((27 - R.x0) * px, (69 - R.z0) * px, px * 2.5, px * 1.6, 0, 0, 6.283); g.fill();
        g.fillStyle = 'rgba(214,196,130,.45)'; g.beginPath(); g.ellipse((21 - R.x0) * px, (75 - R.z0) * px, px * 2.2, px * 0.9, 0, 0, 6.283); g.fill();
      });
      const gg = new THREE.PlaneGeometry(wt, ht); gg.rotateX(-Math.PI / 2); gg.translate(R.x0 + wt / 2, 0.002, R.z0 + ht / 2);
      this.centralGround = new THREE.Mesh(gg, patchMaterial(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })));
      this.centralGround.receiveShadow = true;
      this.scene.add(this.centralGround);
    }
    const parts = [];
    const B = BLOCKS;
    if (c.stage === 0 && near) {
      parts.push(M.place(M.siteGeo(B.mill.w, B.mill.h), B.mill.x + B.mill.w / 2, B.mill.z + B.mill.h / 2));
    }
    if (c.stage >= 1) parts.push(M.place(CM.millGeo(Math.min(3, c.stage)), MILL_O.x, MILL_O.z));
    if (c.stage >= 2) {
      parts.push(M.place(CM.waterTowerGeo(), B.tanque.x + 0.5, B.tanque.z + 0.5));
      parts.push(M.place(CM.crossingGeo(), 16, TRACK.TOP));
      parts.push(M.place(CM.crossingGeo(), 16, TRACK.BOT));
    }
    if (c.stage >= 4) {
      parts.push(M.place(CM.stationGeo(), B.station.x, B.station.z));
      parts.push(M.place(CM.almacenesGeo(), B.almacenes.x, B.almacenes.z));
      parts.push(M.place(CM.destileriaGeo(), B.destileria.x, B.destileria.z));
    }
    // andamios de la etapa en obra
    if (c.building) {
      const st = STAGES[c.building.stage];
      const fp = st.id === 'estacion' ? [B.station, B.almacenes] : st.id === 'via' ? [{ x: MILL_O.x + 1.5, z: 74.5, w: 4.5, h: 3 }] : [B.mill];
      for (const b of fp) parts.push(M.place(CM.scaffoldGeo(b.w, b.h, st.id === 'calderas' ? 3.6 : 2.0), b.x, b.z));
    }
    this.dispose(this.centralStatic);
    if (parts.length) {
      const b = new M.Builder(); parts.forEach((p) => b.add(p));
      this.centralStatic = new THREE.Mesh(b.build(), this.w.mat);
      this.centralStatic.castShadow = true; this.centralStatic.receiveShadow = true;
      this.scene.add(this.centralStatic);
    }
    if (c.stage >= 2 && !this.track) {
      this.track = new THREE.Mesh(CM.trackGeo(), this.w.mat);
      this.track.receiveShadow = true;
      this.scene.add(this.track);
    }
    if (this.track) this.track.visible = c.stage >= 2;
    const trainOn = c.stage >= 2;
    this.loco.visible = trainOn; this.wagons.visible = trainOn; this.loads.visible = trainOn;
  }
  buildPickers() {
    for (const m of [...this.pickGroup.children]) { this.pickGroup.remove(m); m.geometry.dispose(); }
    const s = this.s, c = s.ext.central;
    const mk = (cen, x, z, w, d, h) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), this.inv); m.position.set(x, h / 2, z); m.userData.cen = cen; this.pickGroup.add(m); };
    if (s.level >= CAMPOS_LEVEL) {
      for (const f of FIELDS) if (f.level <= s.level + 4 || c.owned.includes(f.id)) mk(`field:${f.id}`, f.x + 3, f.z + 3, 6, 6, 1.2);
      mk('acopio', BLOCKS.acopio.x + 2, BLOCKS.acopio.z + 1.6, 4.4, 3.2, 2.8);
    }
    if (s.level >= CENTRAL_LEVEL - 3 || c.stage) {
      const B = BLOCKS.mill;
      mk('central', B.x + B.w / 2, B.z + B.h / 2, B.w, B.h, c.stage >= 3 ? 4 : 1);
      if (c.stage >= 3) mk('central', CHIMNEY.x, CHIMNEY.z, 1.4, 1.4, 10);
    }
    if (c.stage >= 4) {
      mk('station', BLOCKS.station.x + 4.5, BLOCKS.station.z + 2, 9, 4, 3);
      mk('central', BLOCKS.almacenes.x + 4, BLOCKS.almacenes.z + 3, 8, 6, 3);
      mk('central', BLOCKS.destileria.x + 1.5, BLOCKS.destileria.z + 1.5, 3, 3, 2.5);
    }
  }
  // ---------------------------------------------------------------- selección
  pick(ray) {
    if (!this.built) return null;
    const objs = [...this.pickGroup.children];
    if (this.loco.visible) objs.push(this.loco, this.wagons);
    const hits = ray.intersectObjects(objs, false);
    return hits.length ? hits[0].object.userData.cen : null;
  }
  // ---------------------------------------------------------------- cuadro a cuadro
  update(dt, time) {
    const rig = this.g.rig;
    if (!this.built) {
      if (this.s.level >= CAMPOS_LEVEL - 2 || this.s.ext.central?.owned.length || this.s.ext.central?.stage || this.near(rig)) this.build();
      else return;
    }
    const s = this.s, c = s.ext.central, sim = this.sim;
    if (sim.cenVer !== this.ver) { this.ver = sim.cenVer; this.refresh(false); this.cropsDirty = true; }
    // LOD de cultivos por distancia de la cámara
    const lod = rig.dist > LOD_FAR ? 'lo' : 'hi';
    if (lod !== this.lod) { this.lod = lod; for (const [k, m] of Object.entries(this.crops)) m.geometry = this.cropGeos[k][lod]; }
    // ¿se ve algo de las zonas? (si no, se ahorra la actualización)
    const vis = this.near(rig);
    this.tick -= dt;
    const working = c.owned.some((id) => c.fields[id]?.work);
    if (vis && (this.cropsDirty || working || this.tick <= 0)) { this.tick = 0.4; this.cropsDirty = false; this.updateCrops(time); }
    if (vis) this.updateWork(dt, time);
    this.updateTrips(dt);
    this.updateTrain(dt, time);
    this.updateSmoke(dt, time);
    if (this.pile.visible) { const k = Math.min(1.6, 0.25 + c.yard / 220); this.pile.scale.set(0.6 + k * 0.5, k, 0.6 + k * 0.4); this.pile.visible = c.yard > 0; }
    else if (s.level >= CAMPOS_LEVEL) this.pile.visible = c.yard > 0;
    this.updateLabels();
  }
  updateCrops(time) {
    const c = this.s.ext.central, t = now();
    const cnt = { cane: 0, tobacco: 0, tomato: 0 };
    for (const id of c.owned) {
      const st = c.fields[id];
      if (!st?.crop) continue;
      const f = FIELD_BY_ID[id];
      const m = this.crops[st.crop];
      let grow = 1, cut = 0;
      if (st.work?.kind === 'plant') grow = 0.12 * Math.min(1, (t - st.work.at) / st.work.dur * 1.2);
      else if (st.work?.kind === 'harvest') cut = Math.floor(Math.min(1, (t - st.work.at) / st.work.dur) * 36);
      else grow = 0.18 + 0.82 * Math.min(1, (t - st.at) / st.dur);
      let k = 0;
      for (let row = 0; row < FIELD; row++) for (let col = 0; col < FIELD; col++, k++) {
        const plantIdx = row * FIELD + (row % 2 ? FIELD - 1 - col : col); // mismo orden que el tractor
        if (st.work?.kind === 'plant' && plantIdx > Math.floor(Math.min(1, (t - st.work.at) / st.work.dur) * 36)) continue;
        if (plantIdx < cut) continue;
        const j = (f.n * 37 + k * 13) % 17;
        setI(m, cnt[st.crop]++, f.x + col + 0.5 + (j - 8) * 0.012, 0, f.z + row + 0.5, j * 0.37, 1, grow * (0.92 + (j % 5) * 0.03));
      }
    }
    for (const [k, m] of Object.entries(this.crops)) { m.count = cnt[k]; m.instanceMatrix.needsUpdate = true; }
  }
  updateWork(dt, time) {
    const c = this.s.ext.central, t = now();
    let nt = 0, nc = 0;
    for (const id of c.owned) {
      const st = c.fields[id];
      if (!st?.work) continue;
      const f = FIELD_BY_ID[id];
      const p = Math.min(0.999, (t - st.work.at) / st.work.dur);
      const row = Math.floor(p * FIELD), along = (p * FIELD) % 1;
      const dir = row % 2 ? -1 : 1;
      const x = f.x + 0.5 + (dir > 0 ? along : 1 - along) * (FIELD - 1), z = f.z + row + 0.5;
      // tractor en la siembra; carreta de alza en el corte (va detrás de la cuadrilla)
      if (st.work.kind === 'plant' || st.crop !== 'cane') setI(this.tractors, nt++, x, Math.sin(time * 20) * 0.01, z - 0.15, headingOf(dir, 0));
      for (let i = 0; i < 6; i++) {
        const lag = (i + 1) * 0.55 * dir;
        const cx = Math.min(f.x + FIELD - 0.3, Math.max(f.x + 0.3, x - lag)), cz = z + (i % 2 ? 0.45 : -0.45) + (st.work.kind === 'harvest' ? 0 : 0.3);
        const swing = Math.sin(time * 7 + i * 1.7);
        setI(this.crew, nc++, cx, 0, cz, headingOf(dir, 0) + (i % 2 ? 0.4 : -0.4), 1, 1, st.work.kind === 'harvest' ? 0.25 + swing * 0.2 : 0.5 + swing * 0.1);
      }
    }
    this.tractors.count = nt; this.tractors.instanceMatrix.needsUpdate = true;
    this.crew.count = nc; this.crew.instanceMatrix.needsUpdate = true;
  }
  // carretas de bueyes: llevan la cosecha del campo al acopio (y una espera en el acopio)
  updateTrips(dt) {
    const sim = this.sim, s = this.s;
    if (sim.lastHarvest && sim.lastHarvest.t !== this.lastHarvestT) {
      this.lastHarvestT = sim.lastHarvest.t;
      const f = FIELD_BY_ID[sim.lastHarvest.id];
      const from = { x: f.x + 3, z: f.z + (f.z > 60 ? -0.5 : 6.5) };
      const lane = { x: f.x - 0.5, z: from.z };
      const to = { x: ACOPIO_PILE.x + 1.6, z: 58.5 };
      this.trips.push({ pts: [from, lane, { x: lane.x, z: f.z > 60 ? 64.5 : 57.6 }, to], seg: 0, u: 0, speed: Math.min(sim.g?.ffSpeed || 1, 1) });
      if (this.trips.length > 5) this.trips.shift();
    }
    const sp = (this.g.ffSpeed || 1);
    let n = 0;
    for (let i = this.trips.length - 1; i >= 0; i--) {
      const tr = this.trips[i];
      const a = tr.pts[tr.seg], b = tr.pts[tr.seg + 1];
      const len = Math.max(0.01, Math.hypot(b.x - a.x, b.z - a.z));
      tr.u += (dt * 1.8 * Math.min(sp, 5)) / len;
      if (tr.u >= 1) { tr.u = 0; tr.seg++; if (tr.seg >= tr.pts.length - 1) { this.trips.splice(i, 1); continue; } }
      const A = tr.pts[tr.seg], Bp = tr.pts[tr.seg + 1];
      setI(this.carts, n++, A.x + (Bp.x - A.x) * tr.u, 0, A.z + (Bp.z - A.z) * tr.u, headingOf(Bp.x - A.x, Bp.z - A.z) + 0);
    }
    if (s.level >= CAMPOS_LEVEL) setI(this.carts, n++, BLOCKS.acopio.x - 1.2, 0, BLOCKS.acopio.z + 1.2, 0.3);
    this.carts.count = n; this.carts.instanceMatrix.needsUpdate = true;
  }
  updateTrain(dt, time) {
    const c = this.s.ext.central;
    if (c.stage < 2) return;
    const tr = c.train;
    const pf = {}, pb = {};
    const place = (mesh, i, sFront, len, yb = 0) => {
      loopAt(sFront, pf); loopAt(sFront - len, pb);
      const x = (pf.x + pb.x) / 2, z = (pf.z + pb.z) / 2;
      const h = headingOf(pf.x - pb.x, pf.z - pb.z);
      if (i < 0) { mesh.position.set(x, yb, z); mesh.rotation.set(0, h, 0); } else setI(mesh, i, x, yb, z, h);
      return { x, z, h };
    };
    const moving = tr.wait <= 0 && tr.v > 0.05;
    const bob = moving ? Math.sin(time * 18) * 0.012 : 0;
    const L = place(this.loco, -1, tr.s, TRAIN.loco, bob);
    let sf = tr.s - TRAIN.loco - 0.15;
    const cap = TRAIN.cap;
    let nl = 0;
    for (let k = 0; k < TRAIN.wagons; k++) {
      place(this.wagons, k, sf, TRAIN.car - 0.1, bob * 0.6);
      const fill = Math.max(0, Math.min(cap, tr.load - k * cap)) / cap;
      if (fill > 0) {
        loopAt(sf, pf); loopAt(sf - TRAIN.car + 0.1, pb);
        setI(this.loads, nl++, (pf.x + pb.x) / 2, 0.5, (pf.z + pb.z) / 2, headingOf(pf.x - pb.x, pf.z - pb.z), 1, 0.25 + fill * 0.75);
      }
      sf -= TRAIN.car;
    }
    this.wagons.instanceMatrix.needsUpdate = true;
    this.loads.count = nl; this.loads.instanceMatrix.needsUpdate = true;
    this.wagons.computeBoundingSphere?.();
    // humo de la locomotora
    const sp = this.g.ffSpeed || 1;
    const fx = L.x - Math.sin(L.h) * 1.45 * -1, fz = L.z - Math.cos(L.h) * 1.45 * -1;
    // la chimenea está 1.45 por delante del centro (−z local)
    const ux = -Math.sin(L.h), uz = -Math.cos(L.h);
    const sx = L.x + ux * (1.45 - TRAIN.loco / 2 + 1.65 - 1.65), szz = L.z + uz * (1.45 - TRAIN.loco / 2 + 1.65 - 1.65);
    this.locoSmokeT = (this.locoSmokeT || 0) - dt;
    if (this.locoSmokeT <= 0) {
      this.locoSmokeT = moving ? 0.12 / Math.max(0.4, tr.v / TRAIN.speed) : 0.7;
      this.emit(L.x + ux * 1.45, 2.0, L.z + uz * 1.45, moving ? 0.55 : 0.35, 0.55, moving ? 0.86 : 0.92);
    }
    const fx2 = this.sim.trainFx;
    if (fx2 && fx2.t !== this.fxT) {
      this.fxT = fx2.t;
      if (fx2.kind === 'whistle' || fx2.kind === 'depart') { for (let i = 0; i < 6; i++) this.emit(L.x + ux * 0.6, 1.8, L.z + uz * 0.6, 0.4, 0.9, 1.0); if (this.g.started && this.near(this.g.rig) && sp === 1) this.g.sound.play('horn'); }
      if (fx2.kind === 'unload' || fx2.kind === 'load') this.w.puff((fx2.kind === 'unload' ? 23 : 34), 0.6, (fx2.kind === 'unload' ? 76.5 : 61.5), 0xd8c890, 8, 1.2);
    }
    void fx; void fz; void sx; void szz; void wrap; void STOPS;
  }
  emit(x, y, z, size, rise, shade) {
    const p = this.puffs.find((q) => q.life <= 0);
    if (!p) return;
    p.life = p.max = 2.6 + Math.random() * 1.2;
    p.x = x + (Math.random() - 0.5) * 0.2; p.y = y; p.z = z + (Math.random() - 0.5) * 0.2;
    p.vx = 0.35 + Math.random() * 0.25; p.vz = 0.15 + Math.random() * 0.2; p.vy = rise + Math.random() * 0.3;
    p.size = size; p.shade = shade;
  }
  updateSmoke(dt, time) {
    const c = this.s.ext.central;
    if (c.stage >= 3) {
      const busy = this.sim.millBusy();
      this.chimT = (this.chimT || 0) - dt;
      if (this.chimT <= 0) { this.chimT = busy ? 0.16 : 0.6; this.emit(CHIMNEY.x, CHIMNEY.y, CHIMNEY.z, busy ? 0.9 : 0.55, busy ? 1.1 : 0.7, busy ? 0.42 : 0.8); }
    }
    let n = 0;
    for (const p of this.puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) continue;
      const a = 1 - p.life / p.max;
      p.x += p.vx * dt; p.y += p.vy * dt * (1 - a * 0.5); p.z += p.vz * dt;
      const sc = p.size * (0.6 + a * 2.6) * (a > 0.75 ? (1 - a) / 0.25 : 1);
      setI(this.smoke, n, p.x, p.y, p.z, 0, sc);
      const sh = p.shade + a * 0.25;
      this.smoke.setColorAt(n, tmpC.setRGB(sh, sh * 0.98, sh * 0.95));
      n++;
    }
    this.smoke.count = n;
    this.smoke.instanceMatrix.needsUpdate = true;
    if (this.smoke.instanceColor) this.smoke.instanceColor.needsUpdate = true;
  }
  // ---------------------------------------------------------------- etiquetas (capa propia, mismo estilo)
  label(key, x, y, z, html, cls = '', act) {
    let L = this.labels.get(key);
    if (!L) {
      L = { el: document.createElement('div'), html: '' };
      L.el.className = `wlabel ${cls}`;
      if (act) { L.el.dataset.act = act.split('|')[0]; if (act.includes('|')) L.el.dataset.id = act.split('|')[1]; }
      this.labelBox.appendChild(L.el);
      this.labels.set(key, L);
    }
    if (L.cls !== cls) { L.el.className = `wlabel ${cls}`; L.cls = cls; }
    if (L.html !== html) { L.el.innerHTML = html; L.html = html; }
    L.x = x; L.y = y; L.z = z; L.seen = true;
  }
  updateLabels() {
    for (const L of this.labels.values()) L.seen = false;
    const rig = this.g.rig;
    if (rig.dist < 95 && this.near(rig) && this.g.started) this.g.centralUI?.labels(this);
    const W = window.innerWidth, H = window.innerHeight;
    for (const [k, L] of this.labels) {
      if (!L.seen) { L.el.remove(); this.labels.delete(k); continue; }
      const p = this.g.project(L.x, L.y, L.z);
      L.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
      L.el.style.visibility = p.ok && p.x > -60 && p.x < W + 60 && p.y > 0 && p.y < H + 60 ? 'visible' : 'hidden';
    }
  }
  blobs(add) {
    if (!this.built || this.s.ext.central.stage < 2) return;
    // sombras de contacto del tren: ya proyecta sombra real; nada extra
  }
}
const tmpC = new THREE.Color();
export { GW, MILL };
