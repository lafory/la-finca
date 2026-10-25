// Lógica del juego: jugador, gallinas, huevos, canteros, camión, fogón, trabajadores, progresión.
import {
  W, H, ITEMS, CROPS, CROP_ORDER, RECIPES, PRICES, EGG_INTERVAL, MAX_GROUND_EGGS, TRUCK_CAP, TRUCK_TIMES,
  WORKERS, PARCELS, BUILDINGS, PEN, TRUCK_TILES, TRUCK_SPOT, WATER_BOOST, ABONO_FACTOR, ORDER_BONUS,
  xpForLevel, SELLABLE, FLAGPOLE,
} from './data.js';
import { now, buildGrid, walkable, isOwned, storageCap, invCount, chickenCap, addChicken, parcelAt } from './state.js';
import { findPath } from './path.js';

export const fmtTime = (sec) => {
  sec = Math.max(0, Math.ceil(sec));
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60), s = sec % 60;
  return s ? `${m} min ${s} s` : `${m} min`;
};
export const fmtClock = (sec) => {
  sec = Math.max(0, Math.ceil(sec));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};

export class Sim {
  constructor(state, hooks) {
    this.s = state;
    this.h = hooks; // { toast, float(x,z,text,cls), sfx(name), levelUp(level), changed(kind) }
    this.grid = buildGrid(state);
    this.player = { x: state.player.x, z: state.player.z, path: null, task: null, moving: false, face: 0, walk: 0, speed: 4.6 };
    this.workers = state.workers.map((w) => this.makeWorker(w));
    this.chickRT = new Map();
    this.reserved = new Set();
    this.eggFullWarned = false;
    this.lastUseTarget = null;
    if (!state.truck.order) state.truck.order = this.makeOrder();
  }

  // ------------------------------------------------------------ utilidades
  can(x, z) { return walkable(this.s, this.grid, x, z, this.truckParked()); }
  edge(ax, az, bx, bz) { return this.grid.edges.has(this.grid.ek(ax, az, bx, bz)); }
  truckParked() { return this.s.truck.phase === 'parked'; }
  rebuildGrid() { this.grid = buildGrid(this.s); }
  addXp(n) {
    const s = this.s;
    s.xp += n;
    while (s.xp >= xpForLevel(s.level + 1)) {
      s.level++;
      this.h.levelUp(s.level);
    }
    this.h.changed('xp');
  }
  addMoney(n, x, z) {
    this.s.money += n;
    if (n > 0) { this.s.stats.earned += n; if (x !== undefined) this.h.float(x, z, `+${n}`, 'money'); }
    this.h.changed('money');
  }
  spend(n) {
    if (this.s.money < n) { this.h.toast('Todavía no alcanzan los pesos.'); this.h.sfx('error'); return false; }
    this.s.money -= n; this.h.changed('money'); return true;
  }
  space() { return storageCap(this.s) - invCount(this.s); }
  addItem(k, n = 1, x, z) {
    if (this.space() < n) { this.h.toast('La canasta está llena. Vende en el camión o amplía el almacén.'); this.h.sfx('error'); return false; }
    this.s.inv[k] += n;
    if (x !== undefined) this.h.float(x, z, `+${n} ${n > 1 ? ITEMS[k].plural.toLowerCase() : ITEMS[k].name.toLowerCase()}`, 'item');
    this.h.changed('inv');
    return true;
  }
  plotDur(crop) { return CROPS[crop].grow * (this.s.upgrades.abono ? ABONO_FACTOR : 1); }
  plotState(p, t = now()) {
    if (!p.crop) return 'empty';
    return t >= p.at + p.dur ? 'ripe' : 'growing';
  }
  plotProgress(p, t = now()) { return p.crop ? Math.min(1, (t - p.at) / p.dur) : 0; }

