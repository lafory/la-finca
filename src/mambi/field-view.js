// Escena 3D del campo de batalla. Reutiliza el renderer de la finca. El campo (34×24) es más grande
// que la finca de 46×40 en metros de juego: cabe un ejército, con río, cañaveral y muros.
import * as THREE from 'three';
import * as M from '../models.js';
import { COLS, ROWS, TILE, tileWorld, worldTile, inb, zone, alive } from './field.js';

const mat = () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: true });
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpE = new THREE.Euler();
const tmpC = new THREE.Color();
const _hit = new THREE.Vector3();
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function setI(mesh, i, x, y, z, ry = 0, s = 1) {
  tmpQ.setFromEuler(tmpE.set(0, ry, 0));
  tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.set(s, s, s));
  mesh.setMatrixAt(i, tmpM);
}

function fighter(shirt, hat, tool) {
  const scarf = hat == null ? 0x5c6064 : 0xb83a2e;
  const p = M.personParts(shirt, hat, tool === 'fusil' ? 5 : 3, { scarf });
  const one = new M.Builder();
  one.merge(p.body);
  one.merge(M.place(p.leg, -0.08, 0, 0, 0.5));
  one.merge(M.place(p.leg, 0.08, 0, 0, 0.5));
  one.merge(M.place(p.arm, -0.22, 0, 0, 0.85));
  one.merge(M.place(p.arm, 0.22, 0, 0, 0.85));
  if (tool === 'machete') one.box(0.045, 0.72, 0.06, 0xd8d8d0, { x: 0.32, y: 0.55, z: -0.02, rx: -0.55 });
  if (tool === 'fusil') one.box(0.05, 0.05, 0.85, 0x4a3428, { x: 0.18, y: 0.82, z: 0.02, rx: Math.PI / 2 });
  const geo = one.build();
  const g = new M.Builder();
  g.merge(M.place(geo, -0.32, 0.08, 0, 0, 0.78));
  g.merge(M.place(geo, 0.32, 0.08, 0, 0, 0.78));
  g.merge(M.place(geo, 0, -0.2, 0, 0, 0.78));
  return g.build();
}

function riders(shirt, hat, variant) {
  const scarf = hat == null ? 0x5c6064 : 0x2f5d8a;
  const p = M.personParts(shirt, hat, 4, { scarf });
  const rider = new M.Builder();
  rider.merge(p.body);
  rider.merge(M.place(p.leg, -0.08, 0, 0, 0.5));
  rider.merge(M.place(p.leg, 0.08, 0, 0, 0.5));
  rider.merge(M.place(p.arm, -0.2, 0, 0, 0.85));
  rider.merge(M.place(p.arm, 0.2, 0, 0, 0.85));
  rider.box(0.04, 0.7, 0.055, 0xe8e6de, { x: 0.28, y: 0.7, rx: -0.35 });
  const rg = rider.build();
  const horse = M.horseGeo(variant);
  const b = new M.Builder();
  b.merge(M.place(horse, -0.15, 0, 0, 0, 0.78));
  b.merge(M.place(rg, -0.15, 0, 0, 0.72, 0.58));
  return b.build();
}

function cannon(crewShirt, hat) {
  const b = new M.Builder();
  b.box(0.62, 0.14, 0.85, 0x6b4428, { y: 0.16 });
  b.box(0.7, 0.08, 0.9, 0x8b6a45, { y: 0.08 });
  b.add(M.part(new THREE.CylinderGeometry(0.09, 0.12, 0.95, 8), 0x3a3c3e, { y: 0.46, z: -0.12, rx: -Math.PI / 2 }));
  b.cyl(0.2, 0.2, 0.08, 8, 0x4a3424, { x: -0.36, y: 0.22, z: 0.12, rz: Math.PI / 2, center: true });
  b.cyl(0.2, 0.2, 0.08, 8, 0x4a3424, { x: 0.36, y: 0.22, z: 0.12, rz: Math.PI / 2, center: true });
  const p = M.personParts(crewShirt, hat, 6, { scarf: hat == null ? 0x5c6064 : 0xb83a2e });
  const one = new M.Builder();
  one.merge(p.body);
  one.merge(M.place(p.leg, -0.08, 0, 0, 0.5));
  one.merge(M.place(p.leg, 0.08, 0, 0, 0.5));
  one.merge(M.place(p.arm, -0.2, 0, 0, 0.85));
  one.merge(M.place(p.arm, 0.2, 0, 0, 0.85));
  const geo = one.build();
  b.merge(M.place(geo, -0.55, 0.2, 0.4, 0, 0.62));
  b.merge(M.place(geo, 0.5, 0.15, -0.6, 0, 0.62));
  return b.build();
}

