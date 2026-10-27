// Fincas de provincia GRANDES: cada finca regional es una copia de la finca principal (mismo motor) con lo de su región.
// Cómo funciona:
//  · La partida guardada sigue siendo la de la finca principal (s). Cada finca de provincia vive completa en
//    s.ext.mambi.farms[ciudad].full (tierra, canteros, animales, obras, trabajadores, canasta, fila de camiones…).
//  · Pesos, XP, nivel, recursos (madera, víveres) y ajustes son compartidos: en la provincia se leen/escriben
//    directo en la partida principal (propiedades enlazadas, no copias).
//  · Al cambiar de finca se guarda y se recarga la página con la otra finca: el mundo 3D se arma de cero, sin fugas
//    de memoria. Antes de crear la partida, applyProfile() cambia las tablas (cultivos, recetas, obras) a las de la región.
import { CROPS, CROP_ORDER, RECIPES, ITEMS, SELLABLE, STRUCTURES, PARCELS, START_PLOTS, SAVE_KEY } from '../data.js';
import { newGame, normalizeState, save, now, SAVE_HOOK } from '../state.js';
import { ZONE_FILTER, ZONES } from '../zones.js';
import { registerItem, registerMigration, registerGameModule, registerAct, registerSimModule, SIM_MODULES, GAME_MODULES, STRUCT_MODELS, FARM_HOOKS } from '../registry.js';
import { Sim } from '../sim.js';
import { World, ANIMAL_GEOS } from '../world.js';
import { CROP_GEOS } from '../models.js';
import { ICON } from '../icons.js';
import { MambiUI } from '../mambi/ui.js';
import { CITY_BY_ID, FARM_LEVELS } from '../mambi/data.js';
import { TYPES, typeOf, seedCost, buildCost } from '../mambi/regional-data.js';
import { PV_CROPS, PV_ITEMS, PROFILES, CITY_PROFILE, profileOf, PV_ZONES, PV_START_PARCELS } from './data.js';
import { CROP_MODELS, ANIMAL_MODELS, STRUCT_GEOS, landmarkGeo } from './models.js';
import * as THREE from 'three';

