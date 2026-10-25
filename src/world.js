// Escena 3D: suelo pintado, edificios, decorado, entidades, fila de camiones.
// Estilizado-realista: PBR (MeshStandard), texturas procedurales, viento, sombras suaves y de contacto.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  W, H, PARCELS, BUILDINGS, PEN, START_PLOTS, START_PALMS, FLAGPOLE, TRUCK_SPOT, CROPS,
} from './data.js';
import { isOwned, isRoad, parcelAt, now } from './state.js';
import * as M from './models.js';
import { patchMaterial, TIME } from './shaders.js';
import { groundTexture, grassTileTexture, blobTexture, skyTexture } from './textures.js';

const CROP_KEYS = ['tomato', 'cane', 'tobacco'];
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpE = new THREE.Euler();
const setMat = (mesh, i, x, y, z, ry = 0, s = 1, sy = s, sz = s) => {
  tmpQ.setFromEuler(tmpE.set(0, ry, 0));
  tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.set(s, sy, sz));
  mesh.setMatrixAt(i, tmpM);
};

export const QUALITY = {
  alta: { dpr: 2, shadow: 2048, grass: 1, env: true },
  media: { dpr: 1.5, shadow: 1024, grass: 0.45, env: true },
  baja: { dpr: 1, shadow: 512, grass: 0.2, env: false },
};

export class World {
  constructor(canvas, sim, quality = 'alta') {
    this.sim = sim;
    this.s = sim.s;
    this.isSmall = Math.min(window.innerWidth, window.innerHeight) < 600;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.scene = new THREE.Scene();
    this.scene.background = skyTexture();
    this.scene.fog = new THREE.Fog(0xe6bf92, 38, 95);

    const std = (o = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0, ...o });
    this.mat = patchMaterial(std());
    this.matFoliage = patchMaterial(std({ side: THREE.DoubleSide, roughness: 0.75 }), { sway: 0.012 });
    this.matCrop = patchMaterial(std({ roughness: 0.75 }), { sway: 0.05 });
    this.matGrass = patchMaterial(std({ side: THREE.DoubleSide, roughness: 1 }), { sway: 0.35, detail: false });
    this.matDS = std({ side: THREE.DoubleSide, roughness: 0.9 });

