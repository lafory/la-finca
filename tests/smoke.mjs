// Prueba de humo headless v2: carga, errores de consola, zoom/paneo, huevos → camión (cargar),
// fila de camiones (No tenemos, siguiente), comprar semillas con lo vendido, sembrar y cosechar, guardado.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const exe = process.env.CHROME || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const report = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ONLY = process.env.ONLY;

const shot = (page, f) => page.screenshot({ path: OUT + f });
const proj = (page, x, y, z) => page.evaluate(([x, y, z]) => window.__finca.project(x, y, z), [x, y, z]);
const tapWorld = async (page, touch, x, y, z) => { const p = await proj(page, x, y, z); if (touch) await page.touchscreen.tap(p.x, p.y); else await page.mouse.click(p.x, p.y); return p; };
const st = (page) => page.evaluate(() => { const g = window.__finca, s = g.sim.s; return { money: s.money, inv: { ...s.inv }, seeds: { ...s.seeds }, eggs: s.eggs.length, xp: s.xp, level: s.level, tut: s.tutorial, harvests: s.stats.harvests, sold: s.stats.sold, dist: g.rig.goalDist, tx: g.rig.goal.x, tz: g.rig.goal.z, fps: g.fps.value, quality: g.world.quality, trucks: s.trucks.map((t) => ({ id: t.id, z: +t.z.toFixed(2), items: t.order.items })), parked: g.sim.truckParked(), calls: g.renderer.info.render.calls, tris: g.renderer.info.render.triangles }; });
const viewport = (page) => page.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { canvas: [c.width, c.height], win: [innerWidth, innerHeight], scrollH: document.documentElement.scrollHeight }; });
const waitParked = async (page, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(() => window.__finca.sim.truckParked())) return true; await sleep(300); } return false; };
const closeModal = (page) => page.evaluate(() => document.querySelector('[data-act="modal-close"]')?.click());

