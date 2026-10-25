// Prueba de humo headless: carga, errores de consola, capturas, zoom, paneo, flujo huevo→camión→siembra→cosecha.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const exe = process.env.CHROME || (fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const report = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(name, opts, flow) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
  await page.goto(BASE, { waitUntil: 'load' });
  await sleep(1200);
  const res = { errors };
  await flow(page, res);
  res.errors = errors;
  report[name] = res;
  await ctx.close();
}
const shot = (page, f) => page.screenshot({ path: OUT + f });
const proj = (page, x, y, z) => page.evaluate(([x, y, z]) => window.__finca.project(x, y, z), [x, y, z]);
const tapWorld = async (page, touch, x, y, z) => { const p = await proj(page, x, y, z); if (touch) await page.touchscreen.tap(p.x, p.y); else await page.mouse.click(p.x, p.y); return p; };
const st = (page) => page.evaluate(() => { const s = window.__finca.sim.s; return { money: s.money, inv: { ...s.inv }, seeds: { ...s.seeds }, eggs: s.eggs.length, xp: s.xp, level: s.level, tut: s.tutorial, harvests: s.stats.harvests, sold: s.stats.sold, dist: window.__finca.rig.goalDist, tx: window.__finca.rig.goal.x, tz: window.__finca.rig.goal.z, fps: window.__finca.fps.value, plots: s.plots.slice(0, 8).map((p) => p.crop) }; });
const viewport = (page) => page.evaluate(() => { const c = document.getElementById('game').getBoundingClientRect(); return { canvas: [c.width, c.height], win: [innerWidth, innerHeight], scrollH: document.documentElement.scrollHeight }; });