    // Luz de atardecer: cielo cálido + sol bajo
    this.hemi = new THREE.HemisphereLight(0xffe6c4, 0x5a4026, 1.15);
    this.scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffd2a0, 3.0);
    sun.position.set(2, 14, 20);
    sun.target.position.set(11, 0, 9);
    sun.castShadow = true;
    Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: 1, far: 60 });
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.035;
    sun.shadow.radius = 4;
    this.scene.add(sun, sun.target);
    this.sun = sun;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.blobTex = blobTexture();
    this.buildOutside();
    this.staticMesh = null;
    this.buildStatic();
    this.buildDynamic();
    this.setQuality(quality);
  }

  setQuality(q) {
    const Q = QUALITY[q] || QUALITY.alta;
    this.quality = q;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.dpr));
    const size = this.isSmall ? Math.min(Q.shadow, 1024) : Q.shadow;
    if (this.sun.shadow.mapSize.x !== size) {
      this.sun.shadow.mapSize.set(size, size);
      this.sun.shadow.map?.dispose();
      this.sun.shadow.map = null;
    }
    this.scene.environment = Q.env ? this.envTex : null;
    this.scene.environmentIntensity = 0.35;
    this.grassFactor = Q.grass;
    if (this.grass) this.grass.count = Math.floor(this.grassTotal * Q.grass);
    if (this.farGrass) this.farGrass.count = Math.floor(this.farGrassTotal * Q.grass);
  }

  // ------------------------------------------------------------ entorno fuera de la finca
  buildOutside() {
    const r = M.rng(99);
    const size = 170, seg = 60;
    const g = new THREE.PlaneGeometry(size, size, 84, 84);
    g.rotateX(-Math.PI / 2);
    g.translate(W / 2, -0.03, H / 2);
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
    const c = new THREE.Color(), ca = new THREE.Color(0x65793a), cb = new THREE.Color(0x94965a), road = new THREE.Color(0xc4a072), earth = new THREE.Color(0x9b4a2a);
    for (let t = 0; t < pos.count; t++) {
      const x = pos.getX(t), z = pos.getZ(t);
      const n = Math.sin(x * 0.21) * Math.cos(z * 0.17) * 0.6 + Math.sin((x + z) * 0.09) * 0.5 + Math.sin(x * 0.53 - z * 0.41) * 0.2 + (r() - 0.5) * 0.15;
      c.copy(ca).lerp(cb, Math.min(1, Math.max(0, n * 0.5 + 0.5)));
      const far = Math.hypot(x - W / 2, z - H / 2) > 18;
      if (far) { const e = Math.sin(x * 0.23 + 1) * Math.cos(z * 0.19); if (e > 0.7) c.lerp(earth, Math.min(1, (e - 0.7) * 4) * 0.85); }
      if (z < 0 || z > H) { const d = Math.abs(x - 16); if (d < 1.6) c.lerp(road, Math.min(1, (1.6 - d) * 1.4)); }
      col.set([c.r, c.g, c.b], t * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 3, pos.getZ(i) / 3);
    const tex = grassTileTexture();
    const ground = new THREE.Mesh(g, patchMaterial(new THREE.MeshStandardMaterial({ vertexColors: true, map: tex, roughness: 1 })));
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Cañaverales alrededor (instanciados, con viento)
    const cane = M.caneLowGeo();
    const caneSpots = [];
    const field = (x0, z0, x1, z1) => { for (let z = z0; z < z1; z += 1.1) for (let x = x0; x < x1; x += 1.1) caneSpots.push([x + 0.5 + (r() - 0.5) * 0.3, z + 0.5 + (r() - 0.5) * 0.3]); };
    field(-14, 3, -4, 15); field(24, 15, 36, 26); field(-10, -16, 3, -6); field(23, -12, 34, -3);
    const caneMesh = new THREE.InstancedMesh(cane, this.matCrop, caneSpots.length);
    caneSpots.forEach(([x, z], i) => setMat(caneMesh, i, x, 0, z, r() * 6, 0.95 + r() * 0.2, 0.9 + r() * 0.35));
    caneMesh.receiveShadow = true;
    this.scene.add(caneMesh);

    const palmSpots = [];
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = 16 + r() * 34;
      const x = W / 2 + Math.cos(a) * d, z = H / 2 + Math.sin(a) * d;
      if (x > 14 && x < 18) continue;
      palmSpots.push([x, z]);
    }
    for (let i = 0; i < 6; i++) palmSpots.push([-2 - r() * 3, r() * H], [W + 1 + r() * 3, r() * H], [r() * W, -2 - r() * 3], [r() * W, H + 1 + r() * 3]);
    this.outsidePalms = palmSpots.filter(([x]) => !(x > 14.5 && x < 17.5));
    for (const [x, z, sd] of [[-30, -20, 1], [-14, -38, 2], [6, -42, 3], [-42, 0, 4], [30, -36, 5]]) {
      const m = new THREE.Mesh(M.mogoteGeo(sd), this.mat);
      m.position.set(x, 0, z); m.scale.setScalar(1.6);
      this.scene.add(m);
    }
    // hierba alta alrededor
    const spots = [];
    for (let i = 0; i < 2600; i++) {
      const x = -10 + r() * (W + 20), z = -10 + r() * (H + 20);
      if (x >= 0 && x < W && z >= 0 && z < H) continue;
      if (x > 14.8 && x < 17.2) continue;
      spots.push([x, z]);
    }
    this.farGrass = new THREE.InstancedMesh(M.grassClumpGeo(9, 0.42), this.matGrass, spots.length);
    spots.forEach(([x, z], i) => setMat(this.farGrass, i, x, 0, z, r() * 6, 0.9 + r() * 0.8));
    this.farGrass.receiveShadow = true;
    this.farGrassTotal = spots.length;
    this.scene.add(this.farGrass);
    // polvo dorado flotando
    const n = 90, pg = new THREE.BufferGeometry(), pp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pp.set([r() * W, 0.3 + r() * 3, r() * H], i * 3);
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    this.motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffe2a0, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false }));
    this.scene.add(this.motes);
  }

  // ------------------------------------------------------------ estáticos (se rehacen al comprar tierra)
  buildStatic() {
    const s = this.s, r = M.rng(5);
    if (this.staticMesh) { this.scene.remove(this.staticMesh); this.staticMesh.geometry.dispose(); }
    const parts = [];
    const plotSet = new Set(s.plots.map((p) => `${p.x},${p.z}`));
    // Suelo pintado (una malla, una textura)
    if (this.groundMesh) { this.scene.remove(this.groundMesh); this.groundMesh.material.map.dispose(); }
    const px = this.isSmall ? 40 : 64;
    const gtex = groundTexture(s, plotSet, px);
    const gg = new THREE.PlaneGeometry(W, H);
    gg.rotateX(-Math.PI / 2);
    gg.translate(W / 2, 0, H / 2);
    this.groundMesh = new THREE.Mesh(gg, patchMaterial(new THREE.MeshStandardMaterial({ map: gtex, roughness: 0.95 })));
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);
    // piedras en el camino
    for (let z = 0; z < H; z++) for (let x = 15; x <= 16; x++) if (r() < 0.12) parts.push(M.place(M.rockGeo(x * 3 + z), x + r(), z + r()));
    // Edificios
    const B = BUILDINGS;
    const center = (b) => [b.x + b.w / 2, b.z + b.h / 2];
    parts.push(M.place(M.bohioGeo(), ...center(B.house)));
    parts.push(M.place(M.coopGeo(), ...center(B.coop)));
    parts.push(M.place(M.kitchenGeo(), ...center(B.kitchen)));
    parts.push(M.place(M.ceibaGeo(), ...center(B.ceiba)));
    parts.push(M.place(M.tankGeo(), ...center(B.tank)));
    parts.push(M.place(M.flagPoleGeo(2.6), FLAGPOLE[0] + 0.5, FLAGPOLE[1] + 0.5));
    parts.push(M.place(M.flagPoleGeo(1.2), B.house.x + 2.75, B.house.z + 2.3, 0, 0.02));
    parts.push(M.place(M.wheelDecorGeo(), 4.5, 8.5, 0.3, 0, 1));
    for (let i = 0; i < 6; i++) parts.push(M.place(M.rockGeo(100 + i), 4.2 + r() * 0.6 + (i % 2) * 9.5, 12.5 + r() * 0.4));
    const fence = (ax, az, bx, bz, kind, seed) => {
      const geo = kind === 'plank' ? M.plankFenceGeo(seed) : M.wireFenceGeo(seed);
      if (ax !== bx) parts.push(M.place(geo, Math.max(ax, bx), Math.min(az, bz) + 0.5, Math.PI / 2));
      else parts.push(M.place(geo, Math.min(ax, bx) + 0.5, Math.max(az, bz)));
    };
    for (let x = PEN.x0; x <= PEN.x1; x++) {
      if (!PEN.gate.some(([gx]) => gx === x)) fence(x, PEN.z1, x, PEN.z1 + 1, 'plank', x);
      if (x < B.coop.x || x >= B.coop.x + B.coop.w) fence(x, PEN.z0 - 1, x, PEN.z0, 'plank', x + 50);
    }
    for (let z = PEN.z0; z <= PEN.z1; z++) { fence(PEN.x0 - 1, z, PEN.x0, z, 'plank', z + 20); fence(PEN.x1, z, PEN.x1 + 1, z, 'plank', z + 30); }
    parts.push(M.place(M.fencePost(), PEN.x1 + 1, PEN.z1 + 1));
    parts.push(M.place(M.fencePost(), PEN.x0 + 2, PEN.z1 + 1));
    for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
      if (!isOwned(s, x, z) || isRoad(x)) continue;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, nz = z + dz;
        const out = nx < 0 || nz < 0 || nx >= W || nz >= H;
        if (out || (!isOwned(s, nx, nz) && !isRoad(nx))) fence(x, z, nx, nz, 'wire', x * 13 + z * 7 + dx);
      }
    }
    for (const p of PARCELS) {
      const owned = s.parcels.includes(p.id);
      if (owned) for (const d of p.decor || []) if (d.kind === 'tobaccoHouse') parts.push(M.place(M.tobaccoHouseGeo(), d.x + d.w / 2, d.z + d.h / 2));
      if (!owned) { const [cx, cz] = this.parcelCenter(p); parts.push(M.place(M.signGeo(), cx, cz, Math.PI / 4)); }
    }
    const geo = new M.Builder();
    parts.forEach((g) => geo.add(g));
    this.staticMesh = new THREE.Mesh(geo.build(), this.mat);
    this.staticMesh.castShadow = true;
    this.staticMesh.receiveShadow = true;
    this.scene.add(this.staticMesh);

    // Palmas (instanciadas, con viento)
    if (this.palms) { this.scene.remove(this.palms); this.palms.dispose(); }
    const inside = [...START_PALMS, ...PARCELS.filter((p) => s.parcels.includes(p.id)).flatMap((p) => p.palms)];
    const all = inside.map(([x, z]) => [x + 0.5, z + 0.5]);
    this.palmGeo = this.palmGeo || M.palmGeo(3, 3.6);
    this.palms = new THREE.InstancedMesh(this.palmGeo, this.matFoliage, all.length);
    const pr = M.rng(17);
    all.forEach(([x, z], i) => setMat(this.palms, i, x, 0, z, pr() * 6.28, 0.72 + pr() * 0.18));
    this.palms.castShadow = true; this.palms.receiveShadow = true;
    this.scene.add(this.palms);
    this.palmSpots = all;
    if (!this.farPalms) {
      this.farPalms = new THREE.InstancedMesh(this.palmGeo, this.matFoliage, this.outsidePalms.length);
      this.outsidePalms.forEach(([x, z], i) => setMat(this.farPalms, i, x, 0, z, pr() * 6.28, 0.7 + pr() * 0.3));
      this.scene.add(this.farPalms);
    }
    // Hierba en el terreno (más densa en lo no comprado)
    if (this.grass) { this.scene.remove(this.grass); this.grass.dispose(); }
    const spots = [];
    const gr = M.rng(31);
    const busy = new Set();
    for (const b of Object.values(B)) for (let z = b.z; z < b.z + b.h; z++) for (let x = b.x; x < b.x + b.w; x++) busy.add(`${x},${z}`);
    for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
      if (isRoad(x) || plotSet.has(`${x},${z}`) || busy.has(`${x},${z}`)) continue;
      if (x >= PEN.x0 && x <= PEN.x1 && z >= PEN.z0 && z <= PEN.z1) continue;
      if (x >= 4 && x <= 8 && z >= 4 && z <= 8) continue;
      const owned = isOwned(s, x, z);
      const n = owned ? 4 : 9;
      for (let i = 0; i < n; i++) spots.push([x + gr(), z + gr(), owned ? 0.75 : 1.2]);
    }
    this.grass = new THREE.InstancedMesh(M.grassClumpGeo(3, 0.3), this.matGrass, spots.length);
    spots.forEach(([x, z, sc], i) => setMat(this.grass, i, x, 0, z, gr() * 6, sc * (0.7 + gr() * 0.6)));
    this.grass.receiveShadow = true;
    this.grassTotal = spots.length;
    this.grass.count = Math.floor(spots.length * (this.grassFactor ?? 1));
    this.scene.add(this.grass);
    this.buildPlots();
    this.buildBlobs();
    this.buildPickers();
  }
  parcelCenter(p) {
    const r = p.rect;
    let cx = Math.floor((r.x0 + r.x1) / 2), cz = Math.floor((r.z0 + r.z1) / 2);
    const bad = new Set([...p.plots, ...p.palms, ...(p.decor || []).flatMap((d) => [[d.x, d.z]])].map(([x, z]) => `${x},${z}`));
    if (bad.has(`${cx},${cz}`)) cz = r.z0 === 0 ? r.z1 : r.z0;
    return [cx + 0.5, cz + 0.5];
  }

  // ------------------------------------------------------------ sombras de contacto
  buildBlobs() {
    if (!this.blobs) {
      const g = new THREE.PlaneGeometry(1, 1);
      g.rotateX(-Math.PI / 2);
      this.blobs = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ map: this.blobTex, transparent: true, depthWrite: false, opacity: 0.55, color: 0x2a1a0c, polygonOffset: true, polygonOffsetFactor: -2 }), 200);
      this.blobs.renderOrder = 1;
      this.scene.add(this.blobs);
    }
    const B = BUILDINGS;
    this.staticBlobs = [
      [B.house.x + 1.5, B.house.z + 1.3, 3.6, 3.2], [B.coop.x + 1, B.coop.z + 1, 2.4, 2], [B.kitchen.x + 1, B.kitchen.z + 1, 2.4, 2.4],
      [B.ceiba.x + 1, B.ceiba.z + 1, 2.2, 2.2], [B.tank.x + 0.5, B.tank.z + 0.5, 1.2, 1.2],
      ...this.palmSpots.map(([x, z]) => [x, z, 0.8, 0.8]),
    ];
  }
  updateBlobs() {
    let i = 0;
    const add = (x, z, sx, sz, ry = 0) => { if (i < 200) setMat(this.blobs, i++, x, 0.012, z, ry, sx, 1, sz); };
    for (const [x, z, sx, sz] of this.staticBlobs) add(x, z, sx, sz);
    const sim = this.sim;
    add(sim.player.x, sim.player.z, 0.7, 0.7);
    for (const w of sim.workers) add(w.x, w.z, 0.7, 0.7);
    for (const c of this.s.chickens) add(c.x, c.z, 0.5, 0.55);
    for (const tv of this.truckViews.values()) if (tv.g.visible) add(tv.g.position.x, tv.g.position.z + 0.2, 1.9, 4.2);
    this.blobs.count = i;
    this.blobs.instanceMatrix.needsUpdate = true;
  }

  // ------------------------------------------------------------ canteros y cultivos instanciados
  buildPlots() {
    const n = START_PLOTS.length + PARCELS.reduce((a, p) => a + p.plots.length, 0);
    if (!this.plotMesh) {
      this.plotMesh = new THREE.InstancedMesh(M.plotGeo(), this.mat, n);
      this.plotMesh.receiveShadow = true;
      this.plotMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3).fill(1), 3);
      this.scene.add(this.plotMesh);
      this.cropMeshes = {};
      for (const c of CROP_KEYS) {
        this.cropMeshes[c] = [0, 1, 2].map((st) => {
          const m = new THREE.InstancedMesh(st === 0 ? (this.sproutGeo ||= M.cropGeo('tomato', 0)) : M.cropGeo(c, st), this.matCrop, n);
          m.castShadow = st > 0; m.receiveShadow = true; m.count = 0;
          this.scene.add(m);
          return m;
        });
      }
      this.sparkles = new THREE.InstancedMesh(M.sparkleGeo(), new THREE.MeshBasicMaterial({ color: 0xffd36a, fog: false }), n);
      this.sparkles.count = 0;
      this.scene.add(this.sparkles);
    }
    this.plotsDirty = true;
  }
  updatePlots(time) {
    const s = this.s, t = now();
    this.plotMesh.count = s.plots.length;
    const counts = {};
    for (const c of CROP_KEYS) counts[c] = [0, 0, 0];
    let sp = 0;
    const wet = new THREE.Color(0.62, 0.55, 0.52), dry = new THREE.Color(1, 1, 1);
    s.plots.forEach((p, i) => {
      if (this.plotsDirty) setMat(this.plotMesh, i, p.x + 0.5, 0, p.z + 0.5);
      this.plotMesh.setColorAt(i, p.crop && p.watered ? wet : dry);
      if (!p.crop) return;
      const prog = this.sim.plotProgress(p, t);
      const st = prog >= 1 ? 2 : prog < 0.33 ? 0 : 1;
      const mesh = this.cropMeshes[p.crop][st];
      const grow = st === 1 ? 0.75 + (prog - 0.33) * 0.4 : 1;
      setMat(mesh, counts[p.crop][st]++, p.x + 0.5, 0, p.z + 0.5, 0, 1, grow);
      if (st === 2) setMat(this.sparkles, sp++, p.x + 0.5, (p.crop === 'cane' ? 1.7 : 1.15) + Math.sin(time * 3 + i) * 0.08, p.z + 0.5, time * 2 + i);
    });
    this.plotsDirty = false;
    this.plotMesh.instanceMatrix.needsUpdate = true;
    this.plotMesh.instanceColor.needsUpdate = true;
    for (const c of CROP_KEYS) for (let st = 0; st < 3; st++) {
      const m = this.cropMeshes[c][st];
      m.count = counts[c][st];
      m.instanceMatrix.needsUpdate = true;
    }
    this.sparkles.count = sp;
    this.sparkles.instanceMatrix.needsUpdate = true;
  }

  // ------------------------------------------------------------ dinámicos
  buildDynamic() {
    const B = BUILDINGS;
    this.eggMesh = new THREE.InstancedMesh(M.eggGeo(), this.mat, 16);
    this.eggMesh.castShadow = true;
    this.eggMesh.count = 0;
    this.scene.add(this.eggMesh);
    this.henGeos = [0, 1, 2, 3].map((v) => M.chickenGeo(v));
    this.henMeshes = new Map();
    this.rooster = new THREE.Mesh(M.roosterGeo(), this.mat);
    this.rooster.position.set(PEN.x1 + 1, 0.62, PEN.z0 + 0.7);
    this.rooster.rotation.y = 0.9;
    this.rooster.castShadow = true;
    this.scene.add(this.rooster);
    // camiones (uno por cada camión de la fila)
    this.truckGeos = new Map();
    this.truckViews = new Map();
    this.crateGeos = [M.crateGeo(0), M.crateGeo(1)];
    // banderas
    this.flagGeoBase = M.flagGeo();
    this.flags = [];
    const addFlag = (x, y, z, s = 1, ry = 0) => {
      const g = this.flagGeoBase.clone();
      const m = new THREE.Mesh(g, this.matDS);
      m.position.set(x, y, z); m.scale.setScalar(s); m.rotation.y = ry;
      m.castShadow = true;
      this.scene.add(m);
      this.flags.push({ m, base: this.flagGeoBase.attributes.position.array.slice(), ph: Math.random() * 6 });
    };
    addFlag(FLAGPOLE[0] + 0.5, 2.3, FLAGPOLE[1] + 0.5, 1, 0.5);
    addFlag(B.house.x + 2.75, 1.0, B.house.z + 2.3, 0.6, 0.5);
    this.player = this.makePerson(M.P.white, M.P.hat, 1);
    this.basket = new THREE.Mesh(M.basketGeo(), this.mat);
    this.basket.position.set(0.22, 0.5, -0.12);
    this.player.root.add(this.basket);
    this.workerViews = [];
    this.smoke = [];
    const sg = new THREE.SphereGeometry(0.12, 8, 6);
    const smat = new THREE.MeshLambertMaterial({ color: 0xd8d0c4, transparent: true, opacity: 0.5, depthWrite: false });
    for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(sg, smat); m.visible = false; this.scene.add(m); this.smoke.push({ m, t: i / 7 }); }
    this.puffs = [];
    const pg = new THREE.SphereGeometry(0.15, 8, 6);
    for (let i = 0; i < 18; i++) {
      const m = new THREE.Mesh(pg, new THREE.MeshLambertMaterial({ color: 0xcfae80, transparent: true, opacity: 0.6, depthWrite: false }));
      m.visible = false; this.scene.add(m); this.puffs.push({ m, life: 0, vx: 0, vy: 0, vz: 0 });
    }
    const ring = new THREE.RingGeometry(0.36, 0.46, 32);
    ring.rotateX(-Math.PI / 2);
    this.marker = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xfff1c9, transparent: true, opacity: 0.0, depthWrite: false }));
    this.marker.position.y = 0.03;
    this.scene.add(this.marker);
    this.markerT = 0;
  }
  truckGeo(model, color) {
    const k = `${model}-${color}`;
    if (!this.truckGeos.has(k)) this.truckGeos.set(k, M.truckGeo(model, color));
    return this.truckGeos.get(k);
  }
  truckView(tr) {
    let v = this.truckViews.get(tr.id);
    if (!v) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(this.truckGeo(tr.model, tr.color), this.mat);
      body.castShadow = true; body.receiveShadow = true;
      body.userData.truckId = tr.id;
      g.add(body);
      const crates = [];
      const bedZ = tr.model === 1 ? 1.3 : 0.85;
      [[-0.3, -0.35], [0.3, -0.35], [-0.3, 0.2], [0.3, 0.2], [0, 0.7], [-0.3, 0.7]].forEach(([x, z], i) => {
        const c = new THREE.Mesh(this.crateGeos[i % 2], this.mat);
        c.position.set(x, 0.46, bedZ + z);
        c.castShadow = true; c.visible = false;
        body.add(c); crates.push(c);
      });
      this.scene.add(g);
      v = { g, body, crates, seen: true };
      this.truckViews.set(tr.id, v);
    }
    return v;
  }
  makePerson(shirt, hat, seed) {
    const parts = M.personParts(shirt, hat, seed);
    const root = new THREE.Group();
    const body = new THREE.Mesh(parts.body, this.mat);
    const legL = new THREE.Mesh(parts.leg, this.mat), legR = new THREE.Mesh(parts.leg, this.mat);
    const armL = new THREE.Mesh(parts.arm, this.mat), armR = new THREE.Mesh(parts.arm, this.mat);
    legL.position.set(-0.075, 0.5, 0); legR.position.set(0.075, 0.5, 0);
    armL.position.set(-0.2, 0.9, 0); armR.position.set(0.2, 0.9, 0);
    for (const m of [body, legL, legR, armL, armR]) { m.castShadow = true; root.add(m); }
    this.scene.add(root);
    return { root, legL, legR, armL, armR, body };
  }
  posePerson(v, ent, time) {
    v.root.position.set(ent.x, 0, ent.z);
    const target = ent.face + Math.PI;
    let d = target - v.root.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    v.root.rotation.y += d * 0.25;
    const sw = ent.moving ? Math.sin(ent.walk) * 0.6 : 0;
    v.legL.rotation.x = sw; v.legR.rotation.x = -sw;
    v.armL.rotation.x = -sw * 0.8; v.armR.rotation.x = sw * 0.8;
    v.armL.rotation.z = 0.08; v.armR.rotation.z = -0.08;
    v.body.position.y = ent.moving ? Math.abs(Math.sin(ent.walk)) * 0.04 : Math.sin(time * 2) * 0.008;
  }
  syncWorkers() {
    const ws = this.sim.workers;
    while (this.workerViews.length < ws.length) {
      const w = ws[this.workerViews.length];
      const shirt = { recolector: 0x6f8fa8, sembrador: 0xc9a34a, cocinero: 0xb8574a, camionero: 0x5f7f4f }[w.role];
      this.workerViews.push(this.makePerson(shirt, w.role === 'cocinero' || w.role === 'sembrador' ? 0xe8d6a8 : M.P.hat, 5 + this.workerViews.length));
    }
  }
  puff(x, y, z, color, n = 3, spd = 1) {
    for (let k = 0; k < n; k++) {
      const p = this.puffs.find((q) => q.life <= 0);
      if (!p) return;
      p.life = 0.7 + Math.random() * 0.4;
      p.m.material.color.set(color);
      p.m.position.set(x + (Math.random() - 0.5) * 0.3, y, z + (Math.random() - 0.5) * 0.3);
      p.vx = (Math.random() - 0.5) * spd; p.vy = 0.6 + Math.random() * spd; p.vz = (Math.random() - 0.5) * spd;
      p.m.visible = true;
    }
  }
  showMarker(x, z) { this.marker.position.x = x; this.marker.position.z = z; this.markerT = 1; }

  updateTrucks(dt, time) {
    for (const v of this.truckViews.values()) v.seen = false;
    const list = [...this.s.trucks.map((t) => [t, false]), ...this.sim.leaving.map((t) => [t, true])];
    for (const [tr, leaving] of list) {
      const v = this.truckView(tr);
      v.seen = true;
      v.g.position.set(TRUCK_SPOT.x, 0, tr.z);
      v.body.position.y = tr.moving ? Math.sin(time * 22 + tr.id) * 0.02 : 0;
      v.body.userData.front = !leaving && tr === this.s.trucks[0];
      const loaded = Object.values(tr.loaded || {}).reduce((a, b) => a + b, 0);
      v.crates.forEach((c, i) => { c.visible = loaded > i * 2; });
      if (tr.moving && Math.random() < dt * 10 && tr.z < 30) this.puff(TRUCK_SPOT.x + (Math.random() - 0.5), 0.15, tr.z + 2, 0xcfae80, 1, 0.6);
    }
    for (const [id, v] of this.truckViews) if (!v.seen) { this.scene.remove(v.g); this.truckViews.delete(id); }
  }

  update(dt, time) {
    TIME.value = time;
    const s = this.s, sim = this.sim;
    this.posePerson(this.player, sim.player, time);
    this.basket.visible = Object.values(s.inv).some((v) => v > 0);
    this.syncWorkers();
    sim.workers.forEach((w, i) => this.posePerson(this.workerViews[i], w, time));
    this.eggMesh.count = Math.min(16, s.eggs.length);
    for (let i = 0; i < this.eggMesh.count; i++) { const e = s.eggs[i]; setMat(this.eggMesh, i, e.x, 0, e.z, e.id); }
    this.eggMesh.instanceMatrix.needsUpdate = true;
    const alive = new Set();
    for (const c of s.chickens) {
      alive.add(c.id);
      let m = this.henMeshes.get(c.id);
      if (!m) { m = new THREE.Mesh(this.henGeos[c.id % 4], this.mat); m.castShadow = true; this.scene.add(m); this.henMeshes.set(c.id, m); }
      const rt = sim.chickRT.get(c.id);
      m.position.set(c.x, rt && rt.moving ? Math.abs(Math.sin(time * 14 + c.id)) * 0.04 : 0, c.z);
      if (rt) m.rotation.y = rt.face + Math.PI;
      m.rotation.x = rt && !rt.moving ? Math.max(0, Math.sin(time * 3 + c.id * 1.7)) * 0.5 : 0;
    }
    for (const [id, m] of this.henMeshes) if (!alive.has(id)) { this.scene.remove(m); this.henMeshes.delete(id); }
    this.rooster.rotation.z = Math.sin(time * 0.7) > 0.97 ? -0.3 : 0;
    this.updateTrucks(dt, time);
    for (const f of this.flags) {
      const pos = f.m.geometry.attributes.position, b = f.base;
      for (let i = 0; i < pos.count; i++) {
        const x = b[i * 3];
        pos.array[i * 3 + 2] = b[i * 3 + 2] + Math.sin(time * 4 + f.ph - x * 5) * 0.07 * x;
        pos.array[i * 3 + 1] = b[i * 3 + 1] - x * x * 0.04;
      }
      pos.needsUpdate = true;
    }
    const cooking = !!s.kitchen.recipe;
    const K = BUILDINGS.kitchen;
    for (const sm of this.smoke) {
      sm.t += dt * 0.35;
      if (sm.t > 1) sm.t -= 1;
      sm.m.visible = cooking;
      sm.m.position.set(K.x + 0.58 + Math.sin(sm.t * 6) * 0.1, 1.55 + sm.t * 2.2, K.z + 0.45 - sm.t * 0.4);
      sm.m.scale.setScalar(0.6 + sm.t * 1.8);
      sm.m.material.opacity = 0.45 * (1 - sm.t);
    }
    for (const p of this.puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt;
      p.vy -= dt * 1.2;
      p.m.scale.setScalar(Math.max(0.05, p.life * 1.4));
      p.m.material.opacity = Math.max(0, p.life);
      if (p.life <= 0) p.m.visible = false;
    }
    this.motes.position.y = Math.sin(time * 0.4) * 0.2;
    if (this.markerT > 0) {
      this.markerT = Math.max(0, this.markerT - dt * 1.4);
      this.marker.material.opacity = this.markerT * 0.9;
      this.marker.scale.setScalar(1 + (1 - this.markerT) * 0.4);
    }
    this.updatePlots(time);
    this.updateBlobs();
  }

  // ------------------------------------------------------------ selección
  buildPickers() {
    if (this.pickers) this.pickers.forEach((m) => this.scene.remove(m));
    const inv = new THREE.MeshBasicMaterial({ visible: false });
    const mk = (kind, x, z, w, d, h) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), inv);
      m.position.set(x, h / 2, z); m.userData.kind = kind; this.scene.add(m); return m;
    };
    const B = BUILDINGS;
    this.pickers = [
      mk('house', B.house.x + 1.5, B.house.z + 1.4, 2.6, 2.4, 2.8),
      mk('coop', B.coop.x + 1, B.coop.z + 1, 1.8, 1.4, 1.6),
      mk('kitchen', B.kitchen.x + 1, B.kitchen.z + 1, 1.8, 1.8, 2.2),
      mk('tank', B.tank.x + 0.5, B.tank.z + 0.5, 0.8, 0.8, 2.0),
    ];
  }
  pick(ray) {
    const bodies = [...this.truckViews.values()].map((v) => v.body);
    const hits = ray.intersectObjects([...this.pickers, ...bodies], false);
    if (!hits.length) return null;
    const o = hits[0].object;
    if (o.userData.truckId !== undefined) return o.userData.front ? 'truck' : 'truckq';
    return o.userData.kind;
  }
  resize(w, h) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (QUALITY[this.quality] || QUALITY.alta).dpr));
    this.renderer.setSize(w, h, false);
  }
  render(camera) { this.renderer.render(this.scene, camera); }
}
export { parcelAt, CROPS };
