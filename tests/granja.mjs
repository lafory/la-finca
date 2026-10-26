// Granja grande: gallinero 1→4 (corral y tope), surcos arados en bloque, potrero de vacas 1→3, batey con
// solares/obras nuevas y casas de mampostería; guardar y recargar; capturas. Computadora (Chromium) e iPhone 13 (WebKit).
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
const BASE = (process.env.URL || 'http://localhost:4173/') + '?dev=1';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exe = fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const only = process.env.ONLY;
const report = {}; let fail = 0;

async function run(name, type, ctxOpts, launch = {}) {
  const browser = await type.launch(launch);
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const shot = async (n) => { await page.evaluate(() => { document.getElementById('modal-wrap').classList.add('hidden'); document.getElementById('toasts').innerHTML = ''; }); await page.screenshot({ path: OUT + `granja-${name}-${n}.png` }); };
  const tapStart = async () => { if (ctxOpts.hasTouch) await page.tap('#start'); else await page.click('#start'); await sleep(900); };
  await page.goto(BASE); await sleep(1500); await tapStart();
  const r = {};
  r.l1 = await page.evaluate(() => { const g = window.__finca, s = g.sim.s; s.level = 20; s.money = 200000; s.res.madera = 500; s.tutorialDone = true; g.ui.updateTutorial?.(); return { cap: g.sim.coopLevel(), hens: s.chickens.length }; });
  // tierra
  r.parcels = await page.evaluate(() => { const g = window.__finca; for (const id of ['este', 'norte', 'oeste', 'sur', 'cuarton', 'potrero', 'rinconada', 'esquinita', 'loma']) g.sim.buyParcel(id); g.onLandChanged(); return g.sim.s.parcels.length; });
  // gallinero 1→4
  r.coop = await page.evaluate(() => { const g = window.__finca, out = []; for (let i = 0; i < 4; i++) out.push([g.sim.upgradeCoop(), g.sim.coopLevel()]); return out; });
  // comprar gallinas hasta el tope (por la tienda)
  r.hens = await page.evaluate(() => { const g = window.__finca; for (let i = 0; i < 20; i++) g.sim.buy('chicken', 1); return g.sim.s.chickens.length; });
  await page.evaluate(() => window.__finca.granjaLook('coop')); await sleep(1800);
  await shot('gallinero');
  // surcos
  r.plow = await page.evaluate(() => { const g = window.__finca, s = g.sim.s; const n0 = s.plots.length; const a = g.sim.plow(9, 16, 4), b = g.sim.plow(6, 17, 3), c = g.sim.plow(1, 15, 3), bad = g.sim.plow(15, 5, 3); return { a, b, c, bad, plots: s.plots.length - n0, plowed: s.ext.granja.plowed }; });
  // sembrar caña/tabaco/tomate maduros en los surcos para la foto
  await page.evaluate(() => { const g = window.__finca, s = g.sim.s, t = performance.now(); const crops = ['cane', 'tobacco', 'tomato']; s.plots.forEach((p, i) => { if (p.z >= 9) { p.crop = crops[Math.floor(p.x / 4) % 3]; p.dur = g.sim.plotDur(p.crop); p.at = (g.sim.s.savedAt || 0) - p.dur * (i % 3 === 0 ? 0.5 : 2); } }); g.world.plotsDirty = true; g.rig.goal.set(8, 0, 15.5); g.rig.goalDist = 15; g.rig.manualUntil = performance.now() + 6000; });
  await sleep(1800);
  await shot('surcos');
  // modo arar por UI
  await page.evaluate(() => { window.__finca.ui.openLand(); }); await sleep(400);
  r.landRows = await page.evaluate(() => [...document.querySelectorAll('#sheet-body [data-act^="granja"]')].map((b) => b.dataset.act));
  await shot('terreno');
  await page.evaluate(() => document.querySelector('#sheet-body [data-act="granja-plow"]').click()); await sleep(400);
  r.pill = await page.evaluate(() => { const p = document.getElementById('plowpill'); const b = p.getBoundingClientRect(); return { shown: !p.classList.contains('hidden'), fits: b.left >= 0 && b.right <= innerWidth + 1 && b.top >= 0 }; });
  await shot('arar');
  await page.evaluate(() => document.querySelector('#plowpill [data-plow="done"]').click());
  // potrero
  r.vacas = await page.evaluate(() => { const g = window.__finca, s = g.sim.s; s.res.madera = 500; const b = g.sim.build('vacas'); const u1 = g.sim.upgradeVacas(), u2 = g.sim.upgradeVacas(); const cows = g.world.animals.filter((a) => a.id === 'vacas').length; return { b, u1, u2, lvl: s.ext.granja.vacas, cows }; });
  await page.evaluate(() => window.__finca.granjaLook('vacas')); await sleep(2000);
  await shot('potrero');
  // batey
  r.batey = await page.evaluate(() => {
    const g = window.__finca, s = g.sim.s, out = {};
    s.res.madera = 500;
    for (const id of ['casa1', 'casa2', 'casa3', 'bodega', 'casa4', 'casa5', 'casa6', 'escuela', 'casa7', 'iglesia', 'casa8', 'domino', 'casa9', 'casa10', 'consultorio', 'casa11', 'casa12', 'panaderia']) out[id] = g.sim.build(id);
    const cap0 = g.sim.workerCap();
    s.res.madera = 500;
    const up = ['casa1', 'casa9', 'casa5'].map((id) => [g.sim.upgradeHouse(id), g.sim.upgradeHouse(id), g.sim.upgradeHouse(id)]);
    return { built: Object.values(out).filter(Boolean).length, cap0, cap1: g.sim.workerCap(), up, tiers: ['casa1', 'casa9', 'casa5'].map((id) => s.built[id]?.tier) };
  });
  await page.evaluate(() => { const g = window.__finca; g.sim.goBatey(); }); await sleep(1500);
  await page.evaluate(() => { const g = window.__finca; g.rig.goal.set(14, 0, 50); g.rig.goalDist = Math.min(g.rig.maxDist, 26); g.rig.manualUntil = performance.now() + 6000; }); await sleep(2200);
  await shot('batey');
  // guardar y recargar
  await page.evaluate(() => { const g = window.__finca; g.sim.goFarm?.(); }); await sleep(600);
  await page.evaluate(() => { const g = window.__finca; window.dispatchEvent(new Event('pagehide')); });
  await page.reload(); await sleep(1500); await tapStart();
  r.reload = await page.evaluate(() => { const g = window.__finca, s = g.sim.s; return { coop: g.sim.coopLevel(), cap: s.chickens.length, vacas: s.ext.granja.vacas, cows: g.world.animals.filter((a) => a.id === 'vacas').length, plowed: s.ext.granja.plowed, plowedPlots: s.plots.filter((p) => p.plowed).length, tier: s.built.casa1?.tier, wcap: g.sim.workerCap() }; });
  r.errors = errors;
  r.ok = r.coop.map((x) => x[1]).join() === '2,3,4,4' && r.hens === 16 && r.plow.a > 0 && r.plow.b > 0 && r.plow.bad === 0 && r.landRows.includes('granja-plow') && r.pill.shown && r.pill.fits
    && r.vacas.lvl === 3 && r.vacas.cows === 6 && r.batey.built === 18 && r.batey.tiers.every((t) => t === 3) && r.batey.cap1 > r.batey.cap0
    && r.reload.coop === 4 && r.reload.vacas === 3 && r.reload.cows === 6 && r.reload.plowedPlots === r.reload.plowed && r.reload.tier === 3 && !errors.length;
  if (!r.ok) fail++;
  report[name] = r; console.log(name, JSON.stringify(r));
  await browser.close();
}
if (!only || only === 'desktop') await run('desktop', chromium, { viewport: { width: 1280, height: 800 } }, { executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
if (!only || only === 'iphone') await run('iphone13', webkit, { ...devices['iPhone 13'] });
fs.writeFileSync(new globalThis.URL('../granja-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
process.exit(fail ? 1 : 0);
