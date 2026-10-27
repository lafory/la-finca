// Captura del kit de fincas regionales (preview/regional-kit.html): todos los modelos en cuadrícula,
// cada cultivo en sus 4 etapas; revisa 0 errores, ≤3 mallas por modelo y que dispose() no rompa nada.
// Uso: npx vite --port 5188 & URL=http://127.0.0.1:5188/ node tests/regional-kit.mjs
import { chromium } from 'playwright';
const BASE = (process.env.URL || 'http://127.0.0.1:5188/') + 'preview/regional-kit.html';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let fail = 0;
const SHOTS = [
  ['all', 'view=all', { width: 1400, height: 1700 }],
  ['build', 'view=build', { width: 1600, height: 900 }],
  ['closeup-1', 'only=rice,coffee,cacao', { width: 1400, height: 1000 }],
  ['closeup-2', 'only=tobacco,citrus,cane', { width: 1400, height: 1000 }],
  ['closeup-3', 'only=cattle,boat,tobaccoHouse,distillery', { width: 1400, height: 1200 }],
  ['closeup-4', 'only=boat,dock,nets,corral', { width: 1400, height: 1200 }],
  ['closeup-5', 'only=bohio,almacen,palm,fence&yaw=0.6', { width: 1200, height: 900 }],
];
for (const [name, qs, vp] of (process.env.ONLY ? SHOTS.filter((s) => process.env.ONLY.split(',').includes(s[0])) : SHOTS)) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await p.goto(`${BASE}?${qs}`, { timeout: 120000 });
  await p.waitForFunction(() => window.__kit?.ready, null, { timeout: 120000 });
  await p.waitForTimeout(800);
  const k = await p.evaluate(() => window.__kit);
  await p.screenshot({ path: `${OUT}regional-kit-${name}.png` });
  const heavy = k.per.filter((x) => x.calls > 3);
  const maxT = Math.max(...k.per.map((x) => x.tris));
  console.log(`${name}: ${k.models} modelos, ${k.calls} llamadas, ${k.tris} tri, máx ${maxT} tri/modelo, caché ${k.cache}, errores ${errors.length + k.errors.length}`);
  if (name === 'all') console.table(k.per.filter((x) => x.stage === 3 || x.stage === '-'));
  if (errors.length || k.errors.length || heavy.length) { fail++; console.log('FALLO', errors, k.errors, heavy); }
  await ctx.close();
}
await b.close();
console.log(fail ? `FALLÓ (${fail})` : 'OK');
process.exit(fail ? 1 : 0);
