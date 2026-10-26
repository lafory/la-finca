// Prueba de la Campaña Mambisa: desbloqueo (?dev=1), mapa, campamento, víveres, batalla animada, ciudad libre,
// finca regional y renta, volver a la finca, guardado. Uso: URL=http://127.0.0.1:4180/ node tests/mambi.mjs  · ONLY=desktop,phone
import { chromium, webkit, devices } from 'playwright';
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
  'iphone-webkit': { ...devices['iPhone 13'], webkit: true },
  'ipad-webkit': { ...devices['iPad (gen 7)'], webkit: true },
};
let wk = null;
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);
const report = {};
async function run(name, { webkit: useWk, ...opts }) {
  if (useWk && !wk) wk = await webkit.launch();
  const ctx = await (useWk ? wk : browser).newContext(opts);
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
  await page.goto(BASE); await sleep(1500); if (opts.hasTouch) await page.tap('#start'); else await page.click('#start'); await sleep(800);
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
  // ---- fincas regionales con TOQUES reales (dedo en teléfono/iPad, ratón en escritorio)
  const touch = !!opts.hasTouch;
  const tap = async (sel) => {
    const r = await ev((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView?.({ block: 'nearest' }); const b = e.getBoundingClientRect(); const x = b.x + b.width / 2, y = b.y + b.height / 2; const h = document.elementFromPoint(x, y); return { x, y, inView: b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth, hitsIt: !!h && (h === e || e.contains(h)), disabled: !!e.disabled }; }, sel);
    if (!r) return { missing: true };
    if (touch) await page.touchscreen.tap(r.x, r.y); else await page.mouse.click(r.x, r.y);
    await sleep(450);
    return r;
  };
  const sheetTitle = () => ev(() => (document.getElementById('sheet-wrap').classList.contains('hidden') ? null : document.getElementById('sheet-title').textContent));
  const farms = () => ev(() => Object.fromEntries(Object.entries(window.__finca.sim.mb().farms).map(([k, f]) => [k, f.lvl])));
  res.taps = {};
  // sin pesos: el botón está apagado y dice por qué
  const richMoney = await ev(() => window.__finca.sim.s.money);
  await ev(() => { window.__finca.sim.s.money = 100; });
  res.taps.badge1 = await ev(() => document.getElementById('mb-nofarm').textContent);
  res.taps.labelManz = await tap('.mb-city[data-id="manzanillo"]');
  res.taps.sheetManz = await sheetTitle();
  res.taps.poorWhy = await ev(() => document.querySelector('#sheet-body .mb-why')?.textContent || null);
  res.taps.poorDisabled = await ev(() => !!document.querySelector('#sheet-body [data-act="mbfarm"]')?.disabled);
  await shot('5a-ciudad-sin-pesos');
  await ev((m) => { window.__finca.sim.s.money = m; }, richMoney); await sleep(700); // la hoja se refresca sola
  res.taps.fundar1 = await tap('#sheet-body [data-act="mbfarm"]');
  res.farm = (await farms()).manzanillo === 1;
  await shot('5b-finca-regional');
  await ev(() => window.__finca.sim.mbCheat('rent')); await sleep(600);
  const m0 = await ev(() => window.__finca.sim.s.money);
  await tap('#sheet-body [data-act="mbrent"]');
  res.rent = (await ev(() => window.__finca.sim.s.money)) - m0;
  await tap('#sheet-wrap [data-act="close"]');
  // segunda ciudad: liberar y fundar desde el botón del cartel de victoria
  await ev(() => window.__finca.sim.mbCheat('army'));
  await tap('.mb-city[data-id="bayamo"]');
  await tap('#sheet-body [data-act="mbattack"]');
  await tap('#sheet-body [data-act="mbgo"][data-tactic="asedio"]'); await sleep(600);
  await tap('#mb-skip');
  await waitFor(() => !window.__finca.mambi.battle && !document.getElementById('modal-wrap').classList.contains('hidden'), 20000);
  res.taps.winBtn = await tap('#modal [data-act="mbfarmgo"]');
  res.taps.sheetBay = await sheetTitle();
  res.taps.fundar2 = await tap('#sheet-body [data-act="mbfarm"]');
  await tap('#sheet-wrap [data-act="close"]');
  // tercera ciudad: tocar «próxima: …» arriba para volar a ella, liberarla y fundar tocando su etiqueta
  res.taps.title = await tap('#mb-title'); await sleep(900);
  res.taps.sheetBar = await sheetTitle();
  await tap('#sheet-body [data-act="mbattack"]');
  await tap('#sheet-body [data-act="mbgo"][data-tactic="asedio"]'); await sleep(600);
  await tap('#mb-skip');
  await waitFor(() => !window.__finca.mambi.battle && !document.getElementById('modal-wrap').classList.contains('hidden'), 20000);
  await tap('#modal [data-act="modal-close"]'); await sleep(1500);
  res.taps.badge3 = await ev(() => document.getElementById('mb-nofarm').textContent);
  res.taps.labelBar = await tap('.mb-city[data-id="baracoa"]');
  res.taps.sheetBar2 = await sheetTitle();
  await shot('5c-ciudad-libre');
  res.taps.fundar3 = await tap('#sheet-body [data-act="mbfarm"]');
  await tap('#sheet-wrap [data-act="close"]');
  // lista de fincas y mejoras 1 → 2 → 3
  res.taps.farmsBtn = await tap('#mb-farms-btn');
  res.taps.farmsSheet = await sheetTitle();
  await tap('#sheet-body [data-act="mbup"][data-id="manzanillo"]');
  await tap('#sheet-body [data-act="mbup"][data-id="manzanillo"]');
  res.taps.maxShown = await ev(() => /Nivel máximo/.test(document.querySelector('#sheet-body [data-farm="manzanillo"]')?.textContent || ''));
  await shot('5d-fincas');
  await tap('#sheet-wrap [data-act="close"]');
  res.farmsAfter = await farms();
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
  res.ok = !errors.length && res.unlocked && res.btnVisible && res.mapOpen && res.army.inf === 5 && res.army.cab === 3 && res.army.cart === 1 && res.viveresGain > 0 && res.inBattle && res.battleDone && res.freed.includes('manzanillo') && res.farm && res.rent > 0 && res.freed2.length === 3 && res.backToFarm && res.farmLoopRunning && res.afterReload.freed === 3 && res.afterReload.farms === 3
    && res.taps.sheetManz?.startsWith('Manzanillo') && /Te faltan/.test(res.taps.poorWhy || '') && res.taps.poorDisabled && res.taps.badge1 === '1'
    && res.taps.fundar1.hitsIt && res.taps.fundar2.hitsIt && res.taps.fundar3.hitsIt && res.taps.labelBar.hitsIt && res.taps.winBtn.hitsIt
    && res.taps.sheetBay?.startsWith('Bayamo') && res.taps.sheetBar?.startsWith('Baracoa') && res.taps.sheetBar2?.startsWith('Baracoa') && res.taps.badge3 === '1'
    && res.farmsAfter.manzanillo === 3 && res.farmsAfter.bayamo === 1 && res.farmsAfter.baracoa === 1 && res.taps.maxShown && res.taps.farmsSheet?.startsWith('Fincas');
  if (!res.ok) process.exitCode = 1;
  report[name] = res;
  console.log(name, JSON.stringify(res));
  await ctx.close();
}
for (const n of ONLY) await run(n, VPS[n]);
fs.writeFileSync(new globalThis.URL('../mambi-report.json', import.meta.url).pathname, JSON.stringify(report, null, 2));
await browser.close(); if (wk) await wk.close();
