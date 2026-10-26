// Guardar partida (código y archivo): ida y vuelta en computadora (Chromium) e iPhone 13 (WebKit).
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exe = fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const report = {}; let fail = 0;

async function run(name, browserType, ctxOpts, launch = {}) {
  const browser = await browserType.launch(launch);
  const errors = [];
  const watch = (page) => { page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message)); };
  const press = async (page, sel) => { if (ctxOpts.hasTouch) await page.tap(sel); else await page.click(sel); await sleep(250); };
  const open = async (ctx) => { const p = await ctx.newPage(); watch(p); p.on('filechooser', () => {}); await p.goto(BASE); await sleep(1500); await press(p, '#start'); await sleep(800); return p; };
  const settings = async (p) => { await p.evaluate(() => window.__finca.ui.openSettings()); await sleep(300); };
  const r = {};
  // Teléfono A: finca con progreso
  const A = await browser.newContext({ ...ctxOpts, acceptDownloads: true });
  const a = await open(A);
  await a.evaluate(() => { const s = window.__finca.sim.s; s.money = 4321; s.level = 6; s.xp = Math.max(s.xp, 2000); });
  await settings(a);
  r.sectionShown = await a.evaluate(() => [...document.querySelectorAll('#sheet-body [data-act]')].map((b) => b.dataset.act).filter((x) => /code|file/.test(x)));
  r.fileBtn = await a.evaluate(() => { const i = document.querySelector('label.filebtn #file-in'); return !!i && !i.hasAttribute('accept'); });
  await press(a, '[data-act="code-copy"]'); await sleep(400);
  const code = await a.$eval('#code-out', (t) => t.value);
  r.copyMsg = await a.$eval('#modal p', (p) => p.textContent);
  r.codeLen = code.length; r.codeOk = /^LF1\.[0-9a-f]{8}\./.test(code);
  await a.screenshot({ path: OUT + `save-${name}-code.png` });
  await press(a, '[data-act="modal-close"]');
  // archivo
  await settings(a);
  const [dl] = await Promise.all([a.waitForEvent('download'), press(a, '[data-act="file-save"]')]);
  const file = `/tmp/${dl.suggestedFilename()}`; await dl.saveAs(file);
  r.fileName = dl.suggestedFilename();
  await A.close();
  // Teléfono B: finca nueva → pega el código
  const B = await browser.newContext({ ...ctxOpts });
  const b = await open(B);
  const before = await b.evaluate(() => ({ money: window.__finca.sim.s.money, level: window.__finca.sim.s.level }));
  await settings(b); await press(b, '[data-act="code-paste"]');
  // código dañado → error
  await b.fill('#code-in', code.slice(0, -30)); await press(b, '[data-act="code-check"]');
  r.badErr = await b.$eval('#code-err', (e) => !e.classList.contains('hidden') && e.textContent);
  await b.fill('#code-in', code); await press(b, '[data-act="code-check"]');
  r.preview = await b.$eval('#modal', (m) => m.innerText.replace(/\s+/g, ' '));
  await b.screenshot({ path: OUT + `save-${name}-preview.png` });
  await Promise.all([b.waitForEvent('load'), press(b, '[data-act="code-apply"]')]);
  await sleep(1500); await press(b, '#start'); await sleep(600);
  r.afterPaste = await b.evaluate(() => ({ money: window.__finca.sim.s.money, level: window.__finca.sim.s.level }));
  // restaurar copia anterior
  await settings(b);
  r.backupRow = await b.$eval('[data-act="backup-restore"]', (x) => x.closest('.row').innerText.replace(/\s+/g, ' ')).catch(() => null);
  await press(b, '[data-act="backup-restore"]');
  await Promise.all([b.waitForEvent('load'), press(b, '[data-act="code-apply"]')]);
  await sleep(1500); await press(b, '#start'); await sleep(600);
  r.afterRestore = await b.evaluate(() => ({ money: window.__finca.sim.s.money, level: window.__finca.sim.s.level }));
  // cargar archivo
  await settings(b);
  const [fc] = await Promise.all([b.waitForEvent('filechooser'), press(b, 'label.filebtn')]);
  await fc.setFiles(file); await sleep(500);
  r.filePreview = await b.$eval('#modal', (m) => m.innerText.replace(/\s+/g, ' ')).catch(() => null);
  await Promise.all([b.waitForEvent('load'), press(b, '[data-act="code-apply"]')]);
  await sleep(1500); await press(b, '#start'); await sleep(600);
  r.afterFile = await b.evaluate(() => ({ money: window.__finca.sim.s.money, level: window.__finca.sim.s.level }));
  r.before = before; r.errors = errors;
  r.ok = r.codeOk && r.sectionShown.length === 3 && r.fileBtn && /Copiado|Mantén/.test(r.copyMsg) && /\.lafinca$/.test(r.fileName) && !!r.badErr
    && /Nivel 6/.test(r.preview) && r.afterPaste.money === 4321 && r.afterPaste.level === 6 && !!r.backupRow
    && r.afterRestore.money === before.money && r.afterRestore.level === before.level
    && /Nivel 6/.test(r.filePreview || '') && r.afterFile.money === 4321 && !errors.length;
  if (!r.ok) fail++;
  report[name] = r; console.log(name, JSON.stringify(r));
  await browser.close();
}
await run('desktop', chromium, { viewport: { width: 1280, height: 800 }, permissions: ['clipboard-read', 'clipboard-write'] }, { executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
await run('iphone13', webkit, { ...devices['iPhone 13'] });
fs.writeFileSync(new globalThis.URL('../savecode-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
process.exit(fail ? 1 : 0);
