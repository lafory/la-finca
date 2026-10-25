// Prueba headless v3.1: finca grande. Compra tierra, quita obstáculos, construye, zoom hasta ver toda la finca y vuelve.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const exe = process.env.CHROME || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const report = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ONLY = process.env.ONLY;

async function run(name, opts, touch) {
  if (ONLY && ONLY !== name) return;
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const waitFor = async (fn, ms = 10000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn)) return true; await sleep(200); } return false; };
  const shot = (f) => page.screenshot({ path: OUT + f });
  const closeAll = () => ev(() => { document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()); window.__finca.ui.closeSheet(); });
  const res = { errors };
  await page.goto(BASE, { waitUntil: 'load' });
  await sleep(1200);
  await page.click('#start');
  await sleep(1000);
  const d0 = await ev(() => ({ dist: window.__finca.rig.goalDist, max: window.__finca.rig.maxDist }));
  // finca avanzada (dinero y nivel de prueba)
  await ev(() => { const s = window.__finca.sim.s; s.money = 60000; s.tutorialDone = true; window.__finca.sim.addXp(9000); });
  await closeAll();
  // compra en orden por la hoja de Terreno (respeta "tierra de al lado")
  for (let k = 0; k < 30; k++) {
    const m = await ev(() => { window.__finca.ui.openLand(); const b = document.querySelector('#sheet-wrap [data-act="parcel"]:not([disabled])'); if (b) { b.click(); return 1; } return 0; });
    if (!m) break; await sleep(200); await closeAll();
  }
  res.parcels = await ev(() => window.__finca.sim.s.parcels.length);
  await sleep(1500);
  const d1 = await ev(() => ({ dist: window.__finca.rig.goalDist, max: window.__finca.rig.maxDist, bounds: window.__finca.rig.boundsGoal }));
  res.zoomBounds = { start: d0, afterLand: d1 };
  // construir todo
  const built = await ev(() => { const sim = window.__finca.sim; return ['anden', 'vacas', 'chivos', 'pozo', 'cerdos', 'trapiche', 'gallinero2', 'fogon2', 'casaTabaco'].map((id) => [id, sim.build(id)]); });
  res.builtFirstTry = built.filter(([, ok]) => ok).length;
  // quitar un obstáculo caminando (flujo real): toca el primero cercano al guajiro
  const obs = await ev(() => { const sim = window.__finca.sim; const p = sim.player; let best = null, bd = 1e9; for (let z = 0; z < 40; z++) for (let x = 0; x < 46; x++) { const o = sim.obstacleAt(x, z); if (o) { const d = Math.hypot(x - p.x, z - p.z); if (d < bd && sim.footprintGoals(x, z, 1, 1).length) { bd = d; best = o; } } } return best; });
  res.obstacle = obs && { id: obs.id, kind: obs.kind, cost: obs.cost, x: obs.x, z: obs.z };
  if (obs) {
    await ev((o) => { const g = window.__finca; g.rig.goal.set(o.x + 0.5, 0, o.z + 0.5); g.rig.goalDist = 14; g.rig.manualUntil = performance.now() + 1e6; }, obs);
    await sleep(1200);
    const p = await ev((o) => window.__finca.project(o.x + 0.5, 0.2, o.z + 0.5), obs);
    res.obsPick = await ev(([x, y]) => { const g = window.__finca; const THREE_ray = null; return g.debugPick ? g.debugPick(x, y) : null; }, [p.x, p.y]);
    // toque directo al mundo (las etiquetas flotantes pueden tapar el punto)
    await ev(([x, y]) => window.__finca.tap(x, y), [p.x, p.y]);
    await page.waitForSelector('[data-act="clearobs"]', { timeout: 5000 }).catch(() => {});
    await page.click('[data-act="clearobs"]', { timeout: 8000 }).catch(async () => { res.clearobsJsClick = true; await ev(() => document.querySelector('[data-act="clearobs"]')?.click()); });
    res.obstacleCleared = await waitFor(`window.__finca.sim.s.cleared.includes(${JSON.stringify(obs.id)})`, 60000);
    if (!res.obstacleCleared) res.obsDebug = await ev(() => { const sim = window.__finca.sim; const p = sim.player; return { x: p.x, z: p.z, target: JSON.stringify(sim.s.target || p.target || p.cmd || null).slice(0, 200), money: sim.s.money, sheet: document.querySelector('#sheet-wrap:not(.hidden) h2')?.textContent }; });
  }
  // limpiar por código todos los obstáculos de los solares y construir lo que falte
  res.builtTotal = await ev(() => { const sim = window.__finca.sim; for (const id of ['anden', 'vacas', 'chivos', 'pozo', 'cerdos', 'trapiche', 'gallinero2', 'fogon2', 'casaTabaco']) sim.build(id); return Object.keys(sim.s.built).length; });
  await closeAll();
  // producción: adelantar hasta que las vacas den leche
  await ev(() => window.__finca.setSpeed(20));
  res.animalReady = await waitFor('Object.values(window.__finca.sim.s.built).some((b) => b.ready === true)', 40000);
  await ev(() => window.__finca.setSpeed(1));
  await ev(() => { window.__finca.sim.s.tod = 0.6; });
  await closeAll();
  // Ver finca: encuadra todo
  await page.click('#btn-viewfarm');
  await sleep(2500);
  res.viewFarm = await ev(() => ({ dist: +window.__finca.rig.dist.toFixed(1), max: +window.__finca.rig.maxDist.toFixed(1) }));
  await shot(`v31-${name}-whole-farm.png`);
  res.perfWhole = await ev(() => { const g = window.__finca; return { fps: +g.fps.value.toFixed(1), calls: g.renderer.info.render.calls, tris: g.renderer.info.render.triangles }; });
  // zoom con rueda/pellizco al máximo y vuelta
  if (!touch) { await page.mouse.move(400, 400); for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, -200); await sleep(30); } }
  else {
    const cdp = await ctx.newCDPSession(page);
    const W = opts.viewport.width, H = opts.viewport.height;
    const tp = (d) => [{ x: W / 2 - d, y: H / 2, id: 1 }, { x: W / 2 + d, y: H / 2, id: 2 }];
    for (let rep = 0; rep < 3; rep++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(20) });
      for (let d = 20; d <= 150; d += 10) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(d) }); await sleep(15); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(100);
    }
  }
  await sleep(800);
  res.zoomedIn = await ev(() => +window.__finca.rig.goalDist.toFixed(1));
  await page.click('[data-act="center"]');
  await sleep(1500);
  res.centered = await ev(() => ({ dist: +window.__finca.rig.dist.toFixed(1), close: +window.__finca.closeDist.toFixed(1) }));
  if (name === 'desktop') {
    // primer plano de estructuras
    await ev(() => { const g = window.__finca; g.rig.goal.set(24, 0, 9); g.rig.goalDist = 26; g.rig.manualUntil = performance.now() + 1e6; });
    await sleep(1500);
    await shot('v31-desktop-structures.png');
    await ev(() => { const g = window.__finca; g.rig.goal.set(12, 0, 22); g.rig.goalDist = 24; });
    await sleep(1500);
    await shot('v31-desktop-south.png');
  }
  await ev(() => window.__finca.ui.openLand());
  await sleep(400);
  if (name === 'phone') await shot('v31-phone-land-sheet.png');
  await closeAll();
  await sleep(2500);
  res.perf = await ev(() => { const g = window.__finca; return { fps: +g.fps.value.toFixed(1), calls: g.renderer.info.render.calls, tris: g.renderer.info.render.triangles, quality: g.world.quality }; });
  res.errors = errors;
  report[name] = res;
  await ctx.close();
}
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
await run('desktop', { viewport: { width: 1280, height: 800 } }, false);
await run('phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: iphone }, true);
await run('ipad', { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, true);
await run('phone-landscape', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: iphone }, true);
await browser.close();
{ const f = OUT + 'v31-report.json'; let prev = {}; if (process.env.ONLY) try { prev = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {} fs.writeFileSync(f, JSON.stringify({ ...prev, ...report }, null, 2)); }
console.log(JSON.stringify(report, null, 1));
