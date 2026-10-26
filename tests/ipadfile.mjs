// «Cargar archivo» en iPad (Safari con UA de Mac), iPhone y computadora:
// el input real está bajo el dedo (sin accept), acepta .lafinca/.lafinca.json/.txt por contenido,
// el mismo archivo dos veces, errores claros, «Descargar archivo» por hoja de compartir en iOS y «Pegar código».
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
import { encodeCode, encodeFile } from '../src/savecode.js';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exe = fs.existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
const report = {}; let fail = 0;

async function run(name, type, ctxOpts, { ipad = false, launch = {} } = {}) {
  const browser = await type.launch(launch);
  const ctx = await browser.newContext(ctxOpts);
  if (ipad) await ctx.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => 5 });
    // hoja de compartir simulada (Playwright WebKit no la tiene)
    window.__shared = [];
    navigator.canShare = (d) => !!(d && d.files && d.files.length);
    navigator.share = async (d) => { window.__shared.push({ names: (d.files || []).map((f) => f.name), text: d.files?.[0] ? await d.files[0].text() : d.text }); };
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('filechooser', () => {}); // activa la intercepción antes del primer toque (Chromium la activa tarde)
  const touch = !!ctxOpts.hasTouch;
  const press = async (sel) => { if (touch) await p.tap(sel); else await p.click(sel); await sleep(250); };
  await p.goto(BASE); await sleep(1500); await press('#start'); await sleep(600);
  const r = {};
  r.isIOS = await p.evaluate(() => document.documentElement.classList.contains('ios'));
  // partida de origen
  const save = await p.evaluate(() => { const s = JSON.parse(JSON.stringify(window.__finca.sim.s)); s.money = 7777; s.level = 9; return s; });
  const code = encodeCode(save), json = encodeFile(save);
  const files = [
    { name: 'la-finca-nivel9.lafinca', mimeType: 'application/octet-stream', buffer: Buffer.from(json) },
    { name: 'la-finca-nivel9.lafinca.json', mimeType: 'application/json', buffer: Buffer.from(json) },
    { name: 'la-finca-nivel9.txt', mimeType: 'text/plain', buffer: Buffer.from('Mi finca:\n' + code + '\n') },
  ];
  const settings = async () => { await p.evaluate(() => { window.__finca.ui.closeModal?.(); document.getElementById('modal-wrap')?.classList.add('hidden'); window.__finca.ui.openSettings(); }); await sleep(300); };
  const pick = async (f) => {
    await settings();
    await p.$eval('label.filebtn', (e) => e.scrollIntoView({ block: 'center' })); await sleep(150);
    const [fc] = await Promise.all([p.waitForEvent('filechooser', { timeout: 20000 }).catch(() => null), press('label.filebtn')]);
    // Chromium sin ventana a veces no intercepta el selector en esta página (WebGL): mismo input, archivo directo.
    if (fc) await fc.setFiles(f); else { r.directSet = (r.directSet || 0) + 1; await p.setInputFiles('#file-in', f); }
    await sleep(500);
    return p.$eval('#modal', (m) => m.closest('.hidden') ? null : m.innerText.replace(/\s+/g, ' ')).catch(() => null);
  };
  await settings();
  await p.$eval('label.filebtn', (e) => e.scrollIntoView({ block: 'center' })); await sleep(150);
  r.input = await p.evaluate(() => {
    const i = document.getElementById('file-in'), l = i.closest('label'), a = i.getBoundingClientRect(), b = l.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return { accept: i.getAttribute('accept'), display: getComputedStyle(i).display, onScreen: a.left >= 0 && a.top >= 0 && a.right <= innerWidth, covers: Math.abs(a.width - b.width) <= 6 && Math.abs(a.height - b.height) <= 6, hitIsInput: hit === i };
  });
  await p.screenshot({ path: OUT + `ipadfile-${name}-settings.png` });
  // descargar: iOS → hoja de compartir con archivo .lafinca
  await settings();
  if (ipad) {
    await press('[data-act="file-save"]'); await sleep(400);
    r.shared = await p.evaluate(() => window.__shared.map((x) => ({ names: x.names, ok: x.text.startsWith('{') })));
  } else {
    const ctxDl = await Promise.all([p.waitForEvent('download', { timeout: 30000 }).catch(() => null), press('[data-act="file-save"]')]);
    r.download = ctxDl[0] ? ctxDl[0].suggestedFilename() : null;
  }
  r.picks = {};
  for (const f of files) r.picks[f.name] = /Nivel 9/.test(await pick(f) || '');
  r.sameTwice = /Nivel 9/.test(await pick(files[0]) || '');
  r.badFile = await pick({ name: 'foto.txt', mimeType: 'text/plain', buffer: Buffer.from('hola') });
  r.emptyFile = await pick({ name: 'vacio.lafinca', mimeType: 'application/octet-stream', buffer: Buffer.alloc(0) });
  await p.screenshot({ path: OUT + `ipadfile-${name}-error.png` });
  // pegar código: portapapeles sin permiso → mensaje claro; pegado a mano con texto alrededor → vista previa
  await settings(); await press('[data-act="code-paste"]');
  if (await p.$('[data-act="code-clip"]')) {
    await p.evaluate(() => { navigator.clipboard.readText = () => Promise.reject(new DOMException('no', 'NotAllowedError')); });
    await press('[data-act="code-clip"]');
    r.clipErr = await p.$eval('#code-err', (e) => !e.classList.contains('hidden') && e.textContent);
  }
  await p.fill('#code-in', '  ' + code.slice(0, 40) + '\n' + code.slice(40) + '  '); await press('[data-act="code-check"]');
  r.pastePreview = /Nivel 9/.test(await p.$eval('#modal', (m) => m.innerText));
  // aplicar un archivo
  await pick(files[2]);
  await Promise.all([p.waitForEvent('load'), press('[data-act="code-apply"]')]);
  await sleep(1500); await press('#start'); await sleep(500);
  r.after = await p.evaluate(() => ({ money: window.__finca.sim.s.money, level: window.__finca.sim.s.level }));
  r.errors = errors;
  r.ok = r.input.accept === null && r.input.display !== 'none' && r.input.onScreen && r.input.covers && r.input.hitIsInput
    && Object.values(r.picks).every(Boolean) && r.sameTwice && /no es una partida/.test(r.badFile || '') && /vacío/.test(r.emptyFile || '')
    && r.pastePreview && (r.clipErr === undefined || /portapapeles/.test(r.clipErr))
    && (ipad ? r.isIOS && r.shared.length === 1 && /\.lafinca$/.test(r.shared[0].names[0]) && r.shared[0].ok : /\.lafinca$/.test(r.download || ''))
    && !r.directSet && r.after.money === 7777 && r.after.level === 9 && !errors.length;
  if (!r.ok) fail++;
  report[name] = r; console.log(name, JSON.stringify(r));
  await browser.close();
}

const ONLY = process.env.ONLY;
const want = (n) => !ONLY || ONLY.split(',').includes(n);
if (want('ipadpro')) await run('ipadpro', webkit, { ...devices['iPad Pro 11'], userAgent: MAC }, { ipad: true });
if (want('ipad7')) await run('ipad7', webkit, { ...devices['iPad (gen 7)'], userAgent: MAC }, { ipad: true });
if (want('iphone')) await run('iphone', webkit, { ...devices['iPhone 13'] });
if (want('desktop')) await run('desktop', chromium, { viewport: { width: 1280, height: 800 }, acceptDownloads: true }, { launch: { executablePath: exe } });
fs.writeFileSync(OUT + 'ipadfile-report.json', JSON.stringify(report, null, 2));
console.log(fail ? `FAIL ${fail}` : 'ALL OK');
process.exit(fail ? 1 : 0);
