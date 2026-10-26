// Punto de entrada del módulo del central: abre las zonas reservadas, instala la lógica y engancha vista y UI.
import { ZONES } from '../zones.js';
import { installCentral, ensureCen } from './sim.js';
import { CentralView } from './view.js';
import { CentralUI } from './ui.js';
import { CAMPOS_LEVEL, CENTRAL_LEVEL, FIELD_BY_ID } from './data.js';
import { now } from '../state.js';

// Las zonas 'campos' y 'central' ya estaban reservadas en zones.js ("muy pronto"): aquí se abren con sus niveles.
if (ZONES.campos) Object.assign(ZONES.campos, { level: CAMPOS_LEVEL, soon: false, blurb: 'Campos de 6×6 con tractor, cuadrilla y carretas de bueyes.' });
if (ZONES.central) Object.assign(ZONES.central, { level: CENTRAL_LEVEL, soon: false, blurb: 'El central azucarero, su chimenea y el tren cañero.' });

// Truco de desarrollo: ?dev=1 en la URL
try { if (new URLSearchParams(location.search).get('dev') === '1') window.__fincaDev = true; } catch { /* sin URL */ }

export { installCentral };

// Se llama al final del constructor de Game
export function attachCentral(game) {
  ensureCen(game.sim.s);
  game.sim.cenInit();
  game.central = new CentralView(game);
  game.centralUI = new CentralUI(game);
  game.cenFF = null;
  // vista de los campos y el central
  game.viewCentral = function () {
    const r = { x0: 4, z0: 44, x1: 72, z1: 79 };
    this.rig.maxDist = Math.max(this.rig.maxDist, this.rig.fitDist(r.x0, r.z0, r.x1, r.z1) * 0.75);
    this.rig.fit(r.x0, r.z0, r.x1, r.z1);
    this.rig.goalDist = Math.min(this.rig.goalDist * 0.75, this.rig.maxDist);
    this.rig.goal.set(36, 0, 66);
    this.rig.manualUntil = performance.now() + 8000;
  }.bind(game);
  return game.central;
}

// Cada cuadro (después de world.update)
export function updateCentral(game, dt, time) {
  if (!game.central) return;
  game.central.update(dt, time);
  game.centralUI.refreshButton();
  // ⏩ de un campo: vuelve a x1 cuando madura
  const id = game.cenFF;
  if (id && game.ffSpeed > 1) {
    const st = game.sim.fieldState(id);
    if (st !== 'growing' && st !== 'planting') { game.cenFF = null; game.setSpeed(1); game.ui.toast(`¡Campo ${FIELD_BY_ID[id].n} listo para cosechar!`); }
  } else if (id && game.ffSpeed === 1) game.cenFF = null;
  void now;
}

// Toque en el mundo: true si lo atendió el central
export function tapCentral(game, ray) {
  if (!game.central) return false;
  const k = game.central.pick(ray);
  if (!k) return false;
  game.sound.play('tap');
  game.centralUI.tapPick(k);
  return true;
}
