// Contraataques del Régimen: aviso (finca y mapa), defensa con guarnición y trinchera (batalla animada), ciudad
// perdida (gris, finca ocupada sin renta), recuperarla con una batalla normal, ataques resueltos al volver y guardado.
// iPhone y iPad (WebKit) y computadora (Chromium). Uso: URL=http://127.0.0.1:4190/ node tests/castro.mjs · ONLY=phone
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
const BASE = (process.env.URL || 'http://localhost:4173/') + '?dev=1';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VPS = {
  phone: { eng: 'webkit', opts: devices['iPhone 13'], noFs: true },
  ipad: { eng: 'webkit', opts: devices['iPad (gen 7)'] },
  desktop: { eng: 'chromium', opts: { viewport: { width: 1280, height: 800 } } },
};
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);
const engines = {};
const eng = async (e) => (engines[e] ||= e === 'webkit' ? await webkit.launch() : await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }));
const report = {};
let fail = 0;

async function run(name) {
  const V = VPS[name];
  const ctx = await (await eng(V.eng)).newContext({ ...V.opts });
  if (V.noFs) await ctx.addInitScript(() => { for (const k of ['requestFullscreen', 'webkitRequestFullscreen']) { delete Element.prototype[k]; delete HTMLElement.prototype[k]; } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const ev = (fn, a) => page.evaluate(fn, a);
  const waitFor = async (fn, ms, arg) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(fn, arg)) return true; await sleep(200); } return false; };
  const click = (sel) => ev((sel) => { const b = document.querySelector(sel); if (!b || b.disabled) return false; b.click(); return true; }, sel);
  const closeModals = () => ev(() => document.querySelectorAll('#modal [data-act="modal-close"]').forEach((b) => b.click()));
  const modalText = () => ev(() => { const w = document.getElementById('modal-wrap'); return w && !w.classList.contains('hidden') ? document.getElementById('modal').textContent : ''; });
  const shot = (n) => page.screenshot({ path: OUT + `castro-${name}-${n}.png`, timeout: 120000 });
  const C = () => ev(() => JSON.parse(JSON.stringify(window.__finca.sim.cs())));
  const enter = async () => { await page.goto(BASE); await sleep(2000); if (V.opts.hasTouch) await page.tap('#start'); else await page.click('#start'); await sleep(1200); };
  const R = { errors };
  try {
    await enter();
    await ev(() => { const g = window.__finca, s = g.sim; s.s.tutorialDone = true; s.mbCheat('unlock'); s.mbCheat('army'); s.mbCheat('army'); s.mbCheat('free'); s.mbCheat('free'); s.mbBuyFarm('manzanillo'); });
    await closeModals();
    R.noAttackYet = await waitFor(() => !window.__finca.sim.cs().attack && !!window.__finca.sim.cs().next, 8000);
    await click('#btn-mambi'); await sleep(2200); await closeModals(); await sleep(500);
    // 1) aviso: truco «Ataque ahora» desde la hoja de Bayamo
    await click('.mb-city[data-id="bayamo"]'); await sleep(500);
    R.citySection = await ev(() => !!document.querySelector('#sheet-body .cs-sec') && document.querySelector('#sheet-body').textContent.includes('Defensa de Bayamo'));
    await click('[data-act="cscheat"][data-k="attack"][data-id="bayamo"]'); await sleep(400);
    let c = await C();
    R.attack = c.attack && { city: c.attack.city, power: c.attack.power, secs: Math.round(c.attack.hit - Date.now() / 1000) };
    R.sheetWarn = await ev(() => !!document.querySelector('#sheet-body .cs-warn'));
    await ev(() => window.__finca.ui.closeSheet()); await sleep(900);
    R.mapBanner = await ev(() => { const b = document.getElementById('cs-mbanner'); return !b.classList.contains('hidden') && /Bayamo/.test(b.textContent) && /\d:\d\d/.test(b.querySelector('.cs-cd').textContent); });
    R.mapMarker = await ev(() => { const m = [...document.querySelectorAll('.cs-mark.threat')]; return m.length === 1 && m[0].style.display !== 'none' && /\d:\d\d/.test(m[0].textContent); });
    await shot('1-aviso-mapa');
    // en la finca también se ve, y «Defender» lleva a la ciudad
    await click('[data-act="mbclose"]'); await sleep(1200);
    R.farmBanner = await ev(() => { const b = document.getElementById('cs-fbanner'); const r = b.getBoundingClientRect(); return !b.classList.contains('hidden') && r.width > 100 && r.right <= innerWidth + 1 && /Bayamo/.test(b.textContent); });
    await shot('2-aviso-finca');
    await click('#cs-fbanner [data-act="csgo"]'); await sleep(2200); await closeModals();
    R.defendOpens = await ev(() => window.__finca.mambi.open && document.getElementById('sheet-title').textContent.startsWith('Bayamo'));
    // 2) defender: guarnición y trinchera
    for (let i = 0; i < 4; i++) { await click('#sheet-body [data-act="csgar"][data-k="inf"][data-n="5"]'); await sleep(80); }
    for (let i = 0; i < 2; i++) { await click('#sheet-body [data-act="csgar"][data-k="cab"][data-n="2"]'); await sleep(80); }
    await click('#sheet-body [data-act="csdef"][data-k="trinchera"]'); await sleep(200);
    c = await C();
    R.garrison = c.cities.bayamo.gar; R.trinchera = c.cities.bayamo.def.trinchera;
    R.chance = await ev(() => { const s = window.__finca.sim; return s.csChance('bayamo', s.cs().attack.power); });
    await click('#sheet-body [data-act="cscheat"][data-k="now"]'); await sleep(300);
    R.defenseAnim = await waitFor(() => !!window.__finca.castro.defense, 4000);
    await waitFor(() => (window.__finca.castro.defense?.t || 9) > 2.4, 8000);
    await shot('3-defensa');
    R.defenseDone = await waitFor(() => !window.__finca.castro.defense, 12000);
    await sleep(300);
    R.heldModal = /resistió/.test(await modalText());
    await shot('4-resistio');
    await closeModals();
    c = await C();
    R.afterHold = { attack: c.attack, held: c.stats.held, freed: await ev(() => [...window.__finca.sim.mb().freed]) };
    // 3) perder: ataque fuerte contra Manzanillo (sin guarnición, con finca)
    await click('.mb-city[data-id="manzanillo"]'); await sleep(400);
    await click('[data-act="cscheat"][data-k="strong"][data-id="manzanillo"]'); await sleep(300);
    await click('#sheet-body [data-act="cscheat"][data-k="now"]'); await sleep(300);
    await waitFor(() => !!window.__finca.castro.defense, 4000);
    await waitFor(() => !window.__finca.castro.defense, 12000); await sleep(300);
    R.lostModal = /cayó/.test(await modalText());
    await closeModals(); await sleep(800);
    c = await C();
    R.lost = await ev(() => { const s = window.__finca.sim; return { freed: s.mbFreed('manzanillo'), owner: s.cs().cities.manzanillo.owner, farmKept: !!s.mb().farms.manzanillo, rate: s.mbFarmRate('manzanillo').pesos, next: s.mbNext()?.id, gray: !document.querySelector('.mb-city[data-id="manzanillo"]').classList.contains('free'), occLabel: document.querySelector('.mb-city[data-id="manzanillo"]').classList.contains('cs-occ') }; });
    await shot('5-ciudad-perdida');
    // 4) recuperarla con una batalla normal
    await click('.mb-city[data-id="manzanillo"]'); await sleep(400);
    R.occupiedNote = await ev(() => /Ocupada por el Régimen/.test(document.getElementById('sheet-body').textContent));
    await click('[data-act="mbattack"]'); await sleep(300);
    await click('[data-act="mbgo"][data-tactic="carga"]'); await sleep(600);
    await click('[data-act="mbskip"]');
    await waitFor(() => !window.__finca.mambi.battle, 15000); await sleep(300);
    await closeModals(); await sleep(600);
    R.retaken = await ev(() => { const s = window.__finca.sim; return { freed: s.mbFreed('manzanillo'), owner: s.cs().cities.manzanillo.owner, retaken: s.cs().stats.retaken, rate: s.mbFarmRate('manzanillo').pesos }; });
    // 5) ausencia: ataques resueltos al volver (con tope), resumen y guardado
    await ev(() => window.__finca.sim.csCheat('away', { h: 3 }));
    await page.reload(); await sleep(2000);
    if (V.opts.hasTouch) await page.tap('#start'); else await page.click('#start');
    await sleep(1500);
    const rep = await modalText();
    R.offline = await ev(() => { const s = window.__finca.sim, C = s.cs(); return { report: C.report?.lines?.length || 0, attacks: C.stats.attacks, lost: C.stats.lost, raids: C.stats.raids, freed: s.mb().freed.length, next: Math.round(C.next - Date.now() / 1000) }; });
    R.offlineModal = /Mientras no estabas/.test(rep);
    await shot('6-al-volver');
    await click('#modal [data-act="csok"][data-id="report"]'); await sleep(400);
    R.reportCleared = await ev(() => !window.__finca.sim.cs().report && document.getElementById('modal-wrap').classList.contains('hidden'));
    // tope justo: 3 h fuera → como mucho 1 pérdida (ciudad o saqueo) en esta ausencia
    R.offlineCapOk = R.offline.lost + R.offline.raids - 1 /* la de la prueba 3 */ <= 1 && R.offline.report <= 4;
    // guardar y recargar: todo sigue ahí
    const before = await ev(() => JSON.stringify({ c: window.__finca.sim.cs().cities, f: window.__finca.sim.mb().freed }));
    await page.reload(); await sleep(2000);
    if (V.opts.hasTouch) await page.tap('#start'); else await page.click('#start');
    await sleep(1200);
    R.reloadSame = (await ev(() => JSON.stringify({ c: window.__finca.sim.cs().cities, f: window.__finca.sim.mb().freed }))) === before;
    R.noReportAgain = !(await modalText()).includes('Mientras no estabas');
  } catch (e) { R.ex = e.message.split('\n')[0]; }
  R.ok = !R.ex && !errors.length && R.noAttackYet && R.citySection && R.attack?.city === 'bayamo' && R.sheetWarn && R.mapBanner && R.mapMarker && R.farmBanner && R.defendOpens
    && R.garrison?.inf === 20 && R.garrison?.cab === 4 && R.trinchera === 1 && R.chance >= 0.999 && R.defenseAnim && R.defenseDone && R.heldModal && !R.afterHold.attack && R.afterHold.held === 1 && R.afterHold.freed.includes('bayamo')
    && R.lostModal && R.lost.freed === false && R.lost.owner === 'regimen' && R.lost.farmKept && R.lost.rate === 0 && R.lost.next === 'manzanillo' && R.lost.gray && R.lost.occLabel
    && R.occupiedNote && R.retaken.freed && R.retaken.owner === 'jugador' && R.retaken.retaken === 1 && R.retaken.rate > 0
    && R.offlineModal && R.offline.report >= 1 && R.reportCleared && R.offlineCapOk && R.reloadSame && R.noReportAgain;
  if (!R.ok) fail++;
  report[name] = R;
  console.log(name, R.ok ? 'OK' : 'FALLA', JSON.stringify(R));
  await ctx.close();
}
for (const n of ONLY) await run(n);
fs.writeFileSync(new globalThis.URL('../castro-report.json', import.meta.url).pathname, JSON.stringify(report, null, 2));
for (const e of Object.values(engines)) await e.close();
console.log(fail ? `castro: ${fail} pantalla(s) con fallas` : 'castro: todo en verde');
process.exit(fail ? 1 : 0);
