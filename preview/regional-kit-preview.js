// Vista previa del kit: cada cultivo en sus 4 etapas (columnas) y las construcciones/piezas abajo.
// ?view=all|crops|build · ?spin=1 gira la cámara. Expone window.__kit para la prueba de Playwright.
import * as THREE from 'three';
import * as K from '../src/mambi/regional-kit.js';
import { CELL } from '../src/mambi/regional-data.js';
import { TIME } from '../src/shaders.js';

const q = new URLSearchParams(location.search), view = q.get('view') || 'all', only = q.get('only');
const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message)));
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe9d2a8);
scene.add(new THREE.HemisphereLight(0xffe6c4, 0x5a4026, 1.25));
const sun = new THREE.DirectionalLight(0xffd8a8, 2.6);
scene.add(sun, sun.target);

const crops = ['rice', 'coffee', 'cacao', 'tobacco', 'citrus', 'cane', 'cattle', 'boat', 'tobaccoHouse', 'distillery'];
const builds = [['dock', { growth: 1 }], ['nets', { growth: 1 }], ['corral', { growth: 0.7 }], ['bohio', {}], ['almacen', { growth: 1 }], ['fence', { length: 2, style: 'rail' }], ['fence', { length: 2, style: 'wire', seed: 2 }], ['palm', { height: 3.4 }], ['palm', { height: 3.0, seed: 4 }]];
const items = [];
if (only) { const o = only.split(','); o.forEach((k, row) => { const n = K.KINDS[k].crop ? 4 : 1; for (let st = 0; st < n; st++) items.push({ kind: k, opts: { stage: st }, x: st, z: row, label: st === 0 ? K.KINDS[k].label : '' }); }); }
else if (view !== 'build') crops.forEach((k, row) => { for (let st = 0; st < 4; st++) items.push({ kind: k, opts: { stage: st }, x: st, z: row, label: st === 0 ? K.KINDS[k].label : '', stageLbl: `etapa ${st}` }); });
const z0 = view === 'build' ? 0 : crops.length + 0.3;
if (!only && view !== 'crops') builds.forEach(([k, o], i) => items.push({ kind: k, opts: o, x: i % 5, z: z0 + Math.floor(i / 5), label: K.KINDS[k].label + (o.style === 'wire' ? ' (alambre)' : '') }));

const lbls = [];
const ground = new THREE.Group(); scene.add(ground);
const gmat = new THREE.MeshStandardMaterial({ color: 0x8a9a4a, roughness: 1 });
let maxX = 0, maxZ = 0;
for (const it of items) {
  const x = it.x * CELL * 1.18, z = it.z * CELL * 1.3;
  maxX = Math.max(maxX, x); maxZ = Math.max(maxZ, z);
  const tile = new THREE.Mesh(new THREE.BoxGeometry(CELL, 0.06, CELL), gmat); tile.position.set(x, -0.06, z); tile.receiveShadow = true; ground.add(tile);
  const m = K.createModel(it.kind, it.opts); m.position.set(x, 0, z); scene.add(m); it.obj = m;
  if (it.label) { const d = document.createElement('div'); d.className = 'lbl'; d.textContent = it.label; document.body.appendChild(d); lbls.push([d, new THREE.Vector3(x - CELL * 0.6, 0, z + CELL * 0.1), true]); }
}
// mismas proporciones que la escena regional: cámara alta a 45°
const cx = maxX / 2, cz = maxZ / 2;
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
sun.position.set(cx - 14, 30, cz + 18); sun.target.position.set(cx, 0, cz);
sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
const ext = Math.max(maxX, maxZ) * 0.8 + 6;
Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 120 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.04;
let yaw = +(q.get('yaw') ?? 0.42);
function frame() {
  const pitch = THREE.MathUtils.degToRad(+(q.get('pitch') ?? 40)), d = 80;
  cam.position.set(cx + Math.sin(yaw) * Math.cos(pitch) * d, Math.sin(pitch) * d, cz + Math.cos(yaw) * Math.cos(pitch) * d);
  cam.lookAt(cx, 0, cz);
  // encuadre: proyecta las esquinas
  cam.updateMatrixWorld();
  const inv = cam.matrixWorldInverse, pts = [];
  for (const [x, z] of [[-CELL, -CELL], [maxX + CELL, -CELL], [-CELL, maxZ + CELL], [maxX + CELL, maxZ + CELL]]) for (const y of [0, 3.5]) pts.push(new THREE.Vector3(x, y, z).applyMatrix4(inv));
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const asp = innerWidth / innerHeight, w = x1 - x0, h = y1 - y0, s = Math.max(w / asp, h) / 2 * 1.02;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  Object.assign(cam, { left: mx - s * asp, right: mx + s * asp, top: my + s, bottom: my - s });
  cam.updateProjectionMatrix();
}
frame();
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); frame(); });
const spin = q.get('spin') === '1';
let frames = 0;
function loop(t) {
  TIME.value = t / 1000;
  if (spin) { yaw += 0.003; frame(); }
  renderer.render(scene, cam);
  for (const [d, v] of lbls) { const p = v.clone().project(cam); d.style.left = `${(p.x * 0.5 + 0.5) * innerWidth}px`; d.style.top = `${(-p.y * 0.5 + 0.5) * innerHeight}px`; }
  if (++frames === 3) {
    const i = renderer.info.render;
    const tris = i.triangles, calls = i.calls;
    // costo por modelo (llamadas y triángulos)
    const per = items.map((it) => { let c = 0, tr = 0; it.obj.traverse((o) => { if (o.isMesh) { c++; tr += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; } }); return { kind: it.kind, stage: it.opts.stage ?? '-', calls: c, tris: Math.round(tr) }; });
    window.__kit = { ready: true, calls, tris, models: items.length, per, errors, cache: K.kitCacheSize() };
    document.getElementById('hud').textContent = `${items.length} modelos · ${calls} llamadas de dibujo (incluye ${items.length} losetas de suelo + sombras) · ${(tris / 1000).toFixed(0)}k triángulos`;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
// prueba de dispose(): crea y suelta un modelo y un instanciado
const tmp = K.createModel('rice', { growth: 0.5 }); tmp.setGrowth(1); tmp.dispose();
const inst = K.createInstanced('citrus', 8, { stage: 3 }); for (let i = 0; i < 8; i++) inst.setAt(i, i, 0); inst.dispose();