const AUTO_KEY = 'lafinca-viaje'; // al recargar para cambiar de finca, se entra sin la pantalla de título
const rt = () => Date.now() / 1000;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const k1 = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${Math.floor(n)}`);

// ---------------------------------------------------------------- registro (siempre, también en la principal)
for (const [id, c] of Object.entries(PV_CROPS)) if (!CROPS[id]) CROPS[id] = { ...c };
for (const [id, it] of Object.entries(PV_ITEMS)) if (!ITEMS[id]) registerItem(id, it, { sellable: false });
for (const [id, f] of Object.entries(CROP_MODELS)) CROP_GEOS[id] = f;
Object.assign(ANIMAL_GEOS, ANIMAL_MODELS);
const svg = (body) => `<svg viewBox="0 0 32 32" aria-hidden="true" class="ico">${body}</svg>`;
Object.assign(ICON, {
  arroz: ICON.arroz || svg('<path d="M16 29V10" stroke="#6f8a3a" stroke-width="2"/><g fill="#e4c860" stroke="#8a7020" stroke-width="1"><ellipse cx="12" cy="9" rx="2" ry="3.4" transform="rotate(-25 12 9)"/><ellipse cx="20" cy="11" rx="2" ry="3.4" transform="rotate(25 20 11)"/><ellipse cx="12" cy="16" rx="2" ry="3.4" transform="rotate(-25 12 16)"/><ellipse cx="20" cy="18" rx="2" ry="3.4" transform="rotate(25 20 18)"/><ellipse cx="16" cy="5" rx="2" ry="3.4"/></g>'),
  cacao: ICON.cacao || svg('<ellipse cx="16" cy="16" rx="8" ry="12" fill="#d8862a" stroke="#7a4214" stroke-width="2"/><path d="M16 4v24M12 6q-2 10 0 20M20 6q2 10 0 20" stroke="#7a4214" stroke-width="1.3" fill="none"/>'),
  naranja: ICON.naranja || svg('<circle cx="16" cy="18" r="10" fill="#f09a20" stroke="#8a5210" stroke-width="2"/><path d="M16 8q3-5 8-4-2 5-8 4z" fill="#4f8a32"/><circle cx="12" cy="15" r="2" fill="#fff" opacity=".35"/>'),
  henequen: ICON.henequen || svg('<g fill="#6f9a8a" stroke="#3a5a4a" stroke-width="1.3"><path d="M16 28L6 6l12 18z"/><path d="M16 28L26 6 14 24z"/><path d="M16 28L16 3l2 22z"/><path d="M16 28L3 16l13 10z"/><path d="M16 28l13-12-13 10z"/></g>'),
  cocotero: ICON.cocotero || ICON.coco,
  potro: ICON.potro || ICON.horse,
  pescado: ICON.pescado || ICON.fish,
  sacoArroz: ICON.sacoArroz || svg('<path d="M8 8q8-4 16 0l2 18q-10 4-20 0z" fill="#e8dcb8" stroke="#8a7a50" stroke-width="2"/><path d="M11 6q5 3 10 0" stroke="#8a7a50" stroke-width="2" fill="none"/><text x="16" y="21" text-anchor="middle" font-size="8" font-weight="800" fill="#8a7020" font-family="sans-serif">ARROZ</text>'),
  arrozLeche: ICON.arrozLeche || svg('<path d="M5 14h22l-3 12H8z" fill="#f3ead6" stroke="#8a6a3a" stroke-width="2"/><ellipse cx="16" cy="14" rx="11" ry="3" fill="#fff8e8" stroke="#8a6a3a" stroke-width="1.5"/><circle cx="13" cy="13" r="1.2" fill="#b8742a"/><circle cx="19" cy="14" r="1.2" fill="#b8742a"/>'),
  quesoBlanco: ICON.quesoBlanco || svg('<path d="M4 20l12-10 12 10v6H4z" fill="#f6f0d8" stroke="#8a7a50" stroke-width="2"/><circle cx="12" cy="22" r="1.6" fill="#e0d4a8"/><circle cx="20" cy="21" r="1.2" fill="#e0d4a8"/>'),
  chocolate: ICON.chocolate || svg('<rect x="6" y="6" width="20" height="20" rx="2" fill="#5a2e14" stroke="#2e1408" stroke-width="2"/><path d="M6 13h20M6 19h20M13 6v20M19 6v20" stroke="#3a1a0a" stroke-width="1.5"/>'),
  chorote: ICON.chorote || svg('<path d="M8 8h16l-2 20H10z" fill="#7a3e1a" stroke="#3a1a0a" stroke-width="2"/><path d="M9 12h14" stroke="#c98e4a" stroke-width="1.5"/>'),
  cucurucho: ICON.cucurucho || svg('<path d="M16 30L6 6h20z" fill="#b8925a" stroke="#6b4a24" stroke-width="2"/><ellipse cx="16" cy="7" rx="10" ry="3" fill="#f3ead6" stroke="#6b4a24" stroke-width="1.5"/>'),
  cafeTostado: ICON.cafeTostado || svg('<path d="M8 8q8-4 16 0l2 18q-10 4-20 0z" fill="#c8b088" stroke="#6b4a2a" stroke-width="2"/><ellipse cx="13" cy="17" rx="2.5" ry="3.5" fill="#4a2a14"/><ellipse cx="19" cy="18" rx="2.5" ry="3.5" fill="#4a2a14"/>'),
  cafeColado: ICON.cafeColado || ICON.cafe,
  ronAnejo: ICON.ronAnejo || ICON.ron,
  dulceLeche: ICON.dulceLeche || svg('<path d="M8 10h16v16a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#c98e4a" stroke="#6b4a2a" stroke-width="2"/><rect x="7" y="6" width="18" height="5" rx="1" fill="#e8d9b5" stroke="#6b4a2a" stroke-width="1.5"/>'),
  jugo: ICON.jugo || svg('<path d="M8 7h16l-2 21H10z" fill="#f0a830" stroke="#8a5210" stroke-width="2"/><circle cx="22" cy="8" r="4" fill="#f09a20" stroke="#8a5210" stroke-width="1.5"/>'),
  pescadoSalado: ICON.pescadoSalado || svg('<rect x="7" y="8" width="18" height="20" rx="3" fill="#8a6a45" stroke="#4a3018" stroke-width="2"/><path d="M7 14h18M7 22h18" stroke="#4a3018" stroke-width="1.5"/><path d="M10 6c3-3 8-3 11 0-3 3-8 3-11 0z" fill="#9ab8c8" stroke="#2f5a7a" stroke-width="1.3"/>'),
  soga: ICON.soga || svg('<circle cx="16" cy="16" r="11" fill="#e0d0a0" stroke="#8a7040" stroke-width="2"/><circle cx="16" cy="16" r="7" fill="none" stroke="#8a7040" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="none" stroke="#8a7040" stroke-width="2"/>'),
  purosVuelta: ICON.purosVuelta || ICON.puros,
});

// ---------------------------------------------------------------- perfil de provincia (antes de crear la partida)
let ACTIVE = null; // { city, prof, root }
export const activeFarm = () => ACTIVE;
const STRUCT_CACHE = new Map();
export function applyProfile(prof) {
  CROP_ORDER.splice(0, CROP_ORDER.length, ...prof.crops);
  for (const k of Object.keys(RECIPES)) delete RECIPES[k];
  for (const [k, r] of Object.entries(prof.recipes)) RECIPES[k] = { ...r, needs: { ...r.needs }, where: [...r.where] };
  for (const [id, o] of Object.entries(prof.slots || {})) {
    const st = STRUCTURES[id];
    if (!st) continue;
    const { model, produce, effect, ...rest } = o;
    Object.assign(st, rest);
    if (produce) st.produce = { ...produce };
    if (effect) st.effect = { ...effect };
    if (model && STRUCT_GEOS[model]) STRUCT_MODELS[id] = () => { if (!STRUCT_CACHE.has(model)) STRUCT_CACHE.set(model, STRUCT_GEOS[model]()); return STRUCT_CACHE.get(model); };
  }
  if (prof.houseDiscount) for (const st of Object.values(STRUCTURES)) {
    if (st.kind !== 'house') continue;
    st.price = Math.round(st.price * (1 - prof.houseDiscount));
    for (const u of [st.upgrade, st.upgrade2]) if (u) u.price = Math.round(u.price * (1 - prof.houseDiscount));
  }
  // lo que se vende en los camiones de esta finca
  const sell = new Set([...prof.crops.map((c) => CROPS[c].item), ...Object.values(prof.recipes).map((r) => r.out)]);
  for (const st of Object.values(STRUCTURES)) if (st.kind === 'animal' && st.produce) sell.add(st.produce.item);
  for (const k of sell) if (ITEMS[k] && !SELLABLE.includes(k)) SELLABLE.push(k);
  // sin campos grandes ni central (son de la finca principal)
  ZONE_FILTER.fn = (id) => PV_ZONES.includes(id);
  for (const L of [SIM_MODULES, GAME_MODULES]) for (let i = L.length - 1; i >= 0; i--) if (L[i].mainOnly) L.splice(i, 1);
  FARM_HOOKS.demand = (s, w) => { for (const [k, m] of Object.entries(prof.demand || {})) if (w[k]) w[k] *= m; };
  // colores de la región: el suelo pintado se tiñe
  const bs = World.prototype.buildStatic;
  World.prototype.buildStatic = function (...a) { const r = bs.apply(this, a); try { this.groundMesh?.material.color.set(prof.tint); } catch { /* sin suelo */ } return r; };
}

// Estado nuevo de una finca de provincia: la tierra inicial + el cantero del este, gallinas, semillas de la región
function freshFarm(root, city, prof, pid) {
  const b = newGame();
  b.city = city; b.prov = pid;
  b.seeds = { ...Object.fromEntries(Object.keys(CROPS).map((k) => [k, 0])), ...prof.seeds };
  b.selectedSeed = prof.crops[0];
  b.tutorial = 99; b.tutorialDone = true; b.ffUsed = !!root.ffUsed; b.hireHint = true;
  b.hints = { ...(root.hints || {}) };
  b.parcels = [...PV_START_PARCELS];
  const plotsAt = new Set(b.plots.map((p) => `${p.x},${p.z}`));
  for (const id of PV_START_PARCELS) { const p = PARCELS.find((q) => q.id === id); for (const [x, z] of p?.plots || []) if (!plotsAt.has(`${x},${z}`)) b.plots.push({ x, z, crop: null, at: 0 }); }
  // dos canteros ya sembrados con lo típico, para que se vea la región desde el primer momento
  const t = now(), c0 = prof.crops[0];
  b.plots.slice(0, 4).forEach((p, i) => { p.crop = c0; p.at = t - CROPS[c0].grow * (0.3 + i * 0.25); p.dur = CROPS[c0].grow; });
  void START_PLOTS;
  return b;
}
const SHARED = ['money', 'xp', 'level', 'xpCurve', 'settings', 'res'];
function link(R, root) {
  for (const k of SHARED) { delete R[k]; Object.defineProperty(R, k, { get: () => root[k], set: (v) => { root[k] = v; }, enumerable: false, configurable: true }); }
  R.ext = R.ext && typeof R.ext === 'object' ? R.ext : {};
  for (const k of ['mambi', 'central']) { delete R.ext[k]; Object.defineProperty(R.ext, k, { get: () => root.ext[k], set: (v) => { root.ext[k] = v; }, enumerable: false, configurable: true }); }
  Object.defineProperty(R, '_root', { value: root, enumerable: false });
}
export function farmSummary(s) {
  return { parcels: s.parcels.length, plots: s.plots.length, sown: s.plots.filter((p) => p.crop).length, built: Object.keys(s.built || {}).length, workers: s.workers.length, hens: s.chickens.length, at: Math.floor(now()) };
}
// Guardar en una provincia = guardar la partida principal con esta finca dentro
SAVE_HOOK.fn = (s) => {
  const root = s._root;
  if (!root) return s;
  root.clockOffset = s.clockOffset;
  const f = root.ext?.mambi?.farms?.[s.city];
  if (f) { f.full = JSON.parse(JSON.stringify(s)); f.sum = farmSummary(s); }
  return root;
};

// Al arrancar: ¿el guajiro estaba en una finca de provincia? → partida de esa finca (o la principal si no se puede)
export function bootFarm(root) {
  const M = root?.ext?.mambi, city = M?.cur;
  if (!city) return { state: root };
  try {
    const f = M.farms?.[city], prof = profileOf(city);
    if (!f || !prof || !M.freed?.includes(city)) { delete M.cur; return { state: root }; }
    applyProfile(prof);
    const pid = CITY_PROFILE[city];
    const base = freshFarm(root, city, prof, pid);
    const d = f.full && typeof f.full === 'object' ? f.full : JSON.parse(JSON.stringify(base));
    d.city = city; d.prov = pid;
    const R = normalizeState(d, base);
    R.city = city; R.prov = pid; R.tutorialDone = true; R.tutorial = Math.max(R.tutorial || 0, 99);
    for (const k of Object.keys(CROPS)) if (R.seeds[k] == null) R.seeds[k] = 0;
    if (!CROPS[R.selectedSeed] || !CROP_ORDER.includes(R.selectedSeed)) R.selectedSeed = prof.crops[0];
    link(R, root);
    ACTIVE = { city, prof, pid, root };
    return { state: R, city, prof };
  } catch (e) {
    console.warn('[provincias] no se pudo abrir la finca; vuelvo a la principal', e);
    try { delete M.cur; localStorage.setItem(SAVE_KEY, JSON.stringify(root)); } catch { /* nada */ }
    location.reload();
    throw e;
  }
}

// ---------------------------------------------------------------- migración: fincas chiquitas viejas → finca grande
// Lo sembrado, lo construido y la tierra comprada se devuelven en pesos (a precio de costo), y la renta juntada también.
registerMigration((s) => {
  if (s.city) return; // solo en la partida principal
  const M = s.ext?.mambi;
  if (!M?.farms) return;
  let total = 0; const names = [];
  for (const [id, f] of Object.entries(M.farms)) {
    if (f.conv || !CITY_BY_ID[id]) continue;
    let refund = Math.floor(f.bank || 0);
    const T = TYPES[CITY_BY_ID[id].farm[0]];
    for (const c of Object.values(f.cells || {})) {
      if (c.k === 'p') refund += seedCost(id);
      else if (c.k === 'b') { const b = T?.build.find((q) => q.id === c.b); if (b) refund += buildCost(id, b); }
    }
    for (let l = 2; l <= Math.min(3, f.lvl || 1); l++) refund += Math.round(CITY_BY_ID[id].farm[1] * FARM_LEVELS[l].up);
    s.money = Math.max(0, Math.floor(+s.money || 0)) + refund;
    s.res ||= {}; s.res.viveres = (s.res.viveres || 0) + Math.floor(f.vbank || 0);
    f.cells = {}; f.bank = 0; f.vbank = 0; f.lvl = 1; f.conv = 1; f.full = null; f.sum = null;
    total += refund; names.push(CITY_BY_ID[id].name);
  }
  if (names.length) M.pvNote = { total: (M.pvNote?.total || 0) + total, names: [...(M.pvNote?.names || []), ...names] };
});

// ---------------------------------------------------------------- lógica (Sim)
const P = Sim.prototype;
const oBuy = P.mbBuyFarm;
P.mbBuyFarm = function (id) {
  const ok = oBuy.call(this, id);
  if (ok) { const f = this.mb().farms[id]; f.cells = {}; f.conv = 2; f.full = null; f.sum = null; f.lvl = 1; this.rgChanged?.(); }
  return ok;
};
const conv = (sim, id) => !!sim.mb().farms[id]?.conv;
for (const [name, val] of [['rgPlots', (f) => f.sum?.sown || 0], ['rgBuilt', (f) => f.sum?.built || 0]]) {
  const o = P[name];
  P[name] = function (id) { const f = this.mb().farms[id]; return f?.conv ? val(f) : o.call(this, id); };
}
const oHas = P.rgHas;
P.rgHas = function (id, bid) { return conv(this, id) ? false : oHas.call(this, id, bid); };
const oUpPrice = P.mbUpgradePrice;
P.mbUpgradePrice = function (id) { return conv(this, id) ? 0 : oUpPrice.call(this, id); };
// saqueo de una finca grande: se llevan el 30 % de lo que hay en el bohío (canasta) de esa finca
const oLoot = P.rgLoot;
P.rgLoot = function (id) {
  const f = this.mb().farms[id];
  if (!f?.conv) return oLoot ? oLoot.call(this, id) : 0;
  const st = this.s.city === id ? this.s : f.full;
  if (!st?.inv) return 0;
  let n = 0;
  for (const k of Object.keys(st.inv)) { const q = Math.floor((st.inv[k] || 0) * 0.3); if (q > 0) { st.inv[k] -= q; n += q; } }
  if (st === this.s) this.h.changed('inv');
  return n;
};
// saqueada hace poco (segundos que faltan) — solo en la finca de provincia activa
P.pvRaid = function () {
  if (!this.s.city) return 0;
  try { const c = this.cs?.().cities?.[this.s.city]; return c && c.raidUntil > rt() ? c.raidUntil - rt() : 0; } catch { return 0; }
};
const oTrucks = P.updateTrucks;
P.updateTrucks = function (dt) { if (this.pvRaid()) return; return oTrucks.call(this, dt); };
const oLoad = P.loadTruck;
P.loadTruck = function (...a) {
  if (this.pvRaid()) { this.h.toast(`Saquearon la finca: los camiones esperan a que se vaya la columna (${Math.ceil(this.pvRaid() / 60)} min).`); this.h.sfx('error'); return false; }
  return oLoad.apply(this, a);
};
const oWorker = P.updateWorker;
P.updateWorker = function (w, dt) { if (this.pvRaid()) { w.status = 'Escondido: saqueo del Régimen'; return; } return oWorker.call(this, w, dt); };
// durante el saqueo todo lo que produce se para (canteros, animales, fogones): se corre el reloj de cada cosa
registerSimModule({
  id: 'provincias',
  update(sim, dt) {
    if (!sim.s.city || !sim.pvRaid()) return;
    const s = sim.s;
    for (const p of s.plots) if (p.crop) p.at += dt;
    for (const [id, st] of Object.entries(STRUCTURES)) { const b = s.built[id]; if (b && st.kind === 'animal' && !b.ready) b.at += dt; }
    for (const key of sim.procKeys()) { const k = sim.proc(key); if (k?.recipe) k.at += dt; }
  },
});

// ---------------------------------------------------------------- mapa de la campaña: «Ir a la finca»
const MP = MambiUI.prototype;
MP.openVisit = function (id) { this.g.switchFarm?.(id); };
const oAct = MP.act;
MP.act = function (a, d) { if (a === 'mbvisit') return this.g.switchFarm?.(d.id); return oAct.call(this, a, d); };
const oRow = MP.farmRow;
MP.farmRow = function (id) {
  const sim = this.sim, c = CITY_BY_ID[id], f = sim.mb().farms[id], prof = profileOf(id);
  if (!prof) return oRow.call(this, id);
  const what = `${prof.crops.map((k) => CROPS[k].name.toLowerCase()).join(', ')}`;
  if (!f) {
    const why = sim.mbCanFarm(id);
    return `<div class="row ${why ? '' : 'sel'}" data-farm="${id}"><div class="row-ico">${ICON[prof.crops[0]] || ICON.field}</div><div class="row-main"><b>Fundar finca en ${esc(c.name)} · ${esc(prof.short)}</b><small>Cuesta ${c.farm[1].toLocaleString('es')} pesos. Una finca grande como la principal: ${esc(what)}. ${esc(prof.blurb)}${why ? `<span class="mb-why">${esc(why)}</span>` : ''}</small></div><button class="btn ${why ? 'poor' : 'primary'}" data-act="mbfarm" data-id="${id}" ${why ? 'disabled' : ''}>Fundar${ICON.coin}${k1(c.farm[1])}</button></div>`;
  }
  if (!f.conv) return oRow.call(this, id);
  const occ = !sim.mbFreed(id), raid = (() => { try { const cc = sim.cs?.().cities?.[id]; return cc && cc.raidUntil > rt(); } catch { return false; } })();
  const sm = f.sum, here = sim.s.city === id;
  const info = sm ? `${sm.parcels + 1} terrenos · ${sm.sown}/${sm.plots} canteros sembrados · ${sm.built} obras · ${sm.workers} trabajadores` : 'Recién fundada: tierra inicial, gallinas y semillas de la región.';
  const state = occ ? '<span class="mb-why">Ocupada por el Régimen: no se puede entrar hasta que recuperes la ciudad.</span>' : raid ? '<span class="mb-why">Saqueada hace poco: camiones y trabajadores parados un rato.</span>' : '';
  return `<div class="row ${occ ? 'dim' : here ? 'sel' : ''}" data-farm="${id}"><div class="row-ico">${ICON[prof.crops[0]] || ICON.field}</div><div class="row-main"><b>Finca de ${esc(c.name)} · ${esc(prof.short)}</b><small>${esc(info)}. ${esc(what)}.${state}</small></div>${here ? '<button class="btn" disabled>Estás aquí</button>' : `<button class="btn primary" data-act="mbvisit" data-id="${id}" ${occ ? 'disabled' : ''}>${ICON.home}Ir a la finca</button>`}</div>`;
};

// ---------------------------------------------------------------- juego: cambiar de finca, HUD, colores y paisaje
const STYLE = `
#pv-switch.prov{background:#fff0c4;border-color:#8a5a14}
#pv-switch span{max-width:50px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#pv-raid{position:absolute;left:50%;transform:translateX(-50%);top:calc(96px + var(--sat,0px));z-index:3;background:rgba(92,96,100,.92);color:#fff;border-radius:12px;padding:5px 12px;font:700 12px/1.25 inherit;text-align:center;max-width:calc(100% - 24px)}
#pv-raid.hidden{display:none}
#pv-travel{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(42,31,21,.86);color:#fff7e0;font:800 20px/1.3 inherit;text-align:center;padding:20px}
`;
function farmName(city) { return city ? `Finca de ${CITY_BY_ID[city].name}` : 'Finca principal'; }
registerAct('pvfarms', (ui) => ui.g.pvOpenFarms?.());
registerAct('pvgo', (ui, d) => ui.g.switchFarm?.(d.id || null));

registerGameModule({
  id: 'provincias',
  attach(game) {
    const A = ACTIVE;
    game.farmCity = A?.city || null;
    game.farmProfile = A?.prof || null;
    if (!document.getElementById('pv-style')) { const st = document.createElement('style'); st.id = 'pv-style'; st.textContent = STYLE; document.head.appendChild(st); }
    // botón «Fincas» en la columna de la izquierda (junto a Manigua, Batey y Campaña); en una provincia dice su ciudad
    const root = document.getElementById('ui');
    const btn = document.createElement('button');
    btn.id = 'pv-switch'; btn.dataset.act = 'pvfarms'; btn.className = `round cam hidden ${A ? 'prov' : ''}`;
    btn.setAttribute('aria-label', A ? `Finca de ${CITY_BY_ID[A.city].name}: cambiar de finca` : 'Cambiar de finca');
    btn.innerHTML = `${A ? ICON[A.prof.crops[0]] || ICON.home : ICON.home}<span>${esc(A ? CITY_BY_ID[A.city].name.replace('Santiago de Cuba', 'Santiago').replace('Sancti Spíritus', 'S. Spíritus').replace('Pinar del Río', 'Pinar') : 'Fincas')}</span>`;
    (document.getElementById('explore') || root).appendChild(btn);
    const raid = document.createElement('div'); raid.id = 'pv-raid'; raid.className = 'hidden'; root.appendChild(raid);
    game.pvEls = { btn, raid };
    game.switchFarm = (city) => switchFarm(game, city);
    game.pvOpenFarms = () => openFarms(game);
    if (A) decorate(game, A);
    const t = document.getElementById('start');
    if (A && t && !game.started) t.textContent = `Continuar en ${CITY_BY_ID[A.city].name}`;
    // aviso de la conversión de las fincas viejas
    const M = game.sim.mb?.();
    if (M?.pvNote && !A) {
      const n = M.pvNote; delete M.pvNote;
      setTimeout(() => game.ui.modal(`<h2>¡Fincas de provincia grandes!</h2><p>Las fincas de ${esc(n.names.join(', '))} ahora son grandes como la principal, con su tierra, animales, obras, trabajadores y camiones.</p><p>Lo que tenías sembrado, construido y la renta juntada se te devolvió: <b>+${n.total.toLocaleString('es')} pesos</b>.</p><p>Entra con el botón de arriba a la izquierda o desde el mapa de Cuba («Ir a la finca»).</p><div class="modal-btns"><button class="btn primary" data-act="modal-close">¡Dale!</button></div>`), 900);
      save(game.sim.s);
    }
  },
  frame(game) {
    const E = game.pvEls; if (!E) return;
    const M = game.sim.mb?.(), n = M ? Object.keys(M.farms || {}).length : 0;
    const show = game.started && (n > 0 || !!game.farmCity) && !document.getElementById('ui')?.classList.contains('mambi-on');
    E.btn.classList.toggle('hidden', !show);
    if (!game.farmCity) return;
    // ciudad perdida mientras estás en su finca: de vuelta a la principal
    if (!game.sim.mbFreed(game.farmCity) && !game.pvKicked && game.started) {
      game.pvKicked = true;
      game.ui.toast(`${CITY_BY_ID[game.farmCity].name} cayó en manos del Régimen: vuelves a la finca principal.`);
      setTimeout(() => switchFarm(game, null, true), 2500);
    }
    const left = game.sim.pvRaid();
    E.raid.classList.toggle('hidden', !left || !show);
    if (left) { const m = Math.floor(left / 60), s = Math.floor(left % 60); E.raid.textContent = `Saqueo del Régimen: camiones, trabajadores y producción parados · ${m}:${String(s).padStart(2, '0')}`; }
  },
});

function switchFarm(game, city, force = false) {
  city = city || null;
  const sim = game.sim, M = sim.mb();
  if (city === (game.farmCity || null)) { game.ui.closeSheet(); return false; }
  if (city) {
    const f = M.farms[city];
    if (!f) { game.ui.toast('Esa ciudad todavía no tiene finca.'); return false; }
    if (!sim.mbFreed(city)) { game.ui.toast(`${CITY_BY_ID[city].name} está en manos del Régimen: recupérala con una batalla para volver a entrar.`); sim.h.sfx('error'); return false; }
    if (!f.conv) { f.cells = {}; f.conv = 2; }
  }
  if (!force && (game.mambi?.battle || game.castro?.defense)) { game.ui.toast('Termina primero la batalla.'); return false; }
  save(sim.s);
  M.cur = city || undefined;
  if (!city) delete M.cur;
  save(sim.s);
  game.resetting = true;
  try { sessionStorage.setItem(AUTO_KEY, '1'); } catch { /* sin sessionStorage */ }
  const ov = document.createElement('div'); ov.id = 'pv-travel';
  ov.innerHTML = `<div>${ICON.truck || ''}<br>Viajando a la ${esc(farmName(city).toLowerCase())}…</div>`;
  document.body.appendChild(ov);
  window.__pvSwitching = city || 'main';
  setTimeout(() => location.reload(), 120);
  return true;
}

function openFarms(game) {
  game.ui.openSheet('Tus fincas', () => {
    const sim = game.sim, M = sim.mb(), cur = game.farmCity;
    let out = '<p class="note">Pesos, nivel, madera y víveres son los mismos en todas tus fincas. Cada finca tiene su tierra, sus animales, sus obras, sus trabajadores y sus camiones.</p>';
    out += `<div class="row ${cur ? '' : 'sel'}"><div class="row-ico">${ICON.home}</div><div class="row-main"><b>Finca principal</b><small>Tomate, caña, tabaco, el batey, la manigua, los campos grandes y el central.</small></div>${cur ? '<button class="btn primary" data-act="pvgo" data-id="">Ir</button>' : '<button class="btn" disabled>Estás aquí</button>'}</div>`;
    const ids = Object.keys(M.farms || {});
    if (ids.length) out += '<h3>Fincas de provincia</h3>';
    for (const id of ids) {
      const prof = profileOf(id), f = M.farms[id], occ = !sim.mbFreed(id), sm = f.sum;
      if (!prof) continue;
      const info = sm ? `${sm.sown}/${sm.plots} canteros · ${sm.built} obras · ${sm.workers} trabajadores` : 'Sin estrenar';
      out += `<div class="row ${occ ? 'dim' : cur === id ? 'sel' : ''}"><div class="row-ico">${ICON[prof.crops[0]] || ICON.field}</div><div class="row-main"><b>${esc(CITY_BY_ID[id].name)} · ${esc(prof.short)}</b><small>${esc(prof.blurb)} ${esc(info)}.${occ ? '<span class="mb-why">Ocupada por el Régimen: recupérala para entrar.</span>' : ''}</small></div>${cur === id ? '<button class="btn" disabled>Estás aquí</button>' : `<button class="btn primary" data-act="pvgo" data-id="${id}" ${occ ? 'disabled' : ''}>Ir</button>`}</div>`;
    }
    if (!ids.length) out += '<p class="note">Libera ciudades en la Campaña Mambisa y funda fincas en ellas.</p>';
    return out;
  });
}

// colores de la región, luz y paisaje de fondo (una malla sólida + una de mar)
function decorate(game, A) {
  const w = game.world, prof = A.prof;
  try { w.groundMesh?.material.color.set(prof.tint); } catch { /* nada */ }
  const lerp = (c, hex, t) => c.lerp(new THREE.Color(hex), t);
  lerp(w.cDay.sky, prof.light, 0.45); lerp(w.cDay.fog, prof.fog, 0.6); lerp(w.cNoon, prof.light, 0.35);
  const L = landmarkGeo(prof.landmark);
  w.pvLand = [];
  if (L.solid) { const m = new THREE.Mesh(L.solid, w.mat); m.castShadow = false; m.receiveShadow = true; m.name = 'pv-landmark'; w.scene.add(m); w.pvLand.push(m); }
  if (L.sea) { const m = new THREE.Mesh(L.sea, new THREE.MeshStandardMaterial({ color: 0x2f8aa0, roughness: 0.25, metalness: 0.05 })); m.receiveShadow = true; m.name = 'pv-sea'; w.scene.add(m); w.pvLand.push(m); }
  void ZONES;
}

// entrar sin la pantalla de título después de cambiar de finca
export function autoEnter() { try { if (sessionStorage.getItem(AUTO_KEY)) { sessionStorage.removeItem(AUTO_KEY); return true; } } catch { /* nada */ } return false; }
void typeOf;
// ganchos para pruebas automatizadas
try { window.__pvRecipes = () => RECIPES; window.__pvActive = () => ACTIVE && { city: ACTIVE.city, pid: ACTIVE.pid }; } catch { /* sin window */ }
