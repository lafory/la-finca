// Prueba del camionero automático: contratar en N2, traer del bohío, cargar, despedir y venta suelta.
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const exe = fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = {};
async function run(name, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const ev = (fn, a) => page.evaluate(fn, a);
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn)) return true; await sleep(150); } return false; };
  const res = { errors };
  await page.goto(BASE); await sleep(1200); await page.click('#start'); await sleep(800);
  await ev(() => { const g = window.__finca, s = g.sim.s; s.tutorialDone = true; g.ui.updateTutorial?.(); s.money = 200; for (let k = 0; k < 200 && s.level < 2; k++) g.sim.addXp(2); document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()); });
  res.level = await ev(() => window.__finca.sim.s.level);
  await ev(() => document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()));
  await ev(() => window.__finca.ui.openWorkers()); await sleep(400);
  res.tag = await ev(() => document.querySelector('[data-worker="camionero"] .wtag')?.textContent);
  res.hireEnabled = await ev(() => !document.querySelector('[data-act="hire"][data-id="camionero"]')?.disabled);
  await page.screenshot({ path: OUT + `cam-${name}-workers-sheet.png` });
  await page.click('[data-act="hire"][data-id="camionero"]');
  await sleep(300);
  await ev(() => window.__finca.ui.closeSheet());
  // espera a que el camión esté parqueado y dale exactamente lo que pide
  await waitFor('window.__finca.sim.isParked(0)', 20000);
  const sold0 = await ev(() => window.__finca.sim.s.stats.sold);
  await ev(() => { const sim = window.__finca.sim, tr = sim.s.trucks[0]; for (const [k, q] of Object.entries(sim.missing(tr))) sim.s.inv[k] = (sim.s.inv[k] || 0) + q; });
  await ev(() => window.__finca.setSpeed(5)); // headless va lento: adelantamos para no esperar tanto
  // ver la caja en brazos
  res.sawCarry = await page.evaluate(() => new Promise((ok) => { const t0 = performance.now(); const f = () => { const w = window.__finca.sim.workers.find((x) => x.role === 'camionero'); if (w.carry && w.moving) return ok(true); if (performance.now() - t0 > 30000) return ok(false); requestAnimationFrame(f); }; f(); }));
  if (res.sawCarry) {
    await ev(() => { const g = window.__finca, w = g.sim.workers.find((x) => x.role === 'camionero'); g.rig.goal.set(w.x, 0, w.z); g.rig.goalDist = 9; g.rig.manualUntil = performance.now() + 1e6; });
    await sleep(700);
    await page.screenshot({ path: OUT + `cam-${name}-carrying.png` });
  }
  res.filled = await waitFor(`window.__finca.sim.s.stats.sold > ${sold0}`, 30000);
  await ev(() => window.__finca.setSpeed(1));
  if (!res.filled) res.trace = await page.evaluate(() => new Promise((ok) => { const out = []; const sim = window.__finca.sim, w = sim.workers.find((x) => x.role === 'camionero'); let n = 0; const id = setInterval(() => { out.push([w.task?.t.kind, w.task?.t.i, +w.x.toFixed(2), +w.z.toFixed(2), !!w.carry, +w.work.toFixed(2), w.rec.jobs, sim.s.inv.egg].join(' ')); if (++n > 30) { clearInterval(id); ok(out); } }, 200); }));
  if (!res.filled) res.dbg = await ev(() => { const sim = window.__finca.sim, w = sim.workers.find((x) => x.role === 'camionero'); return { work: w.work, wait: w.wait, busy: w.busy, fps: window.__finca.fps.value, clk: Date.now(), x: w.x, z: w.z, status: w.status, task: w.task && w.task.verb, path: !!w.path, carry: w.carry, parked: sim.isParked(0), miss: sim.missing(sim.s.trucks[0]), inv: sim.s.inv, reserved: [...sim.reserved] }; });
  // sin mercancía: debe esperar ~20 s de juego y despedir (adelantamos x5)
  await waitFor('window.__finca.sim.isParked(0)', 30000);
  const id1 = await ev(() => { const sim = window.__finca.sim; for (const k of Object.keys(sim.s.inv)) sim.s.inv[k] = 0; return sim.s.trucks[0].id; });
  await sleep(1500);
  res.waitingStatus = await ev(() => window.__finca.sim.workers.find((x) => x.role === 'camionero').status);
  res.notSkippedEarly = await ev((id) => window.__finca.sim.s.trucks[0]?.id === id, id1);
  await ev(() => window.__finca.setSpeed(5));
  res.skipped = await waitFor(`window.__finca.sim.s.trucks[0]?.id !== ${id1}`, 30000);
  await ev(() => window.__finca.setSpeed(1));
  // venta suelta: guardar 5, sobran huevos
  await ev(() => { const g = window.__finca; g.ui.openWorker('camionero'); });
  await sleep(300);
  await page.click('[data-act="wsell"]'); await sleep(150);
  await page.click('[data-act="wkeep"]'); await page.click('[data-act="wkeep"]'); await page.click('[data-act="wkeep"]'); await sleep(150); // 10→20→40→5
  res.keep = await ev(() => window.__finca.sim.workers.find((x) => x.role === 'camionero').rec.keep);
  await page.screenshot({ path: OUT + `cam-${name}-worker-card.png` });
  await ev(() => window.__finca.ui.closeSheet());
  await waitFor('window.__finca.sim.isParked(0)', 30000);
  const money0 = await ev(() => { const s = window.__finca.sim.s; s.inv.egg = 15; window.__finca.setSpeed(5); return s.money; });
  res.soldSurplus = await waitFor(`window.__finca.sim.s.money > ${money0} && window.__finca.sim.s.inv.egg <= 5 + (window.__finca.sim.surplus ? 0 : 99) + Object.values(window.__finca.sim.s.trucks.map(t => window.__finca.sim.missing(t).egg || 0)).reduce((a,b)=>a+b,0)`, 40000);
  res.eggsLeft = await ev(() => { window.__finca.setSpeed(1); return window.__finca.sim.s.inv.egg; });
  report[name] = res;
  await ctx.close();
}
if (!process.env.ONLY || process.env.ONLY.split(',').includes('desktop')) await run('desktop', { viewport: { width: 1280, height: 800 } });
const want = (n) => !process.env.ONLY || process.env.ONLY.split(',').includes(n);
if (want('phone')) await run('phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
if (want('ipad')) await run('ipad', { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
if (want('phone-landscape')) await run('phone-landscape', { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await browser.close();
{ const f = OUT + 'cam-report.json'; let prev = {}; if (process.env.ONLY) try { prev = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {} fs.writeFileSync(f, JSON.stringify({ ...prev, ...report }, null, 2)); }
console.log(JSON.stringify(report, null, 1));
