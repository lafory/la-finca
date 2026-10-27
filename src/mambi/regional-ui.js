// Visita jugable de una finca regional: escena isométrica propia, tocar lotes para sembrar/cosechar/construir,
// comprar tierra, cobrar renta y volver al mapa. Marcadores tocables de las fincas en el mapa de Cuba.
// Se engancha a MambiUI envolviendo métodos (como castro-ui.js).
import { ICON } from '../icons.js';
import { save } from '../state.js';
import { MambiUI } from './ui.js';
import { CITIES, CITY_BY_ID, GOODS } from './data.js';
import { GRID, typeOf, seedCost, buildCost, inGrid, key } from './regional-data.js';
import { RegionalScene } from './regional-scene.js';

const k1 = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${Math.floor(n)}`);
const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const STYLE = `
#mb-visit{position:absolute;inset:0;z-index:6;touch-action:none}
#mb-visit.hidden{display:none}
#mb-visit .rv-top{position:absolute;left:calc(8px + var(--sal,0px));right:calc(8px + var(--sar,0px));top:calc(8px + var(--sat,0px));display:flex;gap:6px;flex-wrap:wrap;align-items:center}
#mb-visit .rv-info{position:absolute;left:50%;transform:translateX(-50%);top:calc(62px + var(--sat,0px));background:rgba(42,31,21,.78);color:#fff7e0;border-radius:14px;padding:6px 12px;text-align:center;max-width:calc(100% - 20px);font-size:13px;line-height:1.3}
#mb-visit .rv-info b{font-size:15px;display:flex;align-items:center;justify-content:center;gap:5px}
#mb-visit .rv-info .ico{width:18px;height:18px}
#mb-visit .rv-info.occ{background:rgba(92,96,100,.9)}
#mb-visit .rv-hint{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(84px + var(--sab,0px));text-align:center;width:max-content;max-width:calc(100% - 24px);background:rgba(246,234,208,.92);border:2px solid #5a4636;border-radius:12px;padding:4px 10px;font-size:12px;font-weight:700;color:#3a2a1e}
#mb-visit .rv-bottom{position:absolute;left:0;right:0;bottom:calc(10px + var(--sab,0px));display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:0 8px}
#mb-visit .rv-zoom{position:absolute;right:calc(10px + var(--sar,0px));bottom:calc(130px + var(--sab,0px));display:flex;flex-direction:column;gap:8px}
#mb-visit .rv-float{position:absolute;transform:translate(-50%,-100%);font-weight:800;color:#fff7c0;text-shadow:0 2px 0 #3a2a1e,0 0 4px #3a2a1e;pointer-events:none;animation:rvUp 1.1s ease-out forwards;white-space:nowrap}
@keyframes rvUp{to{transform:translate(-50%,-260%);opacity:0}}
@media (min-width:700px){#mb-visit .rv-info{top:calc(10px + var(--sat,0px))}}
#mambi .mb-farm{position:absolute;z-index:30;transform:translate(-50%,-50%);min-width:34px;height:30px;padding:0 6px;border-radius:15px;display:flex;align-items:center;gap:3px;font:800 11px/1 inherit;background:rgba(246,234,208,.96);border:2px solid #3f6a2a;color:#2a4a1a;box-shadow:0 2px 0 rgba(60,40,20,.3);cursor:pointer}
#mambi .mb-farm .ico{width:18px;height:18px}
#mambi .mb-farm.occ{border-color:#5c6064;background:#c9cbcd;color:#3a3c3e}
#mambi .mb-farm.ready{border-color:#c8901a;background:#fff0b0}
`;

const P = MambiUI.prototype;
const oInit = P.refresh, oPlace = P.placeLabels, oFrame = P.frame, oClose = P.closeMap, oAct = P.act;

P.rgSetup = function () {
  if (this.rgReady) return; this.rgReady = true;
  if (!document.getElementById('regional-style')) { const st = document.createElement('style'); st.id = 'regional-style'; st.textContent = STYLE; document.head.appendChild(st); }
  // marcadores tocables de finca
  const box = this.el.querySelector('#mb-cities');
  this.farmEls = {};
  for (const c of CITIES) { const b = document.createElement('button'); b.className = 'mb-farm'; b.style.display = 'none'; b.dataset.act = 'mbvisit'; b.dataset.id = c.id; b.setAttribute('aria-label', `Visitar la finca de ${c.name}`); box.appendChild(b); this.farmEls[c.id] = b; }
  // capa de la visita
  const v = (this.vel = document.createElement('div'));
  v.id = 'mb-visit'; v.className = 'hidden';
  v.innerHTML = `
    <div class="rv-top"><button class="btn primary" data-act="mbvback">${ICON.flagcu}<span>Volver al mapa</span></button><div class="chip money">${ICON.coin}<b id="rv-money">0</b></div><div class="chip">${ICON.food}<b id="rv-viv">0</b></div></div>
    <div class="rv-info" id="rv-info"></div>
    <div class="rv-zoom"><button class="round" data-act="rgzoom" data-f="0.8" aria-label="Acercar">+</button><button class="round" data-act="rgzoom" data-f="1.25" aria-label="Alejar">−</button></div>
    <div class="rv-hint" id="rv-hint">Toca un lote libre para sembrar o construir</div>
    <div class="rv-bottom">
      <button class="big" data-act="rgall" id="rv-all">${ICON.basket || ICON.field || ''}<span>Cosechar todo</span></button>
      <button class="big" data-act="rgrent" id="rv-rent">${ICON.coin}<span>Cobrar renta</span></button>
      <button class="big" data-act="rgland" id="rv-land">${ICON.land}<span>Mejorar</span></button>
    </div>`;
  this.el.appendChild(v);
  const pts = new Map(); let last = null, pinch = 0, moved = 0, downAt = 0;
  v.addEventListener('pointerdown', (e) => { e.stopPropagation(); if (e.target.closest('button')) return; pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; moved = 0; downAt = performance.now(); v.setPointerCapture?.(e.pointerId); });
  v.addEventListener('pointermove', (e) => {
    e.stopPropagation();
    if (!pts.has(e.pointerId) || !this.visit) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) this.visit.zoom(pinch / d); pinch = d; moved += 99; return; }
    const dx = e.clientX - last[0], dy = e.clientY - last[1]; moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 8) this.visit.pan(dx, dy);
    last = [e.clientX, e.clientY];
  });
  const up = (e) => {
    e.stopPropagation();
    const was = pts.has(e.pointerId); pts.delete(e.pointerId); if (pts.size < 2) pinch = 0;
    if (was && !pts.size && moved < 10 && performance.now() - downAt < 700 && this.visit) this.rgTap(e.clientX, e.clientY);
  };
  // en pantallas táctiles, que el «click» que llega después del toque no cierre la hoja recién abierta
  v.addEventListener('touchend', (e) => { if (!e.target.closest('button')) e.preventDefault(); }, { passive: false });
  v.addEventListener('pointerup', up); v.addEventListener('pointercancel', (e) => { e.stopPropagation(); pts.delete(e.pointerId); });
  v.addEventListener('wheel', (e) => { e.preventDefault(); e.stopPropagation(); this.visit?.zoom(e.deltaY > 0 ? 1.1 : 0.9); }, { passive: false });
};

// ---------------------------------------------------------------- abrir / cerrar la visita
P.openVisit = function (id) {
  this.rgSetup();
  const f = this.sim.rgFarm(id);
  if (!f) { this.ui.toast('Esa ciudad todavía no tiene finca.'); return; }
  if (this.battle || this.g.castro?.defense) return;
  this.ui.closeSheet(); this.ui.act?.('modal-close', {});
  if (this.visit) this.closeVisit();
  this.sim.mbAccrue();
  this.visit = new RegionalScene(this.g, id);
  this.visitId = id;
  for (const s of ['.mb-top', '#mb-title', '#mb-cities', '.mb-zoom', '#mb-bottom', '#cs-marks', '#cs-mbanner']) this.el.querySelector(s)?.classList.add('rv-hide');
  this.vel.classList.remove('hidden');
  this.rgKey = '';
  this.g.sound?.play?.('tap');
  window.__rgLast = this.visit; // pruebas: para comprobar que se libera
};
P.closeVisit = function () {
  if (!this.visit) return;
  this.visit.dispose();
  this.visit = null; this.visitId = null;
  this.vel.classList.add('hidden');
  for (const e of this.el.querySelectorAll('.rv-hide')) e.classList.remove('rv-hide');
  this.ui.closeSheet();
  this.ver = -1;
  save(this.s);
};
// ---------------------------------------------------------------- tocar un lote
P.rgTap = function (cx, cy) {
  const id = this.visitId, sim = this.sim, f = sim.rgFarm(id), c = this.visit.pick(cx, cy);
  if (!c || !f) { this.visit.select(null); return; }
  const why = sim.rgCanAct(id);
  if (why) { this.ui.toast(why); return; }
  if (!inGrid(f.lvl, c.x, c.z)) {
    const [gc, gr] = GRID[Math.min(3, f.lvl + 1)];
    if (f.lvl < 3 && c.x < gc && c.z < gr) return this.rgLandSheet();
    this.visit.select(null); return;
  }
  const cell = f.cells[key(c.x, c.z)];
  if (!cell) { this.visit.select(c); return this.rgLotSheet(c.x, c.z); }
  this.visit.select(null);
  if (cell.k === 'p') {
    if (sim.rgReady(id, c.x, c.z)) { const v = sim.rgHarvest(id, c.x, c.z); if (v) this.rgFloat(c.x, c.z, `+${v.pesos} pesos`); }
    else this.ui.toast(`${typeOf(id).prod.name}: listo en ${mmss(sim.rgLeft(id, c.x, c.z))}.`);
    return;
  }
  const b = typeOf(id).build.find((q) => q.id === cell.b);
  this.ui.openSheet(b.name, () => `<p class="note">${b.detail}</p><p class="note">${b.id === 'casa' ? 'Con jornaleros, los lotes sembrados se cosechan solos y la renta se junta para cobrarla.' : `Sube el valor de cada cosecha ×${String(b.mult).replace('.', ',')}.`}</p>`);
};
P.rgFloat = function (x, z, text) {
  const p = this.visit.project(x, z, 1.5), e = document.createElement('div');
  e.className = 'rv-float'; e.textContent = text; e.style.left = `${p.x}px`; e.style.top = `${p.y}px`;
  this.vel.appendChild(e); setTimeout(() => e.remove(), 1200);
};
P.rgLotSheet = function (x, z) {
  const id = this.visitId, T = typeOf(id), g = GOODS[CITY_BY_ID[id].farm[0]];
  this.ui.openSheet(`Lote libre · ${CITY_BY_ID[id].name}`, () => {
    const sim = this.sim, cost = seedCost(id), v = sim.rgHarvestValue(id), poor = this.s.money < cost;
    let out = `<p class="note">Cada lote sembrado produce para siempre: se cosecha, vuelve a crecer y se cosecha otra vez.</p>`;
    out += `<div class="row sel"><div class="row-ico">${ICON[g.icon] || ICON.field}</div><div class="row-main"><b>${T.prod.verb}: ${T.prod.name}</b><small>Listo en ${mmss(T.prod.dur)} · cada cosecha da ${v.pesos} pesos y ${v.viveres} víveres.</small></div><button class="btn ${poor ? 'poor' : 'primary'}" data-act="rgplant" data-id="${id}" data-x="${x}" data-z="${z}" ${poor ? 'disabled' : ''}>${T.prod.verb}${ICON.coin}${k1(cost)}</button></div>`;
    out += '<h3>Construir aquí</h3>';
    for (const b of T.build) {
      const why = sim.rgCanBuild(id, b.id), price = buildCost(id, b), done = sim.rgHas(id, b.id);
      out += `<div class="row ${done ? 'dim' : ''}"><div class="row-ico">${ICON.home}</div><div class="row-main"><b>${b.name}</b><small>${done ? 'Ya está construida en esta finca.' : b.detail}${!done && why && !/pesos/.test(why) ? `<span class="mb-why">${why}</span>` : ''}</small></div><button class="btn ${why ? 'poor' : 'primary'}" data-act="rgbuild" data-id="${id}" data-b="${b.id}" data-x="${x}" data-z="${z}" ${why ? 'disabled' : ''}>${done ? 'Hecha' : `Construir${ICON.coin}${k1(price)}`}</button></div>`;
    }
    return out;
  });
};
P.rgLandSheet = function () {
  const id = this.visitId;
  this.ui.openSheet(`Más tierra · ${CITY_BY_ID[id].name}`, () => {
    const sim = this.sim, f = sim.rgFarm(id);
    if (f.lvl >= 3) return '<p class="note">Ya tienes toda la tierra de esta finca.</p>';
    const [c, r] = GRID[f.lvl + 1], price = sim.mbUpgradePrice(id), why = sim.mbCanUpgrade(id);
    return `<p class="note">Compra el siguiente tramo de tierra (las estacas): la finca pasa a ${c * r} lotes para sembrar y construir.</p><div class="row sel"><div class="row-ico">${ICON.land}</div><div class="row-main"><b>Tierra ${f.lvl + 1}/3 · ${c * r} lotes</b><small>${why || 'Se cerca enseguida.'}</small></div><button class="btn ${why ? 'poor' : 'primary'}" data-act="rgland2" data-id="${id}" ${why ? 'disabled' : ''}>Comprar${ICON.coin}${k1(price)}</button></div>`;
  });
};
// ---------------------------------------------------------------- HUD de la visita
P.rgRefresh = function () {
  const id = this.visitId, sim = this.sim, f = sim.rgFarm(id); if (!f) return this.closeVisit();
  const c = CITY_BY_ID[id], g = GOODS[c.farm[0]], T = typeOf(id), r = sim.mbFarmRate(id), occ = sim.rgBlock(id) === 'occ', raid = sim.rgBlock(id) === 'raid';
  let ready = 0; for (const [k, q] of Object.entries(f.cells)) if (q.k === 'p') { const [x, z] = k.split(',').map(Number); if (sim.rgReady(id, x, z)) ready++; }
  const [gc, gr] = GRID[f.lvl], up = sim.mbUpgradePrice(id);
  const st = occ ? 'Ocupada por el Régimen: todo está parado' : raid ? 'Saqueada: los jornaleros vuelven pronto' : sim.rgHas(id, 'casa') ? `Renta ≈ ${k1(r.pesos)} pesos/min` : 'Sin jornaleros: cosechas tú';
  const info = `<b>${ICON[g.icon] || ''}Finca de ${g.name.toLowerCase()} · ${c.name}</b>Tierra ${f.lvl}/3 · ${sim.rgPlots(id)}/${gc * gr} lotes sembrados · ${sim.rgBuilt(id)}/${T.build.length} construcciones<br>${st}`;
  const k = `${info}|${ready}|${Math.floor(f.bank)}|${up}|${Math.floor(this.s.money)}|${sim.rgFree(id)}`;
  const set = (sel, v) => { const e = this.vel.querySelector(sel); if (e && e.textContent !== String(v)) e.textContent = v; };
  set('#rv-money', k1(this.s.money)); set('#rv-viv', k1(this.s.res.viveres || 0));
  if (k === this.rgKey) return; this.rgKey = k;
  const ie = this.vel.querySelector('#rv-info'); ie.innerHTML = info; ie.classList.toggle('occ', occ);
  this.vel.querySelector('#rv-all span').textContent = ready ? `Cosechar ${ready}` : 'Cosechar todo';
  this.vel.querySelector('#rv-rent span').textContent = f.bank >= 1 ? `Cobrar ${k1(f.bank)}` : 'Cobrar renta';
  this.vel.querySelector('#rv-land span').textContent = up ? `Mejorar · tierra ${k1(up)}` : 'Tierra completa';
  this.vel.querySelector('#rv-land').disabled = !up || occ;
  for (const b of this.vel.querySelectorAll('#rv-all,#rv-rent')) b.disabled = occ;
  set('#rv-hint', occ ? `Recupera ${c.name} con una batalla para volver a trabajar` : sim.rgFree(id) ? 'Toca un lote libre para sembrar o construir; lo que brilla está listo' : ready ? 'Toca lo que brilla para cosechar' : 'Compra más tierra tocando las estacas o «Mejorar»');
};

// ---------------------------------------------------------------- ganchos
P.refresh = function () {
  oInit.call(this);
  this.rgSetup();
  const sim = this.sim, M = sim.mb();
  for (const c of CITIES) {
    const e = this.farmEls[c.id], f = M.farms[c.id];
    if (!f) { e.dataset.on = ''; continue; }
    const occ = sim.rgBlock(c.id) === 'occ';
    let ready = 0; for (const [k, q] of Object.entries(f.cells)) if (q.k === 'p') { const [x, z] = k.split(',').map(Number); if (sim.rgReady(c.id, x, z)) ready++; }
    const html = `${ICON[GOODS[c.farm[0]].icon] || ICON.field}${sim.rgPlots(c.id)}`;
    const cls = `mb-farm${occ ? ' occ' : ready && !sim.rgHas(c.id, 'casa') ? ' ready' : ''}`;
    if (e.dataset.h !== html) { e.innerHTML = html; e.dataset.h = html; }
    if (e.className !== cls) e.className = cls;
    e.dataset.on = '1';
  }
};
P.placeLabels = function () {
  oPlace.call(this);
  if (!this.scenes.built || !this.farmEls) return;
  const W = this.el.clientWidth, H = this.el.clientHeight;
  // con la isla entera a la vista solo quedan las finquitas 3D (los marcadores se encimarían con las etiquetas)
  const far = this.scenes.view.dist > Math.max(70, 9000 / Math.max(300, W));
  for (const c of CITIES) {
    const e = this.farmEls[c.id];
    if (!e.dataset.on) { if (e.style.display !== 'none') e.style.display = 'none'; continue; }
    const p = this.scenes.project(this.scenes.farmPos[c.id]);
    const show = !far && p.vis && p.x > -20 && p.x < W + 20 && p.y > -20 && p.y < H + 20;
    e.style.display = show ? '' : 'none';
    e.style.left = `${p.x.toFixed(1)}px`; e.style.top = `${(p.y + 16).toFixed(1)}px`;
  }
};
P.frame = function () {
  if (!this.visit) return oFrame.call(this);
  const t = performance.now(), dt = Math.min(0.1, (t - this.clock) / 1000); this.clock = t;
  if (this.g.started) this.sim.update(dt, dt);
  this.saveT += dt; if (this.saveT > 8) { this.saveT = 0; save(this.s); }
  this.ui.update(dt);
  this.visit.render(dt);
  this.rgRefresh();
  try { this.g.castro?.tickCountdowns?.(); } catch { /* nada */ }
};
P.closeMap = function () { this.closeVisit(); return oClose.call(this); };
P.act = function (a, d) {
  const sim = this.sim, ui = this.ui, id = d.id || this.visitId;
  switch (a) {
    case 'mbvisit': if (!this.open) this.openMap(); return this.openVisit(d.id);
    case 'mbvback': return this.closeVisit();
    case 'rgzoom': return this.visit?.zoom(+d.f);
    case 'rgplant': if (sim.rgPlant(id, +d.x, +d.z)) { ui.closeSheet(); this.visit?.select(null); } else ui.refreshSheet(); return;
    case 'rgbuild': if (sim.rgBuild(id, d.b, +d.x, +d.z)) { ui.closeSheet(); this.visit?.select(null); } else ui.refreshSheet(); return;
    case 'rgall': return sim.rgHarvestAll(id);
    case 'rgrent': return sim.rgCollect(id);
    case 'rgland': return this.rgLandSheet();
    case 'rgland2': if (sim.mbUpgradeFarm(id)) ui.closeSheet(); else ui.refreshSheet(); return;
    default: return oAct.call(this, a, d);
  }
};
