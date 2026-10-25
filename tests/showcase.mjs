// Captura de una finca avanzada (nivel 7, todas las parcelas, cultivos en varias etapas, trabajadores).
import { chromium } from 'playwright';
const BASE = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const exe = '/usr/bin/google-chrome';
const b = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [];
for (const [name, opts] of [['desktop', { viewport: { width: 1280, height: 800 } }], ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(800);
  await p.click('#start'); await p.waitForTimeout(500);
  await p.evaluate(() => {
    const g = window.__finca, sim = g.sim, s = sim.s;
    s.money = 5000; s.xp = 700; s.level = 8; s.tutorialDone = true;
    for (const id of ['este', 'norte', 'oeste', 'sur']) sim.buyParcel(id);
    for (const r of ['recolector', 'sembrador', 'cocinero', 'camionero']) sim.buy(r);
    sim.buy('coop'); for (let i = 0; i < 4; i++) sim.buy('chicken');
    const crops = ['tomato', 'cane', 'tobacco'];
    const t = Date.now() / 1000;
    s.plots.forEach((p, i) => {
      const c = crops[(Math.floor(p.z / 2) + Math.floor(p.x / 3)) % 3];
      p.crop = c; p.dur = sim.plotDur(c);
      const prog = [0.1, 0.5, 0.8, 1.2][i % 4];
      p.at = t - p.dur * prog; p.watered = i % 5 === 0;
    });
    s.seeds = { tomato: 0, cane: 0, tobacco: 0 };
    s.inv.tomato = 3; sim.startRecipe('ketchup');
    s.money = 1234;
    g.onLandChanged();
    document.querySelector('[data-act="modal-close"]')?.click();
    g.ui.closeSheet();
  });
  await p.waitForTimeout(2500);
  await p.evaluate(() => { document.querySelector('[data-act="modal-close"]')?.click(); window.__finca.fitFarm(true); });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}${name}-11-finca-avanzada.png` });
  await p.evaluate(() => { const r = window.__finca.rig; r.goal.set(9, 0, 10); r.goalDist = 13; r.manualUntil = performance.now() + 1e6; });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${OUT}${name}-12-detalle.png` });
  await ctx.close();
}
console.log(JSON.stringify({ errors }));
await b.close();
