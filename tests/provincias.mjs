// Fincas de provincia GRANDES (copia de la finca principal con lo de cada región).
// 1) partida vieja con una finquita chiquita (formato de antes) → se convierte y se devuelve su valor en pesos
// 2) se fundan 3 fincas de provincias distintas (Granma, Baracoa, Matanzas); en cada una, con toques reales:
//    entrar (botón de fincas del HUD), caminar, sembrar, cosechar, cocinar en el fogón, vender a un camión y contratar
//    un trabajador; foto de cada una
// 3) volver a la principal: la finca principal quedó igual; recargar: todo guardado
// 4) 5 cambios de finca: memoria y llamadas de dibujo estables
// 5) saqueo del Régimen sobre una finca grande (roba de la canasta, para camiones y producción) y ciudad ocupada
//    (no se puede entrar; si estás dentro, te saca); 0 errores de consola.
// Uso: URL=http://127.0.0.1:4180/ node tests/provincias.mjs · ONLY=phone,ipad,desktop · LIVE=1 (sin ?dev=1 trucos: usa hooks)
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
const BASE = (process.env.URL || 'http://localhost:4180/') + '?dev=1';
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VPS = {
  phone: { eng: 'webkit', opts: devices['iPhone 13'], noFs: true },
  ipad: { eng: 'webkit', opts: devices['iPad (gen 7)'] },
  desktop: { eng: 'chromium', opts: { viewport: { width: 1280, height: 800 } } },
};
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);
const PREFIX = process.env.PREFIX || 'provincias';
const engines = {};
const eng = async (e) => (engines[e] ||= e === 'webkit' ? await webkit.launch() : await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-precise-memory-info', '--js-flags=--expose-gc'] }));
const report = {}; let fail = 0;
const FARMS = [['manzanillo', 'granma'], ['baracoa', 'baracoa'], ['matanzas', 'matanzas']];

async function run(name) {
  const V = VPS[name];
  const ctx = await (await eng(V.eng)).newContext({ ...V.opts });
  if (V.noFs) await ctx.addInitScript(() => { for (const k of ['requestFullscreen', 'webkitRequestFullscreen']) { delete Element.prototype[k]; delete HTMLElement.prototype[k]; } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const ev = (fn, a) => page.evaluate(fn, a);
  const touch = !!V.opts.hasTouch;
  const tapXY = async (x, y) => { if (touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); await sleep(450); };
  const tap = async (sel) => {
    const r = await ev((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView?.({ block: 'center' }); const b = e.getBoundingClientRect(); if (!b.width) return { hidden: true }; const x = b.x + b.width / 2, y = b.y + b.height / 2; const h = document.elementFromPoint(x, y); return { x, y, hits: !!h && (h === e || e.contains(h)) }; }, sel);
    if (!r || r.hidden) return { missing: true, sel };
    await tapXY(r.x, r.y); return r;
  };
  const closeModals = () => ev(() => document.querySelectorAll('#modal [data-act="modal-close"]').forEach((b) => b.click()));
  const shot = (n) => page.screenshot({ path: OUT + `${PREFIX}-${name}-${n}.png`, timeout: 120000 });
  const started = (city) => page.waitForFunction((city) => window.__fincaStarted && window.__finca && (window.__finca.farmCity || null) === city && window.__finca.renderer?.info.render.frame > 5, city, { timeout: 90000, polling: 300 });
  // punto del mundo en pantalla, solo si cae sobre el lienzo (no sobre un botón)
  const worldXY = (x, z) => ev(([x, z]) => { const g = window.__finca, p = g.project(x, 0, z); const h = document.elementFromPoint(p.x, p.y); return { ...p, free: h?.id === 'game' }; }, [x, z]);
  const centerOn = (x, z, d = 16) => ev(([x, z, d]) => { const g = window.__finca; g.rig.goal.set(x, 0, z); g.rig.goalDist = d; g.rig.target.set(x, 0, z); g.rig.dist = d; g.rig.manualUntil = performance.now() + 60000; }, [x, z, d]);
  const waitFor = async (fn, arg, ms = 25000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await ev(fn, arg)) return true; await sleep(400); } return false; };
  const R = { errors, farms: {} };
  try {
    // ---- 1) partida de nivel 35+ con el central completo y una finquita vieja (Bayamo, formato chiquito)
    await page.goto(BASE); await sleep(2500);
    if (touch) await page.tap('#start'); else await page.click('#start');
    await sleep(1500);
    await ev(() => {
      const g = window.__finca, sim = g.sim; sim.s.tutorialDone = true; sim.mbCheat('unlock');
      const s = sim.s, t = Date.now() / 1000;
      s.money = 500000; s.res.madera = 400;
      s.ext.mambi.freed = ['manzanillo', 'bayamo', 'baracoa', 'santiago', 'holguin', 'camaguey', 'spiritus', 'trinidad', 'santaclara', 'cienfuegos', 'matanzas'];
      s.ext.mambi.intro = true;
      s.ext.mambi.farms = { bayamo: { v: 2, lvl: 2, at: t - 60, bank: 700, vbank: 20, cells: { '0,0': { k: 'p', t0: t - 30 }, '1,0': { k: 'p', t0: t - 30 }, '2,0': { k: 'p', t0: t }, '4,0': { k: 'b', b: 'casa' }, '3,1': { k: 'b', b: 'corral' } } } };
      g.resetting = true;
      localStorage.setItem('lafinca-v2', JSON.stringify(s));
    });
    const before = await ev(() => JSON.parse(localStorage.getItem('lafinca-v2')).money);
    await page.reload(); await sleep(2500);
    if (touch) await page.tap('#start'); else await page.click('#start');
    await started(null); await sleep(1200);
    R.migration = await ev(() => { const g = window.__finca, f = g.sim.mb().farms.bayamo; return { conv: f.conv, cells: Object.keys(f.cells).length, money: Math.floor(g.sim.s.money), modal: !document.getElementById('modal-wrap').classList.contains('hidden') && /grandes/.test(document.getElementById('modal').textContent) }; });
    R.migration.refund = R.migration.money - before;
    R.migrationOk = R.migration.conv === 1 && R.migration.cells === 0 && R.migration.refund > 700 && R.migration.modal;
    await closeModals();
    // la finca principal como estaba (para comparar al volver)
    const mainSnap = () => ev(() => { const s = window.__finca.sim.s; return JSON.stringify({ parcels: s.parcels, plots: s.plots.map((p) => [p.x, p.z, p.crop]), built: Object.keys(s.built).sort(), workers: s.workers.map((w) => w.id), hens: s.chickens.length, inv: s.inv, seeds: s.seeds, trucks: s.trucks.length, central: s.ext.central?.stage }); });
    const main0 = await mainSnap();
    R.mainCrops = await ev(() => window.__finca.sim.constructor && [...document.querySelectorAll('#seedname')].map((e) => e.textContent));
    // ---- 2) fundar 3 fincas de provincias distintas
    for (const [id] of FARMS) await ev((id) => window.__finca.sim.mbBuyFarm(id), id);
    R.founded = await ev(() => Object.entries(window.__finca.sim.mb().farms).map(([id, f]) => `${id}:${f.conv}`));
    await ev(() => window.__finca.sim.constructor && null);
    await ev(() => { const { save } = window; void save; });
    await ev(() => { window.__finca.ui.refreshHud(); });
    await sleep(600);
    await shot('0-principal');
    for (const [id, pid] of FARMS) {
      const F = (R.farms[id] = { pid });
      // entrar con el botón de fincas del HUD
      F.btn = await tap('#pv-switch'); await sleep(700);
      F.go = await tap(`#sheet-body [data-act="pvgo"][data-id="${id}"]`);
      await started(id); await sleep(1500); await closeModals();
      F.inside = await ev(() => { const g = window.__finca, s = g.sim.s; return { city: s.city, prov: s.prov, crops: [...window.__finca.ui.constructor ? [] : []], sel: s.selectedSeed, chip: document.getElementById('pv-switch')?.textContent, plots: s.plots.length, landmark: !!g.world.pvLand?.length, tint: g.world.groundMesh.material.color.getHexString(), zonesCentral: g.central ? 1 : 0 }; });
      // caminar: tocar el suelo a unas casillas del guajiro
      const p0 = await ev(() => ({ x: window.__finca.sim.player.x, z: window.__finca.sim.player.z }));
      await centerOn(p0.x, p0.z, 16); await sleep(800);
      let tgt = null;
      for (const [dx, dz] of [[-3, 0], [0, 3], [-2, 2], [2, 2], [-4, -1]]) { const w = await worldXY(Math.floor(p0.x + dx) + 0.5, Math.floor(p0.z + dz) + 0.5); const ok = await ev(([x, z]) => { const g = window.__finca, s = g.sim.s; return !s.plots.some((p) => p.x === x && p.z === z) && g.sim.can(x, z); }, [Math.floor(p0.x + dx), Math.floor(p0.z + dz)]); if (w.free && ok) { tgt = w; break; } }
      if (tgt) await tapXY(tgt.x, tgt.y);
      await sleep(2500);
      F.walked = await ev((p0) => Math.hypot(window.__finca.sim.player.x - p0.x, window.__finca.sim.player.z - p0.z), p0);
      // sembrar: tocar un cantero vacío
      const plot = await ev(() => { const g = window.__finca, s = g.sim.s; const P = s.plots.filter((p) => !p.crop && g.sim.can(p.x, p.z + 1)); P.sort((a, b) => Math.hypot(a.x - g.sim.player.x, a.z - g.sim.player.z) - Math.hypot(b.x - g.sim.player.x, b.z - g.sim.player.z)); return P[0] ? { x: P[0].x, z: P[0].z } : null; });
      if (plot) {
        await centerOn(plot.x + 0.5, plot.z + 0.5, 14); await sleep(700);
        const w = await worldXY(plot.x + 0.5, plot.z + 0.5);
        F.plotTap = w.free;
        await tapXY(w.x, w.y);
        await waitFor((p) => !!window.__finca.sim.s.plots.find((q) => q.x === p.x && q.z === p.z).crop, plot, 20000);
        F.planted = await ev((p) => window.__finca.sim.s.plots.find((q) => q.x === p.x && q.z === p.z).crop, plot);
        // cosechar: el cantero madura (reloj adelantado) y se toca otra vez
        await ev((p) => { const q = window.__finca.sim.s.plots.find((q) => q.x === p.x && q.z === p.z); q.at -= q.dur + 1; }, plot);
        const item = await ev((c) => window.__finca.sim.constructor && c, F.planted);
        const inv0 = await ev(() => ({ ...window.__finca.sim.s.inv }));
        await sleep(300);
        const w2 = await worldXY(plot.x + 0.5, plot.z + 0.5);
        await tapXY(w2.x, w2.y);
        await waitFor((p) => !window.__finca.sim.s.plots.find((q) => q.x === p.x && q.z === p.z).crop, plot, 20000);
        F.harvested = await ev(([inv0]) => Object.entries(window.__finca.sim.s.inv).filter(([k, v]) => v > (inv0[k] || 0)).map(([k]) => k), [inv0]);
        void item;
      }
      // procesar: el fogón del bohío con la receta de la región (con lo cosechado y un empujoncito de la canasta)
      const rec = await ev(() => { const g = window.__finca, s = g.sim.s; const rid = Object.keys(window.__pvRecipes()).find((r) => window.__pvRecipes()[r].where.includes('kitchen')); const r = window.__pvRecipes()[rid]; for (const [k, q] of Object.entries(r.needs)) s.inv[k] = Math.max(s.inv[k] || 0, q); g.ui.refreshHud(); return { rid, out: r.out }; });
      await ev(() => window.__finca.ui.openKitchen('kitchen')); await sleep(600);
      F.cookBtn = await tap(`#sheet-body [data-act="cook"][data-id="${rec.rid}"]`);
      await sleep(500);
      F.cooking = await ev(() => window.__finca.sim.s.kitchen.recipe);
      await ev(() => { const k = window.__finca.sim.s.kitchen; k.at -= 9999; });
      await waitFor(() => !!window.__finca.sim.s.kitchen.ready, null, 8000);
      await ev(() => window.__finca.ui.openKitchen('kitchen')); await sleep(500);
      await tap('#sheet-body [data-act="collectk"]'); await sleep(400);
      F.made = await ev((out) => window.__finca.sim.s.inv[out], rec.out);
      F.recipe = rec.rid;
      // vender a un camión: el de adelante pide lo que hicimos; Cargar en su hoja
      await waitFor(() => window.__finca.sim.truckParked(), null, 20000);
      const reward = await ev((out) => { const sim = window.__finca.sim, tr = sim.front(); tr.order = { items: { [out]: 1 }, reward: 300, xp: 10 }; tr.loaded = {}; return { m0: Math.floor(sim.s.money), trips: sim.s.truckTrips }; }, rec.out);
      await ev(() => window.__finca.ui.openTruck(0)); await sleep(600);
      F.loadBtn = await tap('#sheet-body [data-act="loadtruck"]'); await sleep(1500);
      F.sold = await ev((r) => Math.floor(window.__finca.sim.s.money) - r.m0, reward);
      await ev(() => window.__finca.ui.closeSheet());
      // contratar: una sembradora
      await tap('[data-act="workers"]'); await sleep(600);
      F.hireBtn = await tap('#sheet-body [data-act="hire"][data-id="sembrador"]'); await sleep(600);
      F.workers = await ev(() => window.__finca.sim.s.workers.map((w) => w.role));
      await ev(() => { window.__finca.ui.closeSheet(); document.getElementById('modal-wrap').classList.add('hidden'); });
      // foto: vista de la finca con el paisaje de fondo
      await ev(() => { window.__finca.rig.manualUntil = 0; window.__finca.viewFarm(); }); await sleep(2500);
      await ev(() => { const g = window.__finca; g.rig.goalDist *= 0.72; }); await sleep(1800);
      F.drawCalls = await ev(() => window.__finca.renderer.info.render.calls);
      await shot(`${Object.keys(R.farms).length}-${id}`);
      F.ok = F.inside.city === id && F.inside.prov === pid && F.inside.landmark && F.walked > 0.9 && !!F.planted && F.harvested?.length > 0 && F.cooking === rec.rid && F.made > 0 && F.sold >= 300 && F.workers.includes('sembrador') && !F.inside.zonesCentral;
    }
    // ---- 3) volver a la principal: igual que antes
    await tap('#pv-switch'); await sleep(700);
    R.backBtn = await tap('#sheet-body [data-act="pvgo"][data-id=""]');
    await started(null); await sleep(1500); await closeModals();
    const main1 = await mainSnap();
    R.mainSame = main0 === main1;
    if (!R.mainSame) R.mainDiff = [main0.slice(0, 400), main1.slice(0, 400)];
    R.mainCentral = await ev(() => !!window.__finca.central && window.__finca.sim.s.ext.central.stage);
    // recargar: las 3 fincas guardadas con lo que se hizo
    await page.reload(); await sleep(2500);
    if (touch) await page.tap('#start'); else await page.click('#start');
    await started(null); await sleep(800);
    R.saved = await ev(() => Object.fromEntries(Object.entries(window.__finca.sim.mb().farms).map(([id, f]) => [id, f.full ? { workers: f.full.workers.length, sown: f.full.plots.filter((p) => p.crop).length, city: f.full.city, money: 'money' in f.full } : null])));
    R.savedOk = FARMS.every(([id]) => R.saved[id]?.workers >= 1 && R.saved[id].city === id && R.saved[id].money === false);
    // ---- 4) 5 cambios de finca: memoria y llamadas de dibujo
    R.mem = [];
    const seq = ['manzanillo', null, 'baracoa', 'matanzas', null];
    for (const c of seq) {
      await ev((c) => window.__finca.switchFarm(c), c);
      await started(c); await sleep(2500);
      await ev(() => window.gc?.()); await sleep(300);
      R.mem.push(await ev(() => { const i = window.__finca.renderer.info; return { city: window.__finca.farmCity, calls: i.render.calls, geo: i.memory.geometries, tex: i.memory.textures, heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null }; }));
    }
    const mainMem = R.mem.filter((m) => !m.city);
    R.memOk = mainMem.length === 2 && Math.abs(mainMem[0].geo - mainMem[1].geo) <= 30 && (mainMem[0].heap == null || mainMem[1].heap < mainMem[0].heap * 1.5);
    // ---- 5) saqueo sobre una finca grande + ciudad ocupada
    await ev(() => window.__finca.switchFarm('baracoa'));
    await started('baracoa'); await sleep(1500); await closeModals();
    R.raid = await ev(() => {
      const g = window.__finca, sim = g.sim, s = sim.s;
      s.inv.cacao = 20; s.inv.coco = 10;
      const C = sim.cs(); sim.csLaunch('baracoa', { kind: 'saqueo' }); C.attack.power = 99999; C.attack.hit = Date.now() / 1000 - 1;
      const r = sim.csResolve(0.5);
      const tz = sim.front()?.z; for (let i = 0; i < 20; i++) sim.update(0.1);
      return { kind: r?.kind, held: r?.held, stolen: r?.crops, cacao: s.inv.cacao, raid: Math.round(sim.pvRaid()), truckStill: Math.abs((sim.front()?.z ?? 0) - (tz ?? 0)) < 1e-6, banner: !document.getElementById('pv-raid').classList.contains('hidden') };
    });
    await sleep(800);
    R.raid.banner = await ev(() => !document.getElementById('pv-raid').classList.contains('hidden'));
    await closeModals();
    await shot('5-saqueo');
    R.raidOk = R.raid.held === false && R.raid.cacao < 20 && R.raid.raid > 0 && R.raid.truckStill && R.raid.banner;
    // ocupada estando dentro → de vuelta a la principal; luego no se puede entrar
    await ev(() => { const sim = window.__finca.sim, C = sim.cs(); C.attack = null; sim.csLaunch('baracoa', { kind: 'retomar' }); C.attack.power = 99999; C.attack.hit = Date.now() / 1000 - 1; sim.csResolve(0.5, { lossOk: true }); });
    await started(null); await sleep(1500); await closeModals();
    R.kicked = await ev(() => window.__finca.farmCity === null && !window.__finca.sim.mbFreed('baracoa'));
    R.blocked = await ev(() => window.__finca.switchFarm('baracoa') === false);
    R.occupiedOk = R.kicked && R.blocked;
    await sleep(500);
  } catch (e) {
    R.crash = String(e.stack || e).slice(0, 600);
  }
  R.ok = !R.crash && R.migrationOk && Object.values(R.farms).length === 3 && Object.values(R.farms).every((f) => f.ok) && R.mainSame && R.savedOk && R.memOk && R.raidOk && R.occupiedOk && errors.length === 0;
  if (!R.ok) fail++;
  report[name] = R;
  console.log(name, JSON.stringify(R, null, 1).slice(0, 6000));
  await ctx.close();
}
for (const n of ONLY) await run(n);
for (const e of Object.values(engines)) await e.close();
fs.writeFileSync(new globalThis.URL('../provincias-report.json', import.meta.url).pathname, JSON.stringify(report, null, 1));
console.log(fail ? `FALLÓ en ${fail}` : 'TODO BIEN');
process.exit(fail ? 1 : 0);
