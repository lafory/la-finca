// Pantalla completa: Android Chrome (tocar «Entrar» la pide, botón visible) y computadora (botón la activa).
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exe = fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const spy = () => {
  window.__fsCalls = 0;
  const orig = Element.prototype.requestFullscreen;
  Element.prototype.requestFullscreen = function (...a) { window.__fsCalls++; return orig.apply(this, a); };
};
const state = () => {
  const f = document.getElementById('btn-full'); const c = document.getElementById('game').getBoundingClientRect();
  return { fsCalls: window.__fsCalls, fullscreen: !!document.fullscreenElement, fsBtnVisible: getComputedStyle(f).display !== 'none' && f.getBoundingClientRect().width > 0,
    hint: !!document.getElementById('a2hs'), canvas: [Math.round(c.width), Math.round(c.height)], view: [innerWidth, innerHeight],
    scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight] };
};
let fail = 0; const report = {};
for (const [name, dev] of [['android-pixel7', devices['Pixel 7']], ['android-pixel7-land', devices['Pixel 7 landscape']]]) {
  const ctx = await browser.newContext({ ...dev }); await ctx.addInitScript(spy);
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE); await sleep(1500); await page.tap('#start'); await sleep(1500);
  const r = await page.evaluate(state); r.errors = errors;
  r.ok = r.fsCalls === 1 && r.fsBtnVisible && !r.hint && r.canvas[0] === r.view[0] && r.canvas[1] === r.view[1] && r.scroll[0] <= r.view[0] && r.scroll[1] <= r.view[1] && !errors.length;
  if (!r.ok) fail++; report[name] = r; console.log(name, JSON.stringify(r));
  await page.screenshot({ path: OUT + `fs-${name}.png` }); await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 800 } }); await ctx.addInitScript(spy);
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE); await sleep(1500); await page.click('#start'); await sleep(1000);
  const before = await page.evaluate(state);
  await page.click('#btn-full'); await sleep(800);
  const r = await page.evaluate(state); r.before = before; r.errors = errors;
  r.ok = before.fsBtnVisible && !before.hint && r.fsCalls === 1 && r.canvas[0] === r.view[0] && r.canvas[1] === r.view[1] && !errors.length;
  if (!r.ok) fail++; report.desktop = r; console.log('desktop', JSON.stringify(r));
  await page.screenshot({ path: OUT + 'fs-desktop.png' }); await ctx.close();
}
fs.writeFileSync(new globalThis.URL('../fullscreen-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
await browser.close();
process.exit(fail ? 1 : 0);
