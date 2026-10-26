// «Entrar a la finca» SIEMPRE entra (o explica qué pasó). Partidas nuevas, viejas, a medias, dañadas, importadas
// por código y por archivo; sin sonido, pantalla completa que falla, almacenamiento lleno, WebGL que no abre y
// el módulo del juego sin cargar. iPhone/iPad (WebKit), iPad con UA de Mac, Android y computadora (Chromium).
// Uso: URL=http://127.0.0.1:4173/ node tests/entrar.mjs   · ONLY=phone,ipad
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
import { encodeCode } from '../src/savecode.js';
const BASE = process.env.URL || 'http://localhost:4173/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const VPS = {
  phone: { eng: 'webkit', opts: devices['iPhone 13'], noFs: true },
  'phone-land': { eng: 'webkit', opts: devices['iPhone 13 landscape'], noFs: true },
  ipad: { eng: 'webkit', opts: devices['iPad (gen 7)'] },
  'ipad-mac': { eng: 'webkit', opts: { viewport: { width: 820, height: 1180 }, userAgent: MAC_UA, hasTouch: true, isMobile: false, deviceScaleFactor: 2 }, macTouch: true },
  android: { eng: 'chromium', opts: devices['Pixel 7'] },
  desktop: { eng: 'chromium', opts: { viewport: { width: 1280, height: 800 } } },
};
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);
const engines = {
  webkit: await webkit.launch(),
  chromium: await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }),
};
const KEY = 'lafinca-v2';
const report = {};
let fail = 0;

async function open(vp, { seed, init, route, url = BASE } = {}) {
  const V = VPS[vp];
  const ctx = await engines[V.eng].newContext({ ...V.opts });
  if (V.noFs) await ctx.addInitScript(() => { for (const k of ['requestFullscreen', 'webkitRequestFullscreen']) { delete Element.prototype[k]; delete HTMLElement.prototype[k]; } Object.defineProperty(Document.prototype, 'fullscreenEnabled', { get: () => undefined, configurable: true }); });
  if (V.macTouch) await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => 5, configurable: true }); });
  if (seed != null) await ctx.addInitScript(([k, s]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem(k, s); } }, [KEY, seed]);
  if (init) await ctx.addInitScript(init);
  if (route) await ctx.route(route, (r) => r.abort());
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('filechooser', () => {});
  await p.goto(url); await sleep(2200);
  return { ctx, p, errors };
}
const press = async (p, vp, sel) => { if (VPS[vp].opts.hasTouch) await p.tap(sel, { timeout: 5000 }); else await p.click(sel, { timeout: 5000 }); await sleep(250); };
const state = (p) => p.evaluate(() => ({
  entered: !!window.__finca?.started && (!document.getElementById('title') || document.getElementById('title').classList.contains('gone')),
  level: window.__finca?.sim?.s?.level, money: window.__finca?.sim?.s?.money,
  rescue: !!document.getElementById('rescue'),
  btn: document.getElementById('start')?.textContent || null,
}));
async function enter(p, vp) { const btn = (await state(p)).btn; await press(p, vp, '#start').catch(() => {}); await sleep(1500); return { ...(await state(p)), btn }; }

// partida de referencia: se crea jugando
async function makeSave(vp) {
  const { ctx, p } = await open(vp);
  await enter(p, vp);
  const raw = await p.evaluate(() => { const s = window.__finca.sim.s; s.level = 14; s.xp = 40000; s.money = 4321; s.res.madera = 50; return JSON.stringify(s); });
  await ctx.close();
  return raw;
}