function caneGeo() {
  const b = new M.Builder();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const x = Math.cos(a) * 0.22, z = Math.sin(a) * 0.22;
    b.cyl(0.035, 0.05, 0.85, 4, i % 2 ? 0xc6a24e : 0xd2b15c, { x, z });
    b.cone(0.16, 0.38, 5, i % 2 ? 0x6a9234 : 0x7da83c, { x, z, y: 0.82 });
  }
  return b.build();
}
function wallGeo() {
  const b = new M.Builder();
  b.box(TILE * 0.96, 1.05, 0.38, 0xc4b49a, { y: 0.02 });
  b.box(TILE * 0.96, 0.16, 0.46, 0xa89880, { y: 1.05 });
  for (let i = 0; i < 4; i++) b.box(0.18, 0.22, 0.22, 0x8f8578, { x: -0.6 + i * 0.4, y: 1.12 });
  return b.build();
}
function trenchGeo() {
  const b = new M.Builder();
  b.box(1.55, 0.16, 0.85, 0x6a4630, { y: -0.1 });
  b.box(1.4, 0.22, 0.32, 0xd2c09a, { y: 0.02, z: 0.28 });
  b.box(1.15, 0.16, 0.22, 0xc4b48a, { y: 0.16, z: 0.26 });
  return b.build();
}
function barGeo() {
  const b = new M.Builder();
  b.box(1.45, 0.28, 0.32, 0x8b5a32, { y: 0.12, rz: 0.08 });
  b.box(1.3, 0.24, 0.28, 0xa87a48, { y: 0.38, rz: -0.12 });
  b.box(0.45, 0.45, 0.45, 0x6b4a2a, { x: 0.35, y: 0.15 });
  return b.build();
}

const COLORS = {
  tierra: [0x8c9a48, 0x7d8f45, 0x73883c],
  camino: [0xc9a477, 0xb89268],
  cana: [0x87a34a, 0x73943c],
  rio: [0x3d92a0, 0x2f7f8e],
  muro: [0xb7a890, 0xa89880],
  plaza: [0xe7d7b0, 0xddc89a],
};

export class FieldView {
  constructor(renderer) {
    this.renderer = renderer;
    this.cam = new THREE.PerspectiveCamera(38, 1, 0.3, 220);
    this.focus = { x: 0, z: 0 };
    this.gfocus = { x: 0, z: 0 };
    this.dist = 32;
    this.gdist = 32;
    this.shown = new Map();
    this.fading = new Map();
    this.bursts = [];
    this.ray = new THREE.Raycaster();
    this.builtFor = '';
  }

