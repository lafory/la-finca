import './style.css';
import * as THREE from 'three';
import { newGame, load, save, resetSave, now, isOwned, parcelAt, invCount, CLOCK } from './state.js';
import { Sim } from './sim.js';
import { World } from './world.js';
import { CameraRig } from './camera.js';
import { Input } from './input.js';
import { Sound } from './audio.js';
import { UI } from './ui.js';
import { ICON } from './icons.js';
import { W, H, PARCELS, START_AREA, BUILDINGS, TRUCK_TILES, TRUCK_SPOT, FF_SPEEDS, FF_STEP, CROPS } from './data.js';

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
    this.rig = new CameraRig(window.innerWidth / window.innerHeight);
    this.isPhone = Math.min(window.innerWidth, window.innerHeight) < 600 || matchMedia('(pointer: coarse)').matches;
    const q = state.settings.quality || 'auto';
    this.world = new World(this.canvas, this.sim, q === 'auto' ? (this.isPhone ? 'media' : 'alta') : q);
    this.perf = { sum: 0, n: 0, checks: 0 };
    this.input = new Input(this.canvas, this.rig, { onTap: (x, y) => this.tap(x, y), onUse: () => { this.sound.unlock(); this.sim.use(); } });
    this.ui = new UI(this);
    this.rig.follow = this.sim.player;
    this.updateBounds();
    this.resize();
    this.fitFarm(true);
    window.addEventListener('resize', () => this.resize());
    window.visualViewport?.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
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
      levelUp: (l) => { this.sound.play('level'); this.ui?.levelUp(l); },
      changed: (k) => { this.ui?.refreshHud(); if (k === 'plots') this.world && (this.world.plotsDirty = true); },
      openTruck: () => this.ui.openTruck(),
      openKitchen: () => this.ui.openKitchen(),
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
      if (this.ui.isTouch && this.ui.fsSupported()) this.ui.toggleFullscreen(true);
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
    return { x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, ok: v.z < 1 };
  }

  ownedRect() {
    const s = this.sim.s;
    let x0 = START_AREA.x0, z0 = START_AREA.z0, x1 = START_AREA.x1 + 3, z1 = START_AREA.z1 + 1;
    for (const p of PARCELS) if (s.parcels.includes(p.id)) { x0 = Math.min(x0, p.rect.x0); z0 = Math.min(z0, p.rect.z0); x1 = Math.max(x1, p.rect.x1 + 1); z1 = Math.max(z1, p.rect.z1 + 1); }
    return { x0, z0, x1, z1 };
  }
  updateBounds() { this.rig.setBounds({ x0: -2, z0: -2, x1: W + 2, z1: H + 2 }); }
  fitFarm(snap) {
    const r = this.ownedRect();
    this.rig.fit(r.x0, r.z0, r.x1, r.z1, snap);
    // en pantallas chicas acerca un poco más
    if (Math.min(window.innerWidth, window.innerHeight) < 500) this.rig.goalDist = Math.max(this.rig.minDist, this.rig.goalDist * 0.8);
    if (snap) this.rig.dist = this.rig.goalDist;
    this.rig.manualUntil = performance.now() + 1500;
  }
  onLandChanged() {
    this.world.buildStatic();
    this.ui.refreshHud();
    this.fitFarm(false);
    save(this.sim.s);
  }
  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.world.resize(w, h);
    this.rig.setAspect(w / h);
    // en horizontal en teléfono, un poco más de alcance de zoom
    this.rig.maxDist = w > h ? 42 : 52;
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
    const w = this.sim.workers.find((x) => x.role === role);
    if (!w) return;
    this.rig.goal.set(w.x, 0, w.z);
    this.rig.manualUntil = performance.now() + 5000;
  }

  commandTarget(t) { this.sim.command(t); this.ui.closeSheet(); }

  // Toque en el mundo: decide qué tocaste y manda al guajiro.
  tap(cx, cy) {
    if (!this.started) return;
    this.sound.unlock();
    const ray = new THREE.Raycaster();
    ray.setFromCamera(this.input.ndc(cx, cy), this.rig.camera);
    const kind = this.world.pick(ray);
    const s = this.sim.s;
    const go = (t, mx, mz) => { if (this.sim.command(t)) { this.world.showMarker(mx, mz); this.sound.play('tap'); } };
    if (kind && kind.startsWith('worker:')) return this.ui.openWorker(kind.slice(7));
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
    if (tx < 0 || tz < 0 || tx >= W || tz >= H) return;
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
    this.world.render(this.rig.camera);
    this.ui.update(dt);
    this.autoQuality(dt);
    this.fps.frames++; this.fps.t += dt;
    if (this.fps.t >= 1) { this.fps.value = this.fps.frames / this.fps.t; this.fps.frames = 0; this.fps.t = 0; }
  }
}

new Game();
