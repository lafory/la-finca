import './style.css';
import './extensions.js'; // primero: los módulos se registran antes de crear la partida
import { viewSize, watchViewport, CAN_FULLSCREEN } from './viewport.js';
import * as THREE from 'three';
import { newGame, load, save, resetSave, now, isOwned, parcelAt, invCount, CLOCK, structOpen } from './state.js';
import { TAP_HANDLERS } from './registry.js';
import { ZONES, zoneOpen, zoneAt, isAnyRoad, PLANT_BY_ID, inFarm } from './zones.js';
import { Sim } from './sim.js';
import { World } from './world.js';
import { CameraRig } from './camera.js';
import { Input } from './input.js';
import { Sound } from './audio.js';
import { UI } from './ui.js';
import { ICON } from './icons.js';
import { W, H, PARCELS, START_AREA, BUILDINGS, TRUCK_TILES, TRUCK_SPOT, FF_SPEEDS, FF_STEP, CROPS, STRUCTURES, TRUCK_SLOTS, GW, GH, xpForLevel } from './data.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    const saved = load();
    this.hadSave = !!saved;
    const state = saved || newGame();
    this.sound = new Sound();
    this.started = false;
    this.ffSpeed = 1;
    this.ffPlot = null;
    this.lastSfx = {};
    this.offline = saved ? this.offlineBefore(state) : null;
    this.sim = new Sim(state, this.hooks());
    this.sim.update(0); // pone al día huevos/cultivos del tiempo fuera
    this.rig = new CameraRig(viewSize().w / viewSize().h);
    this.isPhone = Math.min(viewSize().w, viewSize().h) < 600 || matchMedia('(pointer: coarse)').matches;
    const q = state.settings.quality || 'auto';
    this.world = new World(this.canvas, this.sim, q === 'auto' ? (this.isPhone ? 'media' : 'alta') : q);
    this.perf = { sum: 0, n: 0, checks: 0 };
    this.input = new Input(this.canvas, this.rig, { onTap: (x, y) => this.tap(x, y), onUse: () => { this.sound.unlock(); this.sim.use(); } });
    this.ui = new UI(this);
    this.rig.follow = this.sim.player;
    this.resize();
    this.fitFarm(true);
    this.updateBounds(true);
    watchViewport(() => this.resize());
    document.addEventListener('visibilitychange', () => { if (document.hidden && !this.resetting) save(this.sim.s); });
    window.addEventListener('pagehide', () => { if (!this.resetting) save(this.sim.s); });
    this.saveTimer = 0;
    this.clock = new THREE.Timer();
    this.fps = { frames: 0, t: 0, value: 60 };
    this.setupTitle();
    window.__finca = this; // ganchos para pruebas automatizadas
    this.renderer = this.world.renderer;
    this.renderer.setAnimationLoop(() => this.frame());
  }

  hooks() {
    return {
      toast: (t) => this.ui?.toast(t),
      float: (x, z, t, c) => this.ui?.float(x, z, t, c),
      sfx: (n) => {
        // al adelantar, no repetir el mismo sonido muchas veces seguidas
        if (this.ffSpeed > 1) { const t = performance.now(); if (t - (this.lastSfx[n] || 0) < 400) return; this.lastSfx[n] = t; }
        this.sound.play(n);
      },
      levelUp: (l) => {
        this.sound.play('level'); this.ui?.levelUp(l);
        // zonas nuevas y solares del batey aparecen al subir
        if (this.world && this.rig && (Object.values(ZONES).some((z) => z.level === l) || Object.values(STRUCTURES).some((st) => st.zone && st.level === l))) { this.world.buildStatic(); this.updateBounds(); this.sim.reach = null; this.sim.rebuildGrid(); }
      },
      changed: (k) => {
        this.ui?.refreshHud();
        if (!this.world) return;
        if (k === 'plots') this.world.plotsDirty = true;
        if (k === 'land') { this.world.buildStatic(); save(this.sim.s); }
        if (k === 'obstacles') { this.world.buildObstacles(); }
        if (k === 'manigua' && this.world.zones) this.world.zones.dirty = true;
        if (k === 'travel') { this.updateBounds(true); this.centerPlayer(); this.rig.target.copy(this.rig.goal); this.world.puff(this.sim.player.x, 0.3, this.sim.player.z, 0xe8dcc0, 10, 1.5); }
      },
      openTruck: (i) => this.ui.openTruck(i),
      openKitchen: (key) => this.ui.openKitchen(key),
      openBuild: (id) => this.ui.openBuild(id),
      openShop: () => this.ui.openShop(),
      marker: (t) => {},
      burst: (x, z, item) => this.world.puff(x, 0.4, z, item === 'tomato' ? 0xd2402c : item === 'cane' ? 0xc9c070 : 0x9a6a2e, 5, 1.2),
      layed: (c) => { if (this.started && Math.random() < 0.5) this.sound.play('cluck'); },
    };
  }

  offlineBefore(s) {
    const t = now(), away = t - (s.savedAt || t);
    if (away < 30) return null;
    return { away, eggs: s.eggs.length, ripe: 0 };
  }
  offlineSummary() {
    const o = this.offline;
    if (!o) return;
    const s = this.sim.s;
    const eggs = Math.max(0, s.eggs.length - o.eggs);
    const ripe = s.plots.filter((p) => this.sim.plotState(p) === 'ripe').length;
    const mins = Math.round(o.away / 60);
    const bits = [];
    if (eggs) bits.push(`${eggs} huevo${eggs > 1 ? 's' : ''} nuevos`);
    if (ripe) bits.push(`${ripe} cantero${ripe > 1 ? 's' : ''} listos`);
    if (bits.length) this.ui.toast(`Mientras no estabas (${mins < 1 ? 'un rato' : `${mins} min`}): ${bits.join(', ')}.`);
  }

  setupTitle() {
    const t = document.getElementById('title');
    const btn = document.getElementById('start');
    btn.textContent = this.hadSave ? 'Continuar la finca' : 'Entrar a la finca';
    document.getElementById('flag').innerHTML = ICON.flag;
    btn.addEventListener('click', () => {
      this.sound.unlock();
      if (this.ui.isTouch && CAN_FULLSCREEN) this.ui.toggleFullscreen(true); // nunca en Safari de iPhone/iPad
      t.classList.add('gone');
      setTimeout(() => t.remove(), 600);
      this.started = true;
      this.sound.play('horn');
      this.offlineSummary();
      setTimeout(() => this.resize(), 300);
    });
  }

  project(x, y, z) {
    const v = new THREE.Vector3(x, y, z).project(this.rig.camera);
    return { x: (v.x * 0.5 + 0.5) * this.vw, y: (-v.y * 0.5 + 0.5) * this.vh, ok: v.z < 1 };
  }

  ownedRect() {
    const s = this.sim.s;
    let x0 = START_AREA.x0, z0 = START_AREA.z0, x1 = START_AREA.x1 + 3, z1 = START_AREA.z1 + 1;
    for (const p of PARCELS) if (s.parcels.includes(p.id)) { x0 = Math.min(x0, p.rect.x0); z0 = Math.min(z0, p.rect.z0); x1 = Math.max(x1, p.rect.x1 + 1); z1 = Math.max(z1, p.rect.z1 + 1); }
    return { x0, z0, x1, z1 };
  }
  // Todo lo que se puede recorrer: tierra propia + zonas abiertas
  worldRect() {
    const r = this.ownedRect();
    for (const [id, z] of Object.entries(ZONES)) {
      if (z.road || !zoneOpen(this.sim.s, id)) continue;
      r.x0 = Math.min(r.x0, z.rect.x0); r.z0 = Math.min(r.z0, z.rect.z0); r.x1 = Math.max(r.x1, z.rect.x1 + 1); r.z1 = Math.max(r.z1, z.rect.z1 + 1);
    }
    return r;
  }
  // Paneo y zoom máximo según la tierra propia (se animan al comprar)
  updateBounds(snap = false) {
    const r = this.worldRect();
    this.rig.setBounds({ x0: r.x0 - 3, z0: r.z0 - 3, x1: r.x1 + 3, z1: r.z1 + 3 }, snap);
    this.rig.setMaxDist(Math.max(46, this.rig.fitDist(r.x0, r.z0, r.x1, r.z1) * 1.15), snap);
  }
  // Vista inicial/cercana: la finca original (como antes)
  fitFarm(snap) {
    const r = { x0: START_AREA.x0, z0: START_AREA.z0, x1: START_AREA.x1 + 3, z1: START_AREA.z1 + 1 };
    this.rig.fit(r.x0, r.z0, r.x1, r.z1, snap);
    if (Math.min(viewSize().w, viewSize().h) < 500) this.rig.goalDist = Math.max(this.rig.minDist, this.rig.goalDist * 0.8);
    if (snap) this.rig.dist = this.rig.goalDist;
    this.closeDist = this.rig.goalDist;
    this.rig.manualUntil = performance.now() + 1500;
  }
  // "Ver finca": encuadra toda la tierra propia
  viewFarm() {
    const r = this.ownedRect();
    this.updateBounds();
    this.rig.maxDist = Math.max(this.rig.maxDist, this.rig.fitDist(r.x0, r.z0, r.x1, r.z1));
    this.rig.fit(r.x0, r.z0, r.x1, r.z1);
    this.rig.manualUntil = performance.now() + 6000;
  }
  // Vista de todo lo abierto (finca + manigua + batey)
  viewWorld() {
    const r = this.worldRect();
    this.updateBounds();
    this.rig.maxDist = Math.max(this.rig.maxDist, this.rig.fitDist(r.x0, r.z0, r.x1, r.z1));
    this.rig.fit(r.x0, r.z0, r.x1, r.z1);
    this.rig.manualUntil = performance.now() + 6000;
  }
  goManigua() { this.sound.unlock(); if (this.sim.goManigua()) this.sound.play('tap'); }
  goBatey() { this.sound.unlock(); if (this.sim.goBatey()) this.sound.play('tap'); }
  goFarm() { this.sound.unlock(); this.sim.goFarm(); this.sound.play('tap'); }
  // Trucos solo para desarrollo (no salen en el juego publicado)
  cheat(k) {
    if (!import.meta.env.DEV && !window.__fincaDev) return;
    const s = this.sim.s;
    if (k === 'level') { const need = xpForLevel(s.level + 1) - s.xp; this.sim.addXp(Math.max(1, need)); }
    if (k === 'money') this.sim.addMoney(1000);
    if (k === 'wood') this.sim.addWood(100);
    this.ui.refreshHud();
  }
  // "Centrar": vuelve a la vista cercana sobre el guajiro
  centerPlayer() {
    this.rig.goal.set(this.sim.player.x, 0, this.sim.player.z);
    this.rig.clampGoal();
    this.rig.goalDist = Math.min(this.closeDist || 20, 22);
    this.rig.recenter();
  }
  onLandChanged() {
    this.world.buildStatic();
    this.ui.refreshHud();
    this.updateBounds();
    this.viewFarm();
    save(this.sim.s);
  }
  resize() {
    const { w, h } = viewSize();
    this.vw = w; this.vh = h;
    this.world.resize(w, h);
    this.rig.setAspect(w / h);
    if (this.sim) this.updateBounds(true);
  }
  resetGame() {
    resetSave();
    this.resetting = true;
    location.reload();
  }
  tut(ev) { /* el tutorial avanza leyendo el estado real */ }

  // Calidad automática: si el tiempo de cuadro promedio pasa de ~25 ms, baja un escalón.
  autoQuality(dt) {
    if (!this.started || (this.sim.s.settings.quality || 'auto') !== 'auto' || document.hidden) return;
    const p = this.perf;
    p.sum += dt; p.n++;
    if (p.sum < 3) return;
    const avg = p.sum / p.n;
    p.sum = 0; p.n = 0; p.checks++;
    if (p.checks < 2) return; // ignora el arranque
    const order = ['alta', 'media', 'baja'];
    const i = order.indexOf(this.world.quality);
    if (avg > 0.025 && i < 2) { this.world.setQuality(order[i + 1]); this.resize(); }
  }
  setQuality(q) {
    this.sim.s.settings.quality = q;
    this.perf = { sum: 0, n: 0, checks: 0 };
    this.world.setQuality(q === 'auto' ? (this.isPhone ? 'media' : 'alta') : q);
    this.resize();
  }

  // ------------------------------------------------------------ adelantar el tiempo
  setSpeed(sp) {
    if (sp === this.ffSpeed) return;
    this.ffSpeed = sp;
    if (sp === 1) this.ffPlot = null;
    else { this.sim.s.ffUsed = true; this.ui.focusPlot = null; }
    this.sound.play(sp > 1 ? 'level' : 'tap');
  }
  cycleSpeed() {
    const i = FF_SPEEDS.indexOf(this.ffSpeed);
    this.setSpeed(FF_SPEEDS[(i + 1) % FF_SPEEDS.length]);
  }
  fastForwardPlot(p) {
    if (!p || !p.crop || this.sim.plotState(p) !== 'growing') return;
    this.setSpeed(20);
    this.ffPlot = p;
  }
  focusWorker(role) {
    const w = this.sim.workerById(role);
    if (!w) return;
    this.rig.goal.set(w.x, 0, w.z);
    this.rig.manualUntil = performance.now() + 5000;
  }

  commandTarget(t) { this.sim.command(t); this.ui.closeSheet(); }

  // Toque en el mundo: decide qué tocaste y manda al guajiro.
  debugPick(cx, cy) {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(this.input.ndc(cx, cy), this.rig.camera);
    const p = this.input.ground(cx, cy);
    return { kind: this.world.pick(ray), ground: p && [+p.x.toFixed(2), +p.z.toFixed(2)] };
  }
  tap(cx, cy) {
    if (!this.started) return;
    this.sound.unlock();
    const ray = new THREE.Raycaster();
    ray.setFromCamera(this.input.ndc(cx, cy), this.rig.camera);
    const kind = this.world.pick(ray);
    const s = this.sim.s;
    const go = (t, mx, mz) => { if (this.sim.command(t)) { this.world.showMarker(mx, mz); this.sound.play('tap'); } };
    if (kind && kind.includes(':') && TAP_HANDLERS[kind.split(':')[0]]) return TAP_HANDLERS[kind.split(':')[0]](this, kind.slice(kind.indexOf(':') + 1));
    if (kind && kind.startsWith('worker:')) return this.ui.openWorker(kind.slice(7));
    if (kind && kind.startsWith('wild:')) { const a = this.sim.wildById(+kind.slice(5)); if (a) return go({ kind: 'wild', id: a.id }, a.x, a.z); }
    if (kind && kind.startsWith('wplant:')) return this.tapPlant(kind.slice(7));
    if (kind && kind.startsWith('struct:')) {
      const id = kind.slice(7), st = STRUCTURES[id];
      if (!s.built[id] || st.zone) return this.ui.openBuild(id);
      return go({ kind: 'struct', id }, st.x + st.w / 2, st.z + st.h + 0.5);
    }
    if (kind === 'truck:1') return go({ kind: 'truck', i: 1 }, 14.5, TRUCK_SLOTS[1]);
    if (kind === 'truck' || (kind && kind.startsWith('truckq'))) {
      if (kind !== 'truck') return this.ui.toast('Ese camión está esperando en la fila. Atiende primero al de adelante.');
      if (this.sim.truckParked()) return go({ kind: 'truck' }, 14.5, 9.5);
      return this.ui.toast('El camión está entrando. Un momentico.');
    }
    if (kind) { const b = BUILDINGS[kind]; return go({ kind }, b.x + b.w / 2, b.z + b.h + 0.5); }
    const p = this.input.ground(cx, cy);
    if (!p) return;
    // huevos cerca del toque
    let best = null, bd = 0.6;
    for (const e of s.eggs) { const d = Math.hypot(e.x - p.x, e.z - p.z); if (d < bd) { bd = d; best = e; } }
    if (best) return go({ kind: 'egg', id: best.id }, best.x, best.z);
    const tx = Math.floor(p.x), tz = Math.floor(p.z);
    if (tx < 0 || tz < 0 || tx >= GW || tz >= GH) return;
    if (!inFarm(tx, tz)) {
      // fuera de la finca: plantas de la manigua (tolera tocar la copa), caminos y zonas abiertas
      let pl = this.sim.plantAtTile(tx, tz), pd = 1.3;
      if (!pl) for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        const q = this.sim.plantAtTile(tx + dx, tz + dz);
        if (!q) continue;
        const d = Math.hypot(q.x + 0.5 - p.x, q.z + 0.5 - p.z);
        if (d < pd) { pd = d; pl = q; }
      }
      if (pl) return this.tapPlant(pl.id);
      const zid = zoneAt(tx, tz);
      if (zid && !isAnyRoad(tx, tz) && !zoneOpen(s, zid)) return this.ui.toast(`${ZONES[zid].name}: ${ZONES[zid].soon ? 'muy pronto' : `se abre en el nivel ${ZONES[zid].level}`}.`);
      return go({ kind: 'ground', x: tx, z: tz }, tx + 0.5, tz + 0.5);
    }
    // obstáculos: tolera tocar la parte alta (cae una casilla detrás)
    let obs = this.sim.obstacleAt(tx, tz);
    if (!obs) {
      let od = 0.95;
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        const o = this.sim.obstacleAt(tx + dx, tz + dz);
        if (!o) continue;
        const d = Math.hypot(o.x + 0.5 - p.x, o.z + 0.5 - p.z);
        if (d < od) { od = d; obs = o; }
      }
      if (obs && s.plots.some((q) => q.x === tx && q.z === tz)) obs = null;
    }
    if (obs) return this.ui.openObstacle(obs);
    const plot = s.plots.find((q) => q.x === tx && q.z === tz);
    if (plot) {
      if (plot.crop && this.sim.plotState(plot) === 'growing') this.ui.focus(plot);
      return go({ kind: 'plot', p: plot }, tx + 0.5, tz + 0.5);
    }
    if (!isOwned(s, tx, tz)) {
      const par = parcelAt(tx, tz);
      if (par) return this.ui.openLand();
      return;
    }
    if (TRUCK_TILES.some(([x, z]) => x === tx && z === tz) && this.sim.truckParked()) return go({ kind: 'truck' }, 14.5, 9.5);
    go({ kind: 'ground', x: tx, z: tz }, tx + 0.5, tz + 0.5);
  }

  tapPlant(id) {
    const pl = PLANT_BY_ID.get(id);
    if (!pl) return;
    if (this.sim.command({ kind: 'wplant', id })) { this.world.showMarker(pl.x + 0.5, pl.z + 0.5); this.sound.play('tap'); }
  }

  frame() {
    this.clock.update();
    const dt = Math.min(0.1, this.clock.getDelta());
    const time = this.clock.getElapsed();
    if (this.started) {
      const dir = this.input.moveDir();
      this.sim.freeMoving = !!dir;
      if (dir) this.sim.moveFree(dir, dt);
      // simulación en subpasos fijos: a x20 todo avanza 20 veces más rápido sin saltarse nada
      const sp = this.ffSpeed, gameDt = dt * sp;
      const n = Math.max(1, Math.ceil(gameDt / FF_STEP - 1e-6));
      for (let i = 0; i < n; i++) {
        CLOCK.offset += (gameDt - dt) / n;
        this.sim.update(gameDt / n, dt / n);
      }
      this.gameDt = gameDt;
      if (this.ffPlot && (!this.ffPlot.crop || this.sim.plotState(this.ffPlot) !== 'growing')) {
        const c = this.ffPlot.crop;
        this.setSpeed(1);
        if (c) this.ui.toast(`¡${CROPS[c].name} listo para cosechar!`);
      }
      this.saveTimer += dt;
      if (this.saveTimer > 8 && !this.resetting) { this.saveTimer = 0; save(this.sim.s); }
    }
    this.rig.update(dt);
    this.world.update(dt, time);
    this.world.updateSky(dt, this.started ? (this.gameDt || dt) : 0, this.started ? this.ffSpeed : 1);
    this.world.ffSpeed = this.ffSpeed;
    this.world.render(this.rig.camera, this.rig);
    this.ui.update(dt);
    this.autoQuality(dt);
    this.fps.frames++; this.fps.t += dt;
    if (this.fps.t >= 1) { this.fps.value = this.fps.frames / this.fps.t; this.fps.frames = 0; this.fps.t = 0; }
  }
}

new Game();