  ensure(battle) {
    const id = `${battle.cityId}|${battle.terrain}`;
    if (this.builtFor === id && this.scene) return;
    this.dispose();
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0xe7c398);
    scene.fog = new THREE.Fog(0xe7c398, 42, 130);
    scene.add(new THREE.HemisphereLight(0xfff1d4, 0x6a5438, 1.35));
    const sun = new THREE.DirectionalLight(0xffd7a4, 1.85);
    sun.position.set(-18, 32, 14);
    scene.add(sun);
    const g = new THREE.BufferGeometry();
    const pos = [], col = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const k = battle.ground[y][x];
      const pal = COLORS[k] || COLORS.tierra;
      tmpC.set(pal[(x * 3 + y * 5) % pal.length]);
      if (k === 'tierra' || k === 'cana') tmpC.offsetHSL(0, 0, ((x * 13 + y * 7) % 5 - 2) * 0.015);
      const x0 = (x - COLS / 2) * TILE, z0 = (y - ROWS / 2) * TILE;
      const y0 = k === 'rio' ? -0.12 : 0;
      const v = [[x0, y0, z0], [x0 + TILE, y0, z0], [x0 + TILE, y0, z0 + TILE], [x0, y0, z0], [x0 + TILE, y0, z0 + TILE], [x0, y0, z0 + TILE]];
      for (const p of v) { pos.push(p[0], p[1], p[2]); col.push(tmpC.r, tmpC.g, tmpC.b); }
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    scene.add(new THREE.Mesh(g, mat()));
    this.groundGeo = g;

