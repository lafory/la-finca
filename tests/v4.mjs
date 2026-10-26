// Prueba v4a: manigua (leña, frutas, animales), volver a la finca, batey (casas, tope de trabajadores), leñero.
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VPS = {
  desktop: { viewport: { width: 1280, height: 800 } },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  ipad: { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  'phone-landscape': { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);
const RP = new globalThis.URL('../v4-report.json', import.meta.url).pathname;
const report = process.env.ONLY && fs.existsSync(RP) ? JSON.parse(fs.readFileSync(RP, 'utf8')) : {};
async function run(name, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.addInitScript(() => { window.__fincaDev = true; });
  const ev = (fn, a) => page.evaluate(fn, a);
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn)) return true; await sleep(200); } return false; };
  const closeModals = () => ev(() => document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()));
  const levelTo = async (l) => { await ev((l) => { const g = window.__finca; while (g.sim.s.level < l) g.cheat('level'); }, l); await closeModals(); await sleep(300); };
  const shot = async (n, setup) => { await ev(() => { window.__finca.sim.s.tod = 0.42; }); if (setup) { await ev(setup); await sleep(1800); } await page.screenshot({ path: OUT + `v4-${name}-${n}.png` }); };
  const res = { errors };
  await page.goto(BASE); await sleep(1200); await page.click('#start'); await sleep(800);
  await ev(() => { const g = window.__finca; g.sim.s.tutorialDone = true; g.ui.updateTutorial?.(); });
  // --- nivel 3: se abre la manigua
  res.manBtnBefore = await ev(() => !document.querySelector('#btn-manigua').classList.contains('hidden'));
  await levelTo(3);
  res.level3 = await ev(() => window.__finca.sim.s.level);
  res.manBtn = await waitFor(() => !document.querySelector('#btn-manigua').classList.contains('hidden'), 5000);
  await ev(() => document.querySelector('#btn-manigua').click()); await sleep(600);
  res.inManigua = await ev(() => { const p = window.__finca.sim.player; return p.x >= 46 && p.z < 40; });
  res.homeBtn = await ev(() => !document.querySelector('#btn-home').classList.contains('hidden'));
  await ev(() => window.__finca.setSpeed(5));
  // talar: tocar de verdad un árbol en pantalla (el más cercano a la entrada)
  const target = await ev(() => {
    const g = window.__finca, p = g.sim.player;
    const list = [];
    for (let z = 20; z < 40; z++) for (let x = 46; x < 88; x++) { const pl = g.sim.plantAtTile(x, z); if (pl && pl.kind === 'arbol') list.push(pl); }
    list.sort((a, b) => Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z));
    for (const pl of list) { if (g.sim.pathTo(p, g.sim.goalsFor({ kind: 'wplant', id: pl.id }))) return { id: pl.id, x: pl.x, z: pl.z }; }
    return null;
  });
  res.tree = target;
  const wood0 = await ev(() => window.__finca.sim.s.wood);
  if (target) {
    await ev((t) => { const g = window.__finca; g.rig.goal.set(t.x + 0.5, 0, t.z + 0.5); g.rig.goalDist = 16; g.rig.manualUntil = performance.now() + 1e5; }, target);
    await sleep(1500);
    res.tapKind = await ev((t) => { const g = window.__finca, q = g.project(t.x + 0.5, 1.6, t.z + 0.5); const k = g.debugPick(q.x, q.y).kind; g.tap(q.x, q.y); return k + ' → ' + (g.sim.player.task?.kind || 'none'); }, target);
    if (!/wplant/.test(res.tapKind)) await ev((t) => window.__finca.sim.command({ kind: 'wplant', id: t.id }), target);
    res.chopped = await waitFor(`window.__finca.sim.s.wood > ${wood0}`, 40000);
    res.wood = await ev(() => window.__finca.sim.s.wood);
    res.stump = await ev((t) => !!window.__finca.sim.s.chopped[t.id], target);
  }
  // frutas
  const fruit = await ev(() => {
    const g = window.__finca, p = g.sim.player, list = [];
    for (let z = 0; z < 40; z++) for (let x = 46; x < 88; x++) { const pl = g.sim.plantAtTile(x, z); if (pl && ['mango', 'guayaba', 'coco'].includes(pl.kind) && g.sim.fruitReady(pl)) list.push(pl); }
    list.sort((a, b) => Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z));
    for (const pl of list) if (g.sim.pathTo(p, g.sim.goalsFor({ kind: 'wplant', id: pl.id }))) { g.sim.command({ kind: 'wplant', id: pl.id }); return pl.kind; }
    return null;
  });
  res.fruitKind = fruit;
  if (fruit) res.fruitPicked = await waitFor(`window.__finca.sim.s.inv['${fruit}'] > 0`, 40000);
  // atrapar un animal (no el caballo)
  await ev(() => { const sim = window.__finca.sim; for (let i = 0; i < 6; i++) sim.spawnWild(); });
  res.wildCount = await ev(() => window.__finca.sim.s.wild.length);
  const t0 = Date.now();
  while (Date.now() - t0 < 60000) {
    const st = await ev(() => {
      const g = window.__finca, sim = g.sim, p = sim.player;
      if (sim.s.carry.length) return 'caught';
      if (p.task?.kind === 'wild' && sim.wildById(p.task.id)) return 'chasing';
      const list = sim.s.wild.filter((a) => a.kind !== 'caballo').sort((a, b) => Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z));
      for (const a of list) if (sim.command({ kind: 'wild', id: a.id })) { g.rig.goal.set(a.x, 0, a.z); return 'go ' + a.kind; }
      return 'none';
    });
    if (st === 'caught') break;
    await sleep(700);
  }
  res.carry = await ev(() => window.__finca.sim.s.carry.map((c) => c.kind));
  await ev(() => window.__finca.setSpeed(1));
  // foto de la manigua
  await shot('manigua', () => { const g = window.__finca, p = g.sim.player; g.rig.goal.set(p.x + 3, 0, p.z - 6); g.rig.goalDist = 26; g.rig.manualUntil = performance.now() + 1e5; });
  // volver a la finca entrega lo que llevas
  const caught0 = await ev(() => window.__finca.sim.s.stats.caught || 0);
  await ev(() => document.querySelector('#btn-home').click()); await sleep(600);
  res.backInFarm = await ev(() => { const p = window.__finca.sim.player; return p.x < 46 && p.z < 40; });
  res.delivered = await ev(() => window.__finca.sim.s.carry.length === 0);
  res.caught = caught0;
  // --- nivel 5: batey
  await levelTo(5);
  await ev(() => { const g = window.__finca; g.cheat('money'); g.cheat('wood'); });
  const cap0 = await ev(() => window.__finca.sim.workerCap());
  await ev(() => document.querySelector('#btn-batey').click()); await sleep(600);
  res.inBatey = await ev(() => { const p = window.__finca.sim.player; return p.z >= 42 && p.x <= 30; });
  await ev(() => window.__finca.ui.openLand()); await sleep(400);
  res.buildBtn = await ev(() => !!document.querySelector('[data-act="build"][data-id="casa1"]:not([disabled])'));
  await ev(() => document.querySelector('[data-act="build"][data-id="casa1"]')?.click()); await sleep(400);
  res.house = await ev(() => !!window.__finca.sim.s.built.casa1);
  res.capUp = await ev((c) => window.__finca.sim.workerCap() > c, cap0);
  // leñero (nivel 4) por el desktop
  if (name === 'desktop') {
    await levelTo(9);
    await ev(() => { const g = window.__finca; for (let i = 0; i < 6; i++) { g.cheat('money'); g.cheat('wood'); } for (const k of ['casa2', 'casa3', 'bodega', 'casa4', 'casa5']) g.sim.build(k); g.sim.upgradeHouse('casa1'); g.sim.hire('recolector'); g.sim.hire('lenador'); });
    await closeModals();
    res.lenadorHired = await ev(() => !!window.__finca.sim.workers.find((w) => w.role === 'lenador'));
    const w0 = await ev(() => window.__finca.sim.s.stats.wood || 0);
    await ev(() => window.__finca.setSpeed(20));
    res.lenadorWood = await waitFor(`(window.__finca.sim.s.stats.wood || 0) > ${w0}`, 90000);
    await ev(() => window.__finca.setSpeed(1));
    res.lenadorStatus = await ev(() => window.__finca.sim.workers.find((w) => w.role === 'lenador').status);
  }
  await ev(() => window.__finca.ui.closeSheet());
  await shot('batey', () => { const g = window.__finca; g.rig.goal.set(14, 0, 49); g.rig.goalDist = 30; g.rig.manualUntil = performance.now() + 1e5; });
  await shot('mundo', () => { const g = window.__finca; g.viewWorld(); });
  res.fps = await ev(() => window.__finca.fps.value);
  // guardar y recargar: lo nuevo sobrevive
  await ev(() => window.__finca.sim.s && (window.__finca.saveTimer = 99));
  await sleep(600);
  const before = await ev(() => { const s = window.__finca.sim.s; return { wood: s.wood, houses: Object.keys(s.built).filter((k) => k.startsWith('casa')).length, level: s.level }; });
  await page.reload(); await sleep(1500); await page.click('#start'); await sleep(800);
  const after = await ev(() => { const s = window.__finca.sim.s; return { wood: s.wood, houses: Object.keys(s.built).filter((k) => k.startsWith('casa')).length, level: s.level }; });
  res.persist = JSON.stringify(before) === JSON.stringify(after) ? true : { before, after };
  await ctx.close();
  return res;
}
for (const name of ONLY) {
  try { report[name] = await run(name, VPS[name]); } catch (e) { report[name] = { crash: String(e) }; }
  console.log(name, JSON.stringify(report[name]));
}
fs.writeFileSync(RP, JSON.stringify(report, null, 1));
await browser.close();
