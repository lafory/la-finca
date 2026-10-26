// UI de la granja grande: filas en «Terreno y obras» (gallinero, surcos, potrero) y la pastilla del modo arar.
import { ICON } from '../icons.js';
import { STRUCTURES } from '../data.js';
import { chickenCap } from '../state.js';
import { COOP_LEVELS, COOP_MAX, coopLevel, VACAS_LEVELS, VACAS_MAX, PLOW } from './data.js';

export function landSection(ui) {
  const s = ui.s, sim = ui.sim, g = s.ext.granja || {};
  let out = '<h3>Granja</h3>';
  // gallinero
  const cl = coopLevel(s), L = COOP_LEVELS[cl], N = COOP_LEVELS[cl + 1];
  out += `<div class="row ${cl > 1 ? 'sel' : ''}"><div class="row-ico">${ICON.hen}</div><div class="row-main"><b>${L.name} · nivel ${cl}/${COOP_MAX}</b><small>${s.chickens.length}/${chickenCap(s)} gallinas · ${L.nests} nidales.${N ? ` Siguiente: ${N.name}. ${N.detail}` : ' ¡El gallinero más grande!'}</small></div>
    ${N ? ui.priceBtn(N.price, { act: 'granja-coop', id: 'coop', lockLevel: s.level < N.level ? N.level : 0, wood: N.madera }) : `<button class="btn" data-act="granja-look" data-id="coop">Ver</button>`}</div>`;
  // surcos
  out += `<div class="row"><div class="row-ico">${ICON.seed}</div><div class="row-main"><b>Arar surcos</b><small>Abre campos de surcos en tu tierra libre: toca y ara de 1×1 a 4×4 de una vez. ${PLOW.price} pesos por cantero. Arados: ${g.plowed || 0}.</small></div>
    <button class="btn primary" data-act="granja-plow">Arar</button></div>`;
  // potrero
  const v = STRUCTURES.vacas;
  if (v && s.built.vacas) {
    const vl = g.vacas || 1, VL = VACAS_LEVELS[vl], VN = VACAS_LEVELS[vl + 1];
    out += `<div class="row ${vl > 1 ? 'sel' : ''}"><div class="row-ico">${ICON.leche}</div><div class="row-main"><b>${VL.name} · nivel ${vl}/${VACAS_MAX}</b><small>${VL.n} vacas · ${VL.qty} cantinas por ordeño.${VN ? ` Siguiente: ${VN.name}, ${VN.detail}` : ' ¡El potrero más grande!'}</small></div>
      ${VN ? ui.priceBtn(VN.price, { act: 'granja-vacas', id: 'vacas', lockLevel: s.level < VN.level ? VN.level : 0, wood: VN.madera }) : `<button class="btn" data-act="goBuild" data-id="vacas">Ver</button>`}</div>`;
  } else if (v) out += `<p class="note">Cuando construyas el corral de vacas (nivel ${v.level}) lo podrás ampliar a potrero, con más vacas y más leche.</p>`;
  return out;
}

export class GranjaUI {
  constructor(game) {
    this.g = game;
    const el = document.createElement('div');
    el.className = 'plowpill hidden'; el.id = 'plowpill';
    game.ui.root.appendChild(el);
    this.el = el;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-plow]');
      if (!b) return;
      e.stopPropagation();
      const v = b.dataset.plow;
      if (v === 'done') this.stop();
      else { game.granja.plow.n = +v; this.refreshPill(); }
    });
  }
  start() {
    this.g.ui.closeSheet();
    this.g.granja.plow.on = true;
    this.refreshPill();
    this.g.ui.toast('Toca la tierra libre para arar surcos. Arrastra para mover la vista.');
  }
  stop() { this.g.granja.plow.on = false; this.refreshPill(); }
  refreshPill() {
    const p = this.g.granja.plow, s = this.g.sim.s;
    this.el.classList.toggle('hidden', !p.on);
    if (!p.on) return;
    this.el.innerHTML = `<b>${ICON.seed}Arar surcos</b><span class="pp-sizes">${PLOW.sizes.map((n) => `<button class="btn ${p.n === n ? 'primary' : ''}" data-plow="${n}">${n}×${n}</button>`).join('')}</span><small>${PLOW.price} pesos c/u · tienes ${s.money}</small><button class="btn" data-plow="done">Listo</button>`;
  }
}

export function act(ui, a) {
  const sim = ui.sim, g = ui.g;
  if (a === 'granja-coop') { if (sim.upgradeCoop()) { ui.closeSheet(); g.granjaLook('coop'); } else ui.refreshSheet(); return; }
  if (a === 'granja-vacas') { if (sim.upgradeVacas()) { ui.closeSheet(); g.granjaLook('vacas'); } else ui.refreshSheet(); return; }
  if (a === 'granja-plow') return g.granjaUI.start();
  if (a === 'granja-look') { ui.closeSheet(); g.granjaLook('coop'); }
}