async function flow(page, res, touch, prefix) {
  await shot(page, `${prefix}-01-title.png`);
  res.title = await page.evaluate(() => { const r = document.getElementById('start').getBoundingClientRect(); return { btnBottom: r.bottom, vh: innerHeight }; });
  await page.click('#start');
  await sleep(1200);
  res.viewport = await viewport(page);
  res.fullscreen = await page.evaluate(async () => {
    const btn = document.getElementById('btn-full');
    const man = await fetch(document.querySelector('link[rel=manifest]').href).then((r) => r.json()).catch(() => null);
    return { button: !!btn && getComputedStyle(btn).display !== 'none', manifestDisplay: man && man.display, appleCapable: !!document.querySelector('meta[name=apple-mobile-web-app-capable]'), viewportFit: document.querySelector('meta[name=viewport]').content.includes('viewport-fit=cover') };
  });
  await shot(page, `${prefix}-02-farm.png`);
  const s0 = await st(page);
  // zoom
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    const W = res.viewport.win[0], H = res.viewport.win[1];
    const cx = W / 2, cy = H / 2;
    const tp = (d) => [{ x: cx - d, y: cy, id: 1 }, { x: cx + d, y: cy, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(40) });
    for (let d = 40; d <= 140; d += 10) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(d) }); await sleep(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(640, 400);
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -120); await sleep(30); }
  }
  await sleep(900);
  const s1 = await st(page);
  res.zoom = { before: +s0.dist.toFixed(2), after: +s1.dist.toFixed(2), zoomedIn: s1.dist < s0.dist };
  await shot(page, `${prefix}-03-zoom.png`);
  // paneo con arrastre
  const W = res.viewport.win[0], H = res.viewport.win[1];
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: W / 2, y: H / 2, id: 3 }] });
    for (let k = 1; k <= 10; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: W / 2 - k * 12, y: H / 2 - k * 6, id: 3 }] }); await sleep(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(W / 2, H / 2); await page.mouse.down();
    for (let k = 1; k <= 10; k++) { await page.mouse.move(W / 2 - k * 15, H / 2 - k * 8); await sleep(16); }
    await page.mouse.up();
  }
  await sleep(600);
  const s2 = await st(page);
  res.pan = { moved: Math.hypot(s2.tx - s1.tx, s2.tz - s1.tz) > 0.5 };
  // zoom out para ver todo y volver a centrar
  await page.evaluate(() => { const g = window.__finca; g.fitFarm(true); });
  await sleep(500);
  // 1) recoger huevos: tocar cada huevo
  const eggs = await page.evaluate(() => window.__finca.sim.s.eggs.map((e) => [e.x, e.z]));
  for (const [x, z] of eggs) { await tapWorld(page, touch, x, 0.1, z); await sleep(2600); }
  const s3 = await st(page);
  res.eggs = { collected: s3.inv.egg, tut: s3.tut };
  await shot(page, `${prefix}-04-eggs.png`);
  // 2) camión: tocarlo, entregar pedido
  await tapWorld(page, touch, 15.5, 1.0, 9.5);
  await sleep(3500);
  await shot(page, `${prefix}-05-truck.png`);
  const deliver = await page.$('[data-act="deliver"]:not([disabled])');
  if (deliver) await deliver.click();
  await sleep(800);
  const s4 = await st(page);
  res.truck = { money: s4.money, sold: s4.sold, tut: s4.tut };
  await page.evaluate(() => document.querySelector('[data-act="modal-close"]')?.click());
  // 3) sembrar en el primer cantero
  await tapWorld(page, touch, 8.5, 0.1, 9.5);
  await sleep(3500);
  const s5 = await st(page);
  res.plant = { plots: s5.plots, seeds: s5.seeds.tomato, tut: s5.tut };
  await shot(page, `${prefix}-06-planted.png`);
  // adelantar el reloj de la mata y cosechar
  await page.evaluate(() => { for (const p of window.__finca.sim.s.plots) if (p.crop) p.at -= 9999; });
  await sleep(600);
  await shot(page, `${prefix}-07-ripe.png`);
  res.ripeTut = await page.evaluate(() => document.getElementById('guide-text').textContent);
  await tapWorld(page, touch, 8.5, 0.1, 9.5);
  await sleep(2500);
  const s6 = await st(page);
  res.harvest = { harvests: s6.harvests, tomatoes: s6.inv.tomato, xp: s6.xp, level: s6.level };
  await page.evaluate(() => document.querySelector('[data-act="modal-close"]')?.click());
  await page.click('[data-act="shop"]');
  await sleep(500);
  await shot(page, `${prefix}-08-shop.png`);
  await page.click('[data-act="close"]');
  // guardado y recarga
  await page.evaluate(() => window.__finca && localStorage.setItem('probe', '1'));
  await sleep(300);
  await page.evaluate(() => { const { sim } = window.__finca; localStorage.setItem('lafinca-v2', JSON.stringify(sim.s)); });
  await page.reload({ waitUntil: 'load' });
  await sleep(1000);
  res.reload = await page.evaluate(() => ({ btn: document.getElementById('start').textContent, money: window.__finca.sim.s.money, harvests: window.__finca.sim.s.stats.harvests }));
  await page.click('#start');
  await sleep(2500);
  res.fps = (await st(page)).fps;
  await shot(page, `${prefix}-09-reloaded.png`);
}

await run('desktop', { viewport: { width: 1280, height: 800 } }, (p, r) => flow(p, r, false, 'desktop'));
await run('mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }, (p, r) => flow(p, r, true, 'mobile'));
await run('landscape', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, async (page, res) => {
  await shot(page, 'landscape-01-title.png');
  res.title = await page.evaluate(() => { const r = document.getElementById('start').getBoundingClientRect(); return { btnBottom: r.bottom, vh: innerHeight }; });
  await page.click('#start');
  await sleep(1500);
  res.viewport = await viewport(page);
  await shot(page, 'landscape-02-farm.png');
  // rotación: cambia a vertical y comprueba que el canvas se adapta
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(800);
  res.rotated = await viewport(page);
  await shot(page, 'mobile-10-rotated.png');
});
await browser.close();
fs.writeFileSync(OUT + 'smoke-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
