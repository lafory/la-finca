// Simulación de economía de La Finca (solo node, sin navegador). Lee las tablas reales de src/data.js y src/central/data.js
// y estima cuánto tarda un jugador "típico" en llegar a cada nivel, con y sin ⏩.
// Uso: node tests/balance-sim.mjs [--json]
// Modelo (aproximado, a propósito simple; ver docs/BALANCE.md):
//  - Paso de 10 s de juego "activo" (el jugador juega en sesiones; no cuenta el tiempo fuera de la app).
//  - El jugador hace ~ACT acciones por minuto (tocar, caminar, sembrar, regar, cosechar, cargar). Los trabajadores
//    quitan acciones de la cuenta del jugador cuando los contrata.
//  - Siembra el cultivo que más XP+pesos da por minuto, riega siempre (−30 %), vende por pedidos de camión (×ORDER_BONUS)
//    hasta el tope de camiones por minuto, y lo demás suelto. Procesa (kétchup, guarapo, azúcar, tabacos) si sube el valor.
//  - Compra en este orden cuando le alcanza: gallinas hasta el tope, almacén, parcelas, obras, trabajadores.
//  - Con ⏩: el reloj de juego corre FF_K veces más rápido (cultivos, gallinas, corrales, cocinas), pero las acciones y los
//    camiones siguen en tiempo real.
import { LEVEL_XP, xpForLevel, ITEMS, CROPS, RECIPES, PRICES, STORAGE_CAPS, STORAGE_LEVELS, EGG_INTERVAL, ORDER_BONUS, TRUCK_RESPAWN,
  WORKERS, STRUCTURES, PARCELS, START_PLOTS, WATER_BOOST, MAX_LEVEL, workerHirePrice } from '../src/data.js';
import { FIELD_CROPS, FIELDS, STAGES, MILL, WHOLESALE, PLANT_WORK, HARVEST_WORK, CAMPOS_LEVEL, TRAIN_ORDER, WOOD_PRICE } from '../src/central/data.js';

const ACT = 22 * 0.6; // acciones/min útiles de un jugador típico en el móvil (22 tocando sin parar × 60 % de eficiencia: menús, mirar, dudar)
const ORDER_SEC = 14; // s por pedido de camión (llegar, cargar, irse) + TRUCK_RESPAWN
const ITEMS_PER_ORDER = 3.2;
const FF_K = 6; // media efectiva del ⏩ (x5/x20 a ratos)
const TARGETS = [2, 5, 10, 15, 20, 25, 32, 40];
const STEP = 10; // s
const WORKER_TASKS = 7; // tareas/min de un trabajador (camina + 1,4 s de trabajo + 1,6 s de descanso)
const HOUSE_LEVELS = [5, 5, 6, 7, 8, 10, 12, 14];

