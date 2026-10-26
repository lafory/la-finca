// Vista y control de la granja grande: nidales/sombra/caseta del gallinero según nivel, calles del batey,
// vacas nuevas al ampliar el potrero y el modo «Arar surcos» (toques en la tierra).
import * as THREE from 'three';
import { PEN, STRUCTURES } from '../data.js';
import { zoneOpen } from '../zones.js';
import { coopLevel, COOP_LEVELS, STREETS } from './data.js';
import { nestRowGeo, henShadeGeo, henHouseGeo, streetGeo, place } from './models.js';
import { Builder } from '../models.js';

export class GranjaView {
  constructor(game) {
    this.g = game;
    this.group = new THREE.Group();
    this.group.name = 'granja';
    game.world.scene.add(this.group);
    this.sig = '';
    this.plow = { on: false, n: 2 };
    this.rebuild();
    // avisos de la simulación → rehacer lo que cambió
    const h = game.sim.h, orig = h.changed;
    h.changed = (k) => {
      orig(k);
      if (k === 'granja') { this.refreshCows(); this.placeRooster(); }
    };
    // modo arar: los toques en la tierra aran en vez de caminar
    const tap = game.tap.bind(game);
    game.tap = (cx, cy) => {
      if (!this.plow.on || !game.started) return tap(cx, cy);
      game.sound.unlock();
      const p = game.input.ground(cx, cy);
      if (!p) return;
      const n = game.sim.plow(Math.floor(p.x), Math.floor(p.z), this.plow.n);
      if (n) { game.world.showMarker(Math.floor(p.x) + 0.5, Math.floor(p.z) + 0.5); game.world.puff?.(p.x, 0.2, p.z, 0x8a3f24, 6 + n, 1.2); }
      game.ui.granja?.refreshPill();
    };
    this.placeRooster();
  }

  signature() {
    const s = this.g.sim.s;
    return `${coopLevel(s)}|${zoneOpen(s, 'batey') ? 1 : 0}`;
  }

  rebuild() {
    const s = this.g.sim.s;
    for (const c of [...this.group.children]) { this.group.remove(c); c.geometry?.dispose(); }
    const b = new Builder();
    const lvl = coopLevel(s);
    const L = COOP_LEVELS[lvl];
    // nidales pegados a la cerca de arriba (dentro del corral) y, en la granja avícola, otra fila al este
    if (lvl >= 2) {
      const top = Math.min(L.nests, 6);
      b.merge(place(nestRowGeo(top, 11 + lvl), PEN.x1 + 1 - top * 0.21 - 0.25, PEN.z0 + 0.35));
      if (L.nests > top) b.merge(place(nestRowGeo(L.nests - top, 19), PEN.x1 + 0.65, PEN.z0 + 2.2, -Math.PI / 2));
    }
    if (lvl >= 3) b.merge(place(henShadeGeo(1.6, 1.3), PEN.x0 + 1.4, PEN.z0 + 1.9));
    if (lvl >= 4) b.merge(place(henHouseGeo(), PEN.x1 + 0.2, PEN.z1 + 0.35, Math.PI));
    // calles nuevas del batey
    if (zoneOpen(s, 'batey')) for (const [x0, z0, x1, z1] of STREETS) {
      const w = x1 - x0 + 1, d = z1 - z0 + 1;
      b.merge(place(streetGeo(w, d, x0 * 7 + z0), x0 + w / 2, z0 + d / 2, 0, 0.004));
    }
    const geo = b.build();
    if (geo.attributes.position) {
      const m = new THREE.Mesh(geo, this.g.world.mat);
      m.castShadow = true; m.receiveShadow = true;
      this.group.add(m);
    }
    this.sig = this.signature();
  }

  placeRooster() {
    const r = this.g.world.rooster;
    if (r) r.position.set(PEN.x0 - 0.02, 0.62, PEN.z0 + 1.6);
  }

  // vacas: quitar las del corral viejo y volver a poner st.n vacas
  refreshCows() {
    const w = this.g.world;
    if (!w.animals) return;
    for (const a of w.animals) if (a.id === 'vacas') { w.scene.remove(a.m); }
    w.animals = w.animals.filter((a) => a.id !== 'vacas');
    w.buildAnimals();
  }

  update() {
    if (this.signature() !== this.sig) { this.rebuild(); this.placeRooster(); }
  }
}

// hay vacas fuera del corral nuevo? (por si el corral cambió de tamaño mientras se movían)
export function cowsInside(world) {
  const st = STRUCTURES.vacas;
  return (world.animals || []).filter((a) => a.id === 'vacas').every((a) => a.x >= st.x && a.x <= st.x + st.w && a.z >= st.z && a.z <= st.z + st.h);
}
