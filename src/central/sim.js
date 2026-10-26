// Lógica de los campos grandes, el central azucarero y el tren cañero. Se instala sobre Sim (como installV4).
import { now } from '../state.js';
import { xpForLevel } from '../data.js';
import { RESOURCES } from '../registry.js';
import {
  IND, IND_ORDER, WHOLESALE, ACOPIO_CAP, ALMACEN_CAP, FIELD_CROPS, FIELDS, FIELD_BY_ID, PLANT_WORK, HARVEST_WORK,
  STAGES, WOOD_PRICE, MILL, STILL, TRAIN, STOPS, STOP_ORDER, TRAIN_ORDER, BLOCKS, STAGE_BLOCKS, CAMPOS_LEVEL, CENTRAL_LEVEL,
} from './data.js';
import { wrap, ahead } from './track.js';

const int = (v) => Math.max(0, Math.floor(+v || 0));
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const GW_ = 88;

// Estado guardado (clave nueva `cen`, con valores por defecto: los saves viejos no se tocan)
export function ensureCen(s) {
  s.ext ||= {};
  const d = obj(s.ext.central);
  const tr = obj(d.train);
  const fields = {};
  for (const [id, f] of Object.entries(obj(d.fields))) if (FIELD_BY_ID[id] && f && (!f.crop || FIELD_CROPS[f.crop])) fields[id] = { crop: f.crop || null, at: +f.at || 0, dur: +f.dur || 0, work: f.work && f.work.kind ? { kind: f.work.kind, at: +f.work.at || 0, dur: +f.work.dur || 1 } : null };
  const stage = Math.min(STAGES.length, int(d.stage));
  s.ext.central = {
    owned: Array.isArray(d.owned) ? d.owned.filter((id) => FIELD_BY_ID[id]) : [],
    fields,
    stage,
    building: d.building && Number.isFinite(+d.building.stage) && +d.building.stage === stage ? { stage, at: +d.building.at || 0, dur: +d.building.dur || 1 } : null,
    yard: int(d.yard),
    mill: int(d.mill),
    stock: Object.fromEntries(IND_ORDER.map((k) => [k, int(obj(d.stock)[k])])),
    millAt: +d.millAt || 0,
    stillAt: +d.stillAt || 0,
    still: d.still !== false,
    train: { s: Number.isFinite(+tr.s) ? wrap(+tr.s) : STOPS.station.s, v: 0, load: int(tr.load), next: STOP_ORDER.includes(tr.next) ? tr.next : 'acopio', at: STOP_ORDER.includes(tr.at) ? tr.at : 'station', wait: Math.max(0, +tr.wait || 0) },
    order: d.order && d.order.items ? d.order : null,
    orderAt: +d.orderAt || 0,
    stats: { trips: int(obj(d.stats).trips), orders: int(obj(d.stats).orders), sugar: int(obj(d.stats).sugar), earned: int(obj(d.stats).earned), harvests: int(obj(d.stats).harvests) },
  };
  return s.ext.central;
}

