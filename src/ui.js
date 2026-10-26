// Interfaz DOM: HUD, barra inferior, hojas (Tienda, Terreno, Canasta, Camión, Fogón, Ajustes), tutorial, etiquetas del mundo.
import { ICON, portrait } from './icons.js';
import { CAN_FULLSCREEN, viewSize } from './viewport.js';
import { RESOURCES, UI_SECTIONS, UI_ACTS, UNLOCKS } from './registry.js';
import {
  ITEMS, CROPS, CROP_ORDER, RECIPES, PRICES, WORKERS, WORKER_ORDER, PARCELS, BUILDINGS, TRUCK_SPOT,
  SELLABLE, xpForLevel, EGG_INTERVAL, LEVEL_XP, WORKER_SPEED, workerUpgradePrice, FF_SPEEDS,
  STRUCTURES, STRUCTURE_ORDER, OBSTACLES, STORAGE_CAPS, STORAGE_LEVELS, TRUCK_SLOTS, CAM_WAIT, CAM_KEEP, BATEY_ORDER, WOOD_CAP, workerName, workerLook } from './data.js';
import { ZONES, ZONE_ORDER, zoneOpen, inFarm, CARRY_MAX, WILD_ANIMALS } from './zones.js';
import { storageCap, invCount, chickenCap, now, parcelReachable, structOpen, workerCap } from './state.js';
import { fmtTime, fmtClock } from './sim.js';
import { settingsSection } from './saveui.js';

const $ = (sel, el = document) => el.querySelector(sel);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Qué se desbloquea en cada nivel (para el aviso de subir de nivel y los candados).
export function unlocksAt(level) {
  const out = [];
  for (const c of CROP_ORDER) if (CROPS[c].level === level) out.push(CROPS[c].seedName);
  for (const r of Object.values(RECIPES)) if (r.level === level) out.push(`Receta: ${r.name}`);
  for (const k of WORKER_ORDER) if (WORKERS[k].level === level) out.push(`Contratar: ${WORKERS[k].name}`);
  for (const p of PARCELS) if (p.level === level) out.push(`Terreno: ${p.name}`);
  for (const k of STRUCTURE_ORDER) if (STRUCTURES[k].level === level) out.push(`Construir: ${STRUCTURES[k].name}`);
  for (const u of UNLOCKS) if (u.level === level) out.push(u.text);
  for (const id of ZONE_ORDER) if (ZONES[id].level === level && !ZONES[id].road) out.push(`${ZONES[id].soon ? 'Muy pronto' : 'Se abre'}: ${ZONES[id].name} (${ZONES[id].blurb.toLowerCase().replace(/\.$/, '')})`);
  const houses = BATEY_ORDER.filter((k) => STRUCTURES[k].level === level && STRUCTURES[k].kind === 'house').length;
  if (houses) out.push(`Batey: ${houses} solar${houses > 1 ? 'es' : ''} para casas`);
  for (const k of BATEY_ORDER) if (STRUCTURES[k].level === level && STRUCTURES[k].kind !== 'house') out.push(`Batey: ${STRUCTURES[k].name}`);
  if (level === 2) out.push('El fogón (cocina)', 'Almacén más grande');
  if (level === 3) out.push('Ampliar gallinero');
  if (level === 4) out.push('Abono');
  STORAGE_LEVELS.forEach((l, i) => { if (l === level && i >= 1) out.push(`Almacén de ${STORAGE_CAPS[i + 1]}`); });
  return out;
}

const STRUCT_ICON = { bodega: 'shop', escuela: 'xp', iglesia: 'house', anden: 'truck', vacas: 'leche', chivos: 'queso', pozo: 'water', cerdos: 'carne', trapiche: 'azucar', gallinero2: 'hen', fogon2: 'fire', casaTabaco: 'puros' };

export class UI {
  constructor(game) {
    this.g = game;
    this.root = $('#ui');
    this.labels = new Map();
    this.floaters = [];
    this.toasts = [];
    this.sheet = null;
    this.isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    this.build();
  }
  get s() { return this.g.sim.s; }
  get sim() { return this.g.sim; }

