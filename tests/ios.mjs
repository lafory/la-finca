// iPhone Safari (WebKit): nada se sale de la pantalla visible, HUD y barra inferior visibles.
// iPhone real no tiene la API de pantalla completa: se quita con un init script para simularlo.
// Sin API: sin botón, pista «Añadir a pantalla de inicio» una sola vez. iPad (con API): botón visible.
import { webkit, devices } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await webkit.launch();
const cases = [
  ['iphone13', devices['iPhone 13']], ['iphone13-land', devices['iPhone 13 landscape']],
  ['iphone14', devices['iPhone 14']], ['iphone14-land', devices['iPhone 14 landscape']],
  ['iphone14pro-max', devices['iPhone 14 Pro Max']], ['iphone-se', devices['iPhone SE']],
];
const report = {};
let fail = 0;
for (const [name, dev] of cases) {
  const ctx = await browser.newContext({ ...dev });
  await ctx.addInitScript(() => {
    for (const k of ['requestFullscreen', 'webkitRequestFullscreen']) { delete Element.prototype[k]; delete HTMLElement.prototype[k]; }
    Object.defineProperty(Document.prototype, 'fullscreenEnabled', { get: () => undefined, configurable: true });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(BASE); await sleep(2500);
  const titleFits = await page.evaluate(() => { const r = document.querySelector('#start').getBoundingClientRect(); return r.bottom <= innerHeight + 1 && r.top >= 0; });
  await page.tap('#start'); await sleep(2500);
  const r = await page.evaluate(() => {
    const W = window.visualViewport?.width || innerWidth, H = window.visualViewport?.height || innerHeight;
    const out = [];
    const sel = ['.hud-top .chip', '.hud-top .round:not(.hidden)', '.bottom .big', '.camgroup .cam'];
    for (const s of sel) for (const el of document.querySelectorAll(s)) {
      const b = el.getBoundingClientRect(); if (!b.width) continue;
      if (b.left < -0.5 || b.top < -0.5 || b.right > W + 0.5 || b.bottom > H + 0.5) out.push(`${s} ${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}`);
    }
    const c = document.getElementById('game').getBoundingClientRect();
    const full = document.getElementById('btn-full');
    return {
      W, H, outside: out,
      scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight, document.body.scrollWidth, document.body.scrollHeight],
      canvas: [Math.round(c.width), Math.round(c.height)],
      appVars: [getComputedStyle(document.documentElement).getPropertyValue('--app-w'), getComputedStyle(document.documentElement).getPropertyValue('--app-h')],
      fullscreen: !!(document.fullscreenElement || document.webkitFullscreenElement),
      fsBtnVisible: !!full && getComputedStyle(full).display !== 'none' && full.getBoundingClientRect().width > 0,
      ios: document.documentElement.classList.contains('ios'),
      hint: (() => { const h = document.getElementById('a2hs'); if (!h) return null; const b = h.getBoundingClientRect(); return { text: h.textContent, fits: b.left >= 0 && b.top >= 0 && b.right <= W + 0.5 && b.bottom <= H + 0.5 }; })(),
    };
  });
  if (r.hint) { await page.tap('#a2hs .a2hs-x'); await sleep(200); r.hintClosed = await page.evaluate(() => !document.getElementById('a2hs') && localStorage.getItem('lafinca.a2hsHint') === '1'); }
  // abrir y cerrar una hoja: cabe en pantalla
  await page.evaluate(() => window.__finca.ui.openShop()); await sleep(600);
  r.sheetFits = await page.evaluate(() => { const b = document.querySelector('.sheet').getBoundingClientRect(); const H = window.visualViewport?.height || innerHeight; return b.top >= 0 && b.bottom <= H + 1; });
  await page.screenshot({ path: OUT + `ios-${name}-sheet.png` });
  await page.evaluate(() => window.__finca.ui.closeSheet()); await sleep(300);
  await page.screenshot({ path: OUT + `ios-${name}.png` });
  r.errors = errors; r.titleFits = titleFits;
  const ok = !r.outside.length && r.scroll[0] <= r.W + 1 && r.scroll[1] <= r.H + 1 && r.canvas[0] === Math.round(r.W) && r.canvas[1] === Math.round(r.H) && !r.fullscreen && !r.fsBtnVisible && r.ios && r.hint?.fits && /Añadir a pantalla de inicio/.test(r.hint.text) && r.hintClosed && r.sheetFits && titleFits && !errors.length;
  r.ok = ok; if (!ok) fail++;
  report[name] = r;
  console.log(name, JSON.stringify(r));
  await ctx.close();
}
// iPad Safari: tiene webkitRequestFullscreen (el WebKit de Playwright no la trae: se simula)
// → al entrar pide pantalla completa, botón visible, sin pista
{
  const ctx = await browser.newContext({ ...devices['iPad (gen 7)'] });
  await ctx.addInitScript(() => {
    window.__fsCalls = 0;
    Element.prototype.webkitRequestFullscreen = function () { window.__fsCalls++; };
    Object.defineProperty(Document.prototype, 'webkitFullscreenEnabled', { get: () => true, configurable: true });
  });
  const page = await ctx.newPage();
  await page.goto(BASE); await sleep(2000); await page.tap('#start'); await sleep(2000);
  const r = await page.evaluate(() => { const f = document.getElementById('btn-full'); return { fsCalls: window.__fsCalls, fsBtnVisible: getComputedStyle(f).display !== 'none' && f.getBoundingClientRect().width > 0, hint: !!document.getElementById('a2hs'), ios: document.documentElement.classList.contains('ios') }; });
  r.ok = r.fsCalls === 1 && r.fsBtnVisible && !r.hint && r.ios; if (!r.ok) fail++;
  report.ipad = r; console.log('ipad', JSON.stringify(r));
  await ctx.close();
}
fs.writeFileSync(new globalThis.URL('../ios-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
await browser.close();
process.exit(fail ? 1 : 0);
