// Interfaz DOM: HUD, barra inferior, hojas (Tienda, Terreno, Canasta, Camión, Fogón, Ajustes), tutorial, etiquetas del mundo.
import { ICON } from './icons.js';
import {
  ITEMS, CROPS, CROP_ORDER, RECIPES, PRICES, WORKERS, WORKER_ORDER, PARCELS, BUILDINGS, TRUCK_SPOT, TRUCK_CAP,
  SELLABLE, xpForLevel, EGG_INTERVAL, LEVEL_XP,
} from './data.js';
import { storageCap, invCount, chickenCap, now } from './state.js';
import { fmtTime, fmtClock } from './sim.js';

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
  if (level === 2) out.push('El fogón (cocina)', 'Almacén más grande');
  if (level === 3) out.push('Ampliar gallinero');
  if (level === 4) out.push('Abono');
  if (level === 5) out.push('Almacén grande');
  return out;
}

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
        <span class="grow"></span>
        <button class="round" id="btn-full" data-act="fullscreen" aria-label="Pantalla completa">${ICON.full}</button>
        <button class="round" data-act="settings" aria-label="Ajustes">${ICON.gear}</button>
      </div>
      <div class="toasts" id="toasts" aria-live="polite"></div>
      <div class="guide hidden" id="guide">
        <div class="guide-step" id="guide-step">1/6</div>
        <div class="guide-text" id="guide-text"></div>
        <button class="guide-skip" data-act="skiptut">Saltar</button>
      </div>
      <div class="bottom">
        <button class="big" data-act="shop">${ICON.shop}<span>Tienda</span></button>
        <button class="big" data-act="land">${ICON.land}<span>Terreno</span></button>
        <button class="big seedsel" data-act="seed" id="seedsel">${ICON.seed}<span id="seedname">Tomate</span><em id="seedcount">2</em></button>
        <button class="big small" data-act="center" aria-label="Centrar en el guajiro">${ICON.center}<span>Centrar</span></button>
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
    const d = document.documentElement;
    return !!(d.requestFullscreen || d.webkitRequestFullscreen) && !(window.navigator.standalone);
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
      case 'inventory': return this.openInventory();
      case 'settings': return this.openSettings();
      case 'levelinfo': return this.openLevel();
      case 'fullscreen': return this.toggleFullscreen();
      case 'center': this.g.rig.recenter(); this.g.rig.goalDist = Math.min(this.g.rig.goalDist, 22); return;
      case 'seed': return this.cycleSeed();
      case 'use': sim.use(); return;
      case 'truckinfo': this.g.commandTarget({ kind: 'truck' }); return;
      case 'close': return this.closeSheet();
      case 'skiptut': this.s.tutorialDone = true; this.updateTutorial(); return;
      case 'buy': if (sim.buy(d.id, +(d.qty || 1))) { this.g.tut('buy'); this.refreshSheet(); } else this.refreshSheet(); return;
      case 'parcel': if (sim.buyParcel(d.id)) { this.g.onLandChanged(); this.closeSheet(); } return;
      case 'deliver': if (sim.deliverOrder()) this.closeSheet(); return;
      case 'sell': sim.sellLoose(d.item, d.qty === 'all' ? 999 : +d.qty); this.refreshSheet(); return;
      case 'sendtruck': sim.sendTruck(); this.closeSheet(); return;
      case 'cook': if (sim.startRecipe(d.id)) this.closeSheet(); else this.refreshSheet(); return;
      case 'collectk': sim.collectKitchen(); this.closeSheet(); return;
      case 'toggle': this.s.settings[d.key] = !this.s.settings[d.key]; this.applySettings(); this.refreshSheet(); return;
      case 'reset': return this.confirmReset();
      case 'reset-yes': this.g.resetGame(); return;
      case 'modal-close': $('#modal-wrap').classList.add('hidden'); return;
      case 'selseed': this.s.selectedSeed = d.id; this.refreshHud(); this.closeSheet(); return;
      default:
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

  priceBtn(price, { act = 'buy', id, qty, disabled, lockLevel, label } = {}) {
    if (lockLevel) return `<button class="btn locked" disabled>Nivel ${lockLevel}</button>`;
    const poor = this.s.money < price;
    return `<button class="btn ${poor ? 'poor' : ''}" data-act="${act}" data-id="${id}" ${qty ? `data-qty="${qty}"` : ''} ${disabled || poor ? 'disabled' : ''}>${label || ''}${ICON.coin}${price}</button>`;
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
          <div class="row-btns">${this.priceBtn(cr.seed, { id: c, qty: 1, lockLevel: lock, label: '1 · ' })}${lock ? '' : this.priceBtn(cr.seed * 5, { id: c, qty: 5, label: '5 · ' })}</div></div>`;
      }
      out += '<h3>Animales y mejoras</h3>';
      const full = s.chickens.length >= chickenCap(s);
      out += `<div class="row"><div class="row-ico">${ICON.hen}</div><div class="row-main"><b>Gallina</b><small>${s.chickens.length}/${chickenCap(s)} en el corral · un huevo cada ~${EGG_INTERVAL} s</small></div>
        ${full ? '<button class="btn locked" disabled>Lleno</button>' : this.priceBtn(sim.chickenPrice(), { id: 'chicken' })}</div>`;
      const up = (id, name, detail, price, lvl, done) => `<div class="row ${s.level < lvl ? 'dim' : ''}"><div class="row-ico">${ICON.up}</div><div class="row-main"><b>${name}</b><small>${detail}</small></div>
        ${done ? '<button class="btn locked" disabled>Listo</button>' : this.priceBtn(price, { id, lockLevel: s.level < lvl ? lvl : 0 })}</div>`;
      const stLvl = s.upgrades.storage;
      out += up('storage', stLvl === 0 ? 'Almacén más grande' : 'Almacén grande', `Caben ${[40, 80, 80][stLvl]} cosas (ahora ${storageCap(s)}).`, PRICES.storage[Math.min(stLvl, 1)], [2, 5][Math.min(stLvl, 1)], stLvl >= 2);
      out += up('coop', 'Ampliar gallinero', 'Caben 8 gallinas en vez de 4.', PRICES.coop, 3, s.upgrades.coop);
      out += up('abono', 'Abono', 'Todo crece un 20 % más rápido.', PRICES.abono, 4, s.upgrades.abono);
      out += '<h3>Trabajadores</h3>';
      for (const k of WORKER_ORDER) {
        const w = WORKERS[k], has = s.workers.some((x) => x.role === k);
        out += `<div class="row ${s.level < w.level ? 'dim' : ''}"><div class="row-ico">${ICON.worker}</div><div class="row-main"><b>${w.name}</b><small>${w.detail}</small></div>
          ${has ? '<button class="btn locked" disabled>En la finca</button>' : this.priceBtn(w.price, { id: k, lockLevel: s.level < w.level ? w.level : 0 })}</div>`;
      }
      return out;
    });
  }
  openLand() {
    this.openSheet('Terreno', () => {
      const s = this.s;
      return '<p class="note">Compra tierra para tener más canteros. Cada pedazo trae palmas y sorpresas.</p>' + PARCELS.map((p) => {
        const owned = s.parcels.includes(p.id), lock = s.level < p.level ? p.level : 0;
        return `<div class="row ${lock ? 'dim' : ''}"><div class="row-ico">${ICON.land}</div><div class="row-main"><b>${p.name}</b><small>${p.blurb} ${p.plots.length} canteros.</small></div>
          ${owned ? '<button class="btn locked" disabled>Tuyo</button>' : this.priceBtn(p.price, { act: 'parcel', id: p.id, lockLevel: lock })}</div>`;
      }).join('');
    });
  }
  openInventory() {
    this.openSheet('La canasta', () => {
      const s = this.s;
      let out = `<p class="note">Llevas ${invCount(s)} de ${storageCap(s)}. Vende en el camión.</p><div class="grid">`;
      for (const k of SELLABLE) out += `<div class="cell">${ICON[k]}<b>${s.inv[k]}</b><small>${ITEMS[k].plural}</small></div>`;
      out += '</div><h3>Semillas</h3><div class="grid">';
      for (const c of CROP_ORDER) out += `<div class="cell">${ICON[c]}<b>${s.seeds[c]}</b><small>${CROPS[c].name}</small></div>`;
      return out + '</div>';
    });
  }
  openTruck() {
    this.openSheet('El camión de acopio', () => {
      const s = this.s, sim = this.sim, o = s.truck.order;
      if (!sim.truckParked()) return `<p class="note">El camión anda por el pueblo. Vuelve en ${fmtClock(sim.truckRemaining())}.</p>`;
      let out = '<div class="order"><h3>Pedido del pueblo</h3><div class="order-items">';
      for (const [k, q] of Object.entries(o.items)) {
        const ok = s.inv[k] >= q;
        out += `<div class="oi ${ok ? 'ok' : ''}">${ICON[k]}<b>${Math.min(s.inv[k], q)}/${q}</b><small>${ITEMS[k].plural}</small></div>`;
      }
      out += `</div><div class="order-foot"><span>Paga ${ICON.coin}<b>${o.reward}</b> · ${ICON.xp}<b>${o.xp}</b> XP</span>
        <button class="btn primary" data-act="deliver" ${sim.canDeliver() ? '' : 'disabled'}>Entregar</button></div></div>`;
      const load = Object.values(s.truck.cargo).reduce((a, b) => a + b, 0);
      out += `<h3>Venta suelta <small>(${load}/${TRUCK_CAP} en el camión)</small></h3>`;
      let any = false;
      for (const k of SELLABLE) {
        if (!s.inv[k]) continue;
        any = true;
        out += `<div class="row"><div class="row-ico">${ICON[k]}</div><div class="row-main"><b>${ITEMS[k].plural}: ${s.inv[k]}</b><small>${ITEMS[k].sell} pesos cada uno</small></div>
          <div class="row-btns"><button class="btn" data-act="sell" data-item="${k}" data-qty="1">Cargar 1</button><button class="btn" data-act="sell" data-item="${k}" data-qty="all">Todo</button></div></div>`;
      }
      if (!any) out += '<p class="note">No tienes nada para cargar. Recoge huevos o cosecha.</p>';
      out += `<button class="btn wide" data-act="sendtruck">¡Arranca! (trae otro pedido)</button>`;
      return out;
    });
  }
  openKitchen() {
    this.openSheet('El fogón', () => {
      const s = this.s, k = s.kitchen;
      if (k.ready) return `<p class="note">¡Ya está! Recoge el ${ITEMS[k.ready].name.toLowerCase()}.</p><button class="btn primary wide" data-act="collectk">Recoger</button>`;
      if (k.recipe) return `<p class="note">Cocinando ${RECIPES[k.recipe].name.toLowerCase()}… listo en ${fmtClock(RECIPES[k.recipe].time - (now() - k.at))}.</p>`;
      return Object.entries(RECIPES).map(([id, r]) => {
        const lock = s.level < r.level;
        const need = Object.entries(r.needs).map(([i, q]) => `${q} ${ITEMS[i].plural.toLowerCase()} (tienes ${s.inv[i]})`).join(', ');
        const can = !lock && Object.entries(r.needs).every(([i, q]) => s.inv[i] >= q);
        return `<div class="row ${lock ? 'dim' : ''}"><div class="row-ico">${ICON[r.out]}</div><div class="row-main"><b>${r.name}</b><small>${need} · ${fmtTime(r.time)} · se vende a ${ITEMS[r.out].sell}</small></div>
          ${lock ? `<button class="btn locked" disabled>Nivel ${r.level}</button>` : `<button class="btn" data-act="cook" data-id="${id}" ${can ? '' : 'disabled'}>Cocinar</button>`}</div>`;
      }).join('');
    });
  }
  openSettings() {
    this.openSheet('Ajustes', () => {
      const st = this.s.settings;
      const tg = (key, label, icon) => `<div class="row"><div class="row-ico">${icon}</div><div class="row-main"><b>${label}</b></div>
        <button class="switch ${st[key] ? 'on' : ''}" data-act="toggle" data-key="${key}" role="switch" aria-checked="${!!st[key]}"><i></i></button></div>`;
      let out = tg('music', 'Música guajira', ICON.music) + tg('sfx', 'Efectos de sonido', ICON.sound) + tg('joystick', 'Joystick en pantalla', ICON.center);
      if (this.fsSupported()) out += `<div class="row"><div class="row-ico">${ICON.full}</div><div class="row-main"><b>Pantalla completa</b></div><button class="btn" data-act="fullscreen">${this.isFullscreen() ? 'Salir' : 'Activar'}</button></div>`;
      else out += '<p class="note">En iPhone: Compartir → “Añadir a pantalla de inicio” para jugar a pantalla completa.</p>';
      out += `<p class="note">Controles: toca el suelo para caminar, toca huevos, canteros, el camión o el fogón para usarlos. Arrastra para mover la vista y pellizca (o usa la rueda) para acercar o alejar.</p>`;
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
    if (L.html !== html) { L.el.innerHTML = html; L.html = html; }
    L.x = x; L.y = y; L.z = z; L.seen = true;
  }
  updateLabels() {
    const s = this.s, sim = this.sim;
    for (const L of this.labels.values()) L.seen = false;
    // camión
    const tp = this.g.world.truckPose(0);
    if (tp.visible && sim.truckParked()) {
      const ready = sim.canDeliver();
      const items = Object.entries(s.truck.order.items).map(([k, q]) => `${ICON[k]}${q}`).join(' ');
      this.label('truck', tp.x, 2.2, tp.z, `<span class="lt">Pedido</span>${items}<span class="${ready ? 'go' : ''}">${ready ? '¡Listo!' : ''}</span>`, ready ? 'ready' : '', 'truckinfo');
    } else if (!sim.truckParked()) this.label('truck', TRUCK_SPOT.x, 1.0, TRUCK_SPOT.z, `${ICON.truck} Vuelve en ${fmtClock(sim.truckRemaining())}`, 'muted');
    // fogón
    const K = BUILDINGS.kitchen;
    if (!sim.kitchenOpen()) this.label('kitchen', K.x + 1, 2.6, K.z + 1, 'Fogón · nivel 2', 'muted');
    else if (s.kitchen.ready) this.label('kitchen', K.x + 1, 2.6, K.z + 1, `${ICON[s.kitchen.ready]} ¡Listo!`, 'ready');
    else if (s.kitchen.recipe) this.label('kitchen', K.x + 1, 2.6, K.z + 1, `${ICON[RECIPES[s.kitchen.recipe].out]} ${fmtClock(RECIPES[s.kitchen.recipe].time - (now() - s.kitchen.at))}`);
    else this.label('kitchen', K.x + 1, 2.6, K.z + 1, 'Fogón libre', 'muted');
    // terrenos a la venta
    for (const p of PARCELS) {
      if (s.parcels.includes(p.id)) continue;
      const [cx, cz] = this.g.world.parcelCenter(p);
      const lock = s.level < p.level;
      this.label(`parcel-${p.id}`, cx, 1.2, cz, lock ? `Se vende · nivel ${p.level}` : `Se vende ${ICON.coin}${p.price}`, lock ? 'muted' : 'sale', 'land');
    }
    // temporizador de la mata seleccionada
    if (this.focusPlot && now() < this.focusUntil && this.focusPlot.crop) {
      const p = this.focusPlot, rem = p.at + p.dur - now();
      if (rem > 0) this.label('focus', p.x + 0.5, 1.1, p.z + 0.5, `${ICON[p.crop]} ${fmtClock(rem)}${p.watered ? ` ${ICON.water}` : ''}`);
    }
    const cam = this.g.rig.camera;
    const W = window.innerWidth, H = window.innerHeight;
    for (const [k, L] of this.labels) {
      if (!L.seen) { L.el.remove(); this.labels.delete(k); continue; }
      const p = this.g.project(L.x, L.y, L.z);
      L.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
      L.el.style.visibility = p.ok && p.x > -50 && p.x < W + 50 && p.y > 0 && p.y < H + 50 ? 'visible' : 'hidden';
    }
  }
  focus(p) { this.focusPlot = p; this.focusUntil = now() + 4; }

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
      case 1: return { text: 'El camión de acopio quiere 3 huevos. Tócalo y pulsa “Entregar”.', at: [TRUCK_SPOT.x, 2.6, TRUCK_SPOT.z] };
      case 2:
        if (!anySeeds) return { text: 'Compra semillas de tomate en la Tienda.', dom: '[data-act="shop"]' };
        return { text: 'Toca un cantero de tierra colorada para sembrar tomates.', at: empty ? [empty.x + 0.5, 0.4, empty.z + 0.5] : null };
      case 3:
        if (ripe) { s.tutorial = 4; return this.tutorialSteps(); }
        return { text: `Está creciendo (${growing ? fmtClock(growing.at + growing.dur - t) : '…'}). Toca la mata para regarla y que crezca más rápido. Mientras, recoge huevos.`, at: growing ? [growing.x + 0.5, 0.6, growing.z + 0.5] : null };
      case 4:
        if (!ripe) return { text: 'Espera a que brille: cuando la mata tiene una estrellita dorada, está lista.', at: growing ? [growing.x + 0.5, 0.6, growing.z + 0.5] : null };
        return { text: '¡Tomates listos! Toca la mata (o camina encima) para cosecharlos.', at: [ripe.x + 0.5, 0.9, ripe.z + 0.5] };
      case 5: return { text: 'Vende tus cosas en el camión, sube de nivel y compra tierra en “Terreno”. ¡A levantar la finca!', dom: '[data-act="land"]', done: true };
      default: return null;
    }
  }
  updateTutorial() {
    const s = this.s, g = $('#guide'), arrow = $('#tut-arrow');
    document.querySelectorAll('.pulse').forEach((e) => e.classList.remove('pulse'));
    if (s.tutorialDone || !this.g.started) { g.classList.add('hidden'); arrow.classList.add('hidden'); return; }
    // avanzar según el estado real
    const st = s.stats;
    if (s.tutorial === 0 && (s.inv.egg >= 3 || st.eggs >= 3 || st.sold > 0)) s.tutorial = 1;
    if (s.tutorial === 1 && st.sold > 0) s.tutorial = 2;
    if (s.tutorial === 2 && s.plots.some((p) => p.crop)) s.tutorial = 3;
    if (s.tutorial === 4 && st.harvests > 0) s.tutorial = 5;
    if (s.tutorial >= 5 && (s.parcels.length > 0 || s.level >= 3)) { s.tutorialDone = true; }
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
    this.updateTutorial();
    // botón Usar contextual
    const use = $('#use');
    const n = this.sim.nearestUse();
    const show = (this.isTouch || this.s.settings.joystick) && !!n;
    use.classList.toggle('hidden', !show);
    if (n && use.textContent !== n.label) use.textContent = n.label;
    if (this.sheet && /camión|fogón/i.test(this.sheet.title)) {
      this.sheetTick = (this.sheetTick || 0) + dt;
      if (this.sheetTick > 0.5) { this.sheetTick = 0; this.refreshSheet(); }
    }
  }
}
export { LEVEL_XP };