  build() {
    this.root.innerHTML = `
      <div class="labels" id="labels"></div>
      <div class="floaters" id="floaters"></div>
      <div class="tut-arrow hidden" id="tut-arrow"><svg viewBox="0 0 32 40"><path d="M16 38L2 20h8V2h12v18h8z" fill="#f2c14e" stroke="#5a3a16" stroke-width="2.5" stroke-linejoin="round"/></svg></div>
      <div class="hud-top">
        <button class="chip level" data-act="levelinfo" aria-label="Nivel y experiencia">
          <span class="lvl-badge">${ICON.xp}<b id="lvl">1</b></span>
          <span class="xpbar"><i id="xpfill"></i></span>
        </button>
        <div class="chip money" aria-label="Pesos">${ICON.coin}<b id="money">0</b><small>pesos</small></div>
        <button class="chip inv" data-act="inventory" aria-label="Canasta">${ICON.basket}<b id="invc">0/20</b></button>
        <div class="chip wood hidden" id="woodchip" aria-label="Madera">${ICON.wood}<b id="wood">0</b><small>madera</small></div>
        <span class="grow"></span>
        <button class="round ffbtn" id="btn-ff" data-act="ff" aria-label="Adelantar el tiempo">${ICON.ff}<b id="ffx">x1</b></button>
        <button class="round" id="btn-full" data-act="fullscreen" aria-label="Pantalla completa">${ICON.full}</button>
        <button class="round" data-act="settings" aria-label="Ajustes">${ICON.gear}</button>
      </div>
      <div class="ffbanner hidden" id="ffbanner"><span class="ffspin">${ICON.clock}</span><b>Adelantando…</b><span id="ffinfo">x5</span><button class="btn" data-act="ffstop">${ICON.play}Normal</button></div>
      <div class="toasts" id="toasts" aria-live="polite"></div>
      <div class="plotpill hidden" id="plotpill"></div>
      <div class="guide hidden" id="guide">
        <div class="guide-step" id="guide-step">1/6</div>
        <div class="guide-text" id="guide-text"></div>
        <button class="guide-skip" data-act="skiptut">Saltar</button>
      </div>
      <div class="bottom">
        <button class="big" data-act="shop">${ICON.shop}<span>Tienda</span></button>
        <button class="big" data-act="land">${ICON.land}<span>Terreno</span></button>
        <button class="big" data-act="workers" id="btn-workers">${ICON.worker}<span>Trabajadores</span><em id="wcount" class="hidden">0</em></button>
        <button class="big seedsel" data-act="seed" id="seedsel">${ICON.seed}<span id="seedname">Tomate</span><em id="seedcount">2</em></button>
      </div>
      <div class="camgroup">
        <button class="round cam" data-act="viewfarm" id="btn-viewfarm" aria-label="Ver toda la finca">${ICON.land}<span>Ver finca</span></button>
        <button class="round cam" data-act="center" aria-label="Centrar en el guajiro">${ICON.center}<span>Centrar</span></button>
      </div>
      <div class="explore" id="explore">
        <button class="btn primary gohome hidden" data-act="gofarm" id="btn-home">${ICON.home}<span>Volver a la finca</span></button>
        <button class="round cam hidden" data-act="gomanigua" id="btn-manigua" aria-label="Ir a la manigua">${ICON.tree}<span>Manigua</span></button>
        <button class="round cam hidden" data-act="gobatey" id="btn-batey" aria-label="Ir al batey">${ICON.house}<span>Batey</span></button>
      </div>
      <div class="hint" id="hint">Toca para caminar · WASD/flechas · E/Espacio usar · rueda o pellizco = zoom</div>
      <div class="joy hidden" id="joy"><div class="joy-knob" id="knob"></div></div>
      <button class="use hidden" id="use" data-act="use">Usar</button>
      <div class="sheet-wrap hidden" id="sheet-wrap">
        <div class="sheet" role="dialog" aria-modal="true">
          <header><h2 id="sheet-title"></h2><button class="round ghost" data-act="close" aria-label="Cerrar">${ICON.close}</button></header>
          <div class="sheet-body" id="sheet-body"></div>
        </div>
      </div>
      <div class="modal-wrap hidden" id="modal-wrap"><div class="modal" id="modal"></div></div>
    `;
    this.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b || b.disabled) return;
      this.g.sound.unlock();
      this.act(b.dataset.act, b.dataset);
    });
    $('#sheet-wrap').addEventListener('click', (e) => { if (e.target.id === 'sheet-wrap') this.closeSheet(); });
    if (!this.fsSupported()) $('#btn-full').classList.add('hidden');
    document.addEventListener('fullscreenchange', () => this.refreshSettingsIfOpen());
    this.setupJoystick();
    this.applySettings();
    this.refreshHud();
  }

  fsSupported() {
    return CAN_FULLSCREEN;
  }
  showA2hsHint() {
    const K = 'lafinca.a2hsHint';
    try { if (localStorage.getItem(K)) return; } catch { /* sin almacenamiento */ }
    if (document.getElementById('a2hs')) return;
    const el = document.createElement('div');
    el.className = 'a2hs'; el.id = 'a2hs'; el.setAttribute('role', 'status');
    el.innerHTML = `<span>${ICON.full}</span><b>Para pantalla completa: Compartir → Añadir a pantalla de inicio</b><button class="a2hs-x" aria-label="Cerrar">✕</button>`;
    const close = () => { try { localStorage.setItem(K, '1'); } catch { /* */ } el.remove(); };
    el.querySelector('.a2hs-x').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    this.root.appendChild(el);
    setTimeout(() => { if (el.isConnected) close(); }, 12000);
  }
  isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  toggleFullscreen(force) {
    const d = document.documentElement;
    try {
      if (this.isFullscreen() && force !== true) (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      else if (!this.isFullscreen()) {
        const p = (d.requestFullscreen || d.webkitRequestFullscreen)?.call(d, { navigationUI: 'hide' });
        p?.catch?.(() => {});
      }
    } catch { /* no soportado */ }
  }

  applySettings() {
    const st = this.s.settings;
    this.g.sound.setMusic(st.music);
    this.g.sound.setSfx(st.sfx);
    $('#joy').classList.toggle('hidden', !st.joystick);
    $('#hint').classList.toggle('hidden', this.isTouch);
  }

  // ------------------------------------------------------------ acciones
  act(a, d) {
    const sim = this.sim;
    switch (a) {
      case 'shop': return this.openShop();
      case 'land': return this.openLand();
      case 'workers': return this.openWorkers();
      case 'worker': return this.openWorker(d.id);
      case 'hire': if (sim.hire(d.id)) { const mine = sim.workers.filter((x) => x.role === d.id); this.openWorker(mine[mine.length - 1].rec.id); } else this.refreshSheet(); return;
      case 'wup': sim.upgradeWorker(d.id); this.refreshSheet(); return;
      case 'wauto': sim.toggleAutobuy(d.id); this.refreshSheet(); return;
      case 'wsell': sim.toggleSell(d.id); this.refreshSheet(); return;
      case 'wkeep': sim.cycleKeep(d.id); this.refreshSheet(); return;
      case 'wfire': return this.confirmFire(d.id);
      case 'wfire-yes': sim.fireWorker(d.id); $('#modal-wrap').classList.add('hidden'); this.openWorkers(); return;
      case 'ff': this.g.cycleSpeed(); return;
      case 'ffstop': this.g.setSpeed(1); return;
      case 'ffplot': this.g.fastForwardPlot(this.focusPlot); return;
      case 'inventory': return this.openInventory();
      case 'settings': return this.openSettings();
      case 'levelinfo': return this.openLevel();
      case 'fullscreen': return this.toggleFullscreen();
      case 'center': this.g.centerPlayer(); return;
      case 'viewfarm': if (this.s.level >= ZONES.manigua.level && this.g.rig.goalDist > this.g.rig.fitDist(...Object.values(this.g.ownedRect())) * 0.95) this.g.viewWorld(); else this.g.viewFarm(); return;
      case 'gomanigua': this.closeSheet(); this.g.goManigua(); return;
      case 'gobatey': this.closeSheet(); this.g.goBatey(); return;
      case 'gofarm': this.closeSheet(); this.g.goFarm(); return;
      case 'uphouse': if (sim.upgradeHouse(d.id)) this.closeSheet(); else this.refreshSheet(); return;
      case 'cheat': this.g.cheat(d.id); this.refreshSheet(); return;
      case 'build': if (sim.build(d.id)) this.closeSheet(); else this.refreshSheet(); return;
      case 'opensite': return this.openBuild(d.id);
      case 'goBuild': this.closeSheet(); { const st = STRUCTURES[d.id]; this.g.rig.goal.set(st.x + st.w / 2, 0, st.z + st.h / 2); this.g.rig.goalDist = Math.min(this.g.rig.maxDist, 24); this.g.rig.manualUntil = performance.now() + 5000; } return;
      case 'clearobs': { const o = sim.obstacle(d.id); this.closeSheet(); if (o && this.s.money >= o.cost) this.g.commandTarget({ kind: 'obstacle', id: o.id }); else this.toast('Todavía no alcanzan los pesos.'); return; }
      case 'seed': return this.cycleSeed();
      case 'use': sim.use(); return;
      case 'truckinfo': this.g.commandTarget({ kind: 'truck', i: +(d.i || 0) }); return;
      case 'close': return this.closeSheet();
      case 'skiptut': this.s.tutorialDone = true; this.updateTutorial(); return;
      case 'buy': if (sim.buy(d.id, +(d.qty || 1))) { this.g.tut('buy'); this.refreshSheet(); } else this.refreshSheet(); return;
      case 'parcel': if (sim.buyParcel(d.id)) { this.g.onLandChanged(); this.closeSheet(); } return;
      case 'sell': sim.sellLoose(d.item, d.qty === 'all' ? 999 : +d.qty); this.refreshSheet(); return;
      case 'skiptruck': sim.skipTruck(+(d.i || 0)); this.closeSheet(); return;
      case 'loadtruck': { const i = +(d.i || 0); sim.loadTruck(i); this.refreshSheet(); if (!sim.isParked(i) || this.truckSheetId !== sim.s.trucks[i]?.id) this.closeSheet(); return; }
      case 'cook': if (sim.startRecipe(d.id, d.key || 'kitchen')) this.closeSheet(); else this.refreshSheet(); return;
      case 'collectk': sim.collectKitchen(false, d.key || 'kitchen'); this.closeSheet(); return;
      case 'quality': this.g.setQuality(d.id); this.refreshSheet(); return;
      case 'toggle': this.s.settings[d.key] = !this.s.settings[d.key]; this.applySettings(); this.refreshSheet(); return;
      case 'reset': return this.confirmReset();
      case 'reset-yes': this.g.resetGame(); return;
      case 'modal-close': $('#modal-wrap').classList.add('hidden'); return;
      case 'selseed': this.s.selectedSeed = d.id; this.refreshHud(); this.closeSheet(); return;
      default: if (UI_ACTS[a]) UI_ACTS[a](this, d);
    }
  }
  cycleSeed() {
    const s = this.s;
    const avail = CROP_ORDER.filter((c) => s.level >= CROPS[c].level);
    if (avail.length <= 1 && s.seeds[s.selectedSeed] === 0) return this.openShop();
    this.openSheet('Semilla para sembrar', () => avail.map((c) => `
      <div class="row ${s.selectedSeed === c ? 'sel' : ''}">
        <div class="row-ico">${ICON[c]}</div>
        <div class="row-main"><b>${CROPS[c].name}</b><small>Tienes ${s.seeds[c]} · crece en ${fmtTime(this.sim.plotDur(c))}</small></div>
        <button class="btn" data-act="selseed" data-id="${c}">${s.selectedSeed === c ? 'Elegida' : 'Elegir'}</button>
      </div>`).join(''));
  }

  // ------------------------------------------------------------ hojas
  openSheet(title, render) {
    this.sheet = { title, render };
    $('#sheet-title').textContent = title;
    this.sheetHtml = render();
    $('#sheet-body').innerHTML = this.sheetHtml;
    $('#sheet-wrap').classList.remove('hidden');
    this.g.sound.play('tap');
  }
  refreshSheet() {
    if (this.sheet) {
      const html = this.sheet.render();
      if (html !== this.sheetHtml) { $('#sheet-body').innerHTML = html; this.sheetHtml = html; }
    }
    this.refreshHud();
  }
  refreshSettingsIfOpen() { if (this.sheet?.title === 'Ajustes') this.refreshSheet(); }
  closeSheet() { this.sheet = null; $('#sheet-wrap').classList.add('hidden'); }

  priceBtn(price, { act = 'buy', id, qty, disabled, lockLevel, label, wood } = {}) {
    if (lockLevel) return `<button class="btn locked" disabled>Nivel ${lockLevel}</button>`;
    const poor = this.s.money < price || (wood && this.s.res.madera < wood);
    return `<button class="btn ${poor ? 'poor' : ''}" data-act="${act}" data-id="${id}" ${qty ? `data-qty="${qty}"` : ''} ${disabled || poor ? 'disabled' : ''}>${label || ''}${ICON.coin}${price}${wood ? `<span class="wd">${ICON.wood}${wood}</span>` : ''}</button>`;
  }
  openShop() {
    this.openSheet('Tienda', () => {
      const s = this.s, sim = this.sim;
      let out = '<h3>Semillas</h3>';
      for (const c of CROP_ORDER) {
        const cr = CROPS[c], lock = s.level < cr.level ? cr.level : 0;
        const profit = ITEMS[cr.item].sell - cr.seed;
        out += `<div class="row ${lock ? 'dim' : ''}"><div class="row-ico">${ICON[c]}</div>
          <div class="row-main"><b>${cr.seedName}</b><small>Crece en ${fmtTime(sim.plotDur(c))} · se vende a ${ITEMS[cr.item].sell} (+${profit}) · tienes ${s.seeds[c]}</small></div>
          <div class="row-btns">${this.priceBtn(sim.seedPrice(c), { id: c, qty: 1, lockLevel: lock, label: '1 · ' })}${lock ? '' : this.priceBtn(sim.seedPrice(c) * 5, { id: c, qty: 5, label: '5 · ' })}</div></div>`;
      }
      out += '<h3>Animales y mejoras</h3>';
      const full = s.chickens.length >= chickenCap(s);
      out += `<div class="row"><div class="row-ico">${ICON.hen}</div><div class="row-main"><b>Gallina</b><small>${s.chickens.length}/${chickenCap(s)} en el corral · un huevo cada ~${EGG_INTERVAL} s</small></div>
        ${full ? '<button class="btn locked" disabled>Lleno</button>' : this.priceBtn(sim.chickenPrice(), { id: 'chicken' })}</div>`;
      const up = (id, name, detail, price, lvl, done) => `<div class="row ${s.level < lvl ? 'dim' : ''}"><div class="row-ico">${ICON.up}</div><div class="row-main"><b>${name}</b><small>${detail}</small></div>
        ${done ? '<button class="btn locked" disabled>Listo</button>' : this.priceBtn(price, { id, lockLevel: s.level < lvl ? lvl : 0 })}</div>`;
      const stLvl = s.upgrades.storage;
      const maxSt = stLvl >= PRICES.storage.length;
      out += up('storage', 'Almacén más grande', maxSt ? `Ya caben ${storageCap(s)} cosas.` : `Caben ${STORAGE_CAPS[stLvl + 1]} cosas (ahora ${storageCap(s)}).`, PRICES.storage[Math.min(stLvl, PRICES.storage.length - 1)], STORAGE_LEVELS[Math.min(stLvl, STORAGE_LEVELS.length - 1)], maxSt);
      out += up('coop', 'Ampliar gallinero', 'Caben 8 gallinas en vez de 4.', PRICES.coop, 3, s.upgrades.coop);
      out += up('abono', 'Abono', 'Todo crece un 20 % más rápido.', PRICES.abono, 4, s.upgrades.abono);
      out += `<h3>Trabajadores</h3><div class="row"><div class="row-ico">${ICON.worker}</div><div class="row-main"><b>Ayudantes para la finca</b><small>Recogen, riegan, siembran, cosechan, cocinan y cargan camiones.</small></div><button class="btn primary" data-act="workers">Ver</button></div>`;
      return out;
    });
  }
  // ------------------------------------------------------------ trabajadores
  workerCard(k) {
    const s = this.s, w = WORKERS[k], sim = this.sim, mine = sim.workers.filter((x) => x.role === k);
    const lock = s.level < w.level ? w.level : 0, price = sim.hirePrice(k), full = s.workers.length >= sim.workerCap();
    const btn = lock ? `<button class="btn locked" disabled>Nivel ${lock}</button>`
      : full ? '<button class="btn locked" disabled>Sin vivienda</button>'
      : `<button class="btn primary ${s.money < price ? 'poor' : ''}" data-act="hire" data-id="${k}" ${s.money < price ? 'disabled' : ''}>${mine.length ? 'Otro' : 'Contratar'} ${ICON.coin}${price}</button>`;
    const who = mine.length ? mine.map((x) => workerName(k, x.rec.n || 0)).join(', ') : workerName(k, 0);
    const crew = mine.map((x) => `<button class="wchip" data-act="worker" data-id="${x.rec.id}">${portrait(workerLook(k, x.rec.n || 0), WORKER_ORDER.indexOf(k) + (x.rec.n || 0))}<span><b>${esc(workerName(k, x.rec.n || 0))}</b> <i class="stars">${'★'.repeat(x.rec.lvl)}</i><small>${esc(x.status)}</small></span></button>`).join('');
    return `<div class="wcard ${lock ? 'dim' : ''} ${mine.length ? 'hired' : ''} ${w.tag ? 'feat' : ''}" data-worker="${k}">
      ${portrait(w.look, WORKER_ORDER.indexOf(k))}
      <div class="wmain">${w.tag ? `<span class="wtag">${ICON.coin}${w.tag}</span>` : ''}<b>${esc(who)}${mine.length > 1 ? ` <em class="cnt">×${mine.length}</em>` : ''}</b><span class="role">${ICON[w.icon] || ''}${w.name}</span>
        <small>${mine.length === 1 ? `Ahora: ${esc(mine[0].status)}` : w.detail}</small></div>
      <div class="wbtn">${btn}</div>${crew ? `<div class="wcrew">${crew}</div>` : ''}</div>`;
  }
  openWorkers() {
    this.openSheet('Trabajadores', () => {
      const s = this.s;
      const n = s.workers.length;
      const cap = workerCap(s);
      return `<div class="capbar ${n >= cap ? 'full' : ''}">${ICON.worker}<b>Trabajadores ${n}/${cap}</b><small>${n >= cap ? (s.level >= ZONES.batey.level ? 'Para contratar más: construye o mejora casas en el batey, o sube de nivel.' : `Sube de nivel para más sitio; en el nivel ${ZONES.batey.level} se abre el batey para hacer casas.`) : 'Puedes tener varios del mismo oficio: se reparten el trabajo sin estorbarse. El tope sube con el nivel y con las casas del batey.'}</small></div>
        <p class="note">Pago único, sin salario. Trabajan solos, también mientras adelantas el tiempo. ${n ? '' : 'El primero cuesta poco: ¡vende huevos y contrata a Pancho!'}</p>`
        + [...WORKER_ORDER].sort((a, b) => (WORKERS[b].tag ? 1 : 0) - (WORKERS[a].tag ? 1 : 0)).map((k) => this.workerCard(k)).join('');
    });
  }
  openWorker(id) {
    const first = this.sim.workerById(id);
    if (!first) { if (WORKERS[id]) return this.openSheet(WORKERS[id].name, () => this.workerCard(id)); return; }
    const role = first.role, w = WORKERS[role], rid = first.rec.id, name = workerName(role, first.rec.n || 0);
    this.openSheet(`${name} · ${w.name}`, () => {
      const s = this.s, rt = this.sim.workerById(rid);
      if (!rt) return this.workerCard(role);
      const lvl = rt.rec.lvl, sp = WORKER_SPEED[lvl];
      let out = `<div class="wdetail">${portrait(workerLook(role, rt.rec.n || 0), WORKER_ORDER.indexOf(role) + (rt.rec.n || 0))}<div><p class="wstatus">${ICON[w.icon] || ''} <b>${esc(rt.status)}</b></p><small>${w.detail} Trabajos hechos: ${rt.rec.jobs || 0}.</small></div></div>`;
      out += `<div class="row"><div class="row-ico">${ICON.up}</div><div class="row-main"><b>Rapidez ${'★'.repeat(lvl)}${'☆'.repeat(3 - lvl)}</b><small>Camina ${sp.walk.toFixed(1)} · trabaja en ${sp.work.toFixed(1)} s${lvl < 3 ? ` → nivel ${lvl + 1}: ${WORKER_SPEED[lvl + 1].walk.toFixed(1)} · ${WORKER_SPEED[lvl + 1].work.toFixed(1)} s` : ' · ¡al máximo!'}</small></div>
        ${lvl < 3 ? this.priceBtn(workerUpgradePrice(role, lvl), { act: 'wup', id: rid, label: 'Mejorar · ' }) : '<button class="btn locked" disabled>Máximo</button>'}</div>`;
      if (role === 'sembrador') {
        out += `<div class="row"><div class="row-ico">${ICON.seed}</div><div class="row-main"><b>Comprar semillas sola</b><small>Si no quedan, compra ${CROPS[s.selectedSeed]?.seedName.toLowerCase() || 'semillas'} con tus pesos.</small></div>
          <button class="btn toggle ${rt.rec.autobuy ? 'on' : ''}" data-act="wauto" data-id="${rid}">${rt.rec.autobuy ? 'Sí' : 'No'}</button></div>`;
      }
      if (role === 'camionero') {
        const keep = rt.rec.keep ?? 10;
        out += `<div class="row"><div class="row-ico">${ICON.truck}</div><div class="row-main"><b>Atiende los camiones solo</b><small>Trae del bohío lo que piden, carga y cobra. Si piden lo que no hay, espera ${CAM_WAIT} s por si llega y luego lo despide. Con dos camioneros, cada uno atiende un camión.</small></div></div>`;
        out += `<div class="row"><div class="row-ico">${ICON.coin}</div><div class="row-main"><b>Vender lo que sobra</b><small>Venta suelta a precio normal de lo que pase de lo que guardas (nunca lo que piden los camiones).</small></div>
          <button class="btn toggle ${rt.rec.sell ? 'on' : ''}" data-act="wsell" data-id="${rid}">${rt.rec.sell ? 'Sí' : 'No'}</button></div>`;
        out += `<div class="row ${rt.rec.sell ? '' : 'dim'}"><div class="row-ico">${ICON.basket || ICON.egg}</div><div class="row-main"><b>Guardar ${keep} de cada cosa</b><small>Lo demás lo vende ${esc(name)}. Toca para cambiar (${CAM_KEEP.join(' / ')}).</small></div>
          <button class="btn" data-act="wkeep" data-id="${rid}">${keep}</button></div>`;
      }
      out += `<div class="modal-btns"><button class="btn" data-act="workers">Todos los trabajadores</button><button class="btn danger" data-act="wfire" data-id="${rid}">Despedir</button></div>`;
      return out;
    });
    this.g.focusWorker?.(rid);
  }
  confirmFire(id) {
    const rt = this.sim.workerById(id);
    if (!rt) return;
    const who = workerName(rt.role, rt.rec.n || 0);
    this.modal(`<h2>¿Despedir a ${esc(who)}?</h2><p>No se devuelve lo pagado. Puedes volver a contratar después.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn danger" data-act="wfire-yes" data-id="${rt.rec.id}">Despedir</button></div>`);
  }
  openLand() {
    this.openSheet('Terreno y obras', () => {
      const s = this.s;
      const owned = s.parcels.length;
      let out = `<p class="note">Tienes ${owned} de ${PARCELS.length} pedazos de tierra. Compra la tierra de al lado, quita piedras, marabú y tocones para abrir canteros, y construye en los solares.</p>`;
      out += `<div class="capbar">${ICON.wood}<b>Madera: ${s.res.madera}/${WOOD_CAP}</b><small>${s.level >= ZONES.manigua.level ? 'Tumba árboles en la manigua o contrata al leñador.' : `La madera sale de la manigua (nivel ${ZONES.manigua.level}).`}</small></div>`;
      out += this.bateySection();
      for (const f of UI_SECTIONS.land || []) out += f(this) || '';
      out += '<h3>Construir en la finca</h3>';
      for (const k of STRUCTURE_ORDER) {
        const st = STRUCTURES[k], built = !!s.built[k], par = PARCELS.find((p) => p.id === st.parcel);
        const hasLand = s.parcels.includes(st.parcel), lock = s.level < st.level ? st.level : 0;
        const btn = built ? `<button class="btn" data-act="goBuild" data-id="${k}">Ver</button>`
          : !hasLand ? `<button class="btn locked" disabled>${lock ? `Nivel ${lock}` : 'Sin tierra'}</button>`
          : this.priceBtn(st.price, { act: 'build', id: k, lockLevel: lock, wood: st.madera });
        out += `<div class="row ${lock || !hasLand ? 'dim' : ''} ${built ? 'sel' : ''}"><div class="row-ico">${ICON[STRUCT_ICON[k]] || ICON.up}</div><div class="row-main"><b>${st.name}</b><small>${st.detail}${built ? ' · ¡construido!' : hasLand ? '' : ` · en “${par.name}”`}</small></div>${btn}</div>`;
      }
      out += '<h3>Tierra</h3>';
      out += PARCELS.map((p) => {
        const own = s.parcels.includes(p.id), lock = s.level < p.level ? p.level : 0, reach = parcelReachable(s, p);
        const extra = `${p.plots.length} canteros${p.obstacles.length ? ` · ${p.obstacles.length} obstáculos` : ''}${p.site ? ` · solar: ${STRUCTURES[p.site.id].name.toLowerCase()}` : ''}`;
        const btn = own ? '<button class="btn locked" disabled>Tuyo</button>'
          : lock ? `<button class="btn locked" disabled>Nivel ${lock}</button>`
          : !reach ? '<button class="btn locked" disabled>Lejos</button>'
          : this.priceBtn(p.price, { act: 'parcel', id: p.id });
        return `<div class="row ${lock || (!own && !reach) ? 'dim' : ''}"><div class="row-ico">${ICON.land}</div><div class="row-main"><b>${p.name}</b><small>${p.blurb} ${extra}.${!own && !reach && !lock ? ' Primero compra la tierra de al lado.' : ''}</small></div>${btn}</div>`;
      }).join('');
      return out;
    });
  }
  bateySection() {
    const s = this.s, open = zoneOpen(s, 'batey');
    let out = `<h3>El batey <small>${open ? `· viviendas para ${workerCap(s)} trabajadores` : `· nivel ${ZONES.batey.level}`}</small></h3>`;
    if (!open) return out + `<p class="note">${ZONES.batey.blurb} Aquí harás bohíos y casas de zinc (más trabajadores), la bodega, la escuelita y la iglesita.</p>`;
    out += `<div class="row"><div class="row-ico">${ICON.house}</div><div class="row-main"><b>Ir al batey</b><small>Queda al sur, cruzando el camino.</small></div><button class="btn" data-act="gobatey">Ir</button></div>`;
    for (const k of BATEY_ORDER) out += this.bateyRow(k);
    return out;
  }
  bateyRow(k) {
    const s = this.s, st = STRUCTURES[k], b = s.built[k], lock = s.level < st.level ? st.level : 0;
    const house = st.kind === 'house';
    let btn, name = st.name, detail = st.detail || '';
    if (house) {
      name = b?.tier === 2 ? st.upgrade.name : b ? 'Bohío' : `Solar: ${st.name}`;
      detail = b?.tier === 2 ? `Viven ${st.upgrade.cap} trabajadores más.` : b ? `Vive ${st.cap} trabajador más. Mejóralo a casa de zinc: +${st.upgrade.cap - st.cap}.` : `Bohío de guano: +${st.cap} trabajador.`;
    }
    if (!b) btn = this.priceBtn(st.price, { act: 'build', id: k, lockLevel: lock, wood: st.madera });
    else if (house && b.tier !== 2) btn = s.level < st.upgrade.level ? `<button class="btn locked" disabled>Zinc · nivel ${st.upgrade.level}</button>` : this.priceBtn(st.upgrade.price, { act: 'uphouse', id: k, wood: st.upgrade.wood, label: 'Zinc · ' });
    else btn = `<button class="btn" data-act="goBuild" data-id="${k}">Ver</button>`;
    return `<div class="row ${lock ? 'dim' : ''} ${b ? 'sel' : ''}"><div class="row-ico">${ICON[STRUCT_ICON[k]] || ICON.house}</div><div class="row-main"><b>${name}</b><small>${detail}</small></div>${btn}</div>`;
  }
  openBuild(id) {
    const st = STRUCTURES[id];
    if (st.zone === 'batey') return this.openSheet(st.kind === 'house' ? 'Casa del batey' : st.name, () => `<p class="note">${st.kind === 'house' ? 'Cada casa da vivienda a trabajadores. Hacen falta pesos y madera.' : st.detail}</p>${this.bateyRow(id)}<p class="note">Madera: ${this.s.res.madera}. Viviendas: ${this.sim.workers.length}/${workerCap(this.s)}.</p>`);
    this.openSheet(st.name, () => {
      const s = this.s, lock = s.level < st.level ? st.level : 0;
      if (s.built[id]) return `<p class="note">Ya está construido. ${st.detail}</p>`;
      let blocked = false;
      for (let z = st.z; z < st.z + st.h; z++) for (let x = st.x; x < st.x + st.w; x++) if (this.sim.obstacleAt(x, z)) blocked = true;
      return `<div class="row"><div class="row-ico">${ICON[STRUCT_ICON[id]] || ICON.up}</div><div class="row-main"><b>Solar para: ${st.name}</b><small>${st.detail}</small></div>${this.priceBtn(st.price, { act: 'build', id, lockLevel: lock, wood: st.madera })}</div>
        ${st.madera ? `<p class="note">Lleva ${st.madera} de madera (tienes ${s.res.madera}).</p>` : ''}
        ${blocked ? '<p class="note">Hay que limpiar el solar primero (toca las piedras o el marabú).</p>' : ''}`;
    });
  }
  openObstacle(o) {
    const O = OBSTACLES[o.kind];
    const plot = PARCELS.find((p) => p.id === o.parcel).plots.some(([x, z]) => x === o.x && z === o.z);
    this.openSheet(O.name, () => `<div class="row"><div class="row-ico">${ICON.land}</div><div class="row-main"><b>${O.verb}</b><small>${plot ? 'Debajo hay un cantero nuevo. ' : ''}+${O.xp} XP. Tu guajiro va y lo limpia.</small></div>
      ${this.priceBtn(o.cost, { act: 'clearobs', id: o.id, label: 'Quitar · ' })}</div>`);
  }

  openInventory() {
    this.openSheet('La canasta', () => {
      const s = this.s;
      let out = `<p class="note">Llevas ${invCount(s)} de ${storageCap(s)}. Vende en el camión.${s.res.madera ? ` Madera en el bohío: ${s.res.madera}.` : ''}</p><div class="grid">`;
      for (const k of SELLABLE) if (s.inv[k] || ITEMS[k].level === undefined || s.level >= (ITEMS[k].level || 1)) out += `<div class="cell">${ICON[k]}<b>${s.inv[k]}</b><small>${ITEMS[k].plural}</small></div>`;
      out += '</div><h3>Semillas</h3><div class="grid">';
      for (const c of CROP_ORDER) out += `<div class="cell">${ICON[c]}<b>${s.seeds[c]}</b><small>${CROPS[c].name}</small></div>`;
      return out + '</div>';
    });
  }
  openTruck(i = 0) {
    this.truckSheetId = this.s.trucks[i]?.id;
    this.openSheet(i ? 'Camión de acopio · andén 2' : 'Camión de acopio', () => {
      const s = this.s, sim = this.sim, tr = s.trucks[i];
      if (!tr || !sim.isParked(i) || tr.id !== this.truckSheetId) return '<p class="note">El próximo camión está entrando. Un momentico…</p>';
      const o = tr.order, miss = sim.missing(tr);
      let out = '<div class="order"><h3>Este camión quiere</h3><div class="order-items">';
      for (const [k, q] of Object.entries(o.items)) {
        const got = tr.loaded[k] || 0, need = q - got, have = s.inv[k];
        const ok = need <= 0 || have >= need;
        out += `<div class="oi ${need <= 0 ? 'ok' : ok ? 'ok' : have > 0 ? 'part' : ''}">${ICON[k]}<b>${got}/${q}</b><small>${ITEMS[k].plural} · tienes ${have}</small></div>`;
      }
      const some = sim.canLoadSome(tr), all = Object.keys(miss).length > 0 && sim.canDeliver(tr);
      const cam = sim.workers.find((x) => x.role === 'camionero');
      out += `</div><div class="order-foot"><span>Paga ${ICON.coin}<b>${o.reward}</b> · ${ICON.xp}<b>${o.xp}</b> XP</span></div>
        ${cam ? `<p class="note">${ICON.truck} ${WORKERS.camionero.who} atiende este camión por ti: ${esc(cam.status)}.</p>` : s.level >= WORKERS.camionero.level ? `<p class="note">¿Cansado de vender? Contrata a ${WORKERS.camionero.who} en “Trabajadores”: ${WORKERS.camionero.tag.toLowerCase()}.</p>` : ''}
        <div class="order-btns">
          <button class="btn primary" data-act="loadtruck" data-i="${i}" ${some ? '' : 'disabled'}>${all ? 'Cargar todo' : some ? 'Cargar lo que hay' : 'Cargar'}</button>
          <button class="btn" data-act="skiptruck" data-i="${i}">No tenemos, siguiente</button>
        </div></div>`;
      // la fila
      const next = s.trucks.slice(sim.docks());
      if (next.length) {
        out += '<h3>En la fila</h3><div class="queue">';
        for (const t of next) out += `<div class="qi">${ICON.truck}${Object.entries(t.order.items).map(([k, q]) => `${ICON[k]}${q}`).join(' ')}</div>`;
        out += '</div>';
      }
      out += '<h3>Venta suelta <small>(a precio normal)</small></h3>';
      let any = false;
      for (const k of SELLABLE) {
        if (!s.inv[k]) continue;
        any = true;
        out += `<div class="row"><div class="row-ico">${ICON[k]}</div><div class="row-main"><b>${ITEMS[k].plural}: ${s.inv[k]}</b><small>${ITEMS[k].sell} pesos cada uno</small></div>
          <div class="row-btns"><button class="btn" data-act="sell" data-item="${k}" data-qty="1">Vender 1</button><button class="btn" data-act="sell" data-item="${k}" data-qty="all">Todo</button></div></div>`;
      }
      if (!any) out += '<p class="note">La canasta está vacía. Recoge huevos o cosecha.</p>';
      return out;
    });
  }
  openKitchen(key = 'kitchen') {
    const title = key === 'kitchen' ? 'El fogón' : STRUCTURES[key].name;
    this.openSheet(title, () => {
      const s = this.s, k = this.sim.proc(key);
      if (k.ready) return `<p class="note">¡Ya está! Recoge: ${ITEMS[k.ready].name.toLowerCase()}.</p><button class="btn primary wide" data-act="collectk" data-key="${key}">Recoger</button>`;
      if (k.recipe) return `<p class="note">Haciendo ${RECIPES[k.recipe].name.toLowerCase()}… listo en ${fmtClock(RECIPES[k.recipe].time - (now() - k.at))}.</p>`;
      return Object.entries(RECIPES).filter(([, r]) => r.where.includes(key)).map(([id, r]) => {
        const lock = s.level < r.level;
        const need = Object.entries(r.needs).map(([i, q]) => `${q} ${ITEMS[i].plural.toLowerCase()} (tienes ${s.inv[i]})`).join(', ');
        const can = !lock && Object.entries(r.needs).every(([i, q]) => s.inv[i] >= q);
        return `<div class="row ${lock ? 'dim' : ''}"><div class="row-ico">${ICON[r.out]}</div><div class="row-main"><b>${r.name}</b><small>${need} · ${fmtTime(r.time)} · se vende a ${ITEMS[r.out].sell}</small></div>
          ${lock ? `<button class="btn locked" disabled>Nivel ${r.level}</button>` : `<button class="btn" data-act="cook" data-id="${id}" data-key="${key}" ${can ? '' : 'disabled'}>${key === 'trapiche' ? 'Moler' : key === 'casaTabaco' ? 'Torcer' : 'Cocinar'}</button>`}</div>`;
      }).join('');
    });
  }
  openSettings() {
    this.openSheet('Ajustes', () => {
      const st = this.s.settings;
      const tg = (key, label, icon) => `<div class="row"><div class="row-ico">${icon}</div><div class="row-main"><b>${label}</b></div>
        <button class="switch ${st[key] ? 'on' : ''}" data-act="toggle" data-key="${key}" role="switch" aria-checked="${!!st[key]}"><i></i></button></div>`;
      let out = tg('music', 'Música guajira', ICON.music) + tg('sfx', 'Efectos de sonido', ICON.sound) + tg('joystick', 'Joystick en pantalla', ICON.center);
      const q = st.quality || 'auto';
      out += `<div class="row"><div class="row-ico">${ICON.xp}</div><div class="row-main"><b>Calidad gráfica</b><small>Ahora: ${this.g.world.quality}${q === 'auto' ? ' (automática)' : ''}</small></div></div>
        <div class="seg">${[['auto', 'Auto'], ['alta', 'Alta'], ['media', 'Media'], ['baja', 'Baja']].map(([id, l]) => `<button class="btn ${q === id ? 'primary' : ''}" data-act="quality" data-id="${id}">${l}</button>`).join('')}</div>`;
      if (this.fsSupported()) out += `<div class="row"><div class="row-ico">${ICON.full}</div><div class="row-main"><b>Pantalla completa</b></div><button class="btn" data-act="fullscreen">${this.isFullscreen() ? 'Salir' : 'Activar'}</button></div>`;
      else out += '<p class="note">En iPhone: Compartir → “Añadir a pantalla de inicio” para jugar a pantalla completa.</p>';
      out += `<p class="note">Controles: toca el suelo para caminar, toca huevos, canteros, el camión o el fogón para usarlos. Arrastra para mover la vista y pellizca (o usa la rueda) para acercar o alejar.</p>`;
      if (import.meta.env.DEV || window.__fincaDev) out += `<h3>Trucos (solo desarrollo)</h3><div class="seg"><button class="btn" data-act="cheat" data-id="level">+1 nivel</button><button class="btn" data-act="cheat" data-id="money">+1000 pesos</button><button class="btn" data-act="cheat" data-id="wood">+100 madera</button></div>`;
      out += settingsSection(this);
      out += '<button class="btn danger wide" data-act="reset">Empezar de cero…</button>';
      return out;
    });
  }
  openLevel() {
    const s = this.s;
    const next = s.level + 1;
    this.openSheet(`Nivel ${s.level}`, () => `<p class="note">${s.xp - xpForLevel(s.level)} de ${xpForLevel(next) - xpForLevel(s.level)} XP para el nivel ${next}.</p>
      <h3>En el nivel ${next} se desbloquea</h3><ul class="unl">${(unlocksAt(next).map((u) => `<li>${esc(u)}</li>`).join('')) || '<li>Más pedidos y mejores pagos</li>'}</ul>
      <p class="note">Ganas XP recogiendo, cosechando, cocinando y entregando pedidos.</p>`);
  }
  confirmReset() {
    this.closeSheet();
    this.modal(`<h2>¿Empezar de cero?</h2><p>Se borra toda tu finca: pesos, tierra, gallinas y trabajadores. No se puede deshacer.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn danger" data-act="reset-yes">Sí, borrar</button></div>`);
  }
  modal(html) { $('#modal').innerHTML = html; $('#modal-wrap').classList.remove('hidden'); }
  levelUp(level) {
    const u = unlocksAt(level);
    this.modal(`<div class="lvlup">${ICON.xp}<b>${level}</b></div><h2>¡Subiste al nivel ${level}!</h2>
      ${u.length ? `<p>Ahora tienes:</p><ul class="unl">${u.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p>Los pedidos pagan mejor.</p>'}
      <div class="modal-btns"><button class="btn primary" data-act="modal-close">¡Dale!</button></div>`);
  }

  // ------------------------------------------------------------ HUD
  refreshHud() {
    const s = this.s;
    $('#lvl').textContent = s.level;
    const a = xpForLevel(s.level), b = xpForLevel(s.level + 1);
    $('#xpfill').style.width = `${Math.min(100, ((s.xp - a) / (b - a)) * 100)}%`;
    $('#money').textContent = s.money;
    const ic = invCount(s), cap = storageCap(s);
    $('#invc').textContent = `${ic}/${cap}`;
    $('.chip.inv').classList.toggle('full', ic >= cap);
    $('#woodchip').classList.toggle('hidden', !(s.res.madera > 0 || s.level >= ZONES.manigua.level));
    $('#wood').textContent = s.res.madera;
    $('#seedname').textContent = CROPS[s.selectedSeed].name.split(' ')[0];
    $('#seedcount').textContent = s.seeds[s.selectedSeed];
    $('#seedsel .ico').outerHTML = ICON[s.selectedSeed];
  }
  toast(text) {
    const box = $('#toasts');
    if (this.toasts.length && this.toasts[this.toasts.length - 1].text === text) return;
    const el = h(`<div class="toast">${esc(text)}</div>`);
    box.appendChild(el);
    const t = { el, text, life: 3.2 };
    this.toasts.push(t);
    while (this.toasts.length > 2) { const o = this.toasts.shift(); o.el.remove(); }
  }
  float(x, z, text, cls) {
    const el = h(`<div class="floater ${cls || ''}">${cls === 'money' ? ICON.coin : ''}${esc(text)}</div>`);
    $('#floaters').appendChild(el);
    this.floaters.push({ el, x, z, y: 1.2, life: 1.3 });
    if (this.floaters.length > 12) this.floaters.shift().el.remove();
  }

  // Etiquetas del mundo (camión, fogón, terrenos, temporizadores)
  label(key, x, y, z, html, cls = '', act) {
    let L = this.labels.get(key);
    if (!L) {
      L = { el: h(`<div class="wlabel ${cls}" ${act ? `data-act="${act}"` : ''}></div>`), html: '' };
      $('#labels').appendChild(L.el);
      this.labels.set(key, L);
    }
    if (L.html !== html) { L.el.innerHTML = html; L.html = html; L.w = 0; }
    L.x = x; L.y = y; L.z = z; L.seen = true;
  }
  updateLabels() {
    const s = this.s, sim = this.sim;
    for (const L of this.labels.values()) L.seen = false;
    // fila de camiones: pedido grande en el primero, mini en los demás
    s.trucks.forEach((tr, i) => {
      const items = Object.entries(tr.order.items).map(([k, q]) => `${ICON[k]}${Math.max(0, q - (tr.loaded[k] || 0))}`).join(' ');
      if (sim.isParked(i)) {
        const ready = sim.canDeliver(tr), some = sim.canLoadSome(tr);
        this.label(i ? 'truck-1' : 'truck', TRUCK_SPOT.x, 2.3, tr.z, `<span class="lt">${i ? 'Andén 2' : 'Pedido'}</span>${items}<span class="pay">${ICON.coin}${tr.order.reward}</span>${ready ? '<span class="go">¡Listo!</span>' : some ? '' : '<span class="no">No hay</span>'}`, ready ? 'ready' : '', `truckinfo" data-i="${i}`);
      } else if (Math.abs(tr.z - (tr.slotZ ?? tr.z)) < 0.05) {
        this.label(`truckq-${tr.id}`, TRUCK_SPOT.x, 2.0, tr.z, items, 'mini');
      }
    });
    // fogón
    const K = BUILDINGS.kitchen;
    if (!sim.kitchenOpen()) this.label('kitchen', K.x + 1, 2.6, K.z + 1, 'Fogón · nivel 2', 'muted');
    else if (s.kitchen.ready) this.label('kitchen', K.x + 1, 2.6, K.z + 1, `${ICON[s.kitchen.ready]} ¡Listo!`, 'ready');
    else if (s.kitchen.recipe) this.label('kitchen', K.x + 1, 2.6, K.z + 1, `${ICON[RECIPES[s.kitchen.recipe].out]} ${fmtClock(RECIPES[s.kitchen.recipe].time - (now() - s.kitchen.at))}`);
    else this.label('kitchen', K.x + 1, 2.6, K.z + 1, 'Fogón libre', 'muted');
    // terrenos a la venta
    const frontier = this.g.world.frontierParcels();
    for (const p of PARCELS) {
      if (s.parcels.includes(p.id) || !frontier.has(p.id) || this.g.rig.dist > 75) continue;
      const [cx, cz] = this.g.world.parcelCenter(p);
      const lock = s.level < p.level;
      this.label(`parcel-${p.id}`, cx, 1.2, cz, lock ? `Se vende · nivel ${p.level}` : `Se vende ${ICON.coin}${p.price}`, lock ? 'muted' : 'sale', 'land');
    }
    // temporizador de la mata seleccionada
    // estructuras: listo / tiempo / solar
    for (const [id, st] of Object.entries(STRUCTURES)) {
      if (!structOpen(s, st)) continue;
      const cx = st.x + st.w / 2, cz = st.z + st.h / 2, b = s.built[id];
      if (!b) {
        if (st.zone && (s.level < st.level - 3 || this.g.rig.dist > 40)) continue; // en el batey solo los solares cercanos de nivel
        this.label(`st-${id}`, cx, 1.1, cz, `${st.kind === 'house' ? 'Solar · casa' : `Solar · ${st.name}`}${s.level < st.level ? ` · nivel ${st.level}` : ''}`, s.level < st.level ? 'muted' : 'sale', `opensite" data-id="${id}`);
        continue;
      }
      if (st.kind === 'animal') this.label(`st-${id}`, cx, 1.6, cz, b.ready ? `${ICON[st.produce.item]} ¡Listo!` : `${ICON[st.produce.item]} ${fmtClock(sim.animalLeft(id))}`, b.ready ? 'ready' : 'mini');
      else if (st.kind === 'proc') {
        const k = b;
        this.label(`st-${id}`, cx, 2.4, cz, k.ready ? `${ICON[k.ready]} ¡Listo!` : k.recipe ? `${ICON[RECIPES[k.recipe].out]} ${fmtClock(RECIPES[k.recipe].time - (now() - k.at))}` : `${st.name} libre`, k.ready ? 'ready' : k.recipe ? '' : 'muted');
      }
    }
    // zonas cerradas: letrero en la entrada
    for (const id of ZONE_ORDER) {
      const Z = ZONES[id];
      if (!Z.sign || zoneOpen(s, id)) continue;
      const [x, z] = Z.sign;
      if (Z.soon && s.level < Z.level - 10) continue;
      this.label(`zone-${id}`, x, 1.4, z, `${Z.name} · ${Z.soon ? 'muy pronto' : `nivel ${Z.level}`}`, 'muted');
    }
    // lo que llevas en brazos
    if (s.carry.length) {
      const p = sim.player;
      this.label('carry', p.x, 2.2, p.z, `${s.carry.map((c) => (c.kind === 'caballo' ? ICON.horse : ICON[c.kind] || ICON.hen)).join('')}<span>${s.carry.length}/${CARRY_MAX} · a la finca</span>`, 'mini ready');
    }
    // trabajadores: burbuja con lo que hacen
    for (const w of sim.workers) {
      const W0 = WORKERS[w.role];
      const html = w.work > 0 ? `${ICON[W0.icon] || ''}<span>${esc(w.status)}</span>` : w.busy ? `${ICON[W0.icon] || ''}<span class="dots">…</span>` : '<span class="zz">z z</span>';
      this.label(`w-${w.rec.id}`, w.x, 1.75, w.z, html, `mini wk ${w.work > 0 ? 'working' : ''}`, `worker" data-id="${w.rec.id}`);
    }
    if (this.focusPlot && performance.now() < this.focusUntil && this.focusPlot.crop) {
      const p = this.focusPlot, rem = p.at + p.dur - now();
      if (rem > 0) this.label('focus', p.x + 0.5, 1.1, p.z + 0.5, `${ICON[p.crop]} ${fmtClock(rem)}${p.watered ? ` ${ICON.water}` : ''}`);
    }
    const cam = this.g.rig.camera;
    const { w: W, h: H } = viewSize();
    for (const [k, L] of this.labels) {
      if (!L.seen) { L.el.remove(); this.labels.delete(k); continue; }
      const p = this.g.project(L.x, L.y, L.z);
      let x = p.x;
      if (k === 'truck') { const hw = (L.w ||= L.el.offsetWidth) / 2 + 6; x = Math.min(W - hw, Math.max(hw, x)); }
      L.el.style.transform = `translate(${x}px, ${p.y}px) translate(-50%, -100%)`;
      L.el.style.visibility = p.ok && p.x > -50 && p.x < W + 50 && p.y > 0 && p.y < H + 50 ? 'visible' : 'hidden';
    }
  }
  // ⏩: botón, cartel "Adelantando…" y atajo en la mata tocada
  updateFF() {
    const g = this.g, sp = g.ffSpeed, s = this.s;
    const btn = $('#btn-ff');
    if (btn.dataset.sp !== String(sp)) {
      btn.dataset.sp = String(sp);
      $('#ffx').textContent = `x${sp}`;
      btn.classList.toggle('on', sp > 1);
      $('#ffbanner').classList.toggle('hidden', sp === 1);
      document.getElementById('vignette')?.classList.toggle('ff', sp > 1);
    }
    if (sp > 1) {
      const tod = s.tod ?? 0.6, hh = Math.floor(tod * 24), mm = Math.floor((tod * 24 - hh) * 60);
      const night = tod < 0.23 || tod > 0.79;
      const txt = `x${sp} · ${night ? ICON.moon : ICON.sun} ${String(hh).padStart(2, '0')}:${String(Math.floor(mm / 10) * 10).padStart(2, '0')}${g.ffPlot ? ` · ${ICON[g.ffPlot.crop] || ''} ${fmtClock(g.ffPlot.at + g.ffPlot.dur - now())}` : ''}`;
      const el = $('#ffinfo');
      if (el.dataset.t !== txt) { el.dataset.t = txt; el.innerHTML = txt; }
    }
    // atajo: mata tocada que está creciendo
    const pill = $('#plotpill');
    const p = this.focusPlot;
    const show = p && p.crop && performance.now() < this.focusUntil && this.sim.plotState(p) === 'growing' && sp === 1;
    pill.classList.toggle('hidden', !show);
    if (show) {
      if (pill.dataset.crop !== p.crop) {
        pill.dataset.crop = p.crop;
        pill.innerHTML = `${ICON[p.crop]}<span><b>${CROPS[p.crop].name}</b> · listo en <i id="pilltime"></i></span><button class="btn primary" data-act="ffplot">${ICON.ff}Adelantar</button>`;
      }
      const tt = fmtClock(p.at + p.dur - now()), el = $('#pilltime');
      if (el.textContent !== tt) el.textContent = tt;
    }
    // aviso para contratar al primero
    const wc = $('#wcount');
    const n = s.workers.length;
    if (wc.textContent !== String(n)) { wc.textContent = n; wc.classList.toggle('hidden', !n); }
    if (!s.hireHint && !n && s.money >= WORKERS.recolector.price && s.tutorial >= 2) {
      s.hireHint = true;
      this.toast(`¡Ya te alcanza para contratar a ${WORKERS.recolector.who}! Toca “Trabajadores”.`);
      $('#btn-workers').classList.add('pulse-once');
    }
    if (!s.camHint && s.level >= WORKERS.camionero.level && !s.workers.some((w) => w.role === 'camionero') && s.money >= WORKERS.camionero.price && s.tutorialDone) {
      s.camHint = true;
      this.toast(`${WORKERS.camionero.who} el camionero ya se puede contratar: ${WORKERS.camionero.tag.toLowerCase()}.`);
      $('#btn-workers').classList.add('pulse-once');
    }
  }
  focus(p) { this.focusPlot = p; this.focusUntil = performance.now() + 7000; }

  // ------------------------------------------------------------ tutorial
  tutorialSteps() {
    const s = this.s, sim = this.sim, t = now();
    const ripe = s.plots.find((p) => sim.plotState(p, t) === 'ripe');
    const growing = s.plots.find((p) => sim.plotState(p, t) === 'growing');
    const empty = s.plots.find((p) => !p.crop);
    const anySeeds = CROP_ORDER.some((c) => s.seeds[c] > 0);
    const egg = s.eggs[0];
    switch (s.tutorial) {
      case 0: return { text: '¡Qué volá, guajiro! Toca los huevos del corral para recogerlos. Tu guajiro camina solo.', at: egg ? [egg.x, 0.6, egg.z] : [9.5, 0.8, 7] };
      case 1: return { text: 'Los camiones hacen fila. El primero quiere 3 huevos: tócalo y pulsa “Cargar”. Si pide algo que no tienes, pulsa “No tenemos, siguiente”.', at: [TRUCK_SPOT.x, 2.9, TRUCK_SPOT.z] };
      case 2:
        if (!anySeeds) return { text: 'Compra semillas de tomate en la Tienda.', dom: '[data-act="shop"]' };
        return { text: 'Toca un cantero de tierra colorada para sembrar tomates.', at: empty ? [empty.x + 0.5, 0.4, empty.z + 0.5] : null };
      case 3:
        if (ripe) { s.tutorial = 4; return this.tutorialSteps(); }
        return { text: `Está creciendo (${growing ? fmtClock(growing.at + growing.dur - t) : '…'}). Toca ⏩ arriba para adelantar el tiempo y que crezca rápido (o riégala).`, dom: '#btn-ff' };
      case 4:
        if (!ripe) return { text: 'Espera a que brille: cuando la mata tiene una estrellita dorada, está lista.', at: growing ? [growing.x + 0.5, 0.6, growing.z + 0.5] : null };
        return { text: '¡Tomates listos! Toca la mata (o camina encima) para cosecharlos.', at: [ripe.x + 0.5, 0.9, ripe.z + 0.5] };
      case 5: return { text: 'Contrata ayudantes en “Trabajadores” (Pancho recoge huevos), vende a los camiones y compra tierra en “Terreno”.', dom: '#btn-workers', done: true };
      default: return null;
    }
  }
  updateTutorial() {
    const s = this.s, g = $('#guide'), arrow = $('#tut-arrow');
    document.querySelectorAll('.pulse').forEach((e) => e.classList.remove('pulse'));
    if (s.tutorialDone || !this.g.started || this.g.ffSpeed > 1) { g.classList.add('hidden'); arrow.classList.add('hidden'); return; }
    // avanzar según el estado real
    const st = s.stats;
    if (s.tutorial === 0 && (s.inv.egg >= 3 || st.eggs >= 3 || st.sold > 0)) s.tutorial = 1;
    if (s.tutorial === 1 && st.sold > 0) s.tutorial = 2;
    if (s.tutorial === 2 && s.plots.some((p) => p.crop)) s.tutorial = 3;
    if (s.tutorial === 4 && st.harvests > 0) s.tutorial = 5;
    if (s.tutorial >= 5 && (s.parcels.length > 0 || s.level >= 3 || s.workers.length > 0)) { s.tutorialDone = true; }
    const step = this.tutorialSteps();
    if (!step) { g.classList.add('hidden'); arrow.classList.add('hidden'); return; }
    g.classList.remove('hidden');
    $('#guide-step').textContent = `${Math.min(6, s.tutorial + 1)}/6`;
    if ($('#guide-text').textContent !== step.text) $('#guide-text').textContent = step.text;
    $('.guide-skip').textContent = step.done ? 'Entendido' : 'Saltar';
    if (step.dom) { document.querySelector(step.dom)?.classList.add('pulse'); arrow.classList.add('hidden'); }
    else if (step.at) {
      const p = this.g.project(...step.at);
      arrow.classList.toggle('hidden', !p.ok);
      arrow.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
    } else arrow.classList.add('hidden');
  }

  // ------------------------------------------------------------ joystick y botón Usar
  setupJoystick() {
    const joy = $('#joy'), knob = $('#knob');
    let id = null, cx = 0, cy = 0;
    const R = 46;
    joy.addEventListener('pointerdown', (e) => {
      id = e.pointerId; joy.setPointerCapture(id);
      const r = joy.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      move(e); this.g.sound.unlock();
    });
    const move = (e) => {
      if (e.pointerId !== id) return;
      let dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) { dx *= R / d; dy *= R / d; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.g.input.joy.x = dx / R; this.g.input.joy.z = -dy / R;
    };
    const end = (e) => { if (e.pointerId !== id) return; id = null; knob.style.transform = ''; this.g.input.joy.x = 0; this.g.input.joy.z = 0; };
    joy.addEventListener('pointermove', move);
    joy.addEventListener('pointerup', end);
    joy.addEventListener('pointercancel', end);
  }

  updateExplore() {
    const s = this.s, p = this.sim.player;
    const out = !inFarm(Math.floor(p.x), Math.floor(p.z));
    const st = `${out}|${zoneOpen(s, 'manigua')}|${zoneOpen(s, 'batey')}`;
    if (st !== this.exploreState) {
      this.exploreState = st;
      $('#btn-home').classList.toggle('hidden', !out);
      $('#btn-manigua').classList.toggle('hidden', out || !zoneOpen(s, 'manigua'));
      $('#btn-batey').classList.toggle('hidden', out || !zoneOpen(s, 'batey'));
    }
    // avisos de cada zona nueva (una sola vez, cuando no hay ventana abierta)
    if (!s.started && !this.g.started) return;
    if (!$('#modal-wrap').classList.contains('hidden') || this.sheet) return;
    if (performance.now() < (this.hintAt || 0)) return;
    const hint = (k, cond, text) => { if (!s.hints[k] && cond) { s.hints[k] = 1; this.toast(text); this.hintAt = performance.now() + 4500; return true; } return false; };
    hint('manigua', zoneOpen(s, 'manigua'), '¡Se abrió la manigua! Toca «Manigua» para buscar madera, frutas y animales.')
      || hint('wood', s.res.madera > 0 && s.level < 12, 'La madera se guarda en el bohío. Sirve para construir corrales y casas.')
      || hint('carry', s.carry.length > 0, 'Llévalo a la finca: toca «Volver a la finca» y se entrega solo.')
      || hint('lenador', s.level >= WORKERS.lenador.level, `${WORKERS.lenador.who}, el leñador, ya se puede contratar: tumba árboles por ti.`)
      || hint('batey', zoneOpen(s, 'batey'), '¡Se abrió el batey! Construye casas para tener más trabajadores (Terreno y obras).');
  }
  update(dt) {
    // toasts
    for (let i = this.toasts.length - 1; i >= 0; i--) {
      const t = this.toasts[i];
      t.life -= dt;
      if (t.life < 0.3) t.el.style.opacity = Math.max(0, t.life / 0.3);
      if (t.life <= 0) { t.el.remove(); this.toasts.splice(i, 1); }
    }
    // flotantes
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i];
      f.life -= dt; f.y += dt * 0.9;
      const p = this.g.project(f.x, f.y, f.z);
      f.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      f.el.style.opacity = Math.min(1, f.life * 2);
      if (f.life <= 0) { f.el.remove(); this.floaters.splice(i, 1); }
    }
    this.updateLabels();
    this.updateExplore();
    this.updateTutorial();
    this.updateFF();
    // botón Usar contextual
    const use = $('#use');
    const n = this.sim.nearestUse();
    const show = (this.isTouch || this.s.settings.joystick) && !!n;
    use.classList.toggle('hidden', !show);
    if (n && use.textContent !== n.label) use.textContent = n.label;
    if (this.sheet && /camión|fogón|trabajador|·/i.test(this.sheet.title)) {
      this.sheetTick = (this.sheetTick || 0) + dt;
      if (this.sheetTick > 0.5) { this.sheetTick = 0; this.refreshSheet(); }
    }
  }
}
export { LEVEL_XP };
