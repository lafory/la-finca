// Punto de entrada del módulo del central. Todo se registra en src/registry.js al importarse (ver src/extensions.js):
// zonas, lógica (Sim), migración del guardado, vista 3D, toques, acciones de UI y avisos de nivel.
import {
  registerZone, registerSimModule, registerMigration, registerZoneView, registerTap, registerAct, registerUnlock, registerGameModule,
} from '../registry.js';
import { Sim } from '../sim.js';
import { installCentral, ensureCen } from './sim.js';
import { CentralView, CAMPOS_RECT, CENTRAL_RECT } from './view.js';
import { CentralUI } from './ui.js';
import { CAMPOS_LEVEL, CENTRAL_LEVEL, FIELD_BY_ID, centralUnlocks } from './data.js';

// Truco de desarrollo: ?dev=1 en la URL
try { if (new URLSearchParams(location.search).get('dev') === '1') window.__fincaDev = true; } catch { /* sin URL */ }

// ---- zonas (áreas libres reservadas por el diseño)
registerZone('campos', { name: 'Los campos grandes', blurb: 'Campos de 6×6 con tractor, cuadrilla y carretas de bueyes.', level: CAMPOS_LEVEL, rect: CAMPOS_RECT, sign: [33.5, 43] });
registerZone('central', { name: 'El central', blurb: 'El central azucarero, su chimenea y el tren cañero.', level: CENTRAL_LEVEL, rect: CENTRAL_RECT, sign: [14, 59] });

// ---- lógica y guardado (estado en s.ext.central)
installCentral(Sim); // métodos de campos/central/tren en Sim.prototype + bloqueo de la cuadrícula por los edificios
registerMigration((s) => { ensureCen(s); });
registerSimModule({ id: 'central', init: (sim) => sim.cenInit(), update: (sim, dt) => sim.updateCentral(dt) });

// ---- avisos de subir de nivel
for (let l = 2; l <= 40; l++) for (const t of centralUnlocks(l)) registerUnlock(l, t);

// ---- vista, UI y cámara (necesitan el Game)
let GAME = null;
registerGameModule({
  attach(game) {
    GAME = game;
    game.central = new CentralView(game);
    game.centralUI = new CentralUI(game);
    game.cenFF = null;
    game.viewCentral = function () {
      const r = { x0: 4, z0: 44, x1: 72, z1: 79 };
      this.rig.maxDist = Math.max(this.rig.maxDist, this.rig.fitDist(r.x0, r.z0, r.x1, r.z1) * 0.75);
      this.rig.fit(r.x0, r.z0, r.x1, r.z1);
      this.rig.goalDist = Math.min(this.rig.goalDist * 0.75, this.rig.maxDist);
      this.rig.goal.set(36, 0, 66);
      this.rig.manualUntil = performance.now() + 8000;
    }.bind(game);
  },
  frame(game, dt, time) {
    game.central.update(dt, time);
    game.centralUI.refreshButton();
    // ⏩ de un campo: vuelve a x1 cuando madura
    const id = game.cenFF;
    if (id && game.ffSpeed > 1) {
      const st = game.sim.fieldState(id);
      if (st !== 'growing' && st !== 'planting') { game.cenFF = null; game.setSpeed(1); game.ui.toast(`¡Campo ${FIELD_BY_ID[id].n} listo para cosechar!`); }
    } else if (id && game.ffSpeed === 1) game.cenFF = null;
  },
});

// Toques: la vista (que se construye sola) responde 'cen:<cosa>' y el manejador abre la hoja que toca
const pickView = () => ({ pick: (ray) => { const k = GAME?.central?.pick(ray); return k ? `cen:${k}` : null; } });
registerZoneView('campos', pickView);
registerTap('cen', (game, k) => { game.sound.play('tap'); game.centralUI.tapPick(k); });

// Acciones data-act="cen*"
for (const a of ['cengo', 'cenfield', 'cenbuy', 'cenplant', 'cenharvest', 'cenff', 'cenacopio', 'censell', 'cencentral', 'censtage', 'cenwood', 'censtill', 'censtation', 'cenload', 'censkip', 'cencheat']) {
  registerAct(a, (ui, d) => ui.g.centralUI?.act(a, d));
}
