// Escena 3D: suelo pintado, edificios, decorado, entidades, fila de camiones.
// Estilizado-realista: PBR (MeshStandard), texturas procedurales, viento, sombras suaves y de contacto.
import * as THREE from 'three';
import { viewSize } from './viewport.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  W, H, PARCELS, BUILDINGS, PEN, START_PLOTS, START_PALMS, FLAGPOLE, TRUCK_SPOT, CROPS, WORKERS, WORKER_ORDER,
  STRUCTURES, OBSTACLE_LIST, TRUCK_SLOTS,
} from './data.js';
import { isOwned, isRoad, parcelAt, now, parcelReachable } from './state.js';
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
    this.isSmall = Math.min(viewSize().w, viewSize().h) < 600;
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
    this.buildSkyFx();
    this.setQuality(quality);
  }

  // ------------------------------------------------------------ día y noche, nubes, faroles
  buildSkyFx() {
    this.tod = 0.6;
    this.lightTarget = this.sun.target.position.clone();
    // farol del bohío (siempre en la escena para no recompilar shaders; de día con intensidad 0)
    const B = BUILDINGS.house;
    this.lantern = new THREE.PointLight(0xffa850, 0, 9, 1.6);
    this.lantern.position.set(B.x + 1.5, 1.35, B.z + B.h + 0.15);
    this.scene.add(this.lantern);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0x3a2a1a });
    this.bulbs = [];
    const bulbGeo = new THREE.SphereGeometry(0.07, 10, 8);
    const addBulb = (x, y, z) => { const m = new THREE.Mesh(bulbGeo, bulbMat); m.position.set(x, y, z); this.scene.add(m); this.bulbs.push(m); };
    addBulb(B.x + 1.5, 1.32, B.z + B.h + 0.12);
    const K = BUILDINGS.kitchen;
    addBulb(K.x + 1, 1.25, K.z + K.h + 0.05);
    this.bulbMat = bulbMat;
    // sombras de nubes que barren el campo
    const cm = new THREE.MeshBasicMaterial({ map: this.blobTex, color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false });
    this.cloudMat = cm;
    this.clouds = [];
    const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(g, cm);
      m.scale.set(9 + i * 2.5, 1, 6 + i * 1.5);
      m.position.set(-20 + i * 13, 0.09, -10 + ((i * 37) % 40));
      m.renderOrder = 2;
      this.scene.add(m); this.clouds.push(m);
    }
    this.cDay = { sky: new THREE.Color(0xffe6c4), ground: new THREE.Color(0x5a4026), fog: new THREE.Color(0xe6bf92) };
    this.cNight = { sky: new THREE.Color(0x4a5f96), ground: new THREE.Color(0x1e2230), fog: new THREE.Color(0x27304a) };
    this.cSet = new THREE.Color(0xff8a4a); this.cNoon = new THREE.Color(0xffd2a0); this.cMoon = new THREE.Color(0xa8bcff);
    this.applyTod(0.6);
  }
  // tod: 0 = medianoche, 0.25 = amanecer, 0.5 = mediodía, 0.75 = anochecer
  applyTod(tod) {
    this.tod = tod;
    const TAU = Math.PI * 2;
    const elev = Math.sin((tod - 0.25) * TAU);
    const day = THREE.MathUtils.smoothstep(elev, -0.12, 0.22);
    const night = 1 - day;
    const isMoon = elev < 0;
    const t2 = isMoon ? tod + 0.5 : tod;
    const E = 0.94 * Math.max(0.28, Math.abs(Math.sin((t2 - 0.25) * TAU)));
    const phi = THREE.MathUtils.degToRad(129) + (t2 - 0.6) * TAU;
    const R = 20;
    this.sun.position.set(this.lightTarget.x + Math.cos(phi) * Math.cos(E) * R, Math.sin(E) * R, this.lightTarget.z + Math.sin(phi) * Math.cos(E) * R);
    const low = 1 - THREE.MathUtils.smoothstep(elev, 0.05, 0.6);
    if (isMoon) { this.sun.color.copy(this.cMoon); this.sun.intensity = 0.55 * THREE.MathUtils.smoothstep(-elev, 0.0, 0.25); }
    else { this.sun.color.copy(this.cNoon).lerp(this.cSet, low * 0.85); this.sun.intensity = 3.0 * THREE.MathUtils.smoothstep(elev, -0.02, 0.18); }
    this.hemi.color.copy(this.cDay.sky).lerp(this.cNight.sky, night);
    this.hemi.groundColor.copy(this.cDay.ground).lerp(this.cNight.ground, night);
    this.hemi.intensity = 0.42 + 0.73 * day;
    this.scene.fog.color.copy(this.cDay.fog).lerp(this.cSet, low * day * 0.35).lerp(this.cNight.fog, night);
    this.scene.backgroundIntensity = 0.22 + 0.78 * day;
    this.renderer.toneMappingExposure = 1.0 + night * 0.15;
    this.lantern.intensity = night * 5.5;
    this.bulbMat.color.setRGB(0.23 + night * 0.77, 0.16 + night * 0.62, 0.1 + night * 0.25);
    this.cloudMat.opacity = 0.16 * day;
    this.nightness = night;
  }
  // dtGame: segundos de juego de este cuadro; speed: 1, 5 o 20
  updateSky(dt, dtGame, speed) {
    let tod = this.s.tod ?? 0.6;
    const DAY = 240; // segundos de juego por día al adelantar
    if (speed > 1) tod += dtGame / DAY;
    else if (tod >= 0.3 && tod < 0.6) tod = Math.min(0.6, tod + dt / 40);
    else if (tod < 0.3 || tod > 0.6001) tod += dt / 14; // pasa la noche rápido y vuelve la tarde
    if (tod >= 1) tod -= 1;
    this.s.tod = tod;
    if (Math.abs(tod - this.tod) > 1e-5) this.applyTod(tod);
    for (const c of this.clouds) {
      c.position.x += dt * (speed > 1 ? speed * 0.6 : 1) * 0.35;
      c.position.z += dt * (speed > 1 ? speed * 0.6 : 1) * 0.25;
      if (c.position.x > W + 30) { c.position.x = -30; c.position.z = -12 + Math.random() * 30; }
      if (c.position.z > H + 25) c.position.z = -20;
    }
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
    this.applyGrassCounts();
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
    field(-14, 3, -4, 15); field(W + 4, 10, W + 16, 22); field(-10, -16, 3, -6); field(23, -12, 34, -3); field(-14, H + 4, -2, H + 14); field(24, H + 4, 38, H + 12);
    const caneMesh = new THREE.InstancedMesh(cane, this.matCrop, caneSpots.length);
    caneSpots.forEach(([x, z], i) => setMat(caneMesh, i, x, 0, z, r() * 6, 0.95 + r() * 0.2, 0.9 + r() * 0.35));
    caneMesh.receiveShadow = true;
    this.scene.add(caneMesh);

    const palmSpots = [];
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = 28 + r() * 34;
      const x = W / 2 + Math.cos(a) * d, z = H / 2 + Math.sin(a) * d;
      if (x > 14 && x < 18) continue;
      if (x > -2 && x < W + 1 && z > -2 && z < H + 1) continue;
      palmSpots.push([x, z]);
    }
    for (let i = 0; i < 6; i++) palmSpots.push([-2 - r() * 3, r() * H], [W + 1 + r() * 3, r() * H], [r() * W, -2 - r() * 3], [r() * W, H + 1 + r() * 3]);
    this.outsidePalms = palmSpots.filter(([x]) => !(x > 14.5 && x < 17.5));
    for (const [x, z, sd] of [[-30, -20, 1], [-14, -38, 2], [6, -42, 3], [-42, 0, 4], [30, -36, 5], [W + 34, 8, 6], [W + 26, H + 30, 7], [4, H + 38, 8], [-40, H + 10, 9]]) {
      const m = new THREE.Mesh(M.mogoteGeo(sd), this.mat);
      m.position.set(x, 0, z); m.scale.setScalar(1.6);
      this.scene.add(m);
    }
    // hierba alta alrededor
    const spots = [];
    for (let i = 0; i < 3400; i++) {
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
    for (let i = 0; i < n; i++) pp.set([r() * 22, 0.3 + r() * 3, r() * 18], i * 3);
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
    const px = this.isSmall ? 22 : 34; // el mapa es 46×40: textura ≤ 1564×1360
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
    const frontier = this.frontierParcels();
    for (const p of PARCELS) {
      const owned = s.parcels.includes(p.id);
      if (owned) for (const d of p.decor || []) if (d.kind === 'tobaccoHouse') parts.push(M.place(M.tobaccoHouseGeo(), d.x + d.w / 2, d.z + d.h / 2));
      if (!owned && frontier.has(p.id)) { const [cx, cz] = this.parcelCenter(p); parts.push(M.place(M.signGeo(), cx, cz, Math.PI / 4)); }
    }
    // estructuras construidas y solares
    this.windmill = null;
    for (const [id, st] of Object.entries(STRUCTURES)) {
      if (!s.parcels.includes(st.parcel)) continue;
      const cx = st.x + st.w / 2, cz = st.z + st.h / 2;
      if (!s.built[id]) { parts.push(M.place(M.siteGeo(st.w, st.h), cx, cz)); continue; }
      if (st.kind === 'animal') {
        parts.push(M.place(M.penGeo(st.w, st.h, 300 + st.x), cx, cz));
        if (id === 'gallinero2') parts.push(M.place(M.coopGeo(), st.x + st.w - 0.9, st.z + 0.9, Math.PI));
      } else if (id === 'trapiche') parts.push(M.place(M.trapicheGeo(), cx, cz));
      else if (id === 'fogon2') parts.push(M.place(M.kitchenGeo(), cx, cz));
      else if (id === 'casaTabaco') parts.push(M.place(M.tobaccoHouseGeo(), cx, cz));
      else if (id === 'anden') parts.push(M.place(M.andenGeo(), cx, cz));
      else if (id === 'pozo') { parts.push(M.place(M.wellGeo(), cx, cz)); this.windmill = [cx + 0.45, 2.95, cz + 0.17]; }
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
    // Hierba en trozos de 8×8 tiles: cada trozo es un InstancedMesh con su propia esfera para el frustum culling.
    if (this.grassChunks) for (const c of this.grassChunks) { this.scene.remove(c.mesh); c.mesh.dispose(); }
    this.grassChunks = [];
    const gr = M.rng(31);
    const busy = new Set();
    for (const b of Object.values(B)) for (let z = b.z; z < b.z + b.h; z++) for (let x = b.x; x < b.x + b.w; x++) busy.add(`${x},${z}`);
    for (const [id, st] of Object.entries(STRUCTURES)) if (s.built[id]) for (let z = st.z; z < st.z + st.h; z++) for (let x = st.x; x < st.x + st.w; x++) busy.add(`${x},${z}`);
    const cleared = new Set(s.cleared);
    for (const o of OBSTACLE_LIST) if (s.parcels.includes(o.parcel) && !cleared.has(o.id)) busy.add(`${o.x},${o.z}`);
    this.grassGeo ||= M.grassClumpGeo(3, 0.3);
    const CH = 8;
    for (let cz = 0; cz < H; cz += CH) for (let cx = 0; cx < W; cx += CH) {
      const spots = [];
      for (let z = cz; z < Math.min(H, cz + CH); z++) for (let x = cx; x < Math.min(W, cx + CH); x++) {
        if (isRoad(x) || plotSet.has(`${x},${z}`) || busy.has(`${x},${z}`)) continue;
        if (x >= PEN.x0 && x <= PEN.x1 && z >= PEN.z0 && z <= PEN.z1) continue;
        if (x >= 4 && x <= 8 && z >= 4 && z <= 8) continue;
        const owned = isOwned(s, x, z);
        const n = owned ? 3 : 6;
        for (let i = 0; i < n; i++) spots.push([x + gr(), z + gr(), owned ? 0.75 : 1.2]);
      }
      if (!spots.length) continue;
      // barajar para que bajar el count raleé parejo
      for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(gr() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
      const mesh = new THREE.InstancedMesh(this.grassGeo, this.matGrass, spots.length);
      spots.forEach(([x, z, sc], i) => setMat(mesh, i, x, 0, z, gr() * 6, sc * (0.7 + gr() * 0.6)));
      mesh.receiveShadow = true;
      mesh.computeBoundingSphere();
      this.scene.add(mesh);
      this.grassChunks.push({ mesh, total: spots.length });
    }
    this.applyGrassCounts();
    this.buildObstacles();
    this.buildAnimals();
    if (this.blades) { this.scene.remove(this.blades); this.blades = null; }
    if (this.windmill) {
      this.blades = new THREE.Mesh(M.bladesGeo(), this.mat);
      this.blades.position.set(...this.windmill);
      this.blades.rotation.y = -Math.PI / 4;
      this.blades.castShadow = true;
      this.scene.add(this.blades);
    }
    this.buildPlots();
    this.buildBlobs();
    this.buildPickers();
  }
  // Parcelas a la venta que tocan la tierra propia (las demás no muestran letrero para no llenar la vista)
  frontierParcels() {
    const s = this.s;
    return new Set(PARCELS.filter((p) => !s.parcels.includes(p.id) && parcelReachable(s, p) && p.level <= s.level + 4).map((p) => p.id));
  }
  applyGrassCounts() {
    const f = (this.grassFactor ?? 1) * (this.grassLod ?? 1);
    for (const c of this.grassChunks || []) c.mesh.count = Math.floor(c.total * f);
  }
  buildObstacles() {
    const s = this.s;
    if (this.obstacleMeshes) for (const m of this.obstacleMeshes) { this.scene.remove(m); m.dispose(); }
    this.obstacleMeshes = [];
    const cleared = new Set(s.cleared);
    const list = OBSTACLE_LIST.filter((o) => s.parcels.includes(o.parcel) && !cleared.has(o.id));
    this.obstacleGeos ||= { rock: M.rockPileGeo(5), marabu: M.marabuGeo(6), stump: M.stumpGeo(7) };
    const r = M.rng(55);
    for (const kind of ['rock', 'marabu', 'stump']) {
      const L = list.filter((o) => o.kind === kind);
      if (!L.length) continue;
      const m = new THREE.InstancedMesh(this.obstacleGeos[kind], kind === 'marabu' ? this.matFoliage : this.mat, L.length);
      L.forEach((o, i) => setMat(m, i, o.x + 0.5, 0, o.z + 0.5, r() * 6.28, 0.9 + r() * 0.3));
      m.castShadow = true; m.receiveShadow = true;
      m.computeBoundingSphere();
      this.scene.add(m);
      this.obstacleMeshes.push(m);
    }
  }
  buildAnimals() {
    const s = this.s;
    this.animals ||= [];
    const have = new Set(this.animals.map((a) => a.id));
    for (const [id, st] of Object.entries(STRUCTURES)) {
      if (st.kind !== 'animal' || !s.built[id] || have.has(id)) continue;
      const geos = [0, 1, 2].map((v) => (st.animal === 'cow' ? M.cowGeo(v) : st.animal === 'goat' ? M.goatGeo(v) : st.animal === 'pig' ? M.pigGeo(v) : M.chickenGeo(v)));
      for (let i = 0; i < st.n; i++) {
        const m = new THREE.Mesh(geos[i % 3], this.mat);
        m.castShadow = true;
        const a = { id, st, m, x: st.x + 0.8 + Math.random() * (st.w - 1.6), z: st.z + 1.2 + Math.random() * (st.h - 1.8), tx: 0, tz: 0, wait: Math.random() * 3, face: Math.random() * 6, speed: st.animal === 'cow' ? 0.35 : st.animal === 'hen' ? 0.8 : 0.5 };
        a.tx = a.x; a.tz = a.z;
        this.scene.add(m);
        this.animals.push(a);
      }
    }
  }
  updateAnimals(dt, time) {
    const sp = this.ffSpeed || 1;
    for (const a of this.animals || []) {
      const st = a.st;
      a.wait -= dt * sp;
      if (a.wait <= 0) { a.tx = st.x + 0.6 + Math.random() * (st.w - 1.2); a.tz = st.z + 1.3 + Math.random() * (st.h - 1.8); a.wait = 2 + Math.random() * 5; }
      const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
      const moving = d > 0.05;
      if (moving) { const v = Math.min(d, dt * a.speed * Math.min(sp, 6)); a.x += (dx / d) * v; a.z += (dz / d) * v; a.face = Math.atan2(dx, dz); }
      a.m.position.set(a.x, moving ? Math.abs(Math.sin(time * 8 + a.x)) * 0.02 : 0, a.z);
      a.m.rotation.y = a.face + Math.PI;
      a.m.rotation.x = !moving ? Math.max(0, Math.sin(time * 1.3 + a.z * 3)) * 0.25 : 0;
    }
    if (this.blades) this.blades.rotation.z += dt * (1.5 + sp * 0.5);
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
      ...Object.entries(STRUCTURES).filter(([id, st]) => this.s.built[id] && st.kind !== 'animal').map(([, st]) => [st.x + st.w / 2, st.z + st.h / 2, st.w + 0.4, st.h + 0.4]),
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
    for (const a of this.animals || []) add(a.x, a.z, a.st.animal === 'cow' ? 0.9 : 0.6, a.st.animal === 'cow' ? 1.6 : 0.9, a.face);
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
    this.workerViewMap = new Map();
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
  makePerson(shirt, hat, seed, look) {
    const parts = M.personParts(shirt, hat, seed, look || {});
    const root = new THREE.Group();
    root.rotation.order = 'YXZ';
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
    // animación de trabajo
    let lean = 0;
    if (ent.work > 0 && !ent.moving) {
      const k = Math.sin(time * 9);
      switch (ent.role) {
        case 'recolector': case 'cosechador': case 'sembrador':
          lean = 0.35; v.armR.rotation.x = -0.9 + k * 0.5; v.armL.rotation.x = -0.6 - k * 0.4; break;
        case 'regador': lean = 0.1; v.armR.rotation.x = -1.1 + k * 0.12; v.armR.rotation.z = -0.15; break;
        case 'cocinera': lean = 0.12; v.armR.rotation.x = -0.9; v.armR.rotation.z = -0.25 + Math.sin(time * 6) * 0.35; break;
        case 'camionero': lean = 0.05; v.armR.rotation.x = v.armL.rotation.x = -1.2 + Math.abs(k) * 0.9; v.body.position.y = Math.abs(k) * 0.05; break;
      }
    }
    if (v.crate) {
      v.crate.visible = !!ent.carry;
      if (ent.carry) { v.armL.rotation.x = v.armR.rotation.x = -1.15 + sw * 0.08; v.armL.rotation.z = 0.25; v.armR.rotation.z = -0.25; lean = Math.min(lean, -0.06); v.crate.position.y = 0.78 + v.body.position.y; }
    }
    v.root.rotation.x += (lean - v.root.rotation.x) * 0.25;
  }
  syncWorkers() {
    const ws = this.sim.workers;
    // vista por rol (se puede despedir y volver a contratar)
    const roles = new Set(ws.map((w) => w.role));
    for (const [role, v] of this.workerViewMap) if (!roles.has(role)) { this.scene.remove(v.root); this.workerViewMap.delete(role); }
    for (const w of ws) {
      if (this.workerViewMap.has(w.role)) continue;
      const L = WORKERS[w.role].look;
      const v = this.makePerson(L.shirt, L.hat, 5 + WORKER_ORDER.indexOf(w.role), L);
      const tool = new THREE.Mesh(M.toolGeo(w.role), this.mat);
      tool.position.set(0, -0.42, -0.02);
      tool.castShadow = true;
      v.armR.add(tool);
      if (w.role === 'camionero') {
        // caja de mercancía en brazos (visible cuando lleva algo al camión)
        v.crate = new THREE.Mesh(this.crateGeos ? this.crateGeos[0] : M.crateGeo(0), this.mat);
        v.crate.scale.setScalar(0.62);
        v.crate.position.set(0, 0.78, -0.3);
        v.crate.castShadow = true; v.crate.visible = false;
        v.root.add(v.crate);
        tool.visible = false;
      }
      for (const m of [v.body, v.legL, v.legR, v.armL, v.armR]) m.userData.worker = w.role;
      v.role = w.role;
      this.workerViewMap.set(w.role, v);
      this.puff(w.x, 0.5, w.z, 0xf2c14e, 6, 1.4);
    }
  }
  workerView(role) { return this.workerViewMap.get(role); }
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
      v.g.position.set(TRUCK_SPOT.x + (tr.lx || 0), 0, tr.z);
      v.body.position.y = tr.moving ? Math.sin(time * 22 + tr.id) * 0.02 : 0;
      const idx = leaving ? -1 : this.s.trucks.indexOf(tr);
      v.body.userData.front = idx === 0;
      v.body.userData.dock = idx >= 0 && this.sim.isParked(idx) ? idx : -1;
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
    for (const w of sim.workers) this.posePerson(this.workerViewMap.get(w.role), w, time);
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
    this.updateAnimals(dt, time);
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
    for (const [id, st] of Object.entries(STRUCTURES)) {
      if (!this.s.parcels.includes(st.parcel)) continue;
      this.pickers.push(mk(`struct:${id}`, st.x + st.w / 2, st.z + st.h / 2, st.w - 0.2, st.h - 0.2, this.s.built[id] ? 1.6 : 0.5));
    }
  }
  pick(ray) {
    const bodies = [...this.truckViews.values()].map((v) => v.body);
    const people = [];
    for (const v of this.workerViewMap.values()) people.push(v.body, v.legL, v.legR, v.armL, v.armR);
    const hits = ray.intersectObjects([...people, ...this.pickers, ...bodies], false);
    if (!hits.length) return null;
    const o = hits[0].object;
    if (o.userData.worker) return `worker:${o.userData.worker}`;
    if (o.userData.truckId !== undefined) return o.userData.dock === 0 || o.userData.front ? 'truck' : o.userData.dock === 1 ? 'truck:1' : 'truckq';
    return o.userData.kind;
  }
  resize(w, h) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (QUALITY[this.quality] || QUALITY.alta).dpr));
    this.renderer.setSize(w, h, false);
  }
  render(camera, rig) {
    if (rig) {
      // niebla y sombras siguen a la cámara: el mapa grande se ve completo al alejarse
      const d = rig.dist;
      this.scene.fog.near = d + 14; this.scene.fog.far = d * 1.6 + 70;
      camera.far = Math.max(220, d * 3 + 60); camera.updateProjectionMatrix();
      const snap = 2;
      const tx = Math.round(rig.target.x / snap) * snap, tz = Math.round(rig.target.z / snap) * snap;
      const ext = THREE.MathUtils.clamp(d * 0.75, 19, 48);
      const sc = this.sun.shadow.camera;
      if (tx !== this.lightTarget.x || tz !== this.lightTarget.z || sc.right !== ext) {
        this.lightTarget.set(tx, 0, tz);
        this.sun.target.position.copy(this.lightTarget);
        this.sun.target.updateMatrixWorld();
        Object.assign(sc, { left: -ext, right: ext, top: ext, bottom: -ext, far: 60 + ext });
        sc.updateProjectionMatrix();
        this.applyTod(this.tod);
      }
      // menos hierba cuando se ve la finca entera desde lejos
      const lod = d > 52 ? 0.35 : d > 36 ? 0.6 : 1;
      if (lod !== this.grassLod) { this.grassLod = lod; this.applyGrassCounts(); }
    }
    this.renderer.render(this.scene, camera);
  }
}
export { parcelAt, CROPS };