    const std = mat();
    this.std = std;
    const caneSpots = [], wallSpots = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      if (battle.ground[y][x] === 'cana') caneSpots.push([x, y]);
      if (battle.ground[y][x] === 'muro') wallSpots.push([x, y]);
    }
    this.cane = new THREE.InstancedMesh(caneGeo(), std, Math.max(1, caneSpots.length));
    caneSpots.forEach(([x, y], i) => {
      const [wx, wz] = tileWorld(x, y);
      setI(this.cane, i, wx, 0, wz, ((x * 5 + y) % 7) * 0.2, 0.85 + ((x + y) % 3) * 0.08);
    });
    this.cane.count = caneSpots.length;
    this.cane.instanceMatrix.needsUpdate = true;
    scene.add(this.cane);
    this.walls = new THREE.InstancedMesh(wallGeo(), std, Math.max(1, wallSpots.length));
    wallSpots.forEach(([x, y], i) => {
      const [wx, wz] = tileWorld(x, y);
      const ns = (inb(x, y - 1) && battle.ground[y - 1][x] === 'muro') || (inb(x, y + 1) && battle.ground[y + 1][x] === 'muro');
      const ew = (inb(x - 1, y) && battle.ground[y][x - 1] === 'muro') || (inb(x + 1, y) && battle.ground[y][x + 1] === 'muro');
      setI(this.walls, i, wx, 0, wz, ns && !ew ? Math.PI / 2 : 0, 1);
    });
    this.walls.count = wallSpots.length;
    this.walls.instanceMatrix.needsUpdate = true;
    scene.add(this.walls);

    const palm = M.palmGeo(3, 4.2);
    const palms = new THREE.InstancedMesh(palm, std, 16);
    for (let i = 0; i < 16; i++) {
      const edge = i % 2 === 0;
      const x = edge ? -COLS / 2 * TILE - 1.2 : COLS / 2 * TILE + 1.2;
      const z = -ROWS / 2 * TILE + (i * 1.7) % (ROWS * TILE);
      setI(palms, i, x, 0, z, i, 0.85);
    }
    palms.instanceMatrix.needsUpdate = true;
    scene.add(palms);

    this.meshes = {};
    const specs = [
      ['player', 'machete', fighter(0xeee4c8, 0xd9c08a, 'machete')],
      ['player', 'fusil', fighter(0xe7f0d8, 0xd9c08a, 'fusil')],
      ['player', 'cab', riders(0xeee4c8, 0xc9a86a, 0)],
      ['player', 'art', cannon(0xeee4c8, 0xd9c08a)],
      ['enemy', 'machete', fighter(0x8d9194, null, 'machete')],
      ['enemy', 'fusil', fighter(0x7c8084, null, 'fusil')],
      ['enemy', 'cab', riders(0x7c8084, null, 1)],
      ['enemy', 'art', cannon(0x8a8e92, null)],
    ];
    for (const [side, kind, geo] of specs) {
      const mesh = new THREE.InstancedMesh(geo, std, 24);
      mesh.count = 0;
      mesh.frustumCulled = false;
      scene.add(mesh);
      this.meshes[`${side}|${kind}`] = mesh;
    }
    this.trench = new THREE.InstancedMesh(trenchGeo(), std, 48);
    this.trench.count = 0; this.trench.frustumCulled = false; scene.add(this.trench);
    this.bar = new THREE.InstancedMesh(barGeo(), std, 32);
    this.bar.count = 0; this.bar.frustumCulled = false; scene.add(this.bar);

    const disc = new THREE.CircleGeometry(TILE * 0.42, 6);
    disc.rotateX(-Math.PI / 2);
    this.hiMat = new THREE.MeshStandardMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.55, roughness: 1, depthWrite: false });
    this.hi = new THREE.InstancedMesh(disc, this.hiMat, 500);
    this.hi.count = 0; this.hi.frustumCulled = false; scene.add(this.hi);
    const tile = new THREE.PlaneGeometry(TILE * 0.92, TILE * 0.92);
    tile.rotateX(-Math.PI / 2);
    this.zoneMat = new THREE.MeshStandardMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.16, roughness: 1, depthWrite: false });
    this.zoneMesh = new THREE.InstancedMesh(tile, this.zoneMat, 500);
    this.zoneMesh.count = 0; this.zoneMesh.frustumCulled = false; scene.add(this.zoneMesh);

    const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.72, 16), new THREE.MeshBasicMaterial({ color: 0xf2c14e, side: THREE.DoubleSide, transparent: true, opacity: 0.95 }));
    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    scene.add(ring);
    this.ring = ring;

    const pole = new THREE.Mesh(M.flagPoleGeo ? M.flagPoleGeo(2.2) : new THREE.CylinderGeometry(0.04, 0.05, 2.2, 6), std);
    const [px, pz] = tileWorld(battle.plaza.x, battle.plaza.y);
    pole.position.set(px, 0, pz);
    scene.add(pole);
    this.flagCuba = new THREE.Mesh(M.flagGeo(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide }));
    this.flagGray = new THREE.Mesh(M.part(new THREE.PlaneGeometry(0.9, 0.45, 4, 2).translate(0.45, 0, 0), 0x8a8d90), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide }));
    this.flagCuba.position.set(px, 2.15, pz);
    this.flagGray.position.set(px, 2.15, pz);
    this.flagCuba.scale.setScalar(1.3);
    this.flagGray.scale.setScalar(1.3);
    scene.add(this.flagCuba); scene.add(this.flagGray);
    this.flagPos = [px, pz];

    const puff = new THREE.SphereGeometry(0.18, 5, 4);
    this.puff = new THREE.InstancedMesh(puff, new THREE.MeshStandardMaterial({ color: 0xe6d2a4, transparent: true, opacity: 0.55, depthWrite: false, roughness: 1 }), 16);
    this.puff.count = 0; this.puff.frustumCulled = false; scene.add(this.puff);
    this.shown.clear();
    this.builtFor = id;
    this.battleRef = battle;
  }

  dispose() {
    if (!this.scene) return;
    const mats = new Set();
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const list = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of list) if (!mats.has(m)) { mats.add(m); m.dispose(); }
    });
    this.scene = null;
    this.builtFor = '';
  }

  fit(battle, who) {
    let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9, n = 0;
    const add = (x, y) => {
      const [wx, wz] = tileWorld(x, y);
      minX = Math.min(minX, wx); maxX = Math.max(maxX, wx);
      minZ = Math.min(minZ, wz); maxZ = Math.max(maxZ, wz); n++;
    };
    if (who === 'all') { add(0, 0); add(COLS - 1, ROWS - 1); }
    else {
      const mine = alive(battle, 'player');
      if (mine.length) mine.forEach((u) => add(u.x, u.y));
      else {
        for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (zone(battle, x, y) === 'troop') add(x, y);
      }
    }
    if (!n) return;
    this.gfocus.x = (minX + maxX) / 2;
    this.gfocus.z = (minZ + maxZ) / 2;
    const span = Math.max(maxX - minX, (maxZ - minZ) * 1.15, TILE * 8);
    this.gdist = Math.min(who === 'all' ? 62 : 40, Math.max(18, span * 0.92));
  }

  zoom(f) { this.gdist = Math.max(14, Math.min(64, this.gdist * f)); }
  pan(dx, dy) {
    this.cam.updateMatrixWorld();
    const e = this.cam.matrixWorld.elements;
    const rx = e[0], rz = e[2], fx = -e[8], fz = -e[10];
    const k = this.dist / 520;
    this.gfocus.x -= (dx * rx + dy * fx) * k;
    this.gfocus.z -= (dx * rz + dy * fz) * k;
    const lim = COLS * TILE * 0.55;
    this.gfocus.x = Math.max(-lim, Math.min(lim, this.gfocus.x));
    this.gfocus.z = Math.max(-lim, Math.min(lim, this.gfocus.z));
    this.focus.x = this.gfocus.x;
    this.focus.z = this.gfocus.z;
  }

  pick(clientX, clientY, canvas) {
    const r = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(ndc, this.cam);
    if (!this.ray.ray.intersectPlane(_plane, _hit)) return null;
    const [x, y] = worldTile(_hit.x, _hit.z);
    return inb(x, y) ? { x, y } : null;
  }

  project(x, y, canvas, world) {
    const wx = world ? world.x : tileWorld(x, y)[0];
    const wz = world ? world.z : tileWorld(x, y)[1];
    tmpV.set(wx, 1.15, wz).project(this.cam);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    return { x: (tmpV.x * 0.5 + 0.5) * w, y: (-tmpV.y * 0.5 + 0.5) * h, vis: tmpV.z < 1 && tmpV.x > -1.25 && tmpV.x < 1.25 && tmpV.y > -1.3 && tmpV.y < 1.3 };
  }

  burst(x, y) {
    const [wx, wz] = tileWorld(x, y);
    this.bursts.push({ x: wx, z: wz, t: 0 });
    if (this.bursts.length > 16) this.bursts.shift();
  }

  render(battle, dt, time, opts) {
    this.ensure(battle);
    const k = 1 - Math.exp(-Math.min(0.05, dt) * 8);
    this.focus.x += (this.gfocus.x - this.focus.x) * k;
    this.focus.z += (this.gfocus.z - this.focus.z) * k;
    this.dist += (this.gdist - this.dist) * k;
    const sign = battle.mode === 'defense' ? -1 : 1;
    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    this.cam.aspect = size.x / Math.max(1, size.y);
    this.cam.updateProjectionMatrix();
    // La barra de órdenes tapa el borde de abajo: mirar un poco hacia tu lado para que la tropa quede visible.
    const lift = this.dist * 0.11 * sign;
    this.cam.position.set(this.focus.x + this.dist * 0.16 * sign, this.dist * 0.8, this.focus.z + this.dist * 0.68 * sign);
    this.cam.lookAt(this.focus.x, 0.35, this.focus.z + lift);

    const buckets = {};
    for (const key of Object.keys(this.meshes)) buckets[key] = [];
    for (const u of battle.units) {
      const meshKey = `${u.side}|${u.kind}`;
      if (!this.meshes[meshKey]) continue;
      if (!u.alive) {
        if (!this.fading.has(u.id)) this.fading.set(u.id, 0.45);
      }
      let fade = 1;
      if (!u.alive) {
        fade = this.fading.get(u.id) ?? 0;
        if (fade <= 0) continue;
        this.fading.set(u.id, Math.max(0, fade - dt));
        fade = this.fading.get(u.id) / 0.45;
      }
      const [tx, tz] = tileWorld(u.x, u.y);
      let s = this.shown.get(u.id);
      if (!s) { s = { x: tx, z: tz }; this.shown.set(u.id, s); }
      const follow = 1 - Math.exp(-dt * (opts.anim ? 6.5 : 16));
      s.x += (tx - s.x) * follow;
      s.z += (tz - s.z) * follow;
      const moving = Math.hypot(tx - s.x, tz - s.z) > 0.05;
      const bob = moving ? Math.abs(Math.sin(time * (u.kind === 'cab' ? 11 : 8) + u.id)) * 0.07 : 0;
      const ry = Math.atan2(-(u.fx || 0), -(u.fy || -1));
      buckets[meshKey].push({ s, bob, ry, fade, kind: u.kind });
    }
    for (const [key, mesh] of Object.entries(this.meshes)) {
      const list = buckets[key];
      mesh.count = list.length;
      list.forEach((o, i) => setI(mesh, i, o.s.x, o.bob, o.s.z, o.ry, (o.kind === 'cab' ? 1 : 0.92) * Math.max(0.05, o.fade)));
      mesh.instanceMatrix.needsUpdate = true;
    }

    let ti = 0, bi = 0;
    for (const [kk, kind] of battle.works) {
      const x = kk % COLS, y = (kk / COLS) | 0;
      const [wx, wz] = tileWorld(x, y);
      if (kind === 'trinchera' && ti < 48) setI(this.trench, ti++, wx, 0, wz, 0, 1);
      if (kind === 'barricada' && bi < 32) setI(this.bar, bi++, wx, 0, wz, ((x + y) % 2) * 0.4, 1);
    }
    this.trench.count = ti; this.trench.instanceMatrix.needsUpdate = true;
    this.bar.count = bi; this.bar.instanceMatrix.needsUpdate = true;

    const marks = opts.marks || [];
    this.hi.count = Math.min(marks.length, 500);
    this.hiMat.color.set(opts.markColor || 0xf2c14e);
    marks.forEach((c, i) => {
      if (i >= 500) return;
      const [wx, wz] = tileWorld(c.x, c.y);
      setI(this.hi, i, wx, 0.08, wz, 0, 1);
    });
    this.hi.instanceMatrix.needsUpdate = true;

    const showZone = opts.zone;
    let zi = 0;
    if (showZone) {
      for (let y = 0; y < ROWS && zi < 500; y++) for (let x = 0; x < COLS && zi < 500; x++) {
        if (!zone(battle, x, y)) continue;
        const [wx, wz] = tileWorld(x, y);
        setI(this.zoneMesh, zi++, wx, 0.05, wz, 0, 1);
      }
    }
    this.zoneMesh.count = zi;
    this.zoneMesh.instanceMatrix.needsUpdate = true;

    const sel = opts.sel;
    this.ring.visible = !!(sel && sel.alive);
    if (sel && sel.alive) {
      const s = this.shown.get(sel.id);
      const [wx, wz] = s ? [s.x, s.z] : tileWorld(sel.x, sel.y);
      this.ring.position.set(wx, 0.12, wz);
      const pulse = 1 + Math.sin(time * 5) * 0.06;
      this.ring.scale.setScalar(pulse);
    }

    const playerOn = alive(battle, 'player').some((u) => u.x === battle.plaza.x && u.y === battle.plaza.y);
    const enemyOn = alive(battle, 'enemy').some((u) => u.x === battle.plaza.x && u.y === battle.plaza.y);
    const cuba = battle.mode === 'defense' ? !enemyOn : playerOn;
    this.flagCuba.visible = cuba;
    this.flagGray.visible = !cuba;
    const wave = Math.sin(time * 2.4) * 0.25;
    this.flagCuba.rotation.y = wave;
    this.flagGray.rotation.y = wave + 0.2;

    this.bursts = this.bursts.filter((p) => p.t < 0.7);
    this.puff.count = this.bursts.length;
    this.bursts.forEach((p, i) => {
      p.t += dt;
      setI(this.puff, i, p.x, 0.4 + p.t * 1.4, p.z, 0, 0.4 + p.t * 2.2);
    });
    this.puff.instanceMatrix.needsUpdate = true;
    this.renderer.render(sceneSafe(this), this.cam);
  }
}

function sceneSafe(view) { return view.scene; }
