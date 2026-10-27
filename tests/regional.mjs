// Fincas regionales jugables: partida VIEJA (nivel 1–3 sin lotes) → se conserva y se convierte; finquitas 3D y
// marcadores en el mapa; visitar 3 tipos con toques reales (cosechar, sembrar, construir, comprar tierra, cobrar);
// fundar una nueva y jugarla; ciudad ocupada (todo parado, en gris); escena liberada al volver; 0 errores.
// Uso: URL=http://127.0.0.1:4180/ node tests/regional.mjs · ONLY=phone,ipad,desktop
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
const engines = {};
const eng = async (e) => (engines[e] ||= e === 'webkit' ? await webkit.launch() : await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }));
const report = {}; let fail = 0;
const PREFIX = process.env.PREFIX || 'regional';

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
  const enter = async () => { await page.goto(BASE); await sleep(2200); if (touch) await page.tap('#start'); else await page.click('#start'); await sleep(1500); };
  const money = () => ev(() => Math.floor(window.__finca.sim.s.money));
  // lote (x,z) en pantalla, solo si el toque cae en la escena (no en un botón)
  const cellXY = (x, z) => ev(([x, z]) => { const v = window.__finca.mambi.visit; const p = v.project(x, z, 0.15); const h = document.elementFromPoint(p.x, p.y); return { ...p, free: h?.id === 'mb-visit' }; }, [x, z]);
  const findCell = (want) => ev((want) => {
    const g = window.__finca, sim = g.sim, id = g.mambi.visitId, f = sim.rgFarm(id), v = g.mambi.visit;
    const [c, r] = [[0, 0], [4, 3], [5, 4], [6, 5]][f.lvl];
    const out = [];
    for (let z = 0; z < r; z++) for (let x = 0; x < c; x++) {
      const cell = f.cells[`${x},${z}`];
      const ok = want === 'empty' ? !cell : want === 'ready' ? cell?.k === 'p' && sim.rgReady(id, x, z) : false;
      if (!ok) continue;
      const p = v.project(x, z, 0.15), h = document.elementFromPoint(p.x, p.y);
      if (h?.id === 'mb-visit') out.push({ x, z, sx: p.x, sy: p.y, d: Math.hypot(p.x - innerWidth / 2, p.y - innerHeight / 2) });
    }
    out.sort((a, b) => a.d - b.d);
    if (!out.length) window.__rgDiag = { want, cells: Object.entries(f.cells).map(([k, c]) => { const [x, z] = k.split(',').map(Number); const p = v.project(x, z, 0.15); const h = document.elementFromPoint(p.x, p.y); return `${k}:${c.k}:${c.k === 'p' ? Math.round(sim.rgLeft(id, x, z)) : c.b}:${h?.id || h?.className}`; }) };
    return out[0] || null;
  }, want);
  const R = { errors, farms: {} };
  try {
    // ---- 1) partida vieja: 5 ciudades libres, 3 fincas de nivel 1–3 con el formato de antes (sin lotes, sin castro)
    await enter();
    await ev(() => { const s = window.__finca.sim; s.s.tutorialDone = true; s.mbCheat('unlock'); });
    await ev(() => {
      const s = window.__finca.sim.s, t = Date.now() / 1000;
      s.ext.mambi = { army: { inf: 30, cab: 10, cart: 2 }, freed: ['manzanillo', 'bayamo', 'baracoa', 'santiago', 'holguin'], farms: { manzanillo: { lvl: 2, at: t - 600, bank: 500 }, bayamo: { lvl: 1, at: t - 300, bank: 0 }, baracoa: { lvl: 3, at: t - 60, bank: 10 } }, stats: { battles: 5, won: 5, lost: 0, loot: 9000, income: 2000 }, intro: true };
      s.money = 400000;
      window.__finca.stopSaving = true;
      localStorage.setItem('lafinca-v2', JSON.stringify(s));
    });
    await page.reload(); await sleep(2200); if (touch) await page.tap('#start'); else await page.click('#start'); await sleep(1800);
    await closeModals();
    R.migrated = await ev(() => { const sim = window.__finca.sim, M = sim.mb(); return Object.fromEntries(Object.keys(M.farms).map((id) => [id, { lvl: M.farms[id].lvl, plots: sim.rgPlots(id), built: sim.rgBuilt(id), casa: sim.rgHas(id, 'casa'), rate: sim.mbFarmRate(id).pesos }])); });
    const mig = R.migrated;
    R.migrationOk = mig.manzanillo?.plots === 8 && mig.manzanillo.built === 2 && mig.bayamo?.plots === 4 && mig.bayamo.built === 1 && mig.baracoa?.plots === 12 && mig.baracoa.built === 3 && Object.values(mig).every((f) => f.casa && f.rate > 0);
    // ---- 2) mapa: finquitas 3D + marcadores tocables
    R.openMap = await tap('#btn-mambi'); await sleep(2500); await closeModals(); await sleep(400);
    R.map = { badges: [] };
    for (const id of ['baracoa', 'manzanillo', 'bayamo']) {
      await ev((id) => window.__finca.mambi.scenes.focus(id, 34), id); await sleep(1500);
      const m = await ev((id) => { const sc = window.__finca.mambi.scenes, e = document.querySelector(`.mb-farm[data-id="${id}"]`); return { mesh: !!sc.farmMesh && sc.farmMesh.geometry.attributes.position.count, on: e.style.display !== 'none' && /\d/.test(e.textContent) }; }, id);
      R.map.mesh = m.mesh; if (m.on) R.map.badges.push(id);
    }
    R.mapOk = R.map.mesh > 500 && ['manzanillo', 'bayamo', 'baracoa'].every((id) => R.map.badges.includes(id));
    await shot('1-mapa-fincas');
    // ---- 3) visitar tres tipos con toques reales
    const visit = async (id, plan) => {
      const F = {};
      F.tapBadge = await tap(`.mb-farm[data-id="${id}"]`);
      if (F.tapBadge.missing) { await ev((id) => window.__finca.mambi.scenes.focus(id, 30), id); await sleep(1500); F.tapBadge = await tap(`.mb-farm[data-id="${id}"]`); }
      await sleep(1500);
      F.open = await ev((id) => window.__finca.mambi.visitId === id && !document.getElementById('mb-visit').classList.contains('hidden'), id);
      F.info = await ev(() => document.getElementById('rv-info').textContent);
      // cosechar un lote listo con un toque (el tiempo de crecer se simula: las máquinas de prueba son lentas)
      await ev((id) => window.__finca.sim.rgCheatReady(id), id);
      await sleep(300);
      const rc = await findCell('ready');
      if (rc) { const m0 = await money(); await tapXY(rc.sx, rc.sy); F.harvest = (await money()) - m0; } else F.diag = await ev(() => window.__rgDiag);
      // sembrar en un lote libre
      let ec = await findCell('empty');
      if (ec) {
        const p0 = await ev(() => window.__finca.sim.rgPlots(window.__finca.mambi.visitId));
        await tapXY(ec.sx, ec.sy); await sleep(300);
        F.lotSheet = await ev(() => document.getElementById('sheet-title')?.textContent || '');
        F.tapPlant = await tap('#sheet-body [data-act="rgplant"]');
        F.planted = (await ev(() => window.__finca.sim.rgPlots(window.__finca.mambi.visitId))) - p0;
      }
      // construir lo que falte
      if (plan.build) {
        ec = await findCell('empty');
        if (!ec) { F.land = await tap('#rv-land'); await tap('#sheet-body [data-act="rgland2"]'); await sleep(800); ec = await findCell('empty'); }
        if (ec) {
          await tapXY(ec.sx, ec.sy); await sleep(300);
          F.buildSheet = await ev(() => (document.getElementById('sheet-wrap')?.classList.contains('hidden') ? 'cerrada' : document.getElementById('sheet-title')?.textContent));
          F.tapBuild = await tap(`#sheet-body [data-act="rgbuild"][data-b="${plan.build}"]`);
          F.built = await ev(([id, b]) => window.__finca.sim.rgHas(id, b), [id, plan.build]);
        }
      }
      if (plan.land) { const l0 = await ev((id) => window.__finca.sim.rgFarm(id).lvl, id); await tap('#rv-land'); await tap('#sheet-body [data-act="rgland2"]'); await sleep(900); F.landUp = (await ev((id) => window.__finca.sim.rgFarm(id).lvl, id)) - l0; }
      if (plan.rent) { await ev((id) => { window.__finca.sim.rgFarm(id).bank += 1234; }, id); await sleep(300); const m0 = await money(); await tap('#rv-rent'); F.rent = (await money()) - m0; }
      await sleep(900);
      await shot(`2-visita-${id}`);
      F.drawCalls = await ev(() => window.__finca.g?.world?.renderer?.info?.render?.calls ?? window.__finca.world?.renderer?.info?.render?.calls ?? null);
      await tap('[data-act="mbvback"]'); await sleep(700);
      F.disposed = await ev(() => !!window.__rgLast?.disposed && !window.__finca.mambi.visit && !document.getElementById('mambi').querySelector('.rv-hide'));
      return F;
    };
    R.farms.manzanillo = await visit('manzanillo', { build: 'molino', rent: true });
    R.farms.bayamo = await visit('bayamo', { build: 'corral', land: true });
    R.farms.baracoa = await visit('baracoa', {});
    // ---- 4) fundar una nueva (Santiago, café) desde la hoja y visitarla con «Visitar finca»
    await tap('[data-act="mbfarms"]'); await sleep(500);
    R.newFound = await tap('#sheet-body [data-act="mbfarm"][data-id="santiago"]'); await sleep(500);
    R.newVisitBtn = await tap('#sheet-body [data-act="mbvisit"][data-id="santiago"]'); await sleep(1500);
    R.newOpen = await ev(() => window.__finca.mambi.visitId === 'santiago');
    const ec = await findCell('empty');
    if (ec) { await tapXY(ec.sx, ec.sy); await sleep(300); await tap('#sheet-body [data-act="rgbuild"][data-b="secadero"]'); }
    R.newCasa = await ev(() => window.__finca.sim.rgHas('santiago', 'casa') && window.__finca.sim.rgHas('santiago', 'secadero') && window.__finca.sim.rgPlots('santiago') === 2);
    await sleep(600); await shot('3-visita-santiago-nueva');
    await tap('[data-act="mbvback"]'); await sleep(600);
    // ---- 5a) saqueo del Régimen: se lleva la renta juntada y lo que estaba listo; los jornaleros paran un rato
    R.raid = await ev(() => {
      const sim = window.__finca.sim; sim.rgCheatReady('manzanillo'); sim.rgFarm('manzanillo').bank = 777;
      const C = sim.cs(); C.attack = null; sim.csCheat('attack', { city: 'manzanillo', kind: 'saqueo', warn: 600, mult: 30 });
      const r = sim.csResolve(0.5);
      const f = sim.rgFarm('manzanillo'); const ready = Object.keys(f.cells).filter((k) => { const [x, z] = k.split(',').map(Number); return sim.rgReady('manzanillo', x, z); }).length;
      return { held: r?.held, stolen: r?.stolen, crops: r?.crops, bank: f.bank, ready, block: sim.rgBlock('manzanillo'), plots: sim.rgPlots('manzanillo') };
    });
    R.raidOk = R.raid.held === false && R.raid.stolen >= 777 && R.raid.crops > 0 && R.raid.ready === 0 && R.raid.block === 'raid' && R.raid.plots >= 9;
    await closeModals();
    // ---- 5) ciudad ocupada: finca gris, parada, sin poder sembrar
    await ev(() => { const M = window.__finca.sim.mb(); M.freed = M.freed.filter((x) => x !== 'bayamo'); const c = window.__finca.sim.cs().cities.bayamo; if (c) c.owner = 'regimen'; window.__finca.sim.mbChanged(); });
    await sleep(600);
    R.occBadge = await ev(() => document.querySelector('.mb-farm[data-id="bayamo"]')?.classList.contains('occ'));
    R.occListed = await (async () => { await tap('[data-act="mbfarms"]'); await sleep(400); const t = await ev(() => document.querySelector('#sheet-body').textContent); await ev(() => window.__finca.ui.closeSheet()); return /Ocupadas por el Régimen/.test(t) && /Bayamo/.test(t); })();
    await ev(() => window.__finca.mambi.openVisit('bayamo')); await sleep(1200);
    const t0 = await ev(() => Object.values(window.__finca.sim.rgFarm('bayamo').cells).filter((c) => c.k === 'p').map((c) => c.t0));
    await sleep(1600);
    const t1 = await ev(() => Object.values(window.__finca.sim.rgFarm('bayamo').cells).filter((c) => c.k === 'p').map((c) => c.t0));
    R.occPaused = t1.every((v, i) => v > t0[i]);
    R.occInfo = await ev(() => document.getElementById('rv-info').classList.contains('occ'));
    R.occPlantDenied = await ev(() => window.__finca.sim.rgPlant('bayamo', 3, 2) === false);
    await shot('4-ocupada');
    await tap('[data-act="mbvback"]'); await sleep(400);
    // guardado: sigue todo tras recargar
    await ev(() => { window.__finca.stopSaving = false; });
    await tap('[data-act="mbclose"]'); await sleep(800);
    await page.reload(); await sleep(2200); if (touch) await page.tap('#start'); else await page.click('#start'); await sleep(1500);
    R.afterReload = await ev(() => { const sim = window.__finca.sim; return { santiago: sim.rgHas('santiago', 'secadero'), manzMolino: sim.rgHas('manzanillo', 'molino'), bayamoCorral: sim.rgHas('bayamo', 'corral') }; });
  } catch (e) { R.crash = String(e.stack || e); }
  const F = R.farms;
  const okF = (f, build) => f && f.open && !f.tapBadge?.missing && (f.planted === 1) && (!build || f.built) && f.disposed;
  R.ok = !R.crash && R.raidOk && R.migrationOk && R.mapOk && okF(F.manzanillo, true) && okF(F.bayamo, true) && okF(F.baracoa) && F.manzanillo.harvest > 0 && F.manzanillo.rent >= 1234 && F.bayamo.landUp === 1 && R.newOpen && R.newCasa && R.occBadge && R.occListed && R.occPaused && R.occInfo && R.occPlantDenied && R.afterReload?.santiago && R.afterReload?.manzMolino && errors.length === 0;
  if (!R.ok) fail++;
  report[name] = R;
  console.log(name, R.ok ? 'OK' : 'FALLA', JSON.stringify(R, null, 0).slice(0, 3000));
  await ctx.close();
}
for (const n of ONLY) await run(n);
fs.writeFileSync(new globalThis.URL(`../${PREFIX}-report.json`, import.meta.url).pathname, JSON.stringify(report, null, 2));
for (const e of Object.values(engines)) await e.close();
process.exit(fail ? 1 : 0);