async function runVp(vp) {
  const R = {};
  const mid = await makeSave(vp);
  const midObj = JSON.parse(mid);
  const case_ = async (name, opts, check, { allowErrors = false } = {}) => {
    let o;
    try {
      o = await open(vp, opts);
      const r = await check(o.p, o);
      r.errors = o.errors;
      r.ok = !!r.ok && (allowErrors || !o.errors.length);
      R[name] = r;
    } catch (e) { R[name] = { ok: false, ex: e.message.split('\n')[0], errors: o?.errors }; }
    await o?.ctx.close();
    if (!R[name].ok) fail++;
  };
  await case_('sin-partida', {}, async (p) => { const r = await enter(p, vp); r.ok = r.entered && r.level === 1 && r.btn === 'Entrar a la finca'; return r; });
  await case_('partida-media', { seed: mid }, async (p) => { const r = await enter(p, vp); r.ok = r.entered && r.level === 14 && r.money === 4321; return r; });
  const old = { v: 2, level: 5, money: 300, xp: 500, parcels: [], inv: { egg: 3 }, seeds: { tomato: 3 }, plots: [], chickens: [], eggs: [], workers: [{ role: 'cocinero' }], built: {}, wood: 12, savedAt: Date.now() / 1000 - 86400 * 3 };
  await case_('partida-vieja', { seed: JSON.stringify(old) }, async (p) => { const r = await enter(p, vp); r.madera = await p.evaluate(() => window.__finca.sim.s.res.madera); r.ok = r.entered && r.level === 5 && r.madera === 12; return r; });
  const noExt = structuredClone(midObj); delete noExt.ext; delete noExt.res; delete noExt.player; noExt.plots = null; noExt.workers = [null, { role: 'cocinero' }];
  await case_('sin-extras', { seed: JSON.stringify(noExt) }, async (p) => { const r = await enter(p, vp); r.ok = r.entered && r.level === 14; return r; });
  const badExt = structuredClone(midObj); badExt.ext = { central: 5, granja: 'x', mambi: [1, 2] };
  await case_('extras-dañados', { seed: JSON.stringify(badExt) }, async (p) => { const r = await enter(p, vp); await sleep(1500); r.ok = r.entered && r.level === 14; return r; });
  await case_('json-roto', { seed: '{"v":2,"level":9,' }, async (p) => {
    const r = await enter(p, vp);
    r.rescued = await p.evaluate(() => localStorage.getItem('lafinca-v2-rescate'));
    r.ok = r.entered && r.level === 1 && r.rescued === '{"v":2,"level":9,';
    return r;
  });
  await case_('sin-sonido-ni-fullscreen', {
    seed: mid,
    init: () => {
      window.AudioContext = function () { throw new Error('audio no'); }; window.webkitAudioContext = window.AudioContext;
      const bad = function () { throw new TypeError('fullscreen no'); };
      if (Element.prototype.requestFullscreen) Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('rechazado')); };
      if (Element.prototype.webkitRequestFullscreen) Element.prototype.webkitRequestFullscreen = bad;
    },
  }, async (p) => { const r = await enter(p, vp); r.ok = r.entered && r.level === 14; return r; });
  await case_('almacen-lleno', {
    seed: mid,
    init: () => { const set = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (sessionStorage.getItem('seeded') && this === localStorage) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; } return set.call(this, k, v); }; },
  }, async (p) => { const r = await enter(p, vp); r.ok = r.entered && r.level === 14; return r; });
  // WebGL que no abre (memoria/GPU): aviso en español, la partida NO se borra hasta «Empezar nueva»
  await case_('webgl-falla', {
    seed: mid,
    init: () => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { if (/webgl/.test(t)) return null; return g.call(this, t, o); }; },
  }, async (p) => {
    const r = await state(p);
    r.text = await p.$eval('#rescue', (d) => d.innerText.replace(/\s+/g, ' ').slice(0, 160)).catch(() => null);
    r.saveKept = (await p.evaluate(() => localStorage.getItem('lafinca-v2'))) !== null;
    await press(p, vp, '#rescue-new');
    await sleep(2500);
    r.afterNew = await p.evaluate(() => ({ save: localStorage.getItem('lafinca-v2'), rescate: localStorage.getItem('lafinca-v2-rescate') }));
    r.ok = r.rescue && /no pudo abrir/.test(r.text || '') && /Reintentar/.test(r.text) && r.saveKept && !!r.afterNew.rescate && JSON.parse(r.afterNew.rescate).level === 14 && !r.afterNew.save;
    delete r.afterNew; return r;
  }, { allowErrors: true });
  // el módulo del juego no carga (Safari viejo, red): tocar «Entrar» explica en lugar de no hacer nada
  await case_('juego-sin-cargar', { seed: mid, route: /assets\/index-.*\.js$|src\/main\.js/ }, async (p) => {
    await press(p, vp, '#start').catch(() => {}); await sleep(3200);
    const r = await state(p);
    r.ok = r.rescue && !r.entered;
    return r;
  }, { allowErrors: true });
  // pasar la partida por código y por archivo (como de un teléfono a otro), recargar y entrar
  for (const via of ['codigo', 'archivo']) {
    await case_(`importar-${via}`, {}, async (p) => {
      await enter(p, vp);
      await p.evaluate(() => window.__finca.ui.openSettings()); await sleep(300);
      if (via === 'codigo') {
        // código LF1 hecho por el propio juego desde la partida media
        const code = encodeCode(midObj);
        await press(p, vp, '[data-act="code-paste"]');
        await p.fill('#code-in', code); await press(p, vp, '[data-act="code-check"]');
      } else {
        const path = `/tmp/entrar-${vp}.lafinca`;
        fs.writeFileSync(path, JSON.stringify({ app: 'la-finca', f: 1, at: Date.now(), save: midObj }, null, 1));
        const [fc] = await Promise.all([p.waitForEvent('filechooser', { timeout: 5000 }), press(p, vp, 'label.filebtn')]);
        await fc.setFiles(path); await sleep(700);
      }
      const preview = await p.$eval('#modal', (m) => m.innerText.replace(/\s+/g, ' ')).catch(() => '');
      await Promise.all([p.waitForEvent('load', { timeout: 15000 }), press(p, vp, '[data-act="code-apply"]')]);
      await sleep(2500);
      const r = await enter(p, vp);
      r.preview = preview.slice(0, 60);
      r.ok = /Nivel 14/.test(preview) && r.entered && r.level === 14 && r.money === 4321;
      return r;
    });
  }
  return R;
}

for (const vp of ONLY) {
  report[vp] = await runVp(vp);
  const bad = Object.entries(report[vp]).filter(([, r]) => !r.ok).map(([k]) => k);
  console.log(vp, bad.length ? `FALLA: ${bad.join(', ')}` : 'ok', Object.keys(report[vp]).length, 'casos');
}
fs.writeFileSync(new globalThis.URL('../entrar-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
for (const e of Object.values(engines)) await e.close();
console.log(fail ? `FALLARON ${fail}` : 'TODO OK');
process.exit(fail ? 1 : 0);
