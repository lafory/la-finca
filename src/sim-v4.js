// v4: lógica fuera de la finca — manigua (leña, frutas, animales), batey (casas, tope de trabajadores), leñero.
import { ITEMS, STRUCTURES, WORKERS, WOOD_CAP, GW, BUILDINGS, LENADOR_LOAD, STORAGE_WOOD } from './data.js';
import { ZONES, MANIGUA, PLANT_BY_ID, PLANT_AT, WILD_PLANTS, WILD_ANIMALS, CARRY_MAX, zoneOpen, inFarm, inRect, BATEY } from './zones.js';
import { RESOURCES } from './registry.js';
import { now, chickenCap, addChicken, workerCap, structOpen } from './state.js';

const ART = { jutia: ['la', 'a'], jibaro: ['el', 'o'], guinea: ['la', 'a'], gallina: ['la', 'a'], caballo: ['el', 'o'] };
const nameOf = (k, q) => (q === 1 ? ITEMS[k].name : ITEMS[k].plural).toLowerCase();

export function installV4(Sim) {
  const P = Sim.prototype;

  P.v4init = function () {
    this.wildRT = new Map();
    this.regrowTick = 0;
    this.wildTick = 0;
    this.reach = null;
  };
  // ------------------------------------------------------------ bonos del batey
  P.civic = function (k) {
    let v = 0;
    for (const [id, st] of Object.entries(STRUCTURES)) if (st.kind === 'civic' && this.s.built[id] && st.effect[k]) v += st.effect[k];
    return v;
  };
  P.discount = function () { return 1 - this.civic('discount'); };
  P.workerCap = function () { return workerCap(this.s); };

  // ------------------------------------------------------------ recursos (madera y los registrados)
  P.addRes = function (id, n, x, z) {
    const s = this.s, R = RESOURCES[id];
    if (!R) return false;
    const add = Math.min(n, (R.cap ?? 9999) - (s.res[id] || 0));
    if (add <= 0) { this.h.toast(`No cabe más ${R.name.toLowerCase()} (tope ${R.cap}).`); return false; }
    s.res[id] = (s.res[id] || 0) + add; s.stats[id] = (s.stats[id] || 0) + add;
    if (x !== undefined) this.h.float(x, z, `+${add} ${R.name.toLowerCase()}`, 'item');
    this.h.changed('res');
    return true;
  };
  P.hasRes = function (id, n) { return (this.s.res[id] || 0) >= (n || 0); };
  P.spendRes = function (id, n) {
    if (!n) return true;
    const R = RESOURCES[id];
    if (!this.hasRes(id, n)) { this.h.toast(`Hace falta ${n} de ${R.name.toLowerCase()} (tienes ${this.s.res[id] || 0}).${id === 'madera' ? ' Búscala en la manigua.' : ''}`); this.h.sfx('error'); return false; }
    this.s.res[id] -= n; this.h.changed('res'); return true;
  };
  // Coste genérico: { pesos, madera, res: { id: n }, items: { item: n } }. canPay avisa de lo que falta; pay cobra todo o nada.
  P.costParts = function (c) {
    const res = { ...(c.res || {}) };
    if (c.madera) res.madera = (res.madera || 0) + c.madera;
    return { pesos: c.pesos || c.price || 0, res, items: c.items || {} };
  };
  P.canPay = function (c, quiet) {
    const { pesos, res, items } = this.costParts(c), s = this.s;
    const miss = (msg) => { if (!quiet) { this.h.toast(msg); this.h.sfx('error'); } return false; };
    for (const [k, n] of Object.entries(res)) if ((s.res[k] || 0) < n) return miss(`Hace falta ${n} de ${RESOURCES[k].name.toLowerCase()} (tienes ${s.res[k] || 0}).${k === 'madera' ? ' Búscala en la manigua.' : ''}`);
    for (const [k, n] of Object.entries(items)) if ((s.inv[k] || 0) < n) return miss(`Hacen falta ${n} ${ITEMS[k].plural.toLowerCase()} (tienes ${s.inv[k] || 0}).`);
    if (s.money < pesos) return miss('Todavía no alcanzan los pesos.');
    return true;
  };
  P.pay = function (c) {
    if (!this.canPay(c)) return false;
    const { pesos, res, items } = this.costParts(c), s = this.s;
    if (pesos && !this.spend(pesos)) return false;
    for (const [k, n] of Object.entries(res)) s.res[k] -= n;
    for (const [k, n] of Object.entries(items)) s.inv[k] -= n;
    this.h.changed('res'); this.h.changed('inv');
    return true;
  };
  P.addWood = function (n, x, z) { return this.addRes('madera', n, x, z); };
  P.spendWood = function (n) { return this.spendRes('madera', n); };
  P.storageWood = function () { return STORAGE_WOOD[this.s.upgrades.storage] || 0; };

  // ------------------------------------------------------------ plantas de la manigua
  P.plantStanding = function (id) { return !this.s.chopped[id]; };
  P.fruitReady = function (pl, t = now()) {
    const W = WILD_PLANTS[pl.kind];
    if (!W.fruit) return false;
    const at = this.s.fruit[pl.id];
    return !at || t - at >= W.regrow;
  };
  P.plantAtTile = function (x, z) {
    const p = PLANT_AT.get(z * GW + x);
    return p && this.plantStanding(p.id) ? p : null;
  };
  P.chopPlant = function (id, byWorker) {
    const s = this.s, pl = PLANT_BY_ID.get(id);
    if (!pl || s.chopped[id]) return false;
    const W = WILD_PLANTS[pl.kind];
    if (!W.chop) return false;
    if (!zoneOpen(s, 'manigua')) return false;
    s.chopped[id] = now();
    this.rebuildGrid();
    this.addXp(pl.kind === 'arbol' ? 3 : 1);
    if (byWorker) return W.madera;
    this.addWood(W.madera, pl.x + 0.5, pl.z + 0.5);
    this.h.sfx('harvest');
    this.h.burst?.(pl.x + 0.5, pl.z + 0.5, 'tobacco');
    this.h.changed('manigua');
    return true;
  };
  P.pickFruit = function (id) {
    const s = this.s, pl = PLANT_BY_ID.get(id);
    if (!pl || !this.fruitReady(pl)) { this.h.toast('Todavía no hay frutas. Vuelve más tarde.'); return false; }
    const W = WILD_PLANTS[pl.kind];
    if (!this.addItem(W.fruit, W.qty, pl.x + 0.5, pl.z + 0.5)) return false;
    s.fruit[pl.id] = now();
    s.stats.fruit = (s.stats.fruit || 0) + W.qty;
    this.addXp(ITEMS[W.fruit].xp * W.qty);
    this.h.sfx('harvest');
    this.h.changed('manigua');
    return true;
  };
  P.usePlantTarget = function (id) {
    const pl = PLANT_BY_ID.get(id);
    if (!pl) return false;
    const W = WILD_PLANTS[pl.kind];
    if (W.sacred) { this.h.toast('La ceiba no se tumba, compay: es sagrada. Descansa un rato a su sombra.'); return true; }
    if (W.royal) { this.h.toast('La palma real no se corta: es el árbol nacional. Busca guásimas o marabú.'); return true; }
    if (W.fruit) return this.pickFruit(id);
    return this.chopPlant(id);
  };

  // ------------------------------------------------------------ animales del monte
  P.reachable = function () {
    // tiles de la manigua a los que se llega desde la entrada (se recalcula al tumbar árboles)
    if (this.reach && this.reach.gen === this.gridGen) return this.reach.set;
    const R = ZONES.manigua.rect, set = new Set(), q = [];
    for (let x = R.x0; x <= R.x1; x++) { const k = R.z1 * GW + x; if (!this.grid.blocked[k]) { set.add(k); q.push(k); } }
    while (q.length) {
      const k = q.pop(), x = k % GW, z = (k / GW) | 0;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, nz = z + dz;
        if (!inRect(R, nx, nz)) continue;
        const nk = nz * GW + nx;
        if (set.has(nk) || this.grid.blocked[nk]) continue;
        set.add(nk); q.push(nk);
      }
    }
    this.reach = { gen: this.gridGen, set, list: [...set] };
    return set;
  };
  P.randomWildTile = function (far = 6) {
    this.reachable();
    const L = this.reach.list, p = this.player;
    for (let i = 0; i < 30; i++) {
      const k = L[Math.floor(Math.random() * L.length)], x = k % GW, z = (k / GW) | 0;
      if (z > ZONES.manigua.rect.z1 - 3) continue;
      if (Math.hypot(x - p.x, z - p.z) >= far) return [x, z];
    }
    return null;
  };
  P.spawnWild = function () {
    const s = this.s;
    for (const [kind, A] of Object.entries(WILD_ANIMALS)) {
      if (kind === 'caballo' && s.horse) continue;
      const n = s.wild.filter((w) => w.kind === kind).length;
      if (n >= A.max) continue;
      const tile = this.randomWildTile();
      if (!tile) return;
      s.wild.push({ id: s.nextId++, kind, x: tile[0] + 0.5, z: tile[1] + 0.5 });
      return; // de uno en uno
    }
  };
  P.updateWild = function (dt) {
    const s = this.s;
    if (!zoneOpen(s, 'manigua')) return;
    this.wildTick -= dt;
    if (this.wildTick <= 0) { this.wildTick = s.wild.length < 4 ? 3 : 25; this.spawnWild(); }
    const set = this.reachable();
    for (const a of s.wild) {
      let rt = this.wildRT.get(a.id);
      if (!rt) { rt = { tx: a.x, tz: a.z, wait: Math.random() * 3, face: Math.random() * 6, moving: false }; this.wildRT.set(a.id, rt); }
      const A = WILD_ANIMALS[a.kind];
      const target = this.player.task?.kind === 'wild' && this.player.task.id === a.id;
      if (target) { rt.moving = false; continue; } // se queda quieto mientras lo buscas
      rt.wait -= dt;
      if (rt.wait <= 0) {
        rt.wait = 1.5 + Math.random() * 4;
        const cx = Math.floor(a.x), cz = Math.floor(a.z);
        for (let i = 0; i < 6; i++) {
          const nx = cx + Math.round((Math.random() - 0.5) * 6), nz = cz + Math.round((Math.random() - 0.5) * 6);
          if (set.has(nz * GW + nx) && this.lineFree(cx, cz, nx, nz)) { rt.tx = nx + 0.5; rt.tz = nz + 0.5; break; }
        }
      }
      const dx = rt.tx - a.x, dz = rt.tz - a.z, d = Math.hypot(dx, dz);
      rt.moving = d > 0.05;
      if (rt.moving) { const v = Math.min(d, dt * A.speed); a.x += (dx / d) * v; a.z += (dz / d) * v; rt.face = Math.atan2(dx, dz); }
    }
  };
  P.lineFree = function (x0, z0, x1, z1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(z1 - z0));
    for (let i = 1; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n), z = Math.round(z0 + ((z1 - z0) * i) / n);
      if (this.grid.blocked[z * GW + x]) return false;
    }
    return true;
  };
  P.wildById = function (id) { return this.s.wild.find((w) => w.id === id) || null; };
  P.catchWild = function (id) {
    const s = this.s, a = this.wildById(id);
    if (!a) return false;
    const A = WILD_ANIMALS[a.kind], p = this.player;
    if (Math.hypot(a.x - p.x, a.z - p.z) > 1.9) { this.h.toast(`${A.name}: se movió. Tócalo otra vez.`); return false; }
    if (s.carry.length >= CARRY_MAX) { this.h.toast(`Ya llevas ${CARRY_MAX} animales. Llévalos a la finca primero.`); this.h.sfx('error'); return false; }
    let ok = Math.random() < A.chance;
    if (A.tame) { s.tame[id] = (s.tame[id] || 0) + 1; if (s.tame[id] >= A.tame) ok = true; }
    if (!ok) {
      const rt = this.wildRT.get(id);
      if (rt) { rt.wait = 0; }
      const left = A.tame ? ` (${s.tame[id]}/${A.tame} para domarlo)` : '';
      this.h.toast(`¡Se escapó ${ART[a.kind][0]} ${A.name.toLowerCase()}! Inténtalo otra vez${left}.`);
      this.h.float(a.x, a.z, '¡Se escapó!', 'xp');
      // salta lejos
      const set = this.reachable(), cx = Math.floor(a.x), cz = Math.floor(a.z);
      for (let i = 0; i < 12 && rt; i++) {
        const nx = cx + Math.round((Math.random() - 0.5) * 9), nz = cz + Math.round((Math.random() - 0.5) * 9);
        if (Math.hypot(nx - cx, nz - cz) > 2.5 && set.has(nz * GW + nx)) { rt.tx = nx + 0.5; rt.tz = nz + 0.5; rt.wait = 4; break; }
      }
      return false;
    }
    s.wild = s.wild.filter((w) => w.id !== id);
    this.wildRT.delete(id);
    s.carry.push({ kind: a.kind });
    s.stats.caught = (s.stats.caught || 0) + 1;
    this.addXp(a.kind === 'caballo' ? 25 : 6);
    this.h.sfx('level');
    this.h.float(a.x, a.z, a.kind === 'caballo' ? '¡Domado!' : '¡Atrapado!', 'xp');
    this.h.toast(a.kind === 'caballo' ? '¡Domaste al caballo! Llévalo a la finca.' : `¡${A.name} atrapad${ART[a.kind][1]}! Llév${ART[a.kind][1] === 'a' ? 'ala' : 'alo'} a la finca (${s.carry.length}/${CARRY_MAX}).`);
    this.h.changed('carry');
    return true;
  };
  // Se entrega lo que llevas al entrar en la finca
  P.deliverCarry = function () {
    const s = this.s;
    if (!s.carry.length) return;
    const msgs = [];
    for (const c of s.carry) {
      if (c.kind === 'caballo') { s.horse = true; msgs.push('el caballo ya está en el bohío (caminas más rápido)'); continue; }
      if (c.kind === 'gallina' || c.kind === 'guinea') {
        if (s.chickens.length < chickenCap(s)) { addChicken(s); if (c.kind === 'guinea') s.chickens[s.chickens.length - 1].guinea = true; msgs.push(c.kind === 'guinea' ? 'una guinea al corral' : 'una gallina al corral'); }
        else { this.addMoney(15); msgs.push('el corral está lleno: la vendiste a un vecino (+15)'); }
        continue;
      }
      if (c.kind === 'jibaro' && s.built.cerdos && (s.built.cerdos.extra || 0) < 3) { s.built.cerdos.extra = (s.built.cerdos.extra || 0) + 1; msgs.push('un jíbaro al chiquero (+1 pieza de carne)'); continue; }
      const item = c.kind === 'jibaro' ? 'jibaro' : 'jutia';
      if (this.space() > 0) { s.inv[item]++; msgs.push(`${nameOf(item, 1)} a la canasta`); }
      else { this.addMoney(Math.round(ITEMS[item].sell * 0.6)); msgs.push(`no cabía: lo vendiste (+${Math.round(ITEMS[item].sell * 0.6)})`); }
    }
    s.carry = [];
    this.player.speed = this.playerSpeed();
    this.h.sfx('coins');
    this.h.toast(`De vuelta en la finca: ${msgs.join(', ')}.`);
    this.h.changed('carry');
    this.h.changed('chickens');
    this.h.changed('inv');
  };
  // Viaje rápido (finca ↔ manigua/batey): el camino a pie es largo
  P.teleport = function (x, z) {
    const p = this.player;
    p.x = x; p.z = z; p.path = null; p.task = null; p.moving = false;
    this.h.changed('travel');
  };
  P.goManigua = function () {
    if (!zoneOpen(this.s, 'manigua')) { this.h.toast(`La manigua se abre en el nivel ${ZONES.manigua.level}.`); return false; }
    this.teleport(48.5, 38.5);
    this.h.toast('La manigua: tumba árboles con el machete, recoge frutas y atrapa animales.');
    return true;
  };
  P.goBatey = function () {
    if (!zoneOpen(this.s, 'batey')) { this.h.toast(`El batey se abre en el nivel ${ZONES.batey.level}.`); return false; }
    this.teleport(13.5, 47.5);
    return true;
  };
  P.goFarm = function () {
    this.teleport(13.5, 10.5);
    if (this.s.carry.length) this.deliverCarry();
    return true;
  };
  P.outside = function () { const p = this.player; return !inFarm(Math.floor(p.x), Math.floor(p.z)); };
  P.playerSpeed = function () { return this.s.horse ? 6.9 : 4.6; };

  // ------------------------------------------------------------ casas del batey
  P.upgradeHouse = function (id) {
    const s = this.s, st = STRUCTURES[id], b = s.built[id];
    if (!st || st.kind !== 'house' || !b || b.tier === 2) return false;
    const u = st.upgrade;
    if (s.level < u.level) { this.h.toast(`La casa de zinc se hace en el nivel ${u.level}.`); return false; }
    if (s.res.madera < u.madera) return this.spendWood(u.madera);
    if (!this.spend(u.price)) return false;
    this.spendWood(u.madera);
    b.tier = 2;
    this.addXp(20);
    this.h.sfx('level');
    this.h.toast(`¡Casa de zinc lista! Tope de trabajadores: ${this.workerCap()}.`);
    this.h.changed('land');
    return true;
  };
  P.homeOf = function (w) {
    // reparte a los trabajadores en las casas construidas (2 por casa)
    const houses = Object.keys(STRUCTURES).filter((k) => STRUCTURES[k].kind === 'house' && this.s.built[k]);
    if (!houses.length) return null;
    const i = this.workers.indexOf(w);
    return STRUCTURES[houses[Math.floor(i / 2) % houses.length]];
  };

  // ------------------------------------------------------------ tick
  P.updateV4 = function (dt) {
    const s = this.s, t = now();
    // vuelven a crecer los árboles y las frutas
    this.regrowTick -= dt;
    if (this.regrowTick <= 0) {
      this.regrowTick = 1;
      let changed = false;
      for (const [id, at] of Object.entries(s.chopped)) {
        const pl = PLANT_BY_ID.get(id);
        if (!pl) { delete s.chopped[id]; continue; }
        if (t - at < WILD_PLANTS[pl.kind].regrow) continue;
        const busy = [this.player, ...this.workers].some((e) => Math.floor(e.x) === pl.x && Math.floor(e.z) === pl.z) || s.wild.some((a) => Math.floor(a.x) === pl.x && Math.floor(a.z) === pl.z);
        if (busy) continue;
        delete s.chopped[id]; changed = true;
      }
      if (changed) { this.rebuildGrid(); this.h.changed('manigua'); }
    }
    this.updateWild(dt);
    // al entrar a la finca se entrega lo que llevas
    const p = this.player;
    if (s.carry.length && inFarm(Math.floor(p.x), Math.floor(p.z))) this.deliverCarry();
  };

  // ------------------------------------------------------------ leñero
  P.lenadorPick = function (w, free) {
    const s = this.s;
    if (!zoneOpen(s, 'manigua')) { w.status = 'La manigua se abre en el nivel 3'; return null; }
    if ((w.trees || 0) >= LENADOR_LOAD || (w.load && !this.nearestChop(w, free))) {
      const H = BUILDINGS.house;
      return { x: H.x + H.w / 2, z: H.z + H.h, t: { kind: 'woodhome' }, key: `woodhome-${w.rec.id}`, verb: `llevar ${w.load} de madera al bohío` };
    }
    if (s.res.madera >= WOOD_CAP) { w.status = 'El bohío está lleno de madera'; return null; }
    const pl = this.nearestChop(w, free);
    if (!pl) { w.status = 'Esperando que vuelvan a crecer los árboles'; return null; }
    return { x: pl.x + 0.5, z: pl.z + 0.5, t: { kind: 'wplant', id: pl.id }, key: `pl${pl.id}`, verb: `tumbar ${WILD_PLANTS[pl.kind].name === 'Marabú' ? 'marabú' : 'una guásima'}` };
  };
  P.nearestChop = function (w, free) {
    let best = null, bd = 1e9;
    const set = this.reachable();
    // desde la entrada si todavía está en la finca
    const fx = inRect(ZONES.manigua.rect, Math.floor(w.x), Math.floor(w.z)) ? w.x : 48.5, fz = fx === w.x ? w.z : 38.5;
    for (const pl of MANIGUA.plants) {
      if (!WILD_PLANTS[pl.kind].chop || this.s.chopped[pl.id] || !free(`pl${pl.id}`)) continue;
      const k = pl.z * GW + pl.x;
      if (!set.has(k + 1) && !set.has(k - 1) && !set.has(k + GW) && !set.has(k - GW)) continue;
      const d = Math.hypot(pl.x - fx, pl.z - fz) + (pl.kind === 'marabu' ? 6 : 0);
      if (d < bd) { bd = d; best = pl; }
    }
    return best;
  };
  P.lenadorDo = function (w, t) {
    if (t.kind === 'wplant') { const got = this.chopPlant(t.id, true); if (got) { w.load = (w.load || 0) + got; w.trees = (w.trees || 0) + 1; this.h.float(w.x, w.z, `+${got} madera`, 'item'); this.h.changed('manigua'); } }
    else if (t.kind === 'woodhome') { if (w.load) { this.addWood(w.load, w.x, w.z); w.load = 0; } w.trees = 0; }
  };
}
export { BATEY, structOpen };
