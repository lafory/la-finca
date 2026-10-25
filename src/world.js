// Escena 3D: terreno, edificios, decorado, entidades. Optimizada: estáticos fusionados + instancing.
import * as THREE from 'three';
import {
  W, H, PARCELS, BUILDINGS, PEN, START_PLOTS, START_PALMS, FLAGPOLE, TRUCK_SPOT, TRUCK_TIMES, CROPS, START_AREA,
} from './data.js';
import { isOwned, isRoad, parcelAt, now } from './state.js';
import * as M from './models.js';

const CROP_KEYS = ['tomato', 'cane', 'tobacco'];
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpE = new THREE.Euler();
const setMat = (mesh, i, x, y, z, ry = 0, s = 1, sy = s) => {
  tmpQ.setFromEuler(tmpE.set(0, ry, 0));
  tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.set(s, sy, s));
  mesh.setMatrixAt(i, tmpM);
};

export class World {
  constructor(canvas, sim) {
    this.sim = sim;
    this.s = sim.s;
    const isSmall = Math.min(window.innerWidth, window.innerHeight) < 600;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.scene = new THREE.Scene();
    const haze = new THREE.Color(0xe9bf8c);
    this.scene.background = haze;
    this.scene.fog = new THREE.Fog(haze, 45, 110);

    this.mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
    this.matDS = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });

    // Luz de atardecer
    const hemi = new THREE.HemisphereLight(0xffe2b8, 0x6b4a2a, 1.25);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffcf96, 2.6);
    sun.position.set(11 - 9, 14, 9 + 11);
    sun.target.position.set(11, 0, 9);
    sun.castShadow = true;
    const ss = isSmall ? 1024 : 2048;
    sun.shadow.mapSize.set(ss, ss);
    Object.assign(sun.shadow.camera, { left: -19, right: 19, top: 19, bottom: -19, near: 1, far: 60 });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
    this.scene.add(sun, sun.target);
    this.sun = sun;

    this.buildOutside();
    this.staticMesh = null;
    this.buildStatic();
    this.buildDynamic();
  }

  // ------------------------------------------------------------ entorno fuera de la finca
  buildOutside() {
    const r = M.rng(99);
    const size = 170, seg = 85;
    const g = new THREE.PlaneGeometry(size, size, seg, seg).toNonIndexed();
    g.rotateX(-Math.PI / 2);
    g.translate(W / 2, -0.02, H / 2);
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
    const c = new THREE.Color(), palette = [0x6f8240, 0x7e8f47, 0x8b9a52, 0x65793a, 0x9a9a5a];
    for (let t = 0; t < pos.count; t += 3) {
      const x = pos.getX(t), z = pos.getZ(t);
      const n = Math.sin(x * 0.21) * Math.cos(z * 0.17) + Math.sin((x + z) * 0.09) * 0.8;
      let hex = palette[Math.floor((n + 2) * 1.2 + r() * 0.8) % palette.length];
      if (x > 15 && x < 17 && (z < 0 || z > H)) hex = 0xc19a6a; // camino real
      const far = Math.hypot(x - W / 2, z - H / 2) > 18;
      if (far && Math.sin(x * 0.23 + 1) * Math.cos(z * 0.19) > 0.82) hex = (Math.floor(z * 1.5) % 2) ? 0x9b4a2a : 0x8a3f24; // canteros de tierra colorada
      c.set(hex);
      for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (t + k) * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.deleteAttribute('uv');
    const ground = new THREE.Mesh(g, this.mat);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Cañaverales y palmares alrededor (instanciados)
    const cane = M.caneLowGeo();
    const caneSpots = [];
    const field = (x0, z0, x1, z1) => { for (let z = z0; z < z1; z += 1.2) for (let x = x0; x < x1; x += 1.2) caneSpots.push([x + 0.5 + (r() - 0.5) * 0.3, z + 0.5 + (r() - 0.5) * 0.3]); };
    field(-14, 3, -4, 15); field(24, 15, 36, 26); field(-10, -16, 3, -6); field(23, -12, 34, -3);
    const caneMesh = new THREE.InstancedMesh(cane, this.mat, caneSpots.length);
    caneSpots.forEach(([x, z], i) => setMat(caneMesh, i, x, 0, z, r() * 0.4, 0.95 + r() * 0.2, 0.9 + r() * 0.35));
    caneMesh.castShadow = false; caneMesh.receiveShadow = true;
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
    // mogotes en el horizonte
    for (const [x, z, sd] of [[-30, -20, 1], [-14, -38, 2], [6, -42, 3], [-42, 0, 4], [30, -36, 5]]) {
      const m = new THREE.Mesh(M.mogoteGeo(sd), this.mat);
      m.position.set(x, 0, z); m.scale.setScalar(1.6);
      this.scene.add(m);
    }
    // polvo dorado flotando
    const n = 90, pg = new THREE.BufferGeometry(), pp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pp.set([r() * W, 0.3 + r() * 3, r() * H], i * 3);
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    this.motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffe2a0, size: 0.07, transparent: true, opacity: 0.7, depthWrite: false }));
    this.scene.add(this.motes);
  }

  // ------------------------------------------------------------ estáticos (se rehacen al comprar tierra)
  buildStatic() {
    const s = this.s, r = M.rng(5);
    if (this.staticMesh) { this.scene.remove(this.staticMesh); this.staticMesh.geometry.dispose(); }
    const parts = [];
    // Terreno por tiles
    const plotSet = new Set(s.plots.map((p) => `${p.x},${p.z}`));
    const allPlots = new Set([...START_PLOTS, ...PARCELS.flatMap((p) => p.plots)].map(([x, z]) => `${x},${z}`));
    const tile = new THREE.PlaneGeometry(1, 1).toNonIndexed();
    tile.rotateX(-Math.PI / 2);
    for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
      const owned = isOwned(s, x, z), road = isRoad(x);
      const chk = (x + z) % 2 ? 1.03 : 0.97;
      let hex;
      if (road) hex = M.worn(x === 15 ? 0xc9a477 : 0xbf9a6c, r, 0.05);
      else if (!owned) hex = M.worn(M.P.wild, r, 0.1);
      else if (x >= PEN.x0 && x <= PEN.x1 && z >= PEN.z0 && z <= PEN.z1) hex = M.worn(0xa48a58, r, 0.12);
      else if (x >= 4 && x <= 8 && z >= 4 && z <= 8) hex = M.worn(0xb59468, r, 0.1); // batey
      else if (allPlots.has(`${x},${z}`) || plotSet.has(`${x},${z}`)) hex = M.worn(0x9c5634, r, 0.06);
      else hex = M.worn([M.P.grass, M.P.grassB, M.P.grassC][Math.floor(r() * 3)], r, 0.06);
      const c = new THREE.Color(hex).multiplyScalar(chk);
      parts.push(M.part(tile, c.getHex(), { x: x + 0.5, z: z + 0.5 }));
      // hierba silvestre en terreno no comprado / mata en el patio
      if (!owned && !road && r() < 0.7) parts.push(M.place(M.tuftGeo(x * 31 + z, 0x6f8a3a, 0.34), x + r(), z + r()));
      else if (owned && !road && r() < 0.12 && !plotSet.has(`${x},${z}`)) parts.push(M.place(M.tuftGeo(x * 7 + z, M.P.grassC, 0.18), x + r(), z + r()));
      if (road && r() < 0.15) parts.push(M.place(M.rockGeo(x * 3 + z), x + r(), z + r()));
    }
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
    // Cerca de tablas del corral
    const fence = (ax, az, bx, bz, kind, seed) => {
      const geo = kind === 'plank' ? M.plankFenceGeo(seed) : M.wireFenceGeo(seed);
      if (ax !== bx) parts.push(M.place(geo, Math.max(ax, bx), Math.min(az, bz) + 0.5 + 0, Math.PI / 2));
      else parts.push(M.place(geo, Math.min(ax, bx) + 0.5, Math.max(az, bz)));
    };
    for (let x = PEN.x0; x <= PEN.x1; x++) {
      if (!PEN.gate.some(([gx]) => gx === x)) fence(x, PEN.z1, x, PEN.z1 + 1, 'plank', x);
      if (x < B.coop.x || x >= B.coop.x + B.coop.w) fence(x, PEN.z0 - 1, x, PEN.z0, 'plank', x + 50);
    }
    for (let z = PEN.z0; z <= PEN.z1; z++) { fence(PEN.x0 - 1, z, PEN.x0, z, 'plank', z + 20); fence(PEN.x1, z, PEN.x1 + 1, z, 'plank', z + 30); }
    parts.push(M.place(M.fencePost(), PEN.x1 + 1, PEN.z1 + 1));
    parts.push(M.place(M.fencePost(), PEN.x0 + 2, PEN.z1 + 1));
    // Cerca de alambre en el borde de lo comprado
    for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
      if (!isOwned(s, x, z) || isRoad(x)) continue;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, nz = z + dz;
        const out = nx < 0 || nz < 0 || nx >= W || nz >= H;
        if (out || (!isOwned(s, nx, nz) && !isRoad(nx))) fence(x, z, nx, nz, 'wire', x * 13 + z * 7 + dx);
      }
    }
    // Parcelas: decorado comprado o letrero "Se vende"
    for (const p of PARCELS) {
      const owned = s.parcels.includes(p.id);
      if (owned) for (const d of p.decor || []) if (d.kind === 'tobaccoHouse') parts.push(M.place(M.tobaccoHouseGeo(), d.x + d.w / 2, d.z + d.h / 2));
      if (!owned) {
        const [cx, cz] = this.parcelCenter(p);
        parts.push(M.place(M.signGeo(), cx, cz, Math.PI / 4));
      }
    }
    const geo = new M.Builder();
    parts.forEach((g) => geo.add(g));
    this.staticMesh = new THREE.Mesh(geo.build(), this.mat);
    this.staticMesh.castShadow = true;
    this.staticMesh.receiveShadow = true;
    this.scene.add(this.staticMesh);

    // Palmas (instanciadas): dentro + fuera
    if (this.palms) { this.scene.remove(this.palms); this.palms.dispose(); }
    const inside = [...START_PALMS, ...PARCELS.filter((p) => s.parcels.includes(p.id)).flatMap((p) => p.palms)];
    const all = inside.map(([x, z]) => [x + 0.5, z + 0.5]);
    this.palmGeo = this.palmGeo || M.palmGeo(3, 3.6);
    this.palms = new THREE.InstancedMesh(this.palmGeo, this.mat, all.length);
    const pr = M.rng(17);
    all.forEach(([x, z], i) => setMat(this.palms, i, x, 0, z, pr() * 6.28, 0.72 + pr() * 0.18));
    this.palms.castShadow = true; this.palms.receiveShadow = true;
    this.scene.add(this.palms);
    if (!this.farPalms) {
      this.farPalms = new THREE.InstancedMesh(M.palmLowGeo(2, 3.6), this.mat, this.outsidePalms.length);
      this.outsidePalms.forEach(([x, z], i) => setMat(this.farPalms, i, x, 0, z, pr() * 6.28, 0.75 + pr() * 0.3));
      this.scene.add(this.farPalms);
    }
    this.palmsInsideCount = inside.length;
    this.buildPlots();
    this.buildPickers();
  }
  parcelCenter(p) {
    // centro del rectángulo, ajustado a un tile libre (sin canteros ni palmas)
    const r = p.rect;
    let cx = Math.floor((r.x0 + r.x1) / 2), cz = Math.floor((r.z0 + r.z1) / 2);
    const bad = new Set([...p.plots, ...p.palms, ...(p.decor || []).flatMap((d) => [[d.x, d.z]])].map(([x, z]) => `${x},${z}`));
    if (bad.has(`${cx},${cz}`)) cz = r.z0 === 0 ? r.z1 : r.z0;
    return [cx + 0.5, cz + 0.5];
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
          const m = new THREE.InstancedMesh(st === 0 ? (this.sproutGeo ||= M.cropGeo('tomato', 0)) : M.cropGeo(c, st), this.mat, n);
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
    // huevos
    this.eggMesh = new THREE.InstancedMesh(M.eggGeo(), this.mat, 16);
    this.eggMesh.castShadow = true;
    this.eggMesh.count = 0;
    this.scene.add(this.eggMesh);
    // gallinas
    this.henGeos = [0, 1, 2, 3].map((v) => M.chickenGeo(v));
    this.henMeshes = new Map();
    this.rooster = new THREE.Mesh(M.roosterGeo(), this.mat);
    this.rooster.position.set(PEN.x1 + 1, 0.62, PEN.z0 + 0.7);
    this.rooster.rotation.y = 0.9;
    this.rooster.castShadow = true;
    this.scene.add(this.rooster);
    // camión
    this.truck = new THREE.Group();
    const body = new THREE.Mesh(M.truckGeo(), this.mat);
    body.castShadow = true; body.receiveShadow = true;
    this.truck.add(body);
    this.truckBody = body;
    this.crates = [];
    const cg = [M.crateGeo(0), M.crateGeo(1)];
    [[-0.3, 0.45], [0.3, 0.45], [-0.3, 1.0], [0.3, 1.0], [0, 1.45], [0, 0.72]].forEach(([x, z], i) => {
      const c = new THREE.Mesh(cg[i % 2], this.mat);
      c.position.set(x, 0.46 + (i >= 4 ? 0.3 : 0), z);
      c.castShadow = true; c.visible = false;
      body.add(c); this.crates.push(c);
    });
    this.scene.add(this.truck);
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
    // personas
    this.player = this.makePerson(M.P.white, M.P.hat, 1);
    this.basket = new THREE.Mesh(M.basketGeo(), this.mat);
    this.basket.position.set(0.22, 0.5, -0.12);
    this.player.root.add(this.basket);
    this.workerViews = [];
    // humo del fogón
    this.smoke = [];
    const sg = new THREE.IcosahedronGeometry(0.12, 0);
    const smat = new THREE.MeshLambertMaterial({ color: 0xd8d0c4, transparent: true, opacity: 0.5, depthWrite: false });
    for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(sg, smat); m.visible = false; this.scene.add(m); this.smoke.push({ m, t: i / 7 }); }
    // polvo del camión / estallidos
    this.puffs = [];
    const pg = new THREE.IcosahedronGeometry(0.15, 0);
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(pg, new THREE.MeshLambertMaterial({ color: 0xcfae80, transparent: true, opacity: 0.6, depthWrite: false }));
      m.visible = false; this.scene.add(m); this.puffs.push({ m, life: 0, vx: 0, vy: 0, vz: 0 });
    }
    // marcador de destino
    const ring = new THREE.RingGeometry(0.36, 0.46, 24);
    ring.rotateX(-Math.PI / 2);
    this.marker = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xfff1c9, transparent: true, opacity: 0.0, depthWrite: false }));
    this.marker.position.y = 0.03;
    this.scene.add(this.marker);
    this.markerT = 0;
  }
  makePerson(shirt, hat, seed) {
    const parts = M.personParts(shirt, hat, seed);
    const root = new THREE.Group();
    const body = new THREE.Mesh(parts.body, this.mat);
    const legL = new THREE.Mesh(parts.leg, this.mat), legR = new THREE.Mesh(parts.leg, this.mat);
    const armL = new THREE.Mesh(parts.arm, this.mat), armR = new THREE.Mesh(parts.arm, this.mat);
    legL.position.set(-0.08, 0.5, 0); legR.position.set(0.08, 0.5, 0);
    armL.position.set(-0.23, 0.92, 0); armR.position.set(0.23, 0.92, 0);
    for (const m of [body, legL, legR, armL, armR]) { m.castShadow = true; root.add(m); }
    this.scene.add(root);
    return { root, legL, legR, armL, armR, body };
  }
  posePerson(v, ent, time) {
    v.root.position.set(ent.x, 0, ent.z);
    // giro suave
    const target = ent.face + Math.PI;
    let d = target - v.root.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    v.root.rotation.y += d * 0.25;
    const sw = ent.moving ? Math.sin(ent.walk) * 0.6 : 0;
    v.legL.rotation.x = sw; v.legR.rotation.x = -sw;
    v.armL.rotation.x = -sw * 0.8; v.armR.rotation.x = sw * 0.8;
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

  truckPose(time) {
    const tr = this.s.truck, el = now() - tr.at;
    let z = TRUCK_SPOT.z, visible = true, moving = false;
    const ease = (u) => u * u * (3 - 2 * u);
    if (tr.phase === 'leaving') { const u = Math.min(1, el / TRUCK_TIMES.leaving); z = TRUCK_SPOT.z - ease(u) * u * 38; moving = true; }
    else if (tr.phase === 'gone') visible = false;
    else if (tr.phase === 'arriving') { const u = Math.min(1, el / TRUCK_TIMES.arriving); z = TRUCK_SPOT.z + (1 - ease(u)) * 40; moving = u < 1; }
    return { x: TRUCK_SPOT.x, z, visible, moving };
  }

  update(dt, time) {
    const s = this.s, sim = this.sim;
    // jugador y trabajadores
    this.posePerson(this.player, sim.player, time);
    this.basket.visible = Object.values(s.inv).some((v) => v > 0);
    this.syncWorkers();
    sim.workers.forEach((w, i) => this.posePerson(this.workerViews[i], w, time));
    // huevos
    this.eggMesh.count = Math.min(16, s.eggs.length);
    for (let i = 0; i < this.eggMesh.count; i++) { const e = s.eggs[i]; setMat(this.eggMesh, i, e.x, 0, e.z, e.id); }
    this.eggMesh.instanceMatrix.needsUpdate = true;
    // gallinas
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
    // camión
    const tp = this.truckPose(time);
    this.truck.visible = tp.visible;
    this.truck.position.set(tp.x, 0, tp.z);
    this.truckBody.position.y = tp.moving ? Math.sin(time * 22) * 0.025 : 0;
    const cargo = Object.values(s.truck.cargo || {}).reduce((a, b) => a + b, 0);
    this.crates.forEach((c, i) => { c.visible = cargo > i * 3; });
    if (tp.moving && tp.visible && Math.random() < dt * 14) this.puff(tp.x + (Math.random() - 0.5), 0.15, tp.z + 1.8 * (s.truck.phase === 'leaving' ? 1 : 1), 0xcfae80, 1, 0.6);
    // banderas
    for (const f of this.flags) {
      const pos = f.m.geometry.attributes.position, b = f.base;
      for (let i = 0; i < pos.count; i++) {
        const x = b[i * 3];
        pos.array[i * 3 + 2] = b[i * 3 + 2] + Math.sin(time * 4 + f.ph - x * 5) * 0.07 * x;
        pos.array[i * 3 + 1] = b[i * 3 + 1] - x * x * 0.04;
      }
      pos.needsUpdate = true;
    }
    // humo
    const cooking = !!s.kitchen.recipe;
    const K = BUILDINGS.kitchen;
    for (const sm of this.smoke) {
      sm.t += dt * 0.35;
      if (sm.t > 1) sm.t -= 1;
      sm.m.visible = cooking || (sm.t < 0.4 && Math.random() < 0);
      sm.m.position.set(K.x + 0.58 + Math.sin(sm.t * 6) * 0.1, 1.55 + sm.t * 2.2, K.z + 0.45 - sm.t * 0.4);
      sm.m.scale.setScalar(0.6 + sm.t * 1.8);
      sm.m.material.opacity = 0.45 * (1 - sm.t);
    }
    // partículas
    for (const p of this.puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt;
      p.vy -= dt * 1.2;
      p.m.scale.setScalar(Math.max(0.05, p.life * 1.4));
      p.m.material.opacity = Math.max(0, p.life);
      if (p.life <= 0) p.m.visible = false;
    }
    // motas
    this.motes.position.y = Math.sin(time * 0.4) * 0.2;
    this.motes.rotation.y = Math.sin(time * 0.05) * 0.02;
    // marcador
    if (this.markerT > 0) {
      this.markerT = Math.max(0, this.markerT - dt * 1.4);
      this.marker.material.opacity = this.markerT * 0.9;
      this.marker.scale.setScalar(1 + (1 - this.markerT) * 0.4);
    }
    this.updatePlots(time);
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
    this.truckPicker = mk('truck', 0, 0, 1.5, 3.6, 1.6);
    this.pickers = [
      mk('house', B.house.x + 1.5, B.house.z + 1.4, 2.6, 2.4, 2.8),
      mk('coop', B.coop.x + 1, B.coop.z + 1, 1.8, 1.4, 1.6),
      mk('kitchen', B.kitchen.x + 1, B.kitchen.z + 1, 1.8, 1.8, 2.2),
      mk('tank', B.tank.x + 0.5, B.tank.z + 0.5, 0.8, 0.8, 2.0),
      this.truckPicker,
    ];
  }
  pick(ray) {
    const tp = this.truckPose(0);
    this.truckPicker.position.set(tp.x, 0.8, tp.z);
    this.truckPicker.visible = true;
    const pickers = tp.visible ? this.pickers : this.pickers.filter((p) => p !== this.truckPicker);
    const hits = ray.intersectObjects(pickers, false);
    return hits.length ? hits[0].object.userData.kind : null;
  }
  resize(w, h) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
  }
  render(camera) { this.renderer.render(this.scene, camera); }
}
export { parcelAt, CROPS };