function sim(ff, xpFor = xpForLevel, tweak = {}) {
  const k = ff ? FF_K : 1;
  const s = { level: 1, xp: 0, money: 50, chickens: 3, plots: START_PLOTS.length, storage: 0, coop: false, abono: false,
    parcels: new Set(), built: new Set(), workers: new Set(), hands: 0, staff: 0, fields: 0, stage: 0, wood: 0 };
  const reached = { 1: 0 };
  const log = [];
  let t = 0;
  const addXp = (n) => { s.xp += n; while (s.level < MAX_LEVEL && s.xp >= xpFor(s.level + 1)) { s.level++; reached[s.level] = t; } };
  const buyXp = (n) => addXp(n);
  while (s.level < MAX_LEVEL && t < 3600 * 400) {
    const dt = STEP, min = dt / 60;
    let actions = ACT * min; // presupuesto del jugador en este paso
    let pesos = 0, xp = 0, orderable = 0, loose = 0;
    // --- huevos
    const eggs = s.chickens * (dt * k) / EGG_INTERVAL;
    if (!s.workers.has('recolector')) actions -= eggs * 0.5;
    xp += eggs * ITEMS.egg.xp; orderable += eggs * ITEMS.egg.sell;
    // --- canteros: mejor cultivo disponible por (pesos + 8·xp) / min
    const grow = (c) => CROPS[c].grow * (1 - WATER_BOOST) * (s.abono ? 0.8 : 1);
    let best = 'tomato', bv = 0;
    for (const [c, cr] of Object.entries(CROPS)) {
      if (cr.level > s.level) continue;
      const it = ITEMS[cr.item];
      const v = ((it.sell * ORDER_BONUS - cr.seed) + 8 * (it.xp + cr.xpPlant)) / (grow(c) / k + 20);
      if (v > bv) { bv = v; best = c; }
    }
    const cr = CROPS[best], it = ITEMS[cr.item];
    let cycles = s.plots * dt / (grow(best) / k + 6); // +6 s de vuelta
    // cada ciclo = sembrar + regar + cosechar (3 tareas). Las hace el jugador con lo que le sobre y los trabajadores del campo
    // (~WORKER_TASKS tareas/min cada uno, nivel 1 de rapidez, con caminatas largas en la finca grande).
    const fieldHands = s.hands;
    const taskCap = Math.max(0, actions) + WORKER_TASKS * fieldHands * min;
    cycles = Math.min(cycles, taskCap / 3);
    actions -= Math.max(0, cycles * 3 - WORKER_TASKS * fieldHands * min);
    xp += cycles * (it.xp * (tweak.cropXp?.[best] ?? 1) + cr.xpPlant); pesos -= cycles * cr.seed;
    // --- procesar: si hay cocina/trapiche/casa de tabaco, convierte parte de lo cosechado
    let val = cycles * it.sell;
    const proc = (rid, where) => { const r = RECIPES[rid]; if (r.level > s.level || !where) return; const [ing, q] = Object.entries(r.needs)[0]; if (ing !== cr.item) return;
      const batches = Math.min((cycles / q), where * (dt * k) / r.time); const out = ITEMS[r.out];
      const gain = out.sell - q * ITEMS[ing].sell; if (gain <= 0) return; val += batches * gain; xp += batches * out.xp; };
    const kitchens = 1 + (s.built.has('fogon2') ? 1 : 0);
    proc('ketchup', kitchens); proc('guarapo', kitchens);
    proc('azucar', s.built.has('trapiche') ? 1 : 0); proc('puros', s.built.has('casaTabaco') ? 1 : 0);
    orderable += val;
    // --- corrales
    for (const id of s.built) { const st = STRUCTURES[id]; if (st.kind !== 'animal') continue; const n = st.produce.qty * (dt * k) / st.produce.time;
      xp += n * ITEMS[st.produce.item].xp; orderable += n * ITEMS[st.produce.item].sell; actions -= n * 0.3; }
    // --- camiones: tope de pedidos por minuto (2 andenes con el andén)
    const docks = s.built.has('anden') ? 2 : 1;
    const maxOrderVal = docks * (dt / (ORDER_SEC + TRUCK_RESPAWN)) * ITEMS_PER_ORDER * 40 * (1 + s.level / 10);
    const ordered = Math.min(orderable, maxOrderVal);
    loose = orderable - ordered;
    pesos += ordered * ORDER_BONUS + loose;
    // XP de pedidos ≈ 1,5·xp de lo entregado + 2 por pedido; aprox. 0,5·xp de lo suelto
    const xpRatio = (xp / Math.max(1, orderable));
    xp += ordered * xpRatio * 0.5 + (ordered / (ITEMS_PER_ORDER * 25)) * 2 + loose * xpRatio * 0.5;
    // --- campos grandes y central (módulo central)
    if (s.fields > 0) {
      const fc = FIELD_CROPS.cane; const cyc = s.fields * (dt) / ((fc.grow / k) + PLANT_WORK + HARVEST_WORK + 10);
      xp += cyc * (fc.xpPlant + fc.xpHarvest);
      let caneVal = fc.yield * ITEMS.cane.sell * WHOLESALE;
      if (s.stage >= 3) { const b = fc.yield / MILL.cane; caneVal = b * (MILL.azucar * 125 + MILL.melaza * 60) * (s.stage >= 4 ? TRAIN_ORDER.bonus * 0.6 + 0.4 : WHOLESALE); xp += cyc * b * MILL.xp; }
      pesos += cyc * (caneVal - fc.seed);
    }
    if (process.env.DBG && t % 120 === 0 && t < 2400) console.log(JSON.stringify({ hands: s.hands, staff: s.staff, plots: s.plots, ch: s.chickens, w: s.workers.size, crop: best, b: [...s.built].length, f: s.fields, t, L: s.level, xp: +xp.toFixed(1), cycles: +cycles.toFixed(2), eggs: +eggs.toFixed(2), orderable: Math.round(orderable), ordered: Math.round(ordered), pesos: Math.round(pesos), money: Math.round(s.money) }));
    addXp(xp); s.money += pesos;
    t += dt;
    // --- compras (una por paso)
    const L = s.level;
    const chickenPrice = Math.round(PRICES.chicken * PRICES.chickenStep ** (s.chickens - 3));
    const cap = (s.coop ? 8 : 4);
    const buy = (price, fn, xpGain = 0) => { if (s.money >= price) { s.money -= price; fn(); if (xpGain) buyXp(xpGain); return true; } return false; };
    if (L >= 3 && !s.coop && buy(PRICES.coop, () => { s.coop = true; })) continue;
    if (s.chickens < cap && buy(chickenPrice, () => s.chickens++)) continue;
    if (s.storage < 4 && L >= STORAGE_LEVELS[s.storage] && buy(PRICES.storage[s.storage], () => s.storage++)) continue;
    if (L >= 4 && !s.abono && buy(PRICES.abono, () => { s.abono = true; })) continue;
    const wOrder = ['recolector', 'camionero', 'sembrador', 'regador', 'cosechador', 'cocinera'];
    const w = wOrder.find((r) => !s.workers.has(r) && WORKERS[r].level <= L && s.money >= workerHirePrice(r, 0) * 3);
    const wcap = 4 + Math.floor(L / (tweak.levelCap ?? 4)) + HOUSE_LEVELS.filter((h) => h <= L).length;
    if (w && s.staff < wcap && buy(workerHirePrice(w, 0) * (tweak.hireMul ?? 1), () => { s.workers.add(w); s.staff++; if (['sembrador', 'regador', 'cosechador'].includes(w)) s.hands++; })) continue;
    // más manos para el campo si hay tope y sobran canteros sin atender
    if (s.workers.has('cosechador') && s.staff < wcap && s.plots / Math.max(1, s.hands) > 14) { const extra = s.hands - 2; if (buy(workerHirePrice('sembrador', Math.max(1, extra)) * (tweak.hireMul ?? 1) * (tweak.extraHire ? (1 + extra) : 1), () => { s.hands++; s.staff++; })) continue; }
    const p = PARCELS.find((p) => !s.parcels.has(p.id) && p.level <= L);
    if (p && buy(p.price, () => { s.parcels.add(p.id); s.plots += Array.isArray(p.plots) ? p.plots.length : p.plots; }, 10 + p.level * 2)) continue;
    const st = Object.entries(STRUCTURES).find(([id, v]) => !s.built.has(id) && v.level <= L && v.kind !== 'house' && (!v.parcel || s.parcels.has(v.parcel)));
    if (st && buy(st[1].price + (st[1].madera || 0) * 4, () => s.built.add(st[0]), 15 + st[1].level)) continue;
    const f = FIELDS[s.fields];
    if (L >= CAMPOS_LEVEL && f && f.level <= L && buy(f.price, () => s.fields++)) continue;
    const sg = STAGES[s.stage];
    if (sg && sg.level <= L && buy(sg.price + sg.wood * WOOD_PRICE, () => s.stage++, 200 + (s.stage + 1) * 100)) continue;
    if (t % 3600 < STEP) log.push({ h: t / 3600, level: L, money: Math.round(s.money), plots: s.plots, chickens: s.chickens, fields: s.fields });
  }
  return { reached, log, final: s };
}