async function run(name, opts, touch, shots) {
  if (ONLY && ONLY !== name) return;
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
  await page.goto(BASE, { waitUntil: 'load' });
  await sleep(1500);
  const res = { errors };
  res.title = await page.evaluate(() => { const r = document.getElementById('start').getBoundingClientRect(); return { btnBottom: Math.round(r.bottom), vh: innerHeight }; });
  await page.click('#start');
  await sleep(1500);
  res.viewport = await viewport(page);
  res.pwa = await page.evaluate(async () => {
    const man = await fetch(document.querySelector('link[rel=manifest]').href).then((r) => r.json()).catch(() => null);
    return { fsButton: getComputedStyle(document.getElementById('btn-full')).display !== 'none', manifestDisplay: man && man.display, appleCapable: !!document.querySelector('meta[name=apple-mobile-web-app-capable]') };
  });
  if (shots) await shot(page, `v2-${name}-farm.png`);
  // zoom
  const W = res.viewport.win[0], H = res.viewport.win[1];
  const s0 = await st(page);
  if (touch) {
    const cdp = await ctx.newCDPSession(page);
    const tp = (d) => [{ x: W / 2 - d, y: H / 2, id: 1 }, { x: W / 2 + d, y: H / 2, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(30) });
    for (let d = 30; d <= 110; d += 10) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(d) }); await sleep(20); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(W / 2, H / 2);
    for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, -120); await sleep(30); }
  }
  await sleep(700);
  const s1 = await st(page);
  res.zoom = { before: +s0.dist.toFixed(1), after: +s1.dist.toFixed(1), ok: s1.dist < s0.dist };
  await page.evaluate(() => window.__finca.fitFarm(true));
  await sleep(500);
  // huevos
  const eggs = await page.evaluate(() => window.__finca.sim.s.eggs.map((e) => [e.x, e.z]));
  const waitFor = async (fn, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn)) return true; await sleep(250); } return false; };
  for (const [x, z] of eggs.slice(0, 4)) {
    const n = await page.evaluate(() => window.__finca.sim.s.eggs.length);
    await tapWorld(page, touch, x, 0.1, z);
    await waitFor(`window.__finca.sim.s.eggs.length < ${n}`);
  }
  res.eggs = (await st(page)).inv.egg;
  // camión: tocarlo → hoja → Cargar
  await waitParked(page);
  await tapWorld(page, touch, 15.5, 1.0, 9.5);
  await page.waitForSelector('[data-act="loadtruck"]', { timeout: 12000 }).catch(() => {});
  await sleep(400);
  if (shots) await shot(page, `v2-${name}-truck-sheet.png`);
  const firstOrder = (await st(page)).trucks[0];
  await page.click('[data-act="loadtruck"]').catch(() => {});
  await sleep(600);
  await closeModal(page);
  const s2 = await st(page);
  res.load = { order: firstOrder.items, money: s2.money, sold: s2.sold, tut: s2.tut, queueLen: s2.trucks.length };
  // fila: el siguiente avanza; "No tenemos, siguiente"
  const parked = await waitParked(page, 15000);
  const before = (await st(page)).trucks.map((t) => t.id);
  await page.evaluate(() => window.__finca.ui.closeSheet());
  await tapWorld(page, touch, 15.5, 1.0, 9.5);
  await page.waitForSelector('[data-act="skiptruck"]', { timeout: 12000 }).catch(() => {});
  await page.click('[data-act="skiptruck"]').catch(() => {});
  await sleep(400);
  const afterSkip = (await st(page)).trucks.map((t) => t.id);
  await waitParked(page, 15000);
  await sleep(6000);
  const s3 = await st(page);
  res.skip = { parkedBefore: parked, before, afterSkip, after: s3.trucks.map((t) => t.id), frontChanged: afterSkip[0] !== before[0], refilled: s3.trucks.length >= before.length, parkedAfter: s3.parked };
  // comprar semillas con lo ganado
  await page.click('[data-act="shop"]');
  await sleep(400);
  const seedsBefore = (await st(page)).seeds.tomato;
  await page.click('[data-act="buy"][data-id="tomato"][data-qty="1"]').catch(() => {});
  await sleep(300);
  const s4 = await st(page);
  res.buySeeds = { seedsBefore, seedsAfter: s4.seeds.tomato, money: s4.money };
  await page.click('[data-act="close"]');
  // sembrar y cosechar
  await tapWorld(page, touch, 8.5, 0.1, 9.5);
  await waitFor('window.__finca.sim.s.plots.some((p) => p.crop)', 12000);
  const planted = await page.evaluate(() => window.__finca.sim.s.plots.filter((p) => p.crop).length);
  if (!planted) res.plantDbg = await page.evaluate(() => { const g = window.__finca, q = g.project(8.5, 0.1, 9.5), el = document.elementFromPoint(q.x, q.y); return { q, el: el?.outerHTML?.slice(0, 160), seeds: g.sim.s.seeds, sel: g.sim.s.selectedSeed, p: [g.sim.player.x, g.sim.player.z], task: JSON.stringify(g.sim.player.task || null).slice(0, 100), dist: g.rig.goalDist }; });
  await page.evaluate(() => { for (const p of window.__finca.sim.s.plots) if (p.crop) p.at -= 9999; });
  await sleep(500);
  await tapWorld(page, touch, 8.5, 0.1, 9.5);
  await waitFor('window.__finca.sim.s.stats.harvests > 0', 12000);
  await closeModal(page);
  const s5 = await st(page);
  res.crops = { planted, harvests: s5.harvests, tomatoes: s5.inv.tomato };
  // primer plano de la fila
  await page.evaluate(() => { const r = window.__finca.rig; r.goal.set(14.5, 0, 14.5); r.goalDist = 15; r.manualUntil = performance.now() + 1e6; });
  await sleep(1800);
  if (shots) await shot(page, `v2-${name}-truck-line.png`);
  // guardado y recarga
  await page.evaluate(() => localStorage.setItem('lafinca-v2', JSON.stringify(window.__finca.sim.s)));
  await page.reload({ waitUntil: 'load' });
  await sleep(1200);
  res.reload = await page.evaluate(() => ({ btn: document.getElementById('start').textContent, money: window.__finca.sim.s.money, trucks: window.__finca.sim.s.trucks.length }));
  await page.click('#start');
  await sleep(3000);
  const s6 = await st(page);
  res.perf = { fps: +s6.fps.toFixed(1), quality: s6.quality, calls: s6.calls, tris: s6.tris };
  res.errors = errors;
  report[name] = res;
  await ctx.close();
}

const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
await run('desktop', { viewport: { width: 1280, height: 800 } }, false, true);
await run('phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: iphone }, true, true);
await run('ipad', { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, true, true);
await run('phone-landscape', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: iphone }, true, true);
await browser.close();
{ const f = OUT + 'smoke-report-v2.json'; let prev = {}; if (process.env.ONLY) try { prev = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {} fs.writeFileSync(f, JSON.stringify({ ...prev, ...report }, null, 2)); }
console.log(JSON.stringify(report, null, 1));