export function installCentral(Sim) {
  const P = Sim.prototype;
  const origRebuild = P.rebuildGrid;

  // Los edificios del central bloquean el paso del guajiro
  P.rebuildGrid = function () {
    origRebuild.call(this);
    if (!this.s.ext.central) return;
    const c = this.s.ext.central, gw = this.grid.blocked.length >= GW_ * 80 ? GW_ : 0;
    if (!gw) return;
    const done = new Set();
    STAGES.forEach((st, i) => { if (c.stage > i) for (const b of STAGE_BLOCKS[st.id] || []) done.add(b); });
    if (this.s.level >= CAMPOS_LEVEL) done.add('acopio');
    for (const k of done) { const b = BLOCKS[k]; for (let z = b.z; z < b.z + b.h; z++) for (let x = b.x; x < b.x + b.w; x++) this.grid.blocked[z * gw + x] = 1; }
  };

  P.cenInit = function () {
    ensureCen(this.s);
    this.cenVer = 1;
    this.cenFF = null;
    this.rebuildGrid();
  };
  P.cenBump = function () { this.cenVer = (this.cenVer || 0) + 1; this.h.changed('central'); };

  // ------------------------------------------------------------ almacén industrial
  P.indTotal = function () { const c = this.s.ext.central; return c.yard + c.mill + IND_ORDER.reduce((a, k) => a + c.stock[k], 0); };
  P.indCap = function () { return this.s.ext.central.stage >= 4 ? ALMACEN_CAP : ACOPIO_CAP; };
  P.indSpace = function () { return Math.max(0, this.indCap() - this.indTotal()); };
  P.sellInd = function (k, qty) {
    const c = this.s.ext.central;
    const have = k === 'cane' ? c.yard : c.stock[k];
    const n = Math.min(have, qty);
    if (n <= 0) { this.h.toast('No hay de eso en el acopio.'); this.h.sfx('error'); return false; }
    if (k === 'cane') c.yard -= n; else c.stock[k] -= n;
    const pay = Math.round(n * IND[k].sell * WHOLESALE);
    this.addMoney(pay);
    c.stats.earned += pay;
    this.addXp(Math.max(1, Math.round(n / 10)));
    this.h.sfx('coins');
    this.h.toast(`Vendiste ${n} ${IND[k].plural.toLowerCase()} al por mayor: +${pay} pesos.`);
    this.cenBump();
    return true;
  };

  // ------------------------------------------------------------ campos grandes
  P.fieldState = function (id, t = now()) {
    const s = this.s, c = s.ext.central, f = FIELD_BY_ID[id];
    if (!c.owned.includes(id)) return s.level < f.level ? 'locked' : 'forsale';
    const st = c.fields[id];
    if (!st) return 'empty';
    if (st.work) return st.work.kind === 'plant' ? 'planting' : 'harvesting';
    if (!st.crop) return 'empty';
    return t >= st.at + st.dur ? 'ripe' : 'growing';
  };
  P.fieldProgress = function (id, t = now()) {
    const st = this.s.ext.central.fields[id];
    if (!st) return 0;
    if (st.work) return Math.min(1, (t - st.work.at) / st.work.dur);
    if (!st.crop) return 0;
    return Math.min(1, (t - st.at) / st.dur);
  };
  P.fieldGrow = function (crop) { return FIELD_CROPS[crop].grow * (this.s.upgrades.abono ? 0.85 : 1); };
  P.buyField = function (id) {
    const s = this.s, c = s.ext.central, f = FIELD_BY_ID[id];
    if (!f || c.owned.includes(id)) return false;
    if (s.level < CAMPOS_LEVEL) { this.h.toast(`Los campos grandes se abren en el nivel ${CAMPOS_LEVEL}.`); return false; }
    if (s.level < f.level) { this.h.toast(`Ese campo se compra en el nivel ${f.level}.`); this.h.sfx('error'); return false; }
    if (!this.spend(f.price)) return false;
    c.owned.push(id);
    c.fields[id] = { crop: null, at: 0, dur: 0, work: null };
    this.addXp(40 + f.n * 5);
    this.h.sfx('buy');
    this.h.toast(`¡Campo ${f.n} comprado! Toca el campo para sembrarlo entero.`);
    this.cenBump();
    return true;
  };
  P.plantField = function (id, crop) {
    const s = this.s, c = s.ext.central, cr = FIELD_CROPS[crop];
    if (!cr || this.fieldState(id) !== 'empty') return false;
    if (s.level < cr.level) { this.h.toast(`${cr.name} en grande: nivel ${cr.level}.`); this.h.sfx('error'); return false; }
    if (!this.spend(cr.seed)) return false;
    c.fields[id] = { crop, at: 0, dur: this.fieldGrow(crop), work: { kind: 'plant', at: now(), dur: PLANT_WORK } };
    this.h.sfx('plant');
    this.cenBump();
    return true;
  };
  P.harvestField = function (id) {
    const c = this.s.ext.central, st = c.fields[id];
    if (this.fieldState(id) !== 'ripe') return false;
    const cr = FIELD_CROPS[st.crop];
    if (this.indSpace() < cr.yield) { this.h.toast(`No cabe la cosecha (${cr.yield}). Vende en el acopio${c.stage >= 2 ? ' o espera al tren' : ''}.`); this.h.sfx('error'); return false; }
    st.work = { kind: 'harvest', at: now(), dur: HARVEST_WORK };
    this.h.sfx('harvest');
    this.cenBump();
    return true;
  };
  P.fieldWorkDone = function (id, st) {
    const f = FIELD_BY_ID[id], c = this.s.ext.central;
    const cx = f.x + 3, cz = f.z + 3;
    if (st.work.kind === 'plant') {
      st.work = null;
      st.at = now(); st.dur = this.fieldGrow(st.crop);
      this.addXp(FIELD_CROPS[st.crop].xpPlant);
      this.h.float(cx, cz, `${FIELD_CROPS[st.crop].name} sembrada`, 'item');
    } else {
      const cr = FIELD_CROPS[st.crop], crop = st.crop;
      st.work = null; st.crop = null; st.at = 0;
      const n = Math.min(cr.yield, this.indSpace()); // el espacio se comprobó al empezar el corte
      if (crop === 'cane') c.yard += n; else c.stock[crop] += n;
      c.stats.harvests++;
      this.addXp(cr.xpHarvest);
      this.h.float(cx, cz, `+${n} ${IND[crop].plural.toLowerCase()}`, 'item');
      this.lastHarvest = { id, crop, n, t: performance.now() }; // la vista manda una carreta al acopio
    }
    this.cenBump();
  };

  // ------------------------------------------------------------ central azucarero
  P.stageNext = function () { const c = this.s.ext.central; return c.stage < STAGES.length ? STAGES[c.stage] : null; };
  P.startStage = function () {
    const s = this.s, c = s.ext.central, st = this.stageNext();
    if (!st || c.building) return false;
    if (s.level < st.level) { this.h.toast(`${st.name}: nivel ${st.level}.`); this.h.sfx('error'); return false; }
    if (!this.hasRes('madera', st.wood)) { this.h.toast(`Hace falta ${st.wood} de madera (tienes ${s.res.madera || 0}). Búscala en la manigua o cómprala en el aserrío.`); this.h.sfx('error'); return false; }
    if (!this.pay({ pesos: st.price, madera: st.wood })) return false;
    c.building = { stage: c.stage, at: now(), dur: st.dur };
    this.h.sfx('buy');
    this.h.toast(`¡Empezó la obra: ${st.name.toLowerCase()}!`);
    this.cenBump();
    return true;
  };
  P.stageDone = function () {
    const c = this.s.ext.central, st = STAGES[c.stage];
    c.stage++; c.building = null;
    this.addXp(200 + c.stage * 100);
    this.h.sfx('level');
    const msg = ['', '¡Cimientos listos! Ahora la vía y la locomotora.', '¡Llegó la locomotora! El tren cañero ya recoge la caña en el acopio.', '¡Humo en la chimenea! El central ya muele caña: azúcar y melaza.', '¡El central está completo! Pedidos del tren en la estación y ron en la destilería.'][c.stage];
    this.h.toast(msg || `¡${st.name} terminada!`);
    if (c.stage === 2) { c.train.s = STOPS.station.s; c.train.at = 'station'; c.train.next = 'acopio'; c.train.wait = 2; }
    if (c.stage === 4) c.orderAt = now() + 3;
    this.rebuildGrid();
    this.cenBump();
  };
  P.buyWood = function (n) {
    const s = this.s, cap = RESOURCES.madera?.cap ?? 500;
    n = Math.min(n, cap - (s.res.madera || 0));
    if (n <= 0) { this.h.toast('Ya no cabe más madera.'); return false; }
    if (!this.spend(n * WOOD_PRICE)) return false;
    this.addRes('madera', n);
    this.h.sfx('buy');
    return true;
  };
  P.toggleStill = function () { this.s.ext.central.still = !this.s.ext.central.still; this.cenBump(); };
  P.millBusy = function () { const c = this.s.ext.central; return c.stage >= 3 && c.mill >= MILL.cane && this.indSpace() > 0; };

  // ------------------------------------------------------------ pedidos del tren
  P.newTrainOrder = function () {
    const s = this.s, c = s.ext.central;
    const pool = [['azucar', 40, 120], ['melaza', 15, 45], ['ron', 9, 30]];
    if (s.level >= FIELD_CROPS.tobacco.level) pool.push(['tobacco', 30, 90]);
    if (s.level >= FIELD_CROPS.tomato.level) pool.push(['tomato', 60, 180]);
    // primero lo que hay en el almacén
    pool.sort((a, b) => (c.stock[b[0]] > 0) - (c.stock[a[0]] > 0) || Math.random() - 0.5);
    const n = Math.random() < 0.35 ? 3 : 2;
    const items = {};
    for (const [k, lo, hi] of pool.slice(0, n)) items[k] = Math.round((lo + Math.random() * (hi - lo) * Math.min(1, 0.5 + (s.level - 34) * 0.1)) / 5) * 5 || 5;
    const value = Object.entries(items).reduce((a, [k, q]) => a + IND[k].sell * q, 0);
    const reward = Math.round((value * TRAIN_ORDER.bonus + TRAIN_ORDER.base) / 10) * 10;
    const dest = ['La Habana', 'Cienfuegos', 'Matanzas', 'Santiago', 'Camagüey', 'Sagua la Grande', 'Puerto Padre'][Math.floor(Math.random() * 7)];
    c.order = { id: (c.stats.orders + 1) * 1000 + Math.floor(Math.random() * 999), items, reward, xp: Math.round(reward / 60), dest, loaded: false };
    this.cenBump();
  };
  P.canFillOrder = function () {
    const c = this.s.ext.central, o = c.order;
    return !!o && !o.loaded && Object.entries(o.items).every(([k, q]) => c.stock[k] >= q);
  };
  P.loadOrder = function () {
    const c = this.s.ext.central, o = c.order;
    if (!this.canFillOrder()) { this.h.toast('Falta mercancía en los almacenes para este pedido.'); this.h.sfx('error'); return false; }
    for (const [k, q] of Object.entries(o.items)) c.stock[k] -= q;
    o.loaded = true;
    this.h.sfx('load');
    const tr = c.train;
    if (tr.wait > 0 && tr.at === 'station') this.payOrder();
    else this.h.toast('Cargado en el andén: se cobra cuando el tren pare en la estación.');
    this.cenBump();
    return true;
  };
  P.payOrder = function () {
    const c = this.s.ext.central, o = c.order;
    if (!o || !o.loaded) return;
    this.addMoney(o.reward, 24.5, 61);
    this.addXp(o.xp);
    c.stats.orders++; c.stats.earned += o.reward;
    c.order = null; c.orderAt = now() + TRAIN_ORDER.cooldown;
    this.h.sfx('coins');
    this.h.toast(`¡El tren salió para ${o.dest}! +${o.reward} pesos.`);
    this.cenBump();
  };
  P.skipOrder = function () {
    const c = this.s.ext.central;
    if (!c.order || c.order.loaded) return false;
    c.order = null; c.orderAt = now() + TRAIN_ORDER.cooldown / 2;
    this.cenBump();
    return true;
  };

  // ------------------------------------------------------------ tren cañero
  P.trainArrive = function (stop) {
    const c = this.s.ext.central, tr = c.train, cap = TRAIN.cap * TRAIN.wagons;
    tr.at = stop; tr.wait = STOPS[stop].dwell; tr.v = 0;
    if (stop === 'acopio' && tr.load < cap && c.yard > 0) {
      const n = Math.min(cap - tr.load, c.yard);
      c.yard -= n; tr.load += n;
      this.trainFx = { kind: 'load', t: performance.now() };
    } else if (stop === 'basculador' && tr.load > 0) {
      c.mill += tr.load; c.stats.trips++;
      this.h.float(23, 75.5, `+${tr.load} caña al central`, 'item');
      tr.load = 0;
      this.trainFx = { kind: 'unload', t: performance.now() };
    } else if (stop === 'station') {
      if (c.order?.loaded) this.payOrder();
      this.trainFx = { kind: 'whistle', t: performance.now() };
    }
    this.cenBump();
  };
  P.updateTrain = function (dt) {
    const tr = this.s.ext.central.train;
    if (tr.wait > 0) {
      tr.wait -= dt;
      if (tr.wait <= 0) { tr.wait = 0; tr.next = STOP_ORDER[(STOP_ORDER.indexOf(tr.at) + 1) % STOP_ORDER.length]; this.trainFx = { kind: 'depart', t: performance.now() }; }
      return;
    }
    const target = STOPS[tr.next].s;
    let dist = ahead(tr.s, target);
    if (dist > 1e3) dist = 0;
    const brake = (tr.v * tr.v) / (2 * TRAIN.accel);
    if (dist <= brake + 0.05) tr.v = Math.max(0.7, tr.v - TRAIN.accel * dt);
    else tr.v = Math.min(TRAIN.speed, tr.v + TRAIN.accel * dt);
    const step = tr.v * dt;
    if (step >= dist) { tr.s = target; this.trainArrive(tr.next); } else tr.s = wrap(tr.s + step);
  };

  // ------------------------------------------------------------ tick
  P.updateCentral = function (dt) {
    if (!this.s.ext.central || this.cenVer === undefined) this.cenInit();
    const s = this.s, c = s.ext.central, t = now();
    if (s.level < CAMPOS_LEVEL - 1 && !c.owned.length && !c.stage) return;
    for (const id of c.owned) { const st = c.fields[id]; if (st?.work && t >= st.work.at + st.work.dur) this.fieldWorkDone(id, st); }
    if (c.building && t >= c.building.at + c.building.dur) this.stageDone();
    // molienda (también se pone al día con el tiempo fuera)
    if (c.stage >= 3) {
      if (c.mill >= MILL.cane && this.indSpace() > 0) {
        if (!c.millAt) c.millAt = t;
        let k = 0;
        while (t - c.millAt >= MILL.time && c.mill >= MILL.cane && this.indSpace() >= MILL.azucar + MILL.melaza - MILL.cane && k++ < 400) {
          c.mill -= MILL.cane; c.stock.azucar += MILL.azucar; c.stock.melaza += MILL.melaza; c.stats.sugar += MILL.azucar;
          c.millAt += MILL.time;
          this.addXp(MILL.xp);
          if (k === 1) this.h.float(24, 69, `+${MILL.azucar} sacos de azúcar`, 'item');
        }
        if (k) this.cenBump();
      } else c.millAt = 0;
    }
    if (c.stage >= 4 && c.still) {
      if (c.stock.melaza >= STILL.melaza) {
        if (!c.stillAt) c.stillAt = t;
        let k = 0;
        while (t - c.stillAt >= STILL.time && c.stock.melaza >= STILL.melaza && k++ < 200) {
          c.stock.melaza -= STILL.melaza; c.stock.ron += STILL.ron; c.stillAt += STILL.time;
          this.addXp(STILL.xp);
        }
        if (k) this.cenBump();
      } else c.stillAt = 0;
      if (!c.order && t >= c.orderAt) this.newTrainOrder();
    }
    if (c.stage >= 2) this.updateTrain(dt);
  };

  // ------------------------------------------------------------ trucos de desarrollo (?dev=1)
  P.cenCheat = function (k) {
    const s = this.s, c = s.ext.central;
    const toLevel = (l) => { if (s.level < l) this.addXp(xpForLevel(l) - s.xp); };
    if (k === 'l25') toLevel(CAMPOS_LEVEL);
    if (k === 'l32') toLevel(CENTRAL_LEVEL);
    if (k === 'l35') toLevel(35);
    if (k === 'l40') toLevel(40);
    if (k === 'rich') { this.addMoney(250000); s.res.madera = Math.max(s.res.madera || 0, RESOURCES.madera?.cap ?? 500); this.h.changed('res'); }
    if (k === 'fields') for (const f of FIELDS) if (s.level >= f.level && !c.owned.includes(f.id)) { c.owned.push(f.id); c.fields[f.id] = { crop: null, at: 0, dur: 0, work: null }; }
    if (k === 'central') { toLevel(35); while (c.stage < STAGES.length) { c.building = null; this.stageDone(); } }
    if (k === 'ripe') for (const id of c.owned) { const st = c.fields[id]; if (st?.work) st.work.at -= st.work.dur; else if (st?.crop) st.at = now() - st.dur - 1; }
    if (k === 'cane') { c.yard += 300; }
    this.rebuildGrid();
    this.cenBump();
  };
}
export { FIELDS, STAGES };