// ---- propuesta (NO aplicada al juego): curva más empinada desde el nivel 6 y XP del tabaco más baja; ver docs/BALANCE.md
export function xpProposed(l) {
  const BASE = [0, 0, 20, 55, 110, 190, 320, 520, 800, 1150, 1600];
  if (l < BASE.length) return BASE[l];
  const k = l - 10;
  return Math.round(1600 + 900 * k + 260 * k * k + 9 * k * k * k);
}
const PROPOSED_TWEAK = { cropXp: { tobacco: 0.6 }, levelCap: 5, extraHire: true };
const fmt = (sec) => (sec === undefined ? '—' : sec < 3600 ? `${Math.round(sec / 60)} min` : `${(sec / 3600).toFixed(1)} h`);
const a = sim(false), b = sim(true);
const pa = sim(false, xpProposed, PROPOSED_TWEAK), pb = sim(true, xpProposed, PROPOSED_TWEAK);
const rows = TARGETS.map((L) => ({ level: L, xp: xpForLevel(L), normal: a.reached[L], ff: b.reached[L], xpNew: xpProposed(L), newNormal: pa.reached[L], newFf: pb.reached[L] }));
// muros: niveles cuyo tramo tarda >2,5× la media de los 3 anteriores; demasiado rápido: <25 % de la media
function walls(reached) {
  const out = [];
  for (let L = 5; L <= MAX_LEVEL; L++) {
    if (reached[L] === undefined || reached[L - 1] === undefined) continue;
    const d = reached[L] - reached[L - 1];
    const prev = [1, 2, 3].map((i) => (reached[L - i] ?? 0) - (reached[L - i - 1] ?? 0)).filter((x) => x > 0);
    const avg = prev.reduce((x, y) => x + y, 0) / Math.max(1, prev.length);
    if (avg && d > 2.5 * avg && d > 600) out.push({ level: L, kind: 'muro', tramo: fmt(d), media: fmt(avg) });
    if (avg && d < 0.25 * avg && avg > 300) out.push({ level: L, kind: 'demasiado rápido', tramo: fmt(d), media: fmt(avg) });
  }
  return out;
}
const res = { wallsProposed: walls(pa.reached), assumptions: { ACT, ORDER_SEC, ITEMS_PER_ORDER, FF_K }, rows, wallsNormal: walls(a.reached), wallsFF: walls(b.reached),
  perLevel: Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((L) => ({ L, xp: xpForLevel(L), normal: fmt(a.reached[L]), ff: fmt(b.reached[L]) })) };
if (process.argv.includes('--json')) console.log(JSON.stringify(res, null, 2));
else {
  console.log('Nivel | XP total | sin ⏩ | con ⏩  ||  propuesta: XP | sin ⏩ | con ⏩');
  for (const r of rows) console.log(`${String(r.level).padStart(5)} | ${String(r.xp).padStart(8)} | ${fmt(r.normal).padStart(8)} | ${fmt(r.ff).padStart(8)}  ||  ${String(r.xpNew).padStart(8)} | ${fmt(r.newNormal).padStart(8)} | ${fmt(r.newFf).padStart(8)}`);
  console.log('\nMuros / tramos raros (sin ⏩):', res.wallsNormal);
  console.log('Muros / tramos raros (con ⏩):', res.wallsFF);
  console.log('Muros / tramos raros (propuesta, sin ⏩):', res.wallsProposed);
  console.log('\nPor nivel:'); for (const p of res.perLevel) console.log(`  ${p.L}: ${p.xp} xp · ${p.normal} · ${p.ff}`);
}
void LEVEL_XP; void STORAGE_CAPS;
