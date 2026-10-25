// Prueba headless v3: contratar un trabajador y verlo trabajar, adelantar el tiempo (⏩) hasta que madure el tomate,
// noche del time-lapse, guardado/recarga con el reloj adelantado. Escritorio, iPad, teléfono vertical y horizontal.
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

async function run(name, opts, touch) {
  if (ONLY && ONLY !== name) return;
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const waitFor = async (fn, ms = 10000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn)) return true; await sleep(200); } return false; };
  const tapWorld = async (x, y, z) => { const p = await ev(([x, y, z]) => window.__finca.project(x, y, z), [x, y, z]); if (touch) await page.touchscreen.tap(p.x, p.y); else await page.mouse.click(p.x, p.y); };
  const shot = (f) => page.screenshot({ path: OUT + f });
  const res = { errors };
  await page.goto(BASE, { waitUntil: 'load' });
  await sleep(1200);
  await page.click('#start');
  await sleep(1200);
  // 1) huevos → primer camión (3 huevos = 25 pesos)
  for (let k = 0; k < 6; k++) {
    const st = await ev(() => ({ inv: window.__finca.sim.s.inv.egg, e: window.__finca.sim.s.eggs[0] && [window.__finca.sim.s.eggs[0].x, window.__finca.sim.s.eggs[0].z, window.__finca.sim.s.stats.eggs] }));
    if (st.inv >= 3) break;
    if (!st.e) { await sleep(1000); continue; }
    await tapWorld(st.e[0], 0.1, st.e[1]);
    await waitFor(`window.__finca.sim.s.stats.eggs > ${st.e[2]}`);
  }
  await waitFor('window.__finca.sim.truckParked()', 15000);
  await tapWorld(15.5, 1.0, 9.5);
  await page.waitForSelector('[data-act="loadtruck"]', { timeout: 12000 }).catch(() => {});
  await page.click('[data-act="loadtruck"]').catch(() => {});
  await sleep(500);
  await ev(() => { window.__finca.ui.closeSheet(); document.querySelector('[data-act="modal-close"]')?.click(); });
  res.afterTruck = await ev(() => ({ money: window.__finca.sim.s.money, sold: window.__finca.sim.s.stats.sold }));
  // 2) contratar a Pancho (recolector) desde la barra inferior
  await page.click('#btn-workers');
  await sleep(500);
  res.workerCards = await ev(() => document.querySelectorAll('.wcard').length);
  if (name === 'phone') await shot('v3-phone-workers-sheet.png');
  await page.click('[data-act="hire"][data-id="recolector"]').catch((e) => errors.push('hire click: ' + e.message));
  await sleep(500);
  res.hired = await ev(() => window.__finca.sim.s.workers.map((w) => w.role));
  if (name === 'phone') await shot('v3-phone-worker-sheet.png');
  await ev(() => window.__finca.ui.closeSheet());
  // ver que trabaja: espera a que recoja un huevo sin el guajiro
  const eggsBefore = await ev(() => window.__finca.sim.s.stats.eggs);
  await ev(() => { const s = window.__finca.sim.s; if (s.eggs.length < 2) { s.eggs.push({ id: s.nextId++, x: 8.7, z: 6.6 }, { id: s.nextId++, x: 10.6, z: 7.9 }); } });
  const sawWork = await ev(() => new Promise((res) => { const f = () => { const w = window.__finca.sim.workers[0]; if (w && w.work > 0.5) res(true); else requestAnimationFrame(f); }; f(); setTimeout(() => res(false), 25000); }));
  if (sawWork) {
    await ev(() => { const g = window.__finca, w = g.sim.workers[0]; g.rig.goal.set(w.x, 0, w.z); g.rig.goalDist = 9; g.rig.manualUntil = performance.now() + 1e6; });
    await sleep(350);
    if (name === 'desktop') await shot('v3-desktop-worker-working.png');
  }
  await waitFor(`window.__finca.sim.s.stats.eggs > ${eggsBefore}`, 20000);
  res.worker = { sawWork, eggsByWorker: (await ev(() => window.__finca.sim.s.stats.eggs)) - eggsBefore, status: await ev(() => window.__finca.sim.workers[0]?.status) };
  // 3) sembrar un tomate y adelantar con ⏩
  await ev(() => { window.__finca.fitFarm(true); document.querySelector('[data-act="modal-close"]')?.click(); window.__finca.ui.closeSheet(); });
  await sleep(600);
  await tapWorld(6.5, 0.1, 9.5);
  await waitFor('window.__finca.sim.s.plots.some((p) => p.crop)', 12000);
  res.plantDebug = await ev(() => ({ seeds: window.__finca.sim.s.seeds, modal: !document.getElementById('modal-wrap').classList.contains('hidden'), player: window.__finca.sim.player.x.toFixed(1) + ',' + window.__finca.sim.player.z.toFixed(1), level: window.__finca.sim.s.level }));
  const plot = await ev(() => { const p = window.__finca.sim.s.plots.find((q) => q.crop); return { x: p.x, z: p.z, left: p.at + p.dur - Date.now() / 1000 }; });
  // atajo: tocar la mata creciendo muestra "Adelantar"
  await tapWorld(plot.x + 0.5, 0.1, plot.z + 0.5);
  const pill = await waitFor('!document.getElementById("plotpill").classList.contains("hidden")', 5000);
  const t0 = Date.now();
  await ev(() => document.querySelector('[data-act="modal-close"]')?.click());
  if (pill) await page.click('[data-act="ffplot"]'); else await ev(() => window.__finca.setSpeed(20));
  const ffSpeed = await ev(() => window.__finca.ffSpeed);
  const ripe = await waitFor('window.__finca.sim.s.plots.some((p) => p.crop && window.__finca.sim.plotState(p) === "ripe")', 40000);
  const realSec = (Date.now() - t0) / 1000;
  await sleep(300);
  const autoStop = await ev(() => window.__finca.ffSpeed === 1);
  await ev(([x, z]) => { const g = window.__finca; g.rig.goal.set(x, 0, z); g.rig.goalDist = 11; g.rig.manualUntil = performance.now() + 1e6; }, [plot.x + 0.5, plot.z + 0.5]);
  await waitFor('(() => { const t = window.__finca.sim.s.tod; return t > 0.5 && t < 0.62; })()', 30000);
  await ev(() => document.querySelector('[data-act="modal-close"]')?.click());
  await ev(() => { window.__finca.rig.goalDist = 14; });
  await sleep(1000);
  if (ripe) await shot(`v3-${name}-ripe-after-ff.png`);
  res.ff = { ffSpeed, usedPill: pill, ripe, autoStop, realSec: +realSec.toFixed(1), growLeftAtStart: +plot.left.toFixed(1) };
  // time-lapse de noche con el botón ⏩ (x5 → x20)
  await ev(() => window.__finca.fitFarm(true));
  await ev(() => document.querySelector('[data-act="modal-close"]')?.click());
  await page.click('#btn-ff'); await sleep(200); await page.click('#btn-ff');
  const night = await waitFor('(() => { const t = window.__finca.sim.s.tod; return window.__finca.ffSpeed === 20 && t > 0.86 && t < 0.97; })()', 40000);
  if (night) await shot(`v3-${name}-fastforward-night.png`);
  res.night = { reached: night, tod: await ev(() => window.__finca.sim.s.tod), banner: await ev(() => !document.getElementById('ffbanner').classList.contains('hidden')), speed: await ev(() => window.__finca.ffSpeed) };
  await ev(() => document.querySelector('[data-act="modal-close"]')?.click());
  await page.click('[data-act="ffstop"]');
  await sleep(300);
  res.clockOffset = await ev(() => +(window.__finca.sim.s.clockOffset || 0).toFixed(1));
  res.jobs = await ev(() => window.__finca.sim.s.workers[0]?.jobs || 0);
  // 4) guardar y recargar: el reloj adelantado y el trabajador se conservan
  const offBefore = await ev(() => { window.dispatchEvent(new Event('pagehide')); return window.__finca.sim.s.clockOffset; });
  await page.reload({ waitUntil: 'load' });
  await sleep(1200);
  res.reload = await ev((off) => ({ offsetKept: Math.abs((window.__finca.sim.s.clockOffset || 0) - off) < 1 && off > 0, workers: window.__finca.sim.s.workers.map((w) => w.role + ':' + w.lvl), harvestable: window.__finca.sim.s.plots.filter((p) => p.crop && window.__finca.sim.plotState(p) === 'ripe').length }), offBefore);
  await page.click('#start');
  await sleep(2500);
  res.fps = await ev(() => +window.__finca.fps.value.toFixed(1));
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
fs.writeFileSync(OUT + 'v3-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
