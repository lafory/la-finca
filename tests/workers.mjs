// Varios trabajadores por oficio: nombres/ropa propios, precio creciente, tope por nivel y casas, sin chocar en tareas.
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VPS = { desktop: { viewport: { width: 1280, height: 800 } }, phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const report = {};
for (const [name, opts] of Object.entries(VPS)) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.addInitScript(() => { window.__fincaDev = true; });
  const ev = (fn, a) => page.evaluate(fn, a);
  await page.goto(BASE); await sleep(1200); await page.click('#start'); await sleep(800);
  const res = { errors };
  res.cap1 = await ev(() => { const g = window.__finca; g.sim.s.tutorialDone = true; return g.sim.workerCap(); });
  await ev(() => { const g = window.__finca; while (g.sim.s.level < 8) g.cheat('level'); for (let i = 0; i < 10; i++) g.cheat('money'); document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()); });
  res.cap8 = await ev(() => window.__finca.sim.workerCap());
  // contratar desde la hoja: 3 recolectores y 2 camioneros
  await ev(() => window.__finca.ui.openWorkers()); await sleep(300);
  const prices = [];
  for (const role of ['recolector', 'recolector', 'recolector', 'camionero', 'camionero']) {
    await ev(() => window.__finca.ui.openWorkers()); await sleep(200);
    prices.push(await ev((r) => window.__finca.sim.hirePrice(r), role));
    await ev((r) => document.querySelector(`[data-act="hire"][data-id="${r}"]`).click(), role); await sleep(250);
  }
  res.prices = prices;
  res.workers = await ev(() => window.__finca.sim.s.workers.map((w) => `${w.id}:${w.role}:${w.n}`));
  res.names = await ev(() => window.__finca.sim.workers.map((w) => document.querySelector('#sheet-title')?.textContent && w.rec.n));
  await ev(() => window.__finca.ui.openWorkers()); await sleep(400);
  res.capText = await ev(() => document.querySelector('.capbar b')?.textContent);
  res.chips = await ev(() => [...document.querySelectorAll('.wchip b')].map((b) => b.textContent));
  await page.screenshot({ path: OUT + `workers-${name}-sheet.png` });
  // llenar hasta el tope y comprobar que no deja pasar
  res.overCap = await ev(() => { const g = window.__finca; let n = 0; while (g.sim.s.workers.length < g.sim.workerCap() && n++ < 30) g.sim.hire('regador'); return g.sim.hire('regador'); });
  res.count = await ev(() => window.__finca.sim.s.workers.length);
  await ev(() => window.__finca.ui.closeSheet());
  // coordinación: nunca dos con la misma clave de tarea
  await ev(() => { const g = window.__finca, s = g.sim.s; s.built.anden = { at: 0 }; g.sim.rebuildGrid(); for (let i = 0; i < 12; i++) s.eggs.push({ id: s.nextId++, x: 6 + (i % 4) * 0.8, z: 5 + Math.floor(i / 4) * 0.8 }); g.setSpeed(5); });
  let dup = 0, samples = 0, sold0 = await ev(() => window.__finca.sim.s.stats.sold);
  for (let i = 0; i < 40; i++) {
    const keys = await ev(() => window.__finca.sim.workers.filter((w) => w.task).map((w) => w.task.key));
    if (new Set(keys).size !== keys.length) dup++;
    samples++;
    if (i % 8 === 0) await ev(() => { const sim = window.__finca.sim; for (let k = 0; k < 2; k++) { const tr = sim.s.trucks[k]; if (tr && sim.isParked(k)) for (const [it, q] of Object.entries(sim.missing(tr))) sim.s.inv[it] = Math.min(sim.s.inv[it] + q, 99); } });
    await sleep(500);
  }
  res.dupSamples = dup; res.samples = samples;
  res.camStatus = await ev(() => window.__finca.sim.workers.filter((w) => w.role === 'camionero').map((w) => w.status));
  res.sold = (await ev(() => window.__finca.sim.s.stats.sold)) - sold0;
  await ev(() => window.__finca.setSpeed(1));
  await ev(() => { const g = window.__finca; g.rig.goal.set(14, 0, 11); g.rig.goalDist = 18; g.rig.manualUntil = performance.now() + 1e5; }); await sleep(1500);
  await page.screenshot({ path: OUT + `workers-${name}-farm.png` });
  // guardar/recargar
  await ev(() => { window.__finca.saveTimer = 99; }); await sleep(500);
  await page.reload(); await sleep(1500); await page.click('#start'); await sleep(600);
  res.afterReload = await ev(() => window.__finca.sim.workers.length);
  res.ok = !errors.length && res.prices[1] > res.prices[0] && res.prices[2] > res.prices[1] && res.overCap === false && dup === 0 && res.afterReload === res.count && /Trabajadores \d+\/\d+/.test(res.capText) && res.cap8 > res.cap1;
  report[name] = res;
  console.log(name, JSON.stringify(res));
  await ctx.close();
}
fs.writeFileSync(new globalThis.URL('../workers-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
await browser.close();