  // ------------------------------------------------------------ pedidos del camión
  makeOrder() {
    const s = this.s;
    if (s.truck.trips === 0) return { items: { egg: 3 }, reward: 25, xp: 6 };
    const pool = ['egg', 'tomato'];
    if (s.level >= 2) pool.push('ketchup');
    if (s.level >= 3) pool.push('cane');
    if (s.level >= 4) pool.push('tobacco');
    if (s.level >= 5) pool.push('guarapo');
    const n = Math.min(pool.length, 1 + Math.floor(Math.random() * (s.level >= 3 ? 3 : 2)));
    const items = {};
    const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, n);
    for (const k of picks) {
      const base = { egg: 4, tomato: 3, ketchup: 1, cane: 2, tobacco: 2, guarapo: 1 }[k];
      items[k] = base + Math.floor(Math.random() * (1 + s.level * 0.6));
    }
    let value = 0, xp = 0;
    for (const [k, q] of Object.entries(items)) { value += ITEMS[k].sell * q; xp += ITEMS[k].xp * q; }
    return { items, reward: Math.round(value * ORDER_BONUS + 5), xp: Math.round(xp * 1.5 + 3) };
  }
  canDeliver() {
    const o = this.s.truck.order;
    if (!o || !this.truckParked()) return false;
    return Object.entries(o.items).every(([k, q]) => this.s.inv[k] >= q);
  }
  deliverOrder() {
    const s = this.s, o = s.truck.order;
    if (!this.canDeliver()) { this.h.toast('Todavía falta algo para el pedido.'); this.h.sfx('error'); return false; }
    for (const [k, q] of Object.entries(o.items)) s.inv[k] -= q;
    s.stats.sold++;
    this.addMoney(o.reward, TRUCK_SPOT.x, TRUCK_SPOT.z);
    this.addXp(o.xp);
    this.h.float(TRUCK_SPOT.x, TRUCK_SPOT.z - 1, `+${o.xp} XP`, 'xp');
    this.h.sfx('coins');
    this.h.toast(`¡Pedido entregado! +${o.reward} pesos`);
    s.truck.cargo.order = (s.truck.cargo.order || 0) + 1;
    this.sendTruck(true);
    return true;
  }
  sellLoose(k, qty) {
    const s = this.s;
    if (!this.truckParked()) { this.h.toast('El camión no está. Ya mismo vuelve.'); return false; }
    const load = Object.values(s.truck.cargo).reduce((a, b) => a + b, 0);
    qty = Math.min(qty, s.inv[k], TRUCK_CAP - load);
    if (qty <= 0) { this.h.toast(load >= TRUCK_CAP ? 'El camión está lleno. ¡Mándalo!' : 'No tienes de eso.'); this.h.sfx('error'); return false; }
    s.inv[k] -= qty;
    s.truck.cargo[k] = (s.truck.cargo[k] || 0) + qty;
    const pesos = ITEMS[k].sell * qty;
    this.addMoney(pesos, TRUCK_SPOT.x, TRUCK_SPOT.z);
    this.addXp(Math.max(1, Math.round(ITEMS[k].xp * qty * 0.5)));
    s.stats.sold++;
    this.h.sfx('load');
    this.h.changed('inv');
    if (load + qty >= TRUCK_CAP) { this.h.toast('Camión lleno. ¡Arrancó!'); this.sendTruck(); }
    return true;
  }
  sendTruck(silent) {
    const s = this.s;
    if (!this.truckParked()) return;
    s.truck.phase = 'leaving'; s.truck.at = now();
    if (!silent) this.h.toast('¡Arrancó el camión! Vuelve con un pedido nuevo.');
    this.h.sfx('horn');
    this.h.changed('truck');
  }
  truckRemaining() {
    const tr = this.s.truck, t = now() - tr.at;
    if (tr.phase === 'leaving') return TRUCK_TIMES.leaving + TRUCK_TIMES.gone + TRUCK_TIMES.arriving - t;
    if (tr.phase === 'gone') return TRUCK_TIMES.gone + TRUCK_TIMES.arriving - t;
    if (tr.phase === 'arriving') return TRUCK_TIMES.arriving - t;
    return 0;
  }

  // ------------------------------------------------------------ fogón
  kitchenOpen() { return this.s.level >= 2; }
  startRecipe(id) {
    const s = this.s, r = RECIPES[id];
    if (s.level < r.level) { this.h.toast(`Se desbloquea en el nivel ${r.level}.`); return false; }
    if (s.kitchen.recipe || s.kitchen.ready) { this.h.toast('El fogón está ocupado.'); return false; }
    for (const [k, q] of Object.entries(r.needs)) if (s.inv[k] < q) { this.h.toast(`Hacen falta ${q} ${ITEMS[k].plural.toLowerCase()}.`); this.h.sfx('error'); return false; }
    for (const [k, q] of Object.entries(r.needs)) s.inv[k] -= q;
    s.kitchen.recipe = id; s.kitchen.at = now();
    this.h.sfx('cook');
    this.h.changed('kitchen');
    return true;
  }
  collectKitchen(byWorker) {
    const s = this.s;
    if (!s.kitchen.ready) return false;
    const k = BUILDINGS.kitchen;
    if (!this.addItem(s.kitchen.ready, 1, k.x + 1, k.z + 1)) return false;
    this.addXp(ITEMS[s.kitchen.ready].xp);
    s.kitchen.ready = null;
    if (!byWorker) this.h.sfx('harvest');
    this.h.changed('kitchen');
    return true;
  }

  // ------------------------------------------------------------ canteros
  plant(p, crop, byWorker) {
    const s = this.s;
    if (p.crop) return false;
    if ((s.seeds[crop] || 0) <= 0) {
      if (!byWorker) { this.h.toast(`No tienes ${CROPS[crop].seedName.toLowerCase()}s. Cómpralas en la Tienda.`); this.h.sfx('error'); this.h.openShop?.(); }
      return false;
    }
    s.seeds[crop]--;
    p.crop = crop; p.at = now(); p.dur = this.plotDur(crop); p.watered = false;
    this.addXp(CROPS[crop].xpPlant);
    this.h.sfx('plant');
    this.h.changed('plots');
    return true;
  }
  water(p) {
    if (this.plotState(p) !== 'growing' || p.watered) return false;
    const rem = p.at + p.dur - now();
    p.at -= rem * WATER_BOOST;
    p.watered = true;
    this.h.sfx('water');
    this.h.float(p.x + 0.5, p.z + 0.5, '¡Regado!', 'item');
    this.h.changed('plots');
    return true;
  }
  harvest(p, byWorker) {
    if (this.plotState(p) !== 'ripe') return false;
    const item = CROPS[p.crop].item;
    if (!this.addItem(item, 1, p.x + 0.5, p.z + 0.5)) return false;
    this.addXp(ITEMS[item].xp);
    p.crop = null; p.watered = false;
    this.s.stats.harvests++;
    this.h.sfx('harvest');
    this.h.burst?.(p.x + 0.5, p.z + 0.5, item);
    this.h.changed('plots');
    return true;
  }
  firstSeed() {
    const s = this.s;
    if (s.seeds[s.selectedSeed] > 0) return s.selectedSeed;
    return CROP_ORDER.find((c) => s.seeds[c] > 0) || s.selectedSeed;
  }
  usePlot(p) {
    const st = this.plotState(p);
    if (st === 'ripe') return this.harvest(p);
    if (st === 'empty') return this.plant(p, this.firstSeed());
    if (!p.watered) return this.water(p);
    this.h.toast(`${CROPS[p.crop].name}: listo en ${fmtTime(p.at + p.dur - now())}.`);
    return false;
  }

  // ------------------------------------------------------------ huevos
  collectEgg(idx, byWorker) {
    const s = this.s;
    const e = s.eggs[idx];
    if (!e) return false;
    if (!this.addItem('egg', 1)) return false;
    s.eggs.splice(idx, 1);
    s.stats.eggs++;
    this.addXp(ITEMS.egg.xp);
    this.h.float(e.x, e.z, '+1 huevo', 'item');
    if (!byWorker) this.h.sfx('egg');
    this.eggFullWarned = false;
    return true;
  }

  // ------------------------------------------------------------ compras
  chickenPrice() { return Math.round(PRICES.chicken * Math.pow(PRICES.chickenStep, Math.max(0, this.s.chickens.length - 3))); }
  buy(id, qty = 1) {
    const s = this.s;
    if (CROPS[id]) {
      const c = CROPS[id];
      if (s.level < c.level) return false;
      if (!this.spend(c.seed * qty)) return false;
      s.seeds[id] += qty; s.selectedSeed = id;
      this.h.sfx('buy'); this.h.changed('inv');
      return true;
    }
    if (id === 'chicken') {
      if (s.chickens.length >= chickenCap(s)) { this.h.toast('El gallinero está lleno. Amplíalo.'); return false; }
      if (!this.spend(this.chickenPrice())) return false;
      addChicken(s); this.h.sfx('cluck'); this.h.changed('chickens');
      return true;
    }
    if (id === 'coop') { if (s.upgrades.coop || s.level < 3 || !this.spend(PRICES.coop)) return false; s.upgrades.coop = true; this.h.sfx('buy'); return true; }
    if (id === 'abono') { if (s.upgrades.abono || s.level < 4 || !this.spend(PRICES.abono)) return false; s.upgrades.abono = true; this.h.sfx('buy'); return true; }
    if (id === 'storage') {
      const lvl = s.upgrades.storage;
      const need = [2, 5][lvl];
      if (lvl >= 2 || s.level < need || !this.spend(PRICES.storage[lvl])) return false;
      s.upgrades.storage++; this.h.sfx('buy'); this.h.changed('inv');
      return true;
    }
    if (WORKERS[id]) {
      const w = WORKERS[id];
      if (s.workers.some((x) => x.role === id) || s.level < w.level || !this.spend(w.price)) return false;
      const rec = { role: id, x: 13.5, z: 11.5 };
      s.workers.push(rec);
      this.workers.push(this.makeWorker(rec));
      this.h.sfx('buy');
      this.h.toast(`${w.name}: ¡ya está trabajando en la finca!`);
      this.h.changed('workers');
      return true;
    }
    return false;
  }
  buyParcel(id) {
    const s = this.s, p = PARCELS.find((x) => x.id === id);
    if (!p || s.parcels.includes(id)) return false;
    if (s.level < p.level) { this.h.toast(`Se desbloquea en el nivel ${p.level}.`); return false; }
    if (!this.spend(p.price)) return false;
    s.parcels.push(id);
    for (const [x, z] of p.plots) s.plots.push({ x, z, crop: null, at: 0 });
    this.rebuildGrid();
    this.addXp(10);
    this.h.sfx('level');
    this.h.toast(`¡${p.name} ya es tuyo!`);
    this.h.changed('land');
    return true;
  }

  // ------------------------------------------------------------ objetivos y tareas
  footprintGoals(x0, z0, w, h, reach = 1) {
    const goals = [];
    for (let z = z0 - reach; z < z0 + h + reach; z++) for (let x = x0 - reach; x < x0 + w + reach; x++) {
      if (x >= 0 && z >= 0 && x < W && z < H && this.can(x, z)) goals.push([x, z]);
    }
    return goals;
  }
  goalsFor(t) {
    const B = BUILDINGS;
    switch (t.kind) {
      case 'egg': { const e = this.s.eggs.find((q) => q.id === t.id); return e ? [[Math.floor(e.x), Math.floor(e.z)]] : []; }
      case 'plot': return this.footprintGoals(t.p.x, t.p.z, 1, 1);
      case 'truck': return TRUCK_TILES.map(([x, z]) => [x - 1, z]).filter(([x, z]) => this.can(x, z)).concat([[14, 12], [15, 12], [16, 12], [15, 7], [16, 7]].filter(([x, z]) => this.can(x, z)));
      case 'kitchen': return this.footprintGoals(B.kitchen.x, B.kitchen.z, B.kitchen.w, B.kitchen.h);
      case 'coop': return this.footprintGoals(B.coop.x, B.coop.z, B.coop.w, B.coop.h);
      case 'house': return this.footprintGoals(B.house.x, B.house.z, B.house.w, B.house.h);
      case 'tank': return this.footprintGoals(B.tank.x, B.tank.z, 1, 1);
      case 'ground': return this.can(t.x, t.z) ? [[t.x, t.z]] : this.footprintGoals(t.x, t.z, 1, 1);
      default: return [];
    }
  }
  pathTo(ent, goals) {
    const sx = Math.floor(ent.x), sz = Math.floor(ent.z);
    if (!goals.length) return null;
    return findPath(sx, sz, goals, (x, z) => this.can(x, z) || (x === sx && z === sz), (a, b, c, d) => this.edge(a, b, c, d));
  }
  // El jugador va hacia algo y actúa al llegar.
  command(t) {
    const p = this.player;
    const goals = this.goalsFor(t);
    const path = this.pathTo(p, goals);
    if (!path) { this.h.toast('No se puede llegar allí.'); this.h.sfx('error'); return false; }
    p.path = path.map(([x, z], i) => (i === path.length - 1 && t.kind === 'egg') ? this.eggPos(t.id) : { x: x + 0.5, z: z + 0.5 });
    if (path.length > 1) p.path.shift();
    p.task = t.kind === 'ground' ? null : t;
    this.h.marker?.(t);
    return true;
  }
  eggPos(id) { const e = this.s.eggs.find((q) => q.id === id); return e ? { x: e.x, z: e.z } : { x: this.player.x, z: this.player.z }; }
  perform(t) {
    switch (t.kind) {
      case 'plot': return this.usePlot(t.p);
      case 'egg': { const i = this.s.eggs.findIndex((e) => e.id === t.id); return i >= 0 && this.collectEgg(i); }
      case 'truck': this.h.openTruck(); return true;
      case 'kitchen':
        if (!this.kitchenOpen()) { this.h.toast('El fogón se arregla en el nivel 2.'); return false; }
        if (this.s.kitchen.ready) return this.collectKitchen();
        this.h.openKitchen(); return true;
      case 'coop': this.h.toast(`Gallinas: ${this.s.chickens.length}/${chickenCap(this.s)}. Ponen un huevo cada ${EGG_INTERVAL} s.`); return true;
      case 'house': this.h.toast('El bohío de la familia. Aquí se guarda todo lo que recoges.'); return true;
      case 'tank': this.h.toast('El tanque de agua. Toca una mata que esté creciendo para regarla.'); return true;
      default: return false;
    }
  }
  // Lo más útil cerca del jugador (para "Usar"/E).
  nearestUse() {
    const p = this.player, t = now();
    let best = null, bd = 1e9;
    const consider = (target, x, z, prio, label) => {
      const d = Math.hypot(x - p.x, z - p.z) + prio;
      if (Math.hypot(x - p.x, z - p.z) <= 1.75 && d < bd) { bd = d; best = { target, label }; }
    };
    for (const e of this.s.eggs) consider({ kind: 'egg', id: e.id }, e.x, e.z, 0, 'Recoger');
    for (const pl of this.s.plots) {
      const st = this.plotState(pl, t);
      if (st === 'ripe') consider({ kind: 'plot', p: pl }, pl.x + 0.5, pl.z + 0.5, -0.3, 'Cosechar');
      else if (st === 'empty') consider({ kind: 'plot', p: pl }, pl.x + 0.5, pl.z + 0.5, 0.4, 'Sembrar');
      else if (!pl.watered) consider({ kind: 'plot', p: pl }, pl.x + 0.5, pl.z + 0.5, 0.6, 'Regar');
    }
    if (this.truckParked()) for (const [x, z] of TRUCK_TILES) consider({ kind: 'truck' }, x + 0.5, z + 0.5, 0.2, 'Camión');
    const k = BUILDINGS.kitchen;
    for (let z = k.z; z < k.z + k.h; z++) for (let x = k.x; x < k.x + k.w; x++) consider({ kind: 'kitchen' }, x + 0.5, z + 0.5, 0.2, this.s.kitchen.ready ? 'Recoger' : 'Fogón');
    return best;
  }
  use() {
    const n = this.nearestUse();
    if (!n) { this.h.toast('No hay nada cerca. Camina hasta los huevos, un cantero o el camión.'); return false; }
    return this.perform(n.target);
  }

  // ------------------------------------------------------------ trabajadores
  makeWorker(rec) { return { rec, role: rec.role, x: rec.x, z: rec.z, path: null, task: null, wait: 1 + Math.random(), face: 0, walk: 0, moving: false, speed: 3.2 }; }
  workerPick(w) {
    const s = this.s, t = now();
    const free = (key) => !this.reserved.has(key);
    const near = (list) => list.sort((a, b) => Math.hypot(a.x - w.x, a.z - w.z) - Math.hypot(b.x - w.x, b.z - w.z))[0];
    if (w.role === 'recolector' && this.space() > 0) {
      const eggs = s.eggs.filter((e) => free(`e${e.id}`)).map((e) => ({ x: e.x, z: e.z, t: { kind: 'egg', id: e.id }, key: `e${e.id}` }));
      const ripe = s.plots.filter((p) => this.plotState(p, t) === 'ripe' && free(`p${p.x},${p.z}`)).map((p) => ({ x: p.x + 0.5, z: p.z + 0.5, t: { kind: 'plot', p }, key: `p${p.x},${p.z}` }));
      return near([...eggs, ...ripe]);
    }
    if (w.role === 'sembrador' && CROP_ORDER.some((c) => s.seeds[c] > 0)) {
      return near(s.plots.filter((p) => !p.crop && free(`p${p.x},${p.z}`)).map((p) => ({ x: p.x + 0.5, z: p.z + 0.5, t: { kind: 'plot', p }, key: `p${p.x},${p.z}` })));
    }
    if (w.role === 'cocinero' && this.kitchenOpen() && free('kitchen')) {
      const k = s.kitchen;
      const canCook = !k.recipe && !k.ready && Object.values(RECIPES).some((r) => s.level >= r.level && Object.entries(r.needs).every(([i, q]) => s.inv[i] >= q));
      if (k.ready || canCook) return { x: 13, z: 5, t: { kind: 'kitchen' }, key: 'kitchen' };
    }
    if (w.role === 'camionero' && this.canDeliver() && free('truck')) return { x: 15, z: 9, t: { kind: 'truck' }, key: 'truck' };
    return null;
  }
  workerDo(w, t) {
    const s = this.s;
    if (t.kind === 'egg') { const i = s.eggs.findIndex((e) => e.id === t.id); if (i >= 0) this.collectEgg(i, true); }
    else if (t.kind === 'plot') {
      if (w.role === 'recolector') this.harvest(t.p, true);
      else if (w.role === 'sembrador') {
        const c = s.seeds[s.selectedSeed] > 0 ? s.selectedSeed : CROP_ORDER.find((x) => s.seeds[x] > 0);
        if (c) this.plant(t.p, c, true);
      }
    } else if (t.kind === 'kitchen') {
      if (s.kitchen.ready) this.collectKitchen(true);
      if (!s.kitchen.recipe && !s.kitchen.ready) {
        const r = ['guarapo', 'ketchup'].find((id) => s.level >= RECIPES[id].level && Object.entries(RECIPES[id].needs).every(([i, q]) => s.inv[i] >= q));
        if (r) this.startRecipe(r);
      }
    } else if (t.kind === 'truck') this.deliverOrder();
  }
  updateWorker(w, dt) {
    if (w.path) { this.stepAlong(w, dt); if (w.path) return; }
    if (w.task) {
      this.workerDo(w, w.task.t);
      this.reserved.delete(w.task.key);
      w.task = null; w.wait = 0.8;
      return;
    }
    w.wait -= dt;
    if (w.wait > 0) return;
    const pick = this.workerPick(w);
    if (!pick) {
      // pasea tranquilo cerca del bohío
      w.wait = 2.5 + Math.random() * 3;
      const gx = 5 + Math.floor(Math.random() * 9), gz = 7 + Math.floor(Math.random() * 5);
      const path = this.pathTo(w, this.can(gx, gz) ? [[gx, gz]] : []);
      if (path && path.length > 1) { path.shift(); w.path = path.map(([x, z]) => ({ x: x + 0.5, z: z + 0.5 })); }
      return;
    }
    const goals = this.goalsFor(pick.t);
    const path = this.pathTo(w, goals);
    if (!path) { w.wait = 2; return; }
    this.reserved.add(pick.key);
    w.task = pick;
    w.path = path.map(([x, z]) => ({ x: x + 0.5, z: z + 0.5 }));
    if (pick.t.kind === 'egg') w.path[w.path.length - 1] = this.eggPos(pick.t.id);
    if (w.path.length > 1) w.path.shift();
  }

  // ------------------------------------------------------------ movimiento
  stepAlong(ent, dt) {
    const wp = ent.path[0];
    const dx = wp.x - ent.x, dz = wp.z - ent.z;
    const d = Math.hypot(dx, dz);
    const stepLen = ent.speed * dt;
    ent.moving = true;
    if (d > 1e-4) ent.face = Math.atan2(dx, dz);
    if (d <= stepLen) {
      ent.x = wp.x; ent.z = wp.z;
      ent.path.shift();
      if (!ent.path.length) { ent.path = null; ent.moving = false; }
    } else {
      ent.x += (dx / d) * stepLen; ent.z += (dz / d) * stepLen;
    }
    ent.walk += dt * ent.speed * 2.2;
  }
  moveFree(dir, dt) {
    const p = this.player;
    p.path = null; p.task = null;
    const sp = p.speed * dt;
    const tryMove = (nx, nz) => {
      const r = 0.22;
      const cx = Math.floor(p.x), cz = Math.floor(p.z);
      for (const [ox, oz] of [[-r, -r], [r, -r], [-r, r], [r, r]]) {
        const tx = Math.floor(nx + ox), tz = Math.floor(nz + oz);
        if (tx === cx && tz === cz) continue;
        if (!this.can(tx, tz)) return false;
        if ((tx !== cx) !== (tz !== cz) && this.edge(cx, cz, tx, tz)) return false;
        if (tx !== cx && tz !== cz && (this.edge(cx, cz, tx, cz) || this.edge(cx, cz, cx, tz))) return false;
      }
      p.x = nx; p.z = nz; return true;
    };
    const mx = tryMove(p.x + dir.x * sp, p.z);
    const mz = tryMove(p.x, p.z + dir.z * sp);
    p.moving = mx || mz;
    p.face = Math.atan2(dir.x, dir.z);
    p.walk += dt * p.speed * 2.2;
  }

  // ------------------------------------------------------------ tick
  update(dt) {
    const s = this.s, t = now();
    // jugador
    const p = this.player;
    if (p.path) {
      this.stepAlong(p, dt);
      if (!p.path && p.task) { const tk = p.task; p.task = null; this.perform(tk); }
    } else if (!this.freeMoving) p.moving = false;
    s.player.x = p.x; s.player.z = p.z;
    // recoger huevos y cosechar al pisar
    for (let i = s.eggs.length - 1; i >= 0; i--) {
      const e = s.eggs[i];
      if (Math.hypot(e.x - p.x, e.z - p.z) < 0.55) this.collectEgg(i);
    }
    const tx = Math.floor(p.x), tz = Math.floor(p.z);
    const under = s.plots.find((q) => q.x === tx && q.z === tz);
    if (under && this.plotState(under, t) === 'ripe' && Math.hypot(tx + 0.5 - p.x, tz + 0.5 - p.z) < 0.45 && this.space() > 0) this.harvest(under);
    // gallinas ponen (también "offline": se ponen al día hasta el tope)
    for (const c of s.chickens) {
      let guard = 0;
      while (t >= c.nextLay && guard++ < 50) {
        if (s.eggs.length < MAX_GROUND_EGGS) {
          const ex = Math.min(PEN.x1 + 0.8, Math.max(PEN.x0 + 0.2, c.x + (Math.random() - 0.5) * 0.4));
          const ez = Math.min(PEN.z1 + 0.8, Math.max(PEN.z0 + 0.2, c.z + (Math.random() - 0.5) * 0.4));
          s.eggs.push({ id: s.nextId++, x: ex, z: ez });
          this.h.layed?.(c);
        } else if (!this.eggFullWarned) {
          this.eggFullWarned = true;
          this.h.toast('El corral está lleno de huevos. ¡Recógelos!');
        }
        c.nextLay += EGG_INTERVAL * (0.85 + Math.random() * 0.3);
        if (t - c.nextLay > EGG_INTERVAL * MAX_GROUND_EGGS) c.nextLay = t + EGG_INTERVAL * 0.5;
      }
    }
    // camión
    const tr = s.truck, el = t - tr.at;
    if (tr.phase === 'leaving' && el >= TRUCK_TIMES.leaving) { tr.phase = 'gone'; tr.at += TRUCK_TIMES.leaving; tr.cargo = {}; this.h.changed('truck'); }
    if (tr.phase === 'gone' && t - tr.at >= TRUCK_TIMES.gone) { tr.phase = 'arriving'; tr.at += TRUCK_TIMES.gone; tr.trips++; tr.order = this.makeOrder(); this.h.changed('truck'); }
    if (tr.phase === 'arriving' && t - tr.at >= TRUCK_TIMES.arriving) {
      tr.phase = 'parked'; tr.at += TRUCK_TIMES.arriving; this.h.sfx('horn'); this.h.changed('truck');
      // si el jugador quedó parado donde se parquea, apártalo
      if (TRUCK_TILES.some(([x, z]) => x === Math.floor(p.x) && z === Math.floor(p.z))) { p.x = 14.5; p.path = null; }
    }
    // fogón
    const k = s.kitchen;
    if (k.recipe && t - k.at >= RECIPES[k.recipe].time) { k.ready = RECIPES[k.recipe].out; k.recipe = null; this.h.changed('kitchen'); }
    // trabajadores
    for (const w of this.workers) { this.updateWorker(w, dt); w.rec.x = w.x; w.rec.z = w.z; }
    // gallinas deambulan (separadas entre sí)
    for (const c of s.chickens) {
      let rt = this.chickRT.get(c.id);
      if (!rt) { rt = { tx: c.x, tz: c.z, wait: Math.random() * 2, peck: 0, face: Math.random() * 6, moving: false }; this.chickRT.set(c.id, rt); }
      rt.wait -= dt;
      if (rt.wait <= 0) {
        rt.tx = PEN.x0 + 0.35 + Math.random() * (PEN.x1 - PEN.x0 + 0.3);
        rt.tz = PEN.z0 + 0.35 + Math.random() * (PEN.z1 - PEN.z0 + 0.3);
        rt.wait = 1.5 + Math.random() * 3;
      }
      const dx = rt.tx - c.x, dz = rt.tz - c.z, d = Math.hypot(dx, dz);
      rt.moving = d > 0.05;
      if (rt.moving) { const sp = Math.min(d, dt * 0.9); c.x += (dx / d) * sp; c.z += (dz / d) * sp; rt.face = Math.atan2(dx, dz); }
      for (const o of s.chickens) {
        if (o === c) continue;
        const ox = c.x - o.x, oz = c.z - o.z, od = Math.hypot(ox, oz);
        if (od < 0.45 && od > 1e-4) { c.x += (ox / od) * (0.45 - od) * 0.5; c.z += (oz / od) * (0.45 - od) * 0.5; }
      }
      c.x = Math.min(PEN.x1 + 0.75, Math.max(PEN.x0 + 0.25, c.x));
      c.z = Math.min(PEN.z1 + 0.75, Math.max(PEN.z0 + 0.25, c.z));
    }
  }
}
export { SELLABLE, FLAGPOLE, isOwned, parcelAt, storageCap, invCount, chickenCap };
