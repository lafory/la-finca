// Punto de entrada de la Campaña Mambisa (extensión registrada en src/extensions.js). Estado en s.ext.mambi.
import { registerResource, registerSimModule, registerMigration, registerAct, registerUnlock, registerGameModule } from '../registry.js';
import { Sim } from '../sim.js';
import { installMambi, ensureMambi } from './sim.js';
import { installRegional } from './regional-sim.js';
import { MambiUI } from './ui.js';
import './regional-ui.js';
import { MAMBI_LEVEL } from './data.js';

try { if (new URLSearchParams(location.search).get('dev') === '1') window.__fincaDev = true; } catch { /* sin URL */ }

registerResource('viveres', { name: 'Víveres', icon: 'food', cap: 99999, start: 0, hud: false, detail: 'Comida para la tropa mambisa.' });
installMambi(Sim);
installRegional(Sim);
registerMigration((s) => { ensureMambi(s); });
registerSimModule({ id: 'mambi', init: (sim) => { ensureMambi(sim.s); }, update: (sim, dt) => sim.mbUpdate(dt) });
registerUnlock(MAMBI_LEVEL, 'La Campaña Mambisa (cuando el central esté completo): libera Cuba ciudad por ciudad');

registerGameModule({
  attach(game) { game.mambi = new MambiUI(game); },
  frame(game) { game.mambi.refreshButton(); },
});
for (const a of ['mbopen', 'mbclose', 'mbzoom', 'mbfit', 'mbcity', 'mbcamp', 'mbfood', 'mbrent', 'mbrecruit', 'mbattack', 'mbgo', 'mbfarm', 'mbfarms', 'mbfarmgo', 'mbup', 'mbskip', 'mbcheat', 'mbvisit', 'mbvback', 'rgplant', 'rgbuild', 'rgall', 'rgrent', 'rgland', 'rgland2', 'rgzoom']) {
  registerAct(a, (ui, d) => ui.g.mambi?.act(a, d));
}
