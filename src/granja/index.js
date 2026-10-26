// Granja grande: gallinero por niveles (1–4), surcos arados en bloque, potrero de vacas ampliable
// y batey más grande (solares nuevos, calles, consultorio, panadería, placita del dominó, casas de mampostería).
import { registerSimModule, registerMigration, registerStructure, registerUISection, registerAct, registerUnlock, registerGameModule, FARM_HOOKS, STRUCT_MODELS } from '../registry.js';
import { STRUCTURES, BATEY_ORDER } from '../data.js';
import { Sim } from '../sim.js';
import { installGranja, ensureGranja } from './sim.js';
import { COOP_LEVELS, COOP_MAX, coopLevel, VACAS_LEVELS, NEW_HOUSES, NEW_CIVIC, MASONRY } from './data.js';
import { masonryHouseGeo, consultorioGeo, panaderiaGeo, dominoGeo, milkShedGeo } from './models.js';
import { GranjaView } from './view.js';
import { GranjaUI, landSection, act } from './ui.js';

// ---- gallinero: tope de gallinas y ritmo de puesta por nivel
FARM_HOOKS.henCap = (s, base) => COOP_LEVELS[Math.min(COOP_MAX, coopLevel(s))].cap + (s.extraHens || 0);
FARM_HOOKS.layFactor = (s) => COOP_LEVELS[Math.min(COOP_MAX, coopLevel(s))].lay;

// ---- batey: solares nuevos y obras nuevas
const houseIds = [];
NEW_HOUSES.forEach(([x, z, level, price, wood], i) => {
  const id = `casa${9 + i}`;
  registerStructure(id, { name: `Casa ${9 + i} del batey`, detail: 'Un bohío para los trabajadores: +1 al tope. Se mejora a casa de zinc (+2) y a mampostería (+3).', price, madera: wood, level, kind: 'house', zone: 'batey', x, z, w: 3, h: 3, cap: 1,
    upgrade: { level: Math.max(9, level + 2), price: Math.round(price * 2.2), madera: wood + 10, cap: 2, name: 'Casa de zinc' } });
  houseIds.push(id);
});
for (const [id, def] of Object.entries(NEW_CIVIC)) registerStructure(id, def);
// orden en la hoja del batey
const order = ['domino', 'casa9', 'casa10', 'consultorio', 'casa11', 'casa12', 'panaderia'];
for (const id of order) if (!BATEY_ORDER.includes(id)) BATEY_ORDER.push(id);
// todas las casas (viejas y nuevas) pueden llegar a mampostería; modelo según el nivel de la casa
for (const [id, st] of Object.entries(STRUCTURES)) {
  if (st.kind !== 'house' || st.zone !== 'batey') continue;
  st.upgrade2 ||= MASONRY(st);
  STRUCT_MODELS[id] = (M, b) => {
    const ry = st.z > 50 ? Math.PI : 0;
    const geo = b.tier === 3 ? masonryHouseGeo(st.x + st.z) : b.tier === 2 ? M.zincHouseGeo(st.x) : M.smallBohioGeo(st.x);
    return M.place(geo, 0, 0, ry);
  };
}
STRUCT_MODELS.consultorio = (M) => consultorioGeo();
STRUCT_MODELS.panaderia = (M) => M.place(panaderiaGeo(), 0, 0, 0);
STRUCT_MODELS.domino = (M) => dominoGeo();
// potrero: corral del tamaño actual y, desde el nivel 2, rancho de ordeño
STRUCT_MODELS.vacas = (M) => {
  const st = STRUCTURES.vacas, b = new M.Builder();
  b.merge(M.penGeo(st.w, st.h, 300 + st.x));
  if (st.w >= 5) b.merge(M.place(milkShedGeo(), st.w / 2 - 1.25, -st.h / 2 + 0.95));
  return b.build();
};

// ---- lógica y guardado
installGranja(Sim);
registerMigration((s) => { ensureGranja(s); });
registerSimModule({ id: 'granja', init: (sim) => sim.granjaInit(), update: (sim) => sim.granjaUpdate() });

// ---- avisos de nivel
for (let i = 2; i <= COOP_MAX; i++) registerUnlock(COOP_LEVELS[i].level, `Granja: ${COOP_LEVELS[i].name.toLowerCase()} (${COOP_LEVELS[i].cap} gallinas)`);
for (let i = 2; i < VACAS_LEVELS.length; i++) registerUnlock(VACAS_LEVELS[i].level, `Granja: ${VACAS_LEVELS[i].name.toLowerCase()} (${VACAS_LEVELS[i].n} vacas)`);

// ---- UI
registerUISection('land', landSection);
for (const a of ['granja-coop', 'granja-vacas', 'granja-plow', 'granja-look']) registerAct(a, (ui) => act(ui, a));

// ---- vista
registerGameModule({
  attach(game) {
    game.granja = new GranjaView(game);
    game.granjaUI = new GranjaUI(game);
    game.ui.granja = game.granjaUI;
    game.granjaLook = function (what) {
      const st = what === 'vacas' ? STRUCTURES.vacas : null;
      const [x, z] = st ? [st.x + st.w / 2, st.z + st.h / 2] : [11, 7.5];
      this.rig.goal.set(x, 0, z);
      this.rig.goalDist = Math.min(this.rig.maxDist, 16);
      this.rig.manualUntil = performance.now() + 5000;
    }.bind(game);
  },
  frame(game) { game.granja.update(); },
});
