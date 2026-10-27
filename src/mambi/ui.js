// Pantalla del mapa de la campaña (capa DOM sobre el lienzo), hojas de ciudad/campamento/tácticas y cartel de batalla.
import { ICON } from '../icons.js';
import { save } from '../state.js';
import { fmtTime } from '../sim.js';
import { MambiScenes } from './map.js';
import { CITIES, CITY_BY_ID, UNITS, UNIT_ORDER, TACTICS, TACTIC_ORDER, GOODS, FARM_LEVELS, MAMBI_LEVEL, provinceAt } from './data.js';

const svg = (body) => `<svg viewBox="0 0 32 32" aria-hidden="true" class="ico">${body}</svg>`;
Object.assign(ICON, {
  flagcu: ICON.flagcu || svg('<path d="M6 3v27" stroke="#5a4636" stroke-width="2.4" stroke-linecap="round"/><rect x="7" y="5" width="20" height="13" fill="#2f5da8"/><rect x="7" y="7.6" width="20" height="2.6" fill="#fff"/><rect x="7" y="12.8" width="20" height="2.6" fill="#fff"/><path d="M7 5l9 6.5L7 18z" fill="#c8332b"/><path d="M10.2 9.8l.6 1.4 1.5.1-1.2.9.4 1.5-1.3-.8-1.3.8.4-1.5-1.2-.9 1.5-.1z" fill="#fff"/>'),
  machete: ICON.machete || svg('<path d="M6 26l3 3 3-3-2-2z" fill="#6b4a2a" stroke="#3a2a1a" stroke-width="1.5"/><path d="M10 24L26 5c2 1 2 4 0 6L13 27z" fill="#d8d8d0" stroke="#5a5a56" stroke-width="1.6" stroke-linejoin="round"/>'),
  soldier: ICON.soldier || svg('<ellipse cx="16" cy="9" rx="10" ry="2.6" fill="#d9c08a" stroke="#7a5a36" stroke-width="1.4"/><path d="M12 9c0-3 1.5-5 4-5s4 2 4 5" fill="#e0c896" stroke="#7a5a36" stroke-width="1.4"/><circle cx="16" cy="12.5" r="3.2" fill="#c58c5c"/><path d="M9 29c0-7 3-11 7-11s7 4 7 11z" fill="#eee4c8" stroke="#8a7a5a" stroke-width="1.6"/><path d="M14 18l2 4 2-4" fill="#b83a2e"/>'),
  cart: ICON.cart || svg('<rect x="4" y="11" width="18" height="9" rx="1" fill="#a0784a" stroke="#5a3a1e" stroke-width="2"/><path d="M22 15h6" stroke="#5a3a1e" stroke-width="2"/><circle cx="9" cy="23" r="4" fill="#6b4a2a" stroke="#3a2a1a" stroke-width="2"/><circle cx="18" cy="23" r="4" fill="#6b4a2a" stroke="#3a2a1a" stroke-width="2"/><path d="M6 11c2-4 12-4 14 0" fill="#e8d9a8" stroke="#8a7a5a" stroke-width="1.4"/>'),
  food: ICON.food || svg('<path d="M5 15h22l-2 11a3 3 0 0 1-3 2H10a3 3 0 0 1-3-2z" fill="#c98e4a" stroke="#6b4a2a" stroke-width="2"/><circle cx="11" cy="12" r="4" fill="#d94a3a"/><circle cx="18" cy="11" r="4.5" fill="#f3ead6" stroke="#bfae8a"/><circle cx="23" cy="13" r="3" fill="#7aa83a"/>'),
  cafe: ICON.cafe || svg('<path d="M6 12h16v9a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z" fill="#f3ead6" stroke="#6b4a2a" stroke-width="2"/><path d="M22 14h2a3 3 0 0 1 0 6h-2" fill="none" stroke="#6b4a2a" stroke-width="2"/><ellipse cx="14" cy="13" rx="7" ry="1.6" fill="#5a3218"/><path d="M11 4c-1 2 1 3 0 5M16 3c-1 2 1 3 0 5" stroke="#bfae8a" stroke-width="1.6" fill="none"/>'),
  fish: ICON.fish || svg('<path d="M4 16c5-7 14-7 19 0-5 7-14 7-19 0z" fill="#6fa8c8" stroke="#2f5a7a" stroke-width="2"/><path d="M23 16l6-5v10z" fill="#6fa8c8" stroke="#2f5a7a" stroke-width="2"/><circle cx="10" cy="15" r="1.5" fill="#1a2a3a"/>'),
});
const k1 = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${Math.floor(n)}`);
const STYLE = `
#mambi{position:absolute;inset:0;z-index:4;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none}
#mambi.hidden{display:none}
#mambi .rv-hide{display:none!important}
#ui.mambi-on>*:not(#mambi):not(.sheet-wrap):not(.modal-wrap):not(.toasts){display:none!important}
#mambi .mb-top{position:absolute;left:calc(8px + var(--sal,0px));right:calc(8px + var(--sar,0px));top:calc(8px + var(--sat,0px));display:flex;gap:6px;flex-wrap:wrap;align-items:center}
#mambi .mb-title{position:absolute;left:50%;transform:translateX(-50%);top:calc(104px + var(--sat,0px));font:700 14px/1.2 inherit;color:#fff7e0;background:rgba(42,31,21,.72);border:0;border-radius:14px;padding:6px 12px;white-space:nowrap;max-width:calc(100% - 20px);overflow:hidden;text-overflow:ellipsis;cursor:pointer}
@media (min-width:700px){#mambi .mb-title{top:calc(60px + var(--sat,0px))}}
#mambi .mb-bottom{position:absolute;left:0;right:0;bottom:calc(10px + var(--sab,0px));display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:0 8px}
#mambi .mb-zoom{position:absolute;right:calc(10px + var(--sar,0px));bottom:calc(84px + var(--sab,0px));display:flex;flex-direction:column;gap:8px}
#mambi .mb-city{position:absolute;transform:translate(-50%,-135%);min-height:30px;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(246,234,208,.95);border:2px solid #5a4636;color:#3a2a1e;box-shadow:0 2px 0 rgba(60,40,20,.3);display:flex;align-items:center;gap:4px;cursor:pointer}
#mambi .mb-city .ico{width:16px;height:16px}
#mambi .mb-city.free{background:#e7f2d2;border-color:#3f6a2a}
#mambi .mb-city.next{background:#ffe08a;border-color:#a8601a;animation:mbPulse 1.2s ease-in-out infinite}
#mambi .mb-city.locked{opacity:.72}
#mambi .mb-city.nofarm{background:#fff3c4;border-color:#3f6a2a;box-shadow:0 0 0 3px rgba(255,210,90,.7),0 2px 0 rgba(60,40,20,.3)}
#mambi .mb-city .nf{display:inline-flex;align-items:center;margin-left:2px;padding:1px 6px;border-radius:9px;background:#3f6a2a;color:#fff;font-size:11px}
#mambi .mb-city.tiny{font-size:0;padding:0;min-height:0;width:14px;height:14px;border-radius:50%;gap:0;transform:translate(-50%,-150%)}
#mambi .mb-city.tiny .ico,#mambi .mb-city.tiny .nf{display:none}
#mambi .mb-bottom .big{position:relative}
#mambi .mb-bottom .big em{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#c8332b;color:#fff;font:700 12px/20px inherit;font-style:normal;text-align:center;padding:0 4px}
#mambi .mb-bottom .big em.hidden{display:none}
.mb-why{display:block;color:#a0503c;font-weight:700}
#ui.mambi-on>.toasts{z-index:7;top:calc(150px + var(--sat,0px))}
@media (max-width:520px){.sheet [data-farm]{flex-wrap:wrap}.sheet [data-farm] .row-main{flex:1 1 60%}.sheet [data-farm]>.btn{flex:1 1 100%}}
@keyframes mbPulse{50%{transform:translate(-50%,-145%)}}
#mambi .mb-skip{position:absolute;right:calc(12px + var(--sar,0px));bottom:calc(14px + var(--sab,0px))}
#mambi .mb-banner{position:absolute;left:50%;top:calc(70px + var(--sat,0px));transform:translateX(-50%);background:rgba(42,31,21,.85);color:#fbf1da;padding:8px 14px;border-radius:14px;font-weight:700;white-space:nowrap}
.mb-odds{display:inline-block;padding:2px 8px;border-radius:10px;font-weight:700;font-size:12px}
.mb-odds.hi{background:#cfe8b8;color:#2a4a1a}.mb-odds.mid{background:#f7e3a0;color:#6a4a10}.mb-odds.lo{background:#f2c0b0;color:#6a2010}
.mb-army{display:flex;gap:10px;flex-wrap:wrap;margin:4px 0 8px}.mb-army span{display:flex;align-items:center;gap:4px;font-weight:700}.mb-army .ico{width:20px;height:20px}
`;

export class MambiUI {
  constructor(game) {
    this.g = game;
    this.ui = game.ui;
    this.scenes = new MambiScenes(game);
    this.open = false;
    this.battle = null;
    if (!document.getElementById('mambi-style')) { const st = document.createElement('style'); st.id = 'mambi-style'; st.textContent = STYLE; document.head.appendChild(st); }
    const ex = document.getElementById('explore');
    if (ex && !document.getElementById('btn-mambi')) {
      const b = document.createElement('button');
      b.className = 'round cam hidden'; b.id = 'btn-mambi'; b.dataset.act = 'mbopen'; b.setAttribute('aria-label', 'Campaña mambisa');
      b.innerHTML = `${ICON.flagcu}<span>Campaña</span>`;
      ex.appendChild(b); this.btn = b;
    }
    const el = (this.el = document.createElement('div'));
    el.id = 'mambi'; el.className = 'hidden';
    el.innerHTML = `
      <div class="mb-top">
        <button class="btn primary" data-act="mbclose">${ICON.home}<span>Volver a la finca</span></button>
        <div class="chip money">${ICON.coin}<b id="mb-money">0</b></div>
        <div class="chip">${ICON.food}<b id="mb-viv">0</b><small>víveres</small></div>
        <div class="chip">${ICON.azucar || ICON.cane}<b id="mb-sug">0</b><small>azúcar</small></div>
        <div class="chip">${ICON.soldier}<b id="mb-army">0</b></div>
      </div>
      <button class="mb-title" id="mb-title" data-act="mbcity">La Campaña Mambisa</button>
      <div id="mb-cities"></div>
      <div class="mb-zoom"><button class="round" data-act="mbzoom" data-f="0.75" aria-label="Acercar">+</button><button class="round" data-act="mbzoom" data-f="1.33" aria-label="Alejar">−</button><button class="round cam" data-act="mbfit" aria-label="Ver toda la isla">${ICON.land}<span>Isla</span></button></div>
      <div class="mb-bottom" id="mb-bottom">
        <button class="big" data-act="mbcamp">${ICON.soldier}<span>Campamento</span></button>
        <button class="big" data-act="mbfarms" id="mb-farms-btn">${ICON.field || ICON.land}<span>Fincas</span><em id="mb-nofarm" class="hidden">0</em></button>
        <button class="big" data-act="mbfood">${ICON.food}<span>Mandar víveres</span></button>
        <button class="big" data-act="mbrent">${ICON.coin}<span id="mb-rent">Renta</span></button>
      </div>
      <button class="btn mb-skip hidden" id="mb-skip" data-act="mbskip">Saltar ⏭</button>
      <div class="mb-banner hidden" id="mb-banner"></div>`;
    this.ui.root.appendChild(el);
    this.cityEls = {};
    const box = el.querySelector('#mb-cities');
    for (const c of CITIES) { const b = document.createElement('button'); b.className = 'mb-city'; b.dataset.act = 'mbcity'; b.dataset.id = c.id; box.appendChild(b); this.cityEls[c.id] = b; }
    this.setupDrag();
  }
  get sim() { return this.g.sim; }
  get s() { return this.g.sim.s; }
  dev() { return !!(window.__fincaDev || import.meta.env.DEV); }

  setupDrag() {
    const el = this.el; const pts = new Map(); let last = null, pinch = 0, moved = 0;
    el.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; moved = 0; el.setPointerCapture?.(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId) || this.battle) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) this.scenes.zoom(pinch / d); pinch = d; return; }
      const k = this.scenes.view.dist / Math.max(300, el.clientHeight) * 1.3;
      this.scenes.pan(-(e.clientX - last[0]) * k, -(e.clientY - last[1]) * k * 1.4);
      moved += Math.abs(e.clientX - last[0]) + Math.abs(e.clientY - last[1]);
      last = [e.clientX, e.clientY];
    });
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; if (pts.size === 1) last = [...pts.values()][0]; };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', (e) => { e.preventDefault(); this.scenes.zoom(e.deltaY > 0 ? 1.12 : 0.89); }, { passive: false });
    void moved;
  }

  // ---------------------------------------------------------------- abrir / cerrar
  openMap() {
    if (!this.sim.mbUnlocked()) { this.ui.toast(`La campaña empieza en el nivel ${MAMBI_LEVEL} con el central completo.`); return; }
    if (this.open) return;
    this.open = true;
    this.g.setSpeed?.(1);
    this.ui.closeSheet();
    this.ui.root.classList.add('mambi-on');
    this.el.classList.remove('hidden');
    const nx = this.sim.mbNext();
    this.scenes.ensure();
    this.scenes.placeCam(0);
    this.scenes.fitAll();
    if (nx) this.scenes.focus(nx.id, Math.min(this.scenes.goal.dist, 55));
    Object.assign(this.scenes.view, this.scenes.goal);
    this.scenes.recolor();
    this.ver = -1;
    this.clock = performance.now();
    this.saveT = 0;
    this.g.world.renderer.setAnimationLoop(() => this.frame());
    if (!this.sim.mb().intro) {
      this.sim.mb().intro = true;
      this.ui.modal(`<h2>${ICON.flagcu} La Campaña Mambisa</h2><p>El central ya muele y la finca da para más. En la isla, un Régimen gris tiene las ciudades bajo su puño. Con los pesos, los víveres y el azúcar de la finca arma una tropa mambisa y libera la isla <b>de oriente a occidente</b>.</p><p>Cada ciudad libre deja fundar una finca regional (arroz, café, cacao, tabaco…) que paga más tropa.</p><button class="btn primary" data-act="modal-close">¡A caballo!</button>`);
    }
  }
  closeMap() {
    if (!this.open) return;
    this.open = false; this.battle = null;
    this.el.classList.add('hidden');
    this.ui.root.classList.remove('mambi-on');
    this.ui.closeSheet();
    save(this.s);
    this.g.clock?.update?.();
    this.g.world.renderer.setAnimationLoop(() => this.g.frame());
  }
  frame() {
    const t = performance.now(), dt = Math.min(0.1, (t - this.clock) / 1000); this.clock = t;
    const time = t / 1000;
    // la finca sigue viva (sin dibujarla)
    if (this.g.started) this.sim.update(dt, dt);
    this.saveT += dt; if (this.saveT > 8) { this.saveT = 0; save(this.s); }
    this.ui.update(dt);
    if (this.battle) {
      const bt = this.scenes.renderBattle(dt);
      if (bt > 6.6 && !this.battle.shown) this.finishBattle();
      return;
    }
    this.scenes.renderMap(dt, time);
    this.refresh();
    this.placeLabels();
  }
  refresh() {
    const s = this.s, sim = this.sim;
    const set = (id, v) => { const e = this.el.querySelector(id); if (e && e.textContent !== String(v)) e.textContent = v; };
    set('#mb-money', k1(s.money)); set('#mb-viv', k1(s.res.viveres || 0)); set('#mb-sug', k1(sim.mbSugar()));
    set('#mb-army', `${sim.mbSoldiers()}/${sim.mbCap()}`);
    const p = sim.mbPending();
    set('#mb-rent', p.pesos >= 1 ? `Cobrar ${k1(p.pesos)}` : 'Renta');
    const M = sim.mb(), nx = sim.mbNext();
    set('#mb-title', nx ? `Libres ${M.freed.length}/${CITIES.length} · próxima: ${nx.name} ›` : '¡Toda la isla es libre!');
    const tEl = this.el.querySelector('#mb-title'), tId = nx?.id || CITIES[CITIES.length - 1].id;
    if (tEl.dataset.id !== tId) tEl.dataset.id = tId;
    const nf = sim.mbFarmless().length, badge = this.el.querySelector('#mb-nofarm');
    if (badge.textContent !== String(nf)) badge.textContent = nf;
    if (badge.classList.contains('hidden') !== !nf) badge.classList.toggle('hidden', !nf);
    if (this.ver !== sim.mbVer) {
      this.ver = sim.mbVer;
      if (this.scenes.built) this.scenes.recolor();
      for (const c of CITIES) {
        const b = this.cityEls[c.id], free = sim.mbFreed(c.id), isNext = nx?.id === c.id, farm = M.farms[c.id];
        b.dataset.kind = free ? (farm ? 'free' : 'nofarm') : isNext ? 'next' : 'locked';
        b.dataset.prio = { nofarm: 3, next: 2, free: 1, locked: 0 }[b.dataset.kind];
        b.className = `mb-city ${free ? 'free' : isNext ? 'next' : 'locked'}${free && !farm ? ' nofarm' : ''}`;
        b.setAttribute('aria-label', `${c.name}${free ? (farm ? ' · libre, con finca' : ' · libre, sin finca') : ''}`);
        b.innerHTML = `${free ? ICON.flagcu : isNext ? ICON.machete : ''}${c.name}${farm ? ` ${ICON[GOODS[c.farm[0]].icon] || ''}` : free ? '<span class="nf">+ Finca</span>' : ''}`;
        b.dataset.w = '';
      }
    }
  }
  // Etiquetas de ciudad sin encimarse: primero las libres sin finca, luego la próxima, las libres y las demás. Si una
  // choca con otra ya puesta se corre arriba/abajo; si no cabe, las de baja prioridad quedan como un puntico tocable.
  placeLabels() {
    if (!this.scenes.built) return;
    const W = this.el.clientWidth, H = this.el.clientHeight, placed = [];
    const list = CITIES.map((c) => ({ c, b: this.cityEls[c.id], p: this.scenes.project(this.scenes.cityPos[c.id]) }))
      .sort((a, b) => (+b.b.dataset.prio || 0) - (+a.b.dataset.prio || 0));
    const hit = (r) => placed.some((q) => r.l < q.r && r.r > q.l && r.t < q.b && r.b > q.t);
    for (const { b, p } of list) {
      const prio = +b.dataset.prio || 0;
      if (!p.vis || p.x < -40 || p.x > W + 40 || p.y < -10 || p.y > H + 60) { if (b.style.display !== 'none') b.style.display = 'none'; continue; }
      if (b.style.display === 'none') b.style.display = '';
      b.classList.remove('tiny');
      if (!b.dataset.w) b.dataset.w = `${b.offsetWidth}|${b.offsetHeight}`;
      const [w, h] = b.dataset.w.split('|').map(Number);
      let y = p.y, ok = false;
      for (const dy of [0, -(h + 3), h + 3, -2 * (h + 3), 2 * (h + 3)]) {
        const top = p.y + dy - h * 1.35;
        const r = { l: p.x - w / 2, r: p.x + w / 2, t: top, b: top + h };
        if (!hit(r)) { y = p.y + dy; placed.push(r); ok = true; break; }
      }
      if (!ok && prio <= 1) { b.classList.add('tiny'); y = p.y; }
      else if (!ok) { const top = p.y - h * 1.35; placed.push({ l: p.x - w / 2, r: p.x + w / 2, t: top, b: top + h }); }
      b.style.left = `${p.x.toFixed(1)}px`; b.style.top = `${y.toFixed(1)}px`;
      b.style.zIndex = String(10 + prio);
    }
  }

  // ---------------------------------------------------------------- acciones
  act(a, d) {
    const sim = this.sim, ui = this.ui;
    switch (a) {
      case 'mbopen': return this.openMap();
      case 'mbclose': return this.closeMap();
      case 'mbzoom': return this.scenes.zoom(+d.f);
      case 'mbfit': return this.scenes.fitAll();
      case 'mbcity': this.scenes.focus(d.id); return this.openCity(d.id);
      case 'mbcamp': return this.openCamp();
      case 'mbfood': sim.mbSendFood(); ui.refreshSheet(); return;
      case 'mbrent': if (Object.keys(sim.mb().farms).length) sim.mbCollect(); else ui.toast('Libera una ciudad y funda allí una finca regional para cobrar renta.'); ui.refreshSheet(); return;
      case 'mbrecruit': sim.mbRecruit(d.id); ui.refreshSheet(); return;
      case 'mbattack': return this.openTactics(d.id);
      case 'mbgo': return this.startBattle(d.id, d.tactic);
      case 'mbfarm': sim.mbBuyFarm(d.id); ui.refreshSheet(); return;
      case 'mbfarms': return this.openFarms();
      case 'mbfarmgo': ui.act('modal-close', {}); this.scenes.focus(d.id); return this.openCity(d.id);
      case 'mbup': sim.mbUpgradeFarm(d.id); ui.refreshSheet(); return;
      case 'mbskip': if (this.battle) this.scenes.bt = 6.7; return;
      case 'mbcheat': sim.mbCheat(d.id); ui.refreshSheet(); ui.refreshHud(); if (d.id === 'unlock') this.refreshButton(); return;
      default:
    }
  }
  priceBtn(price, act, attrs, label, extra = '', disabled = false) {
    const poor = disabled || this.s.money < price;
    return `<button class="btn ${poor ? 'poor' : ''}" data-act="${act}" ${attrs} ${poor ? 'disabled' : ''}>${label}${ICON.coin}${k1(price)}${extra}</button>`;
  }
  armyLine() {
    const a = this.sim.mb().army;
    return `<div class="mb-army"><span>${ICON.soldier}${a.inf} infantes</span><span>${ICON.machete}${a.cab} jinetes</span><span>${ICON.cart}${a.cart} carretas</span><span>${ICON.food}${this.s.res.viveres || 0} víveres</span></div>`;
  }
  cheats() {
    if (!this.dev()) return '';
    const b = (id, l) => `<button class="btn" data-act="mbcheat" data-id="${id}">${l}</button>`;
    return `<h3>Trucos (desarrollo)</h3><div class="seg">${b('unlock', 'Abrir campaña')}${b('army', '+Tropa')}${b('free', 'Liberar próxima')}${b('rent', '+1 h de renta')}</div>`;
  }
  openCamp() {
    this.ui.openSheet('Campamento mambí', () => {
      const sim = this.sim;
      let out = `<p class="note">Recluta con pesos y víveres (la comida de la canasta) y arma carretas con el azúcar del central. Campamento: ${sim.mbSoldiers()}/${sim.mbCap()} soldados.</p>`;
      out += this.armyLine();
      for (const k of UNIT_ORDER) {
        const u = UNITS[k], why = sim.mbCanRecruit(k);
        const cost = u.viveres ? `<span class="wd">${ICON.food}${u.viveres}</span>` : `<span class="wd">${ICON.azucar || ICON.cane}${u.azucar}</span>`;
        out += `<div class="row ${why && why !== 'Todavía no alcanzan los pesos.' ? 'dim' : ''}"><div class="row-ico">${k === 'inf' ? ICON.soldier : k === 'cab' ? ICON.machete : ICON.cart}</div><div class="row-main"><b>${u.name}${u.power ? ` · fuerza ${u.power}` : ''}</b><small>${why || u.detail}</small></div>${this.priceBtn(u.price, 'mbrecruit', `data-id="${k}"`, 'Reclutar · ', cost, !!why)}</div>`;
      }
      const fv = sim.mbFoodValue();
      out += `<div class="row"><div class="row-ico">${ICON.food}</div><div class="row-main"><b>Mandar víveres desde la finca</b><small>${fv ? `La comida de la canasta da ${fv} víveres.` : 'La canasta no tiene comida ahora.'}</small></div><button class="btn" data-act="mbfood" ${fv ? '' : 'disabled'}>Mandar</button></div>`;
      const M = sim.mb();
      out += `<p class="note">Batallas: ${M.stats.battles} · ganadas ${M.stats.won} · botín ${k1(M.stats.loot)} pesos · renta cobrada ${k1(M.stats.income)}.</p>`;
      return out + this.cheats();
    });
  }
  oddsTag(ch) { const cls = ch >= 0.75 ? 'hi' : ch >= 0.35 ? 'mid' : 'lo'; return `<span class="mb-odds ${cls}">${ch >= 0.999 ? 'segura' : ch <= 0 ? 'imposible' : `${Math.round(ch * 100)} %`}</span>`; }
  openCity(id) {
    const c = CITY_BY_ID[id];
    this.ui.openSheet(`${c.name} · ${provinceAt(c.lon).name}`, () => {
      const sim = this.sim, M = sim.mb(), free = sim.mbFreed(id), nx = sim.mbNext();
      const g = GOODS[c.farm[0]];
      let out = '';
      if (!free) {
        out += `<p class="note">Guardias del Régimen: <b>${c.guards}</b> · terreno: ${c.terrain}${c.terrain === 'monte' ? ' (bueno para emboscadas)' : ''}. Al liberarla: botín de ${k1(c.guards * 50)} pesos.</p>`;
        if (!M.farms[id]) out += this.farmRow(id); else out += this.farmRow(id);
        out += this.armyLine();
        if (nx?.id === id) {
          const best = Math.max(...TACTIC_ORDER.map((t) => sim.mbChance(t, id)));
          out += `<div class="row sel"><div class="row-ico">${ICON.machete}</div><div class="row-main"><b>Atacar ${c.name}</b><small>Mejor probabilidad con tu tropa: ${this.oddsTag(best)}</small></div><button class="btn primary" data-act="mbattack" data-id="${id}">Elegir táctica</button></div>`;
        } else out += `<p class="note">Primero hay que liberar ${nx?.name}. La campaña va de oriente a occidente.</p>`;
        return out + this.cheats();
      }
      out += `<p class="note">${ICON.flagcu} ¡${c.name} es libre! El pueblo celebra en la plaza.</p>`;
      out += this.farmRow(id);
      if (M.farms[id] && !M.farms[id].conv) out += `<div class="row"><div class="row-ico">${ICON.coin}</div><div class="row-main"><b>Renta de todas las fincas</b><small>Se junta sola, también con el juego cerrado (hasta 8 h).</small></div><button class="btn primary" data-act="mbrent">Cobrar</button></div>`;
      const otras = sim.mbFarmless().filter((x) => x !== id);
      if (otras.length) out += `<p class="note">Otras ciudades libres sin finca: ${otras.map((x) => `<b>${CITY_BY_ID[x].name}</b>`).join(', ')}. Toca «Fincas» abajo para verlas todas.</p>`;
      return out + this.cheats();
    });
  }
  // Fila de la finca regional de una ciudad: tipo, precio, renta y por qué no se puede (si no se puede).
  farmRow(id) {
    const sim = this.sim, c = CITY_BY_ID[id], g = GOODS[c.farm[0]], f = sim.mb().farms[id], ico = ICON[g.icon] || ICON.field;
    if (!f) {
      const r = sim.mbFarmRate(id, 1), why = sim.mbCanFarm(id);
      return `<div class="row ${why ? '' : 'sel'}" data-farm="${id}"><div class="row-ico">${ico}</div><div class="row-main"><b>Fundar finca de ${g.name.toLowerCase()}${sim.mbFreed(id) ? '' : ` en ${c.name}`}</b><small>Cuesta ${c.farm[1].toLocaleString('es')} pesos · renta ≈ ${k1(r.pesos)} pesos y ${r.viveres} víveres por minuto al empezar (bohío de jornaleros y 2 lotes sembrados; siembra y construye allí para ganar más), también con el juego cerrado (hasta 8 h).${why ? `<span class="mb-why">${why}</span>` : ''}</small></div><button class="btn ${why ? 'poor' : 'primary'}" data-act="mbfarm" data-id="${id}" ${why ? 'disabled' : ''}>Fundar finca${ICON.coin}${k1(c.farm[1])}</button></div>`;
    }
    const r = sim.mbFarmRate(id), occ = sim.rgBlock(id) === 'occ', up = sim.mbUpgradePrice(id), why = sim.mbCanUpgrade(id);
    const state = occ ? '<span class="mb-why">Ocupada por el Régimen: no produce hasta que recuperes la ciudad.</span>' : sim.rgHas(id, 'casa') ? '' : '<span class="mb-why">Sin bohío de jornaleros: solo produce lo que cosechas tú.</span>';
    return `<div class="row ${occ ? 'dim' : ''}" data-farm="${id}"><div class="row-ico">${ico}</div><div class="row-main"><b>Finca de ${g.name.toLowerCase()} en ${c.name} · tierra ${f.lvl}/3</b><small>${sim.rgPlots(id)} lotes sembrados · ${sim.rgBuilt(id)} construcciones · ${k1(r.pesos)} pesos y ${r.viveres} víveres por minuto.${state}${up && why && !occ ? `<span class="mb-why">${why}</span>` : ''}</small></div><button class="btn primary" data-act="mbvisit" data-id="${id}">${ICON.home}Visitar finca</button>${up ? `<button class="btn ${why || occ ? 'poor' : ''}" data-act="mbup" data-id="${id}" ${why || occ ? 'disabled' : ''}>Más tierra ${f.lvl + 1}/3${ICON.coin}${k1(up)}</button>` : '<button class="btn" disabled>Tierra completa</button>'}</div>`;
  }
  // Lista de todas las fincas regionales: las libres sin finca primero, luego las fundadas y las que faltan por liberar.
  openFarms() {
    this.ui.openSheet('Fincas regionales · Cuba libre', () => {
      const sim = this.sim, M = sim.mb(), sinFinca = sim.mbFarmless();
      let out = `<p class="note">Cada ciudad libre puede tener su finca. Libres: <b>${M.freed.length}</b> · con finca: <b>${Object.keys(M.farms).length}</b> · sin finca: <b>${sinFinca.length}</b>. Tienes ${k1(this.s.money)} pesos.</p>`;
      if (!M.freed.length) out += `<p class="note">Todavía no hay ciudades libres. Libera ${sim.mbNext()?.name} desde el mapa y aquí podrás fundar su finca.</p>`;
      if (sinFinca.length) { out += '<h3>Libres sin finca</h3>'; for (const id of sinFinca) out += this.farmRow(id); }
      const con = M.freed.filter((id) => M.farms[id]);
      const occ = Object.keys(M.farms).filter((id) => !M.freed.includes(id));
      if (con.length) {
        out += '<h3>Fincas fundadas</h3>';
        for (const id of con) out += this.farmRow(id);
        if (con.some((id) => !M.farms[id].conv)) out += `<div class="row"><div class="row-ico">${ICON.coin}</div><div class="row-main"><b>Renta de todas las fincas</b><small>Pendiente: ${k1(sim.mbPending().pesos)} pesos</small></div><button class="btn primary" data-act="mbrent">Cobrar</button></div>`;
      }
      if (occ.length) { out += '<h3>Ocupadas por el Régimen</h3>'; for (const id of occ) out += this.farmRow(id); }
      const falta = CITIES.filter((c) => !sim.mbFreed(c.id));
      if (falta.length) out += `<h3>Por liberar</h3><p class="note">${falta.map((c) => `${c.name} (${GOODS[c.farm[0]].name.toLowerCase()})`).join(' · ')}</p>`;
      return out + this.cheats();
    });
  }
  openTactics(id) {
    const c = CITY_BY_ID[id];
    this.ui.openSheet(`Táctica · ${c.name}`, () => {
      const sim = this.sim;
      let out = `<p class="note">Guardias: <b>${c.guards}</b>. La marcha gasta 1 víver por soldado. Quien pierde no sufre: se dispersa y vuelve a su casa.</p>` + this.armyLine();
      for (const t of TACTIC_ORDER) {
        const T = TACTICS[t], why = sim.mbCanAttack(id, t), ch = sim.mbChance(t, id), p = Math.round(sim.mbPower(t, id));
        out += `<div class="row ${why ? 'dim' : ''}"><div class="row-ico">${t === 'carga' ? ICON.machete : t === 'emboscada' ? ICON.tree : ICON.cart}</div><div class="row-main"><b>${T.name} · fuerza ${p} ${this.oddsTag(ch)}</b><small>${why || T.detail}</small></div><button class="btn ${why ? '' : 'primary'}" data-act="mbgo" data-id="${id}" data-tactic="${t}" ${why ? 'disabled' : ''}>¡Al ataque!</button></div>`;
      }
      return out + this.cheats();
    });
  }
  startBattle(id, tactic) {
    const res = this.sim.mbBattle(id, tactic);
    if (!res) { this.ui.refreshSheet(); return; }
    this.ui.closeSheet();
    this.battle = res;
    this.scenes.startBattle(res);
    this.g.sound.play('horn');
    this.el.querySelector('#mb-bottom').classList.add('hidden');
    this.el.querySelector('#mb-cities').classList.add('hidden');
    this.el.querySelector('.mb-zoom').classList.add('hidden');
    this.el.querySelector('#mb-skip').classList.remove('hidden');
    const bn = this.el.querySelector('#mb-banner'); bn.textContent = `${TACTICS[tactic].name} en ${CITY_BY_ID[id].name}`; bn.classList.remove('hidden');
  }
  finishBattle() {
    const r = this.battle; r.shown = true;
    const c = CITY_BY_ID[r.city];
    this.battle = null;
    for (const s of ['#mb-bottom', '#mb-cities', '.mb-zoom']) this.el.querySelector(s).classList.remove('hidden');
    this.el.querySelector('#mb-skip').classList.add('hidden');
    this.el.querySelector('#mb-banner').classList.add('hidden');
    this.ver = -1;
    this.scenes.focus(r.city);
    const lost = r.lost.inf + r.lost.cab + r.lost.cart;
    const lostTxt = lost ? `${r.lost.inf ? `${r.lost.inf} infantes ` : ''}${r.lost.cab ? `${r.lost.cab} jinetes ` : ''}${r.lost.cart ? `${r.lost.cart} carretas ` : ''}se dispersaron y volvieron a sus casas.` : 'Toda la tropa volvió entera.';
    this.g.sound.play(r.win ? 'level' : 'error');
    save(this.s);
    if (r.win) this.ui.modal(`<h2>${ICON.flagcu} ¡${c.name} es libre!</h2><p>Fuerza ${r.power} contra ${r.guards} guardias: los guardias del Régimen se retiraron y la bandera de la estrella solitaria ondea en la plaza.</p><p>Botín: <b>+${k1(r.loot)} pesos</b> · +${r.xp} XP. ${lostTxt}</p><p>${r.done ? '¡Toda la isla es libre! Fiesta en todas las plazas.' : `Funda una finca de ${GOODS[c.farm[0]].name.toLowerCase()} en ${c.name} para financiar la tropa.`}</p><div class="modal-btns"><button class="btn" data-act="modal-close">¡Viva Cuba libre!</button><button class="btn primary" data-act="mbfarmgo" data-id="${c.id}">Fundar finca en ${c.name}</button></div>`);
    else this.ui.modal(`<h2>Retirada en ${c.name}</h2><p>Fuerza ${r.power} contra ${r.guards} guardias: esta vez no alcanzó y la columna se retiró a la manigua. ${lostTxt}</p><p>Recluta más jinetes, lleva carretas o prueba otra táctica. +${r.xp} XP por la experiencia.</p><button class="btn primary" data-act="modal-close">Volver al mapa</button>`);
  }
  refreshButton() {
    if (!this.btn) return;
    const show = this.sim.mbUnlocked();
    if (this.btn.classList.contains('hidden') === show) this.btn.classList.toggle('hidden', !show);
  }
}
void fmtTime;
void FARM_LEVELS;
