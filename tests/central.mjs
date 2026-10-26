// Prueba del central: ?dev=1, campos grandes (sembrar/cosechar), obra del central en 4 etapas, tren cañero, pedido del tren.
// Uso: (preview corriendo) URL=http://127.0.0.1:4180/ node tests/central.mjs   · ONLY=desktop,phone · ENGINE=webkit
import { chromium, webkit } from 'playwright';
import fs from 'node:fs';
const BASE = (process.env.URL || 'http://localhost:4173/') + '?dev=1';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const WK = process.env.ENGINE === 'webkit';
const browser = WK ? await webkit.launch() : await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VPS = {
  desktop: { viewport: { width: 1280, height: 800 } },
  ipad: { viewport: { width: 820, height: 1180 }, isMobile: !WK || undefined, hasTouch: true, deviceScaleFactor: 1 },
  phone: { viewport: { width: 390, height: 844 }, isMobile: !WK || undefined, hasTouch: true, deviceScaleFactor: 1 },
  'phone-land': { viewport: { width: 844, height: 390 }, isMobile: !WK || undefined, hasTouch: true, deviceScaleFactor: 1 },
};
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);
const report = {};
async function run(name, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const ev = (fn, a) => page.evaluate(fn, a);
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn)) return true; await sleep(250); } return false; };
  const closeAll = () => ev(() => { document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()); window.__finca.ui.closeSheet(); });
  const tag = WK ? 'wk-' : '';
  const shot = (n) => page.screenshot({ path: OUT + `central-${tag}${name}-${n}.png`, timeout: 120000 });
  const look = async (x, z, d) => { await ev(([x, z, d]) => { const g = window.__finca; g.rig.maxDist = Math.max(g.rig.maxDist, d); g.rig.goal.set(x, 0, z); g.rig.goalDist = d; g.rig.manualUntil = performance.now() + 1e7; g.sim.s.tod = 0.42; }, [x, z, d]); await sleep(1500); };
  const res = { errors };
  await page.goto(BASE); await sleep(1200); await page.click('#start'); await sleep(800);
  await ev(() => { window.__finca.sim.s.tutorialDone = true; });
  res.devFlag = await ev(() => !!window.__fincaDev);
  // 1) campos grandes: nivel 25 por el truco, comprar el campo 1 por la hoja, sembrar caña
  await ev(() => window.__finca.sim.cenCheat('l25')); await closeAll();
  await ev(() => window.__finca.sim.cenCheat('rich'));
  res.level25 = await ev(() => window.__finca.sim.s.level);
  await ev(() => window.__finca.viewCentral()); await sleep(1800);
  await shot('1-campos-abiertos');
  // tocar el campo 1 en pantalla (flujo real)
  await look(40, 57, 22);
  const p = await ev(() => window.__finca.project(40, 0.3, 54));
  await ev(([x, y]) => window.__finca.tap(x, y), [p.x, p.y]);
  await sleep(400);
  res.fieldSheet = await ev(() => document.querySelector('#sheet-title')?.textContent);
  await ev(() => document.querySelector('[data-act="cenbuy"]')?.click()); await sleep(300);
  await ev(() => document.querySelector('[data-act="cenplant"][data-crop="cane"]')?.click()); await sleep(300);
  await ev(() => { const sim = window.__finca.sim; sim.buyField('f2'); sim.plantField('f2', 'cane'); });
  await sleep(2500);
  res.planting = await ev(() => window.__finca.sim.fieldState('f1'));
  await shot('2-sembrando');
  res.planted = await waitFor(() => window.__finca.sim.fieldState('f1') === 'growing', 20000);
  await ev(() => window.__finca.sim.cenCheat('ripe')); await sleep(600);
  res.ripe = await ev(() => window.__finca.sim.fieldState('f1'));
  await shot('3-cana-madura');
  await ev(() => { window.__finca.sim.harvestField('f1'); window.__finca.sim.harvestField('f2'); });
  await sleep(6000);
  await shot('4-cortando');
  res.harvested = await waitFor(() => window.__finca.sim.fieldState('f1') === 'empty', 25000);
  res.yard = await ev(() => window.__finca.sim.s.cen.yard);
  // 2) central: nivel 32+, obra real de la etapa 1 por la hoja, luego el truco para terminar
  await ev(() => window.__finca.sim.cenCheat('l32')); await closeAll();
  await ev(() => window.__finca.sim.cenCheat('rich'));
  await look(22, 69, 26);
  await ev(() => { window.__finca.centralUI.openCentral(); document.querySelector('[data-act="censtage"]')?.click(); });
  await sleep(1500);
  res.building = await ev(() => !!window.__finca.sim.s.cen.building);
  await shot('5-obra');
  await ev(() => window.__finca.sim.cenCheat('central')); await closeAll();
  await ev(() => { const sim = window.__finca.sim; sim.cenCheat('fields'); for (const id of sim.s.cen.owned) sim.plantField(id, ['cane', 'tobacco', 'tomato'][id.length % 3 === 0 ? 0 : (+id.slice(1)) % 3]); });
  res.stage = await ev(() => window.__finca.sim.s.cen.stage);
  // 3) tren: debe moverse y pasar por el acopio y el basculador
  const s0 = await ev(() => window.__finca.sim.s.cen.train.s);
  await look(30, 66, 30);
  await sleep(3000);
  await shot('6-central-tren');
  res.trainMoved = (await ev(() => window.__finca.sim.s.cen.train.s)) !== s0;
  await ev(() => window.__finca.setSpeed(20));
  res.trainDelivered = await waitFor(() => window.__finca.sim.s.cen.stats.trips > 0, 40000);
  res.milled = await waitFor(() => window.__finca.sim.s.cen.stock.azucar > 0, 30000);
  await ev(() => window.__finca.setSpeed(1));
  // 4) pedido del tren
  await ev(() => { const c = window.__finca.sim.s.cen; if (!c.order) window.__finca.sim.newTrainOrder(); for (const k of Object.keys(c.order.items)) c.stock[k] = Math.max(c.stock[k], c.order.items[k]); });
  const m0 = await ev(() => window.__finca.sim.s.money);
  await ev(() => { window.__finca.centralUI.openStation(); document.querySelector('[data-act="cenload"]')?.click(); });
  await sleep(500);
  await shot('7-estacion');
  await closeAll();
  await ev(() => window.__finca.setSpeed(20));
  res.orderPaid = await waitFor(() => window.__finca.sim.s.cen.stats.orders > 0, 40000);
  await ev(() => window.__finca.setSpeed(1));
  res.moneyGain = (await ev(() => window.__finca.sim.s.money)) - m0;
  await look(16, 68, 24); await sleep(1500);
  await shot('8-chimenea-humo');
  await ev(() => window.__finca.cenCheat ? 0 : 0);
  await ev(() => window.__finca.viewCentral()); await sleep(2500);
  await shot('9-vista-general');
  // fps y llamadas de dibujo en la vista general
  res.perf = await ev(async () => { const g = window.__finca; const t0 = performance.now(); let f = 0; await new Promise((r) => { const tick = () => { f++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else r(); }; requestAnimationFrame(tick); }); const info = g.renderer.info.render; return { fps: Math.round(f / 2), calls: info.calls, tris: info.triangles }; });
  // guardado: recargar y conservar todo
  await ev(() => window.__finca.sim && (window.__finca.saveNow ? window.__finca.saveNow() : null));
  await page.evaluate(() => { const g = window.__finca; localStorage.setItem('lafinca-v2', JSON.stringify({ ...g.sim.s, savedAt: Date.now() / 1000 })); });
  await page.reload(); await sleep(1500);
  res.afterReload = await ev(() => ({ stage: window.__finca.sim.s.cen.stage, owned: window.__finca.sim.s.cen.owned.length, level: window.__finca.sim.s.level }));
  report[name] = res;
  console.log(name, JSON.stringify(res));
  await ctx.close();
}
for (const n of ONLY) await run(n, VPS[n]);
fs.writeFileSync(new globalThis.URL(`../central-report${WK ? '-webkit' : ''}.json`, import.meta.url).pathname, JSON.stringify(report, null, 2));
await browser.close();
