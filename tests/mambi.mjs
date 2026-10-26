// Prueba de la Campaña Mambisa: desbloqueo (?dev=1), mapa, campamento, víveres, batalla animada, ciudad libre,
// finca regional y renta, volver a la finca, guardado. Uso: URL=http://127.0.0.1:4180/ node tests/mambi.mjs  · ONLY=desktop,phone
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = (process.env.URL || 'http://localhost:4173/') + '?dev=1';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VPS = {
  desktop: { viewport: { width: 1280, height: 800 } },
  ipad: { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  'phone-land': { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
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
  const waitFor = async (fn, ms, arg) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await sleep(250); } return false; };
  const click = (sel) => ev((sel) => { const b = document.querySelector(sel); if (!b) return false; b.click(); return true; }, sel);
  const closeModals = () => ev(() => document.querySelectorAll('[data-act="modal-close"]').forEach((b) => b.click()));
  const shot = (n) => page.screenshot({ path: OUT + `mambi-${name}-${n}.png`, timeout: 120000 });
  const res = { errors };
  await page.goto(BASE); await sleep(1200); await page.click('#start'); await sleep(800);
  await ev(() => { window.__finca.sim.s.tutorialDone = true; });
  res.hiddenAtStart = await ev(() => document.getElementById('btn-mambi')?.classList.contains('hidden'));
  res.lockedAtStart = await ev(() => !window.__finca.sim.mbUnlocked());
  // desbloquear con el truco (nivel 35 + central completo + recursos)
  await ev(() => window.__finca.sim.mbCheat('unlock')); await closeModals(); await sleep(400);
  res.unlocked = await ev(() => window.__finca.sim.mbUnlocked());
  res.btnVisible = await waitFor(() => !document.getElementById('btn-mambi').classList.contains('hidden'), 3000);
  await click('#btn-mambi'); await sleep(2500);
  res.mapOpen = await ev(() => !document.getElementById('mambi').classList.contains('hidden') && document.getElementById('ui').classList.contains('mambi-on'));
  res.intro = await ev(() => !document.getElementById('modal-wrap').classList.contains('hidden'));
  await closeModals(); await sleep(800);
  await shot('1-mapa');
  // campamento: reclutar por la hoja
  await click('[data-act="mbcamp"]'); await sleep(400);
  for (let i = 0; i < 5; i++) { await click('[data-act="mbrecruit"][data-id="inf"]'); await sleep(80); }
  for (let i = 0; i < 3; i++) { await click('[data-act="mbrecruit"][data-id="cab"]'); await sleep(80); }
  await click('[data-act="mbrecruit"][data-id="cart"]'); await sleep(200);
  res.army = await ev(() => ({ ...window.__finca.sim.mb().army }));
  await shot('2-campamento');
  // víveres desde la canasta
  await ev(() => { window.__finca.sim.s.inv.egg = 12; window.__finca.sim.s.inv.tomato = 6; window.__finca.ui.refreshSheet(); });
  const v0 = await ev(() => window.__finca.sim.s.res.viveres);
  await click('#sheet-body [data-act="mbfood"]'); await sleep(200);
  res.viveresGain = (await ev(() => window.__finca.sim.s.res.viveres)) - v0;
  await ev(() => window.__finca.ui.closeSheet());
  // ciudad → táctica → batalla
  await click('.mb-city[data-id="manzanillo"]'); await sleep(600);
  res.citySheet = await ev(() => document.querySelector('#sheet-title')?.textContent);
  await click('[data-act="mbattack"]'); await sleep(300);
  res.tactics = await ev(() => document.querySelectorAll('[data-act="mbgo"]').length);
  await shot('3-tacticas');
  await click('[data-act="mbgo"][data-tactic="carga"]');
  await sleep(2600);
  res.inBattle = await ev(() => !!window.__finca.mambi.battle);
  await shot('4-batalla');
  res.battleDone = await waitFor(() => !window.__finca.mambi.battle, 30000);
  await sleep(300);
  await shot('5-resultado');
  res.freed = await ev(() => [...window.__finca.sim.mb().freed]);
  await closeModals(); await sleep(300);
  // finca regional + renta
  await click('.mb-city[data-id="manzanillo"]'); await sleep(400);
  await click('[data-act="mbfarm"]'); await sleep(300);
  res.farm = await ev(() => !!window.__finca.sim.mb().farms.manzanillo);
  await ev(() => window.__finca.sim.mbCheat('rent'));
  const m0 = await ev(() => window.__finca.sim.s.money);
  await click('[data-act="mbrent"]'); await sleep(300);
  res.rent = (await ev(() => window.__finca.sim.s.money)) - m0;
  await ev(() => window.__finca.ui.closeSheet());
  // segunda ciudad con más tropa (asedio)
  await ev(() => window.__finca.sim.mbCheat('army'));
  await click('.mb-city[data-id="bayamo"]'); await sleep(300);
  await click('[data-act="mbattack"]'); await sleep(300);
  await click('[data-act="mbgo"][data-tactic="asedio"]'); await sleep(500);
  await click('[data-act="mbskip"]');
  await waitFor(() => !window.__finca.mambi.battle, 20000); await closeModals(); await sleep(1500);
  res.freed2 = await ev(() => [...window.__finca.sim.mb().freed]);
  await click('[data-act="mbfit"]'); await sleep(1500);
  await shot('6-isla');
  res.perf = await ev(async () => { const g = window.__finca; const t0 = performance.now(); let f = 0; await new Promise((r) => { const tick = () => { f++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else r(); }; requestAnimationFrame(tick); }); const i = g.renderer.info.render; return { fps: Math.round(f / 2), calls: i.calls, tris: i.triangles }; });
  // la finca siguió viva mientras el mapa estaba abierto; volver
  await click('[data-act="mbclose"]'); await sleep(1500);
  res.backToFarm = await ev(() => document.getElementById('mambi').classList.contains('hidden') && !document.getElementById('ui').classList.contains('mambi-on'));
  const c0 = await ev(() => window.__finca.fps.frames + window.__finca.fps.t);
  await sleep(1200);
  res.farmLoopRunning = (await ev(() => window.__finca.fps.frames + window.__finca.fps.t)) !== c0;
  await shot('7-finca');
  // guardado
  await page.evaluate(() => { const g = window.__finca; localStorage.setItem('lafinca-v2', JSON.stringify({ ...g.sim.s, savedAt: Date.now() / 1000 })); });
  await page.reload(); await sleep(1500);
  res.afterReload = await ev(() => { const m = window.__finca.sim.s.ext.mambi; return { freed: m.freed.length, farms: Object.keys(m.farms).length, army: m.army.inf + m.army.cab, viveres: window.__finca.sim.s.res.viveres }; });
  res.ok = !errors.length && res.unlocked && res.btnVisible && res.mapOpen && res.army.inf === 5 && res.army.cab === 3 && res.army.cart === 1 && res.viveresGain > 0 && res.inBattle && res.battleDone && res.freed.includes('manzanillo') && res.farm && res.rent > 0 && res.freed2.length === 2 && res.backToFarm && res.farmLoopRunning && res.afterReload.freed === 2;
  report[name] = res;
  console.log(name, JSON.stringify(res));
  await ctx.close();
}
for (const n of ONLY) await run(n, VPS[n]);
fs.writeFileSync(new globalThis.URL('../mambi-report.json', import.meta.url).pathname, JSON.stringify(report, null, 2));
await browser.close();
