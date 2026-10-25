// Lógica del juego: jugador, gallinas, huevos, canteros, camión, fogón, trabajadores, progresión.
import {
  W, H, ITEMS, CROPS, CROP_ORDER, RECIPES, PRICES, EGG_INTERVAL, MAX_GROUND_EGGS, TRUCK_SLOTS, TRUCK_SPEED, TRUCK_RESPAWN, TRUCK_MODELS, TRUCK_COLORS,
  WORKERS, WORKER_SPEED, workerUpgradePrice, PARCELS, BUILDINGS, PEN, TRUCK_TILES, TRUCK_SPOT, WATER_BOOST, ABONO_FACTOR, ORDER_BONUS,
  xpForLevel, SELLABLE, FLAGPOLE, STRUCTURES, OBSTACLES, OBSTACLE_LIST, STORAGE_LEVELS, CAM_WAIT, CAM_KEEP } from './data.js';
import { parcelReachable, now, buildGrid, walkable, isOwned, storageCap, invCount, chickenCap, addChicken, parcelAt } from './state.js';
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
    this.leaving = [];
    this.initTrucks();
  }

  // ------------------------------------------------------------ utilidades
  can(x, z) { return walkable(this.s, this.grid, x, z) && !this.truckBlocks(x, z); }
  edge(ax, az, bx, bz) { return this.grid.edges.has(this.grid.ek(ax, az, bx, bz)); }
  front() { return this.s.trucks[0] || null; }
  truckParked() { const f = this.front(); return !!f && Math.abs(f.z - TRUCK_SLOTS[0]) < 0.05; }
  docks() { return this.s.built.anden ? 2 : 1; }
  // ¿El camión i está parqueado en un andén (se puede cargar)?
  isParked(i) { const t = this.s.trucks[i]; return !!t && i < this.docks() && Math.abs(t.z - TRUCK_SLOTS[i]) < 0.05; }
  truckIndex(tr) { return this.s.trucks.indexOf(tr); }
  // Los camiones detenidos ocupan los tiles del camino donde esperan.
  truckBlocks(x, z) {
    if (x !== 15 && x !== 16) return false;
    for (const t of this.s.trucks) {
      if (Math.abs(t.z - (t.slotZ ?? t.z)) > 0.05) continue;
      if (z >= Math.floor(t.z - 1.6) && z <= Math.floor(t.z + 1.6)) return true;
    }
    return false;
  }
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

  // ------------------------------------------------------------ fila de camiones y pedidos
  queueSize() { return this.s.level >= 4 ? 4 : 3; }
  initTrucks() {
    const s = this.s;
    if (!Array.isArray(s.trucks)) {
      s.trucks = [];
      s.truckTrips = s.truck?.trips || 0;
      delete s.truck;
      for (let i = 0; i < this.queueSize(); i++) this.spawnTruck(TRUCK_SLOTS[i]);
    }
    if (!s.nextTruckAt) s.nextTruckAt = 0;
  }
  spawnTruck(atZ) {
    const s = this.s;
    const t = {
      id: s.nextId++,
      model: Math.floor(Math.random() * TRUCK_MODELS),
      color: TRUCK_COLORS[Math.floor(Math.random() * TRUCK_COLORS.length)],
      order: this.makeOrder(s.trucks.length),
      loaded: {},
      z: atZ ?? H + 6,
      arrivedAt: now(),
    };
    s.trucks.push(t);
    s.truckTrips = (s.truckTrips || 0) + 1;
    return t;
  }
  // Pedidos que favorecen lo que el jugador puede producir ahora mismo.
  makeOrder(pos = 0) {
    const s = this.s, t = now();
    if ((s.truckTrips || 0) === 0 && pos === 0) return { items: { egg: 3 }, reward: 25, xp: 6 };
    const growing = (crop) => s.plots.some((p) => p.crop === crop);
    const pending = new Set(s.trucks.flatMap((tr) => Object.keys(tr.order.items)));
    const weights = {};
    weights.egg = 6 + Math.min(4, s.chickens.length - 3) + (s.inv.egg > 2 ? 3 : 0);
    const crop = (item, crop, lvl) => {
      if (s.level < lvl) return;
      let w = 0.4;
      if (s.inv[item] > 0) w += 4;
      if (growing(crop)) w += 3;
      if (s.seeds[crop] > 0) w += 1;
      weights[item] = w;
    };
    crop('tomato', 'tomato', 1); crop('cane', 'cane', 3); crop('tobacco', 'tobacco', 4);
    const prod = (item, recipe) => {
      const r = RECIPES[recipe];
      if (s.level < r.level) return;
      const [ing, q] = Object.entries(r.needs)[0];
      let w = 0.3;
      if (s.inv[item] > 0) w += 4;
      if (s.kitchen.recipe === recipe || s.kitchen.ready === item) w += 3;
      if (s.inv[ing] >= q) w += 2;
      weights[item] = w;
    };
    prod('ketchup', 'ketchup'); prod('guarapo', 'guarapo');
    // productos de las estructuras nuevas (solo si están construidas)
    for (const [id, st] of Object.entries(STRUCTURES)) {
      if (!s.built[id]) continue;
      if (st.kind === 'animal' && st.produce.item !== 'egg') weights[st.produce.item] = 2 + (s.inv[st.produce.item] > 0 ? 4 : 0);
      if (st.kind === 'proc') for (const [rid, r] of Object.entries(RECIPES)) if (r.where.includes(id) && rid !== 'ketchup' && rid !== 'guarapo' && s.level >= r.level) weights[r.out] = 1.5 + (s.inv[r.out] > 0 ? 4 : 0) + (this.proc(id)?.recipe === rid ? 2 : 0);
    }
    // un poco de variedad: baja el peso de lo que ya piden los demás camiones
    for (const k of pending) if (weights[k]) weights[k] *= 0.6;
    const pick = (exclude) => {
      const ents = Object.entries(weights).filter(([k]) => !exclude.has(k));
      const tot = ents.reduce((a, [, w]) => a + w, 0);
      let r = Math.random() * tot;
      for (const [k, w] of ents) { r -= w; if (r <= 0) return k; }
      return ents[0]?.[0];
    };
    const kinds = Math.min(Object.keys(weights).length, s.level >= 3 && Math.random() < 0.45 ? 2 : 1);
    const items = {};
    const used = new Set();
    for (let i = 0; i < kinds; i++) {
      const k = pick(used);
      if (!k) break;
      used.add(k);
      const base = { egg: 3, tomato: 2, ketchup: 1, cane: 2, tobacco: 1, guarapo: 1, leche: 2, queso: 1, carne: 1, melao: 1, azucar: 1, puros: 1 }[k] || 1;
      let q = base + Math.floor(Math.random() * (1 + Math.min(4, s.level * 0.5)));
      if (s.inv[k] > 0 && Math.random() < 0.6) q = Math.max(1, Math.min(q, s.inv[k] + 1));
      items[k] = q;
    }
    let value = 0, xp = 0;
    for (const [k, q] of Object.entries(items)) { value += ITEMS[k].sell * q; xp += ITEMS[k].xp * q; }
    return { items, reward: Math.round(value * ORDER_BONUS + 3 + s.level), xp: Math.round(xp * 1.5 + 2) };
  }
  missing(tr = this.front()) {
    if (!tr) return {};
    const out = {};
    for (const [k, q] of Object.entries(tr.order.items)) { const m = q - (tr.loaded[k] || 0); if (m > 0) out[k] = m; }
    return out;
  }
  canLoadSome(tr = this.front()) {
    return Object.keys(this.missing(tr)).some((k) => this.s.inv[k] > 0);
  }
  canDeliver(tr = this.front()) {
    if (!tr || !this.isParked(this.truckIndex(tr))) return false;
    return Object.entries(this.missing(tr)).every(([k, q]) => this.s.inv[k] >= q);
  }
  // Carga lo que haya (parcial vale). Si se completa, cobra y el camión se va.
  loadTruck(i = 0, byWorker = false) {
    const s = this.s, tr = s.trucks[i];
    if (!tr || !this.isParked(i)) return false;
    const SZ = TRUCK_SLOTS[i];
    let n = 0;
    for (const [k, q] of Object.entries(this.missing(tr))) {
      const m = Math.min(q, s.inv[k]);
      if (m > 0) { s.inv[k] -= m; tr.loaded[k] = (tr.loaded[k] || 0) + m; n += m; }
    }
    if (!n) { if (!byWorker) { this.h.toast('No tienes nada de lo que pide. Pulsa “No tenemos, siguiente”.'); this.h.sfx('error'); } return false; }
    tr.lastLoadAt = now();
    if (!byWorker) this.h.sfx('load');
    this.h.changed('inv');
    if (Object.keys(this.missing(tr)).length === 0) {
      const o = tr.order;
      s.stats.sold++;
      this.addMoney(o.reward, TRUCK_SPOT.x, SZ);
      this.addXp(o.xp);
      this.h.float(TRUCK_SPOT.x, SZ - 1, `+${o.xp} XP`, 'xp');
      this.h.sfx('coins');
      if (!byWorker) this.h.toast(`¡Pedido completo! +${o.reward} pesos`);
      this.departTruck(i);
    } else if (byWorker) this.h.float(TRUCK_SPOT.x, SZ - 1, `Chucho cargó ${n}`, 'xp');
    else this.h.toast(`Cargaste ${n}. Faltan cosas, pero el camión espera.`);
    return true;
  }
  deliverOrder() { return this.loadTruck(); }
  // "No tenemos, siguiente": se va sin castigo; paga a precio normal lo que ya se cargó.
  skipTruck(i = 0, byWorker = false) {
    const s = this.s, tr = s.trucks[i];
    if (!tr || !this.isParked(i)) return false;
    let pay = 0;
    for (const [k, q] of Object.entries(tr.loaded)) pay += ITEMS[k].sell * q;
    if (pay) { this.addMoney(pay, TRUCK_SPOT.x, TRUCK_SLOTS[i]); s.stats.sold++; }
    if (byWorker) this.h.float(TRUCK_SPOT.x, TRUCK_SLOTS[i] - 1, 'No tenemos, ¡siguiente!', 'xp');
    else { this.h.toast(pay ? `Se fue con lo cargado: +${pay} pesos. Ya viene el próximo.` : 'Sin problema, compay. Ya viene el próximo camión.'); this.h.sfx('horn'); }
    this.departTruck(i);
    return true;
  }
  departFront() { this.departTruck(0); }
  departTruck(i = 0) {
    const s = this.s, tr = s.trucks.splice(i, 1)[0];
    if (!tr) return;
    // el del segundo andén sale por el carril de al lado para no chocar con el primero
    this.leaving.push({ ...tr, lane: i > 0 ? 1 : 0, lx: 0 });
    s.skippedAt = now();
    if (!s.nextTruckAt || s.nextTruckAt < now()) s.nextTruckAt = now() + TRUCK_RESPAWN;
    this.h.changed('truck');
  }
  sellLoose(k, qty, byWorker = false) {
    const s = this.s;
    if (!this.truckParked() && !this.isParked(1)) { if (!byWorker) this.h.toast('Espera a que el camión se parquee.'); return false; }
    qty = Math.min(qty, s.inv[k]);
    if (qty <= 0) { if (!byWorker) { this.h.toast('No tienes de eso.'); this.h.sfx('error'); } return false; }
    s.inv[k] -= qty;
    const pesos = ITEMS[k].sell * qty;
    this.addMoney(pesos, TRUCK_SPOT.x, TRUCK_SPOT.z);
    this.addXp(Math.max(1, Math.round(ITEMS[k].xp * qty * 0.5)));
    s.stats.sold++;
    if (!byWorker) this.h.sfx('coins');
    this.h.changed('inv');
    return true;
  }
  // Lo que el camionero puede vender suelto: lo que pase de "guardar X", sin tocar lo que piden los camiones.
  surplus(rec) {
    const s = this.s, keep = rec.keep ?? 10, need = {};
    for (const tr of s.trucks) for (const [k, q] of Object.entries(this.missing(tr))) need[k] = (need[k] || 0) + q;
    const out = {};
    for (const k of SELLABLE) { const q = (s.inv[k] || 0) - keep - (need[k] || 0); if (q > 0) out[k] = q; }
    return out;
  }
  loadable(tr) {
    const out = {};
    for (const [k, q] of Object.entries(this.missing(tr))) { const m = Math.min(q, this.s.inv[k] || 0); if (m > 0) out[k] = m; }
    return out;
  }
  camHome() { return this.can(14, 9) ? [14, 9] : this.can(14, 10) ? [14, 10] : null; }
  updateTrucks(dt) {
    const s = this.s, t = now();
    s.trucks.forEach((tr, i) => {
      tr.slotZ = TRUCK_SLOTS[i];
      const d = tr.z - tr.slotZ;
      if (Math.abs(d) < 0.02) {
        if (tr.z !== tr.slotZ && i < this.docks()) this.h.sfx('horn');
        tr.z = tr.slotZ;
        if (i < this.docks() && !tr.parkedSince) tr.parkedSince = now();
        return;
      }
      const sp = Math.min(TRUCK_SPEED, 1.2 + Math.abs(d) * 2.2) * dt;
      tr.z -= Math.sign(d) * Math.min(Math.abs(d), sp);
      tr.moving = true;
      tr.parkedSince = 0; // al cambiar de andén vuelve a contar la espera
    });
    for (const tr of s.trucks) if (tr.z === tr.slotZ) tr.moving = false;
    for (let i = this.leaving.length - 1; i >= 0; i--) {
      const tr = this.leaving[i];
      if (tr.lane && tr.lx < 1.7) tr.lx = Math.min(1.7, tr.lx + dt * 1.4);
      else { tr.v = Math.min(TRUCK_SPEED * 1.3, (tr.v || 0) + dt * 4); tr.z -= tr.v * dt; }
      tr.moving = true;
      if (tr.z < -40) this.leaving.splice(i, 1);
    }
    if (s.trucks.length < this.queueSize() && t >= (s.nextTruckAt || 0)) {
      const back = s.trucks[s.trucks.length - 1];
      this.spawnTruck(Math.max(H + 6, (back?.z || 0) + 6));
      s.nextTruckAt = t + TRUCK_RESPAWN;
      this.h.changed('truck');
    }
    // si el jugador quedó donde se para un camión, apártalo
    const p = this.player;
    if (this.truckBlocks(Math.floor(p.x), Math.floor(p.z))) { p.x = 14.5; p.path = null; }
  }

  // ------------------------------------------------------------ fogón
  kitchenOpen() { return this.s.level >= 2; }
  // Estructuras con recetas: el fogón del batey ('kitchen') y las construidas (fogon2, trapiche, casaTabaco).
  proc(key = 'kitchen') { return key === 'kitchen' ? this.s.kitchen : this.s.built[key] || null; }
  procKeys() { return ['kitchen', ...Object.keys(STRUCTURES).filter((k) => STRUCTURES[k].kind === 'proc' && this.s.built[k])]; }
  procPos(key = 'kitchen') { const b = key === 'kitchen' ? BUILDINGS.kitchen : STRUCTURES[key]; return { x: b.x + b.w / 2, z: b.z + b.h / 2 }; }
  canStart(rid, key = 'kitchen') {
    const s = this.s, r = RECIPES[rid];
    return r.where.includes(key) && s.level >= r.level && Object.entries(r.needs).every(([i, q]) => s.inv[i] >= q);
  }
  startRecipe(id, key = 'kitchen') {
    const s = this.s, r = RECIPES[id], k = this.proc(key);
    if (!k) return false;
    if (s.level < r.level) { this.h.toast(`Se desbloquea en el nivel ${r.level}.`); return false; }
    if (!r.where.includes(key)) return false;
    if (k.recipe || k.ready) { this.h.toast('Está ocupado.'); return false; }
    for (const [i, q] of Object.entries(r.needs)) if (s.inv[i] < q) { this.h.toast(`Hacen falta ${q} ${ITEMS[i].plural.toLowerCase()}.`); this.h.sfx('error'); return false; }
    for (const [i, q] of Object.entries(r.needs)) s.inv[i] -= q;
    k.recipe = id; k.at = now();
    this.h.sfx('cook');
    this.h.changed('kitchen');
    return true;
  }
  collectKitchen(byWorker, key = 'kitchen') {
    const k = this.proc(key);
    if (!k || !k.ready) return false;
    const P = this.procPos(key);
    if (!this.addItem(k.ready, 1, P.x, P.z)) return false;
    this.addXp(ITEMS[k.ready].xp);
    k.ready = null;
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
    if (!byWorker) this.h.sfx('plant');
    this.h.changed('plots');
    return true;
  }
  water(p, byWorker) {
    if (this.plotState(p) !== 'growing' || p.watered) return false;
    const rem = p.at + p.dur - now();
    p.at -= rem * (this.s.built.pozo ? 0.45 : WATER_BOOST);
    p.watered = true;
    if (!byWorker) this.h.sfx('water');
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
    if (!byWorker) this.h.sfx('harvest');
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
      const need = STORAGE_LEVELS[lvl];
      if (lvl >= PRICES.storage.length || s.level < need || !this.spend(PRICES.storage[lvl])) return false;
      s.upgrades.storage++; this.h.sfx('buy'); this.h.changed('inv');
      return true;
    }
    if (WORKERS[id]) return this.hire(id);
    return false;
  }
  // ------------------------------------------------------------ contratar / mejorar / despedir
  hire(id) {
    const s = this.s, w = WORKERS[id];
    if (s.workers.some((x) => x.role === id) || s.level < w.level || !this.spend(w.price)) return false;
    const rec = { role: id, x: 13.5, z: 11.5, lvl: 1, autobuy: id === 'sembrador', ...(id === 'camionero' ? { sell: false, keep: 10 } : {}) };
    s.workers.push(rec);
    this.workers.push(this.makeWorker(rec));
    this.h.sfx('level');
    this.h.toast(`¡${w.who} ya trabaja en la finca! ${w.name}.`);
    this.h.float(rec.x, rec.z, `¡${w.who} contratado${w.look.skirt ? 'a' : ''}!`, 'xp');
    this.h.changed('workers');
    return true;
  }
  upgradeWorker(role) {
    const w = this.workers.find((x) => x.role === role);
    if (!w || w.rec.lvl >= 3 || !this.spend(workerUpgradePrice(role, w.rec.lvl))) return false;
    w.rec.lvl++;
    w.speed = WORKER_SPEED[w.rec.lvl].walk;
    this.h.sfx('buy');
    this.h.float(w.x, w.z, '¡Más rápido!', 'xp');
    this.h.changed('workers');
    return true;
  }
  fireWorker(role) {
    const i = this.workers.findIndex((x) => x.role === role);
    if (i < 0) return false;
    const w = this.workers[i];
    if (w.task) this.reserved.delete(w.task.key);
    this.workers.splice(i, 1);
    this.s.workers = this.s.workers.filter((x) => x.role !== role);
    this.h.toast(`${WORKERS[role].who} se despidió. Puedes volver a contratarlo cuando quieras.`);
    this.h.changed('workers');
    return true;
  }
  toggleSell() { const w = this.workers.find((x) => x.role === 'camionero'); if (w) w.rec.sell = !w.rec.sell; }
  cycleKeep() {
    const w = this.workers.find((x) => x.role === 'camionero');
    if (w) { const i = CAM_KEEP.indexOf(w.rec.keep ?? 10); w.rec.keep = CAM_KEEP[(i + 1) % CAM_KEEP.length]; }
  }
  toggleAutobuy(role) {
    const w = this.workers.find((x) => x.role === role);
    if (w) w.rec.autobuy = !w.rec.autobuy;
  }

  buyParcel(id) {
    const s = this.s, p = PARCELS.find((x) => x.id === id);
    if (!p || s.parcels.includes(id)) return false;
    if (s.level < p.level) { this.h.toast(`Se desbloquea en el nivel ${p.level}.`); return false; }
    if (!parcelReachable(s, p)) { this.h.toast('Primero compra la tierra de al lado: no hay camino hasta allí.'); return false; }
    if (!this.spend(p.price)) return false;
    s.parcels.push(id);
    const covered = new Set(p.obstacles.filter((o) => !s.cleared.includes(o.id)).map((o) => `${o.x},${o.z}`));
    for (const [x, z] of p.plots) if (!covered.has(`${x},${z}`)) s.plots.push({ x, z, crop: null, at: 0 });
    this.rebuildGrid();
    this.addXp(10 + p.level * 2);
    this.h.sfx('level');
    this.h.toast(`¡${p.name} ya es tuyo!`);
    this.h.changed('parcel');
    return true;
  }

  // ------------------------------------------------------------ obstáculos y estructuras
  obstacle(id) { return OBSTACLE_LIST.find((o) => o.id === id); }
  obstacleAt(x, z) {
    const s = this.s;
    return OBSTACLE_LIST.find((o) => o.x === x && o.z === z && s.parcels.includes(o.parcel) && !s.cleared.includes(o.id)) || null;
  }
  clearObstacle(id) {
    const s = this.s, o = this.obstacle(id);
    if (!o || s.cleared.includes(id) || !s.parcels.includes(o.parcel)) return false;
    if (!this.spend(o.cost)) return false;
    s.cleared.push(id);
    const p = PARCELS.find((q) => q.id === o.parcel);
    let plot = false;
    if (p.plots.some(([x, z]) => x === o.x && z === o.z) && !s.plots.some((q) => q.x === o.x && q.z === o.z)) { s.plots.push({ x: o.x, z: o.z, crop: null, at: 0 }); plot = true; }
    this.rebuildGrid();
    this.addXp(OBSTACLES[o.kind].xp);
    this.h.sfx('harvest');
    this.h.burst?.(o.x + 0.5, o.z + 0.5, o.kind === 'marabu' ? 'cane' : 'tobacco');
    this.h.float(o.x + 0.5, o.z + 0.5, plot ? '¡Cantero nuevo!' : '¡Limpio!', 'xp');
    this.h.changed(plot ? 'land' : 'obstacles');
    return true;
  }
  build(id) {
    const s = this.s, st = STRUCTURES[id];
    if (!st || s.built[id]) return false;
    if (!s.parcels.includes(st.parcel)) { this.h.toast(`Primero compra “${PARCELS.find((p) => p.id === st.parcel).name}”.`); return false; }
    if (s.level < st.level) { this.h.toast(`Se construye en el nivel ${st.level}.`); return false; }
    // el solar tiene que estar libre de obstáculos
    for (let z = st.z; z < st.z + st.h; z++) for (let x = st.x; x < st.x + st.w; x++) if (this.obstacleAt(x, z)) { this.h.toast('Limpia el solar primero.'); return false; }
    if (!this.spend(st.price)) return false;
    s.built[id] = { at: now(), ready: st.kind === 'proc' ? null : false, recipe: null };
    // quita al guajiro o a un trabajador si está parado en el solar
    this.rebuildGrid();
    for (const e of [this.player, ...this.workers]) if (!this.can(Math.floor(e.x), Math.floor(e.z))) { e.x = st.x + st.w + 0.5; e.z = st.z + st.h + 0.5; e.path = null; }
    this.addXp(15 + st.level);
    this.h.sfx('level');
    this.h.toast(`¡${st.name} construido!`);
    this.h.changed('land');
    return true;
  }
  animalLeft(id) { const st = STRUCTURES[id], b = this.s.built[id]; return b ? Math.max(0, b.at + st.produce.time - now()) : 0; }
  collectAnimal(id, byWorker) {
    const st = STRUCTURES[id], b = this.s.built[id];
    if (!b || !b.ready) return false;
    if (!this.addItem(st.produce.item, st.produce.qty, st.x + st.w / 2, st.z + st.h / 2)) return false;
    this.addXp(ITEMS[st.produce.item].xp * st.produce.qty);
    b.ready = false; b.at = now();
    if (!byWorker) this.h.sfx('harvest');
    this.h.changed('built');
    return true;
  }
  useStructure(id) {
    const st = STRUCTURES[id], b = this.s.built[id];
    if (!b) { this.h.openBuild?.(id); return true; }
    if (st.kind === 'animal') {
      if (b.ready) return this.collectAnimal(id);
      this.h.toast(`${st.name}: listo en ${fmtTime(this.animalLeft(id))}.`); return true;
    }
    if (st.kind === 'proc') { if (b.ready) return this.collectKitchen(false, id); this.h.openKitchen(id); return true; }
    if (st.kind === 'boost') { this.h.toast('El pozo con molino: regar rinde más (45 %).'); return true; }
    if (st.kind === 'dock') { this.h.toast('Segundo andén: el segundo camión de la fila también se puede cargar.'); return true; }
    return false;
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
      case 'truck': {
        if (t.i) { const z0 = Math.floor(TRUCK_SLOTS[1] - 1.5); const out = []; for (let z = z0; z <= z0 + 3; z++) for (const x of [14, 17]) if (this.can(x, z)) out.push([x, z]); return out; }
        return TRUCK_TILES.map(([x, z]) => [x - 1, z]).filter(([x, z]) => this.can(x, z)).concat([[15, 7], [16, 7]].filter(([x, z]) => this.can(x, z)));
      }
      case 'obstacle': { const o = this.obstacle(t.id); return o ? this.footprintGoals(o.x, o.z, 1, 1) : []; }
      case 'struct': { const b = STRUCTURES[t.id]; return this.footprintGoals(b.x, b.z, b.w, b.h); }
      case 'proc': { const b = STRUCTURES[t.key]; return this.footprintGoals(b.x, b.z, b.w, b.h); }
      case 'kitchen': return this.footprintGoals(B.kitchen.x, B.kitchen.z, B.kitchen.w, B.kitchen.h);
      case 'coop': return this.footprintGoals(B.coop.x, B.coop.z, B.coop.w, B.coop.h);
      case 'house': case 'fetch': return this.footprintGoals(B.house.x, B.house.z, B.house.w, B.house.h);
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
      case 'truck': this.h.openTruck(t.i || 0); return true;
      case 'obstacle': return this.clearObstacle(t.id);
      case 'struct': return this.useStructure(t.id);
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
  makeWorker(rec) {
    rec.lvl = rec.lvl || 1;
    return { rec, role: rec.role, x: rec.x, z: rec.z, path: null, task: null, wait: 1 + Math.random(), face: 0, walk: 0, moving: false,
      speed: WORKER_SPEED[rec.lvl].walk, work: 0, workDur: 1, status: 'Llegando a la finca', busy: false };
  }
  seedFor(w) {
    const s = this.s;
    const have = s.seeds[s.selectedSeed] > 0 ? s.selectedSeed : CROP_ORDER.find((c) => s.seeds[c] > 0);
    if (have) return { crop: have, buy: false };
    if (w.rec.autobuy) {
      const c = CROPS[s.selectedSeed] && s.level >= CROPS[s.selectedSeed].level ? s.selectedSeed : 'tomato';
      if (s.money >= CROPS[c].seed) return { crop: c, buy: true };
    }
    return null;
  }
  workerPick(w) {
    const s = this.s, t = now();
    const free = (key) => !this.reserved.has(key);
    const near = (list) => list.sort((a, b) => Math.hypot(a.x - w.x, a.z - w.z) - Math.hypot(b.x - w.x, b.z - w.z))[0] || null;
    const plots = (fn, verb) => near(s.plots.filter((p) => fn(p) && free(`p${p.x},${p.z}`)).map((p) => ({ x: p.x + 0.5, z: p.z + 0.5, t: { kind: 'plot', p }, key: `p${p.x},${p.z}`, verb: verb(p) })));
    const cname = (p) => (p.crop ? CROPS[p.crop].name.toLowerCase() : '');
    switch (w.role) {
      case 'recolector': {
        if (this.space() <= 0) { w.status = 'La canasta está llena: vende algo'; return null; }
        w.status = 'Esperando que pongan las gallinas';
        const animals = Object.entries(STRUCTURES).filter(([id, st]) => st.kind === 'animal' && s.built[id]?.ready && free(`a${id}`) && this.space() >= st.produce.qty)
          .map(([id, st]) => ({ x: st.x + st.w / 2, z: st.z + st.h / 2, t: { kind: 'struct', id }, key: `a${id}`, verb: `recoger en el ${st.name.toLowerCase()}` }));
        return near([...s.eggs.filter((e) => free(`e${e.id}`)).map((e) => ({ x: e.x, z: e.z, t: { kind: 'egg', id: e.id }, key: `e${e.id}`, verb: 'recoger un huevo' })), ...animals]);
      }
      case 'regador':
        w.status = 'Nada que regar ahora';
        return plots((p) => this.plotState(p, t) === 'growing' && !p.watered, (p) => `regar el ${cname(p)}`);
      case 'sembrador':
        if (!this.seedFor(w)) { w.status = w.rec.autobuy ? 'No alcanza el dinero para semillas' : 'Sin semillas: cómpralas o activa “Comprar semillas”'; return null; }
        w.status = 'No hay canteros vacíos';
        return plots((p) => !p.crop, () => 'sembrar');
      case 'cosechador':
        if (this.space() <= 0) { w.status = 'La canasta está llena: vende algo'; return null; }
        w.status = 'Esperando que madure algo';
        return plots((p) => this.plotState(p, t) === 'ripe', (p) => `cosechar el ${cname(p)}`);
      case 'cocinera': {
        if (!this.kitchenOpen()) { w.status = 'El fogón se arregla en el nivel 2'; return null; }
        w.status = 'Le faltan tomates, caña o tabaco';
        const jobs = [];
        for (const key of this.procKeys()) {
          const k = this.proc(key);
          if (k.recipe) { w.status = 'Cuidando el fogón'; continue; }
          const canCook = !k.ready && Object.keys(RECIPES).some((rid) => this.canStart(rid, key));
          if (free(`k${key}`) && (k.ready || canCook)) {
            const P = this.procPos(key);
            jobs.push({ x: P.x, z: P.z, t: key === 'kitchen' ? { kind: 'kitchen' } : { kind: 'proc', key }, key: `k${key}`, verb: k.ready ? 'recoger lo que salió' : (key === 'trapiche' ? 'moler caña' : key === 'casaTabaco' ? 'torcer tabacos' : 'prender el fogón') });
          }
        }
        return near(jobs);
      }
      case 'camionero': {
        // Totalmente automático: espera en el andén, trae del bohío lo que piden, carga, cobra y despide.
        const truckJob = (i, verb) => ({ x: 14.5, z: TRUCK_SLOTS[i], t: { kind: 'truck', i }, key: `truck${i}`, verb });
        if (w.carry) {
          const i = w.carry.i;
          const desc = Object.entries(w.carry.items).map(([k, q]) => `${q} ${(q === 1 ? ITEMS[k].name : ITEMS[k].plural || ITEMS[k].name).toLowerCase()}`).join(', ');
          if (this.isParked(i)) return truckJob(i, `${w.carry.sell ? 'vender' : 'cargar'} ${desc}`);
          w.carry = null; // el camión se fue mientras tanto
        }
        const H = BUILDINGS.house;
        const fetch = (i, sell) => ({ x: H.x + H.w / 2, z: H.z + H.h, t: { kind: 'fetch', i, sell }, key: `truck${i}`, verb: sell ? 'buscar lo que sobra en el bohío' : 'buscar en el bohío lo que pide el camión' });
        w.status = 'En el andén, esperando un camión';
        let waiting = null;
        for (let i = 0; i < this.docks(); i++) {
          if (!free(`truck${i}`) || !this.isParked(i)) continue;
          const f = s.trucks[i];
          if (Object.keys(this.loadable(f)).length) return fetch(i, false);
          const left = CAM_WAIT - (t - Math.max(f.parkedSince || t, f.lastLoadAt || 0));
          if (left <= 0) return truckJob(i, 'despedir al camión (no tenemos)');
          if (!waiting || left < waiting) waiting = left;
        }
        if (w.rec.sell) for (let i = 0; i < this.docks(); i++) {
          if (free(`truck${i}`) && this.isParked(i) && Object.keys(this.surplus(w.rec)).length) return fetch(i, true);
        }
        if (waiting) w.status = `Esperando mercancía: despide al camión en ${Math.ceil(waiting)} s`;
        return null;
      }
    }
    return null;
  }
  workerDo(w, t) {
    const s = this.s;
    if (t.kind === 'egg') { const i = s.eggs.findIndex((e) => e.id === t.id); if (i >= 0) this.collectEgg(i, true); }
    else if (t.kind === 'plot') {
      if (w.role === 'cosechador') this.harvest(t.p, true);
      else if (w.role === 'regador') this.water(t.p, true);
      else if (w.role === 'sembrador' && !t.p.crop) {
        const sd = this.seedFor(w);
        if (sd) {
          if (sd.buy) { if (!this.spend(CROPS[sd.crop].seed)) return; s.seeds[sd.crop]++; this.h.float(w.x, w.z, `−${CROPS[sd.crop].seed} semilla`, 'coin'); }
          this.plant(t.p, sd.crop, true);
        }
      }
    } else if (t.kind === 'kitchen' || t.kind === 'proc') {
      const key = t.key || 'kitchen', k = this.proc(key);
      if (k.ready) this.collectKitchen(true, key);
      if (!k.recipe && !k.ready) {
        const r = ['puros', 'azucar', 'melao', 'guarapo', 'ketchup'].find((id) => this.canStart(id, key));
        if (r) this.startRecipe(r, key);
      }
    } else if (t.kind === 'struct') { this.collectAnimal(t.id, true); }
    else if (t.kind === 'fetch') {
      const tr = s.trucks[t.i];
      const items = t.sell ? this.surplus(w.rec) : tr ? this.loadable(tr) : {};
      if (Object.keys(items).length) w.carry = { i: t.i, sell: !!t.sell, items };
    } else if (t.kind === 'truck') {
      const i = t.i || 0, tr = s.trucks[i], c = w.carry;
      w.carry = null;
      if (!tr || !this.isParked(i)) return;
      if (c && c.sell) {
        const sur = this.surplus(w.rec);
        let pesos = 0;
        for (const k of Object.keys(c.items)) { const q = Math.min(c.items[k], sur[k] || 0); if (q > 0 && this.sellLoose(k, q, true)) pesos += ITEMS[k].sell * q; }
        if (pesos) this.h.float(TRUCK_SPOT.x, TRUCK_SLOTS[i] - 1, `Venta suelta +${pesos}`, 'coin');
      } else if (this.canLoadSome(tr)) this.loadTruck(i, true);
      else if (CAM_WAIT - (now() - Math.max(tr.parkedSince || 0, tr.lastLoadAt || 0)) <= 0) this.skipTruck(i, true);
    }
  }
  updateWorker(w, dt) {
    const sp = WORKER_SPEED[w.rec.lvl];
    if (w.path) { this.stepAlong(w, dt); if (w.path) return; }
    if (w.task) {
      if (w.work <= 0) { w.work = sp.work; w.workDur = sp.work; w.status = w.task.doing; w.busy = true; if (Math.hypot(w.task.x - w.x, w.task.z - w.z) > 0.05) w.face = Math.atan2(w.task.x - w.x, w.task.z - w.z); }
      w.work -= dt;
      if (w.work > 0) return;
      w.work = 0;
      this.workerDo(w, w.task.t);
      w.rec.jobs = (w.rec.jobs || 0) + 1;
      this.reserved.delete(w.task.key);
      w.task = null; w.wait = sp.rest; w.busy = false;
      return;
    }
    w.wait -= dt;
    if (w.wait > 0) return;
    const pick = this.workerPick(w);
    if (!pick && w.role === 'camionero') {
      // se queda parado en el andén mirando al camino
      w.wait = 0.8;
      const home = this.camHome();
      if (home && (Math.floor(w.x) !== home[0] || Math.floor(w.z) !== home[1])) {
        const path = this.pathTo(w, [home]);
        if (path && path.length > 1) { path.shift(); w.path = path.map(([x, z]) => ({ x: x + 0.5, z: z + 0.5 })); }
      } else w.face = Math.PI / 2;
      return;
    }
    if (!pick) {
      // descansa o pasea tranquilo cerca del bohío
      w.wait = (2.5 + Math.random() * 3) * (sp.rest / 1.6 + 0.5);
      if (Math.random() < 0.5) return;
      const gx = 5 + Math.floor(Math.random() * 9), gz = 7 + Math.floor(Math.random() * 5);
      const path = this.pathTo(w, this.can(gx, gz) ? [[gx, gz]] : []);
      if (path && path.length > 1) { path.shift(); w.path = path.map(([x, z]) => ({ x: x + 0.5, z: z + 0.5 })); }
      return;
    }
    const goals = this.goalsFor(pick.t);
    const path = this.pathTo(w, goals);
    if (!path) { w.wait = 2; return; }
    this.reserved.add(pick.key);
    const DOING = { recolector: pick.t.kind === 'struct' ? 'Recogiendo' : 'Recogiendo huevos', regador: 'Regando', sembrador: 'Sembrando', cosechador: 'Cosechando', cocinera: 'En el fogón', camionero: pick.t.kind === 'fetch' ? 'Juntando la mercancía' : w.carry ? (w.carry.sell ? 'Vendiendo lo que sobra' : 'Cargando el camión') : 'Despidiendo el camión' };
    pick.doing = DOING[w.role];
    w.task = pick;
    w.status = `Va a ${pick.verb}`;
    w.busy = true;
    w.path = path.map(([x, z]) => ({ x: x + 0.5, z: z + 0.5 }));
    if (pick.t.kind === 'egg') w.path[w.path.length - 1] = this.eggPos(pick.t.id);
    if (w.path.length > 1) w.path.shift();
    else if (Math.hypot(w.path[0].x - w.x, w.path[0].z - w.z) < 0.05) w.path = null;
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
  // dt = segundos de juego (más grandes al adelantar); pdt = segundos reales para el guajiro.
  update(dt, pdt = dt) {
    const s = this.s, t = now();
    // jugador
    const p = this.player;
    if (p.path) {
      this.stepAlong(p, pdt);
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
    // camiones
    this.updateTrucks(dt);
    // fogón
    for (const key of this.procKeys()) {
      const k = this.proc(key);
      if (k.recipe && t - k.at >= RECIPES[k.recipe].time) { k.ready = RECIPES[k.recipe].out; k.recipe = null; this.h.changed('kitchen'); }
    }
    for (const [id, st] of Object.entries(STRUCTURES)) {
      const b = s.built[id];
      if (b && st.kind === 'animal' && !b.ready && t - b.at >= st.produce.time) { b.ready = true; this.h.changed('built'); }
    }
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
