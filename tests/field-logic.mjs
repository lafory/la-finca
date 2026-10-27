// Lógica del campo de batalla, sin navegador.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBattle, autoDeploy, canStart, alive, passCost, blockedLos, spawn, resolveSide, outcome, casualties,
  placeWork, setOrder, COLS, ROWS, zone,
} from '../src/mambi/field.js';

const army = { inf: 24, cab: 8, cart: 2 };

function find(b, k) {
  for (let y = 0; y < b.ground.length; y++) for (let x = 0; x < COLS; x++) if (b.ground[y][x] === k) return { x, y };
  return null;
}

test('el campo tiene río, cañaveral, muros, camino y plaza', () => {
  const b = createBattle({ mode: 'attack', cityId: 'manzanillo', city: 'Manzanillo', terrain: 'costa', tactic: 'carga', army, enemy: 20 });
  const n = {};
  for (const row of b.ground) for (const t of row) n[t] = (n[t] || 0) + 1;
  assert.ok(n.rio > 20, 'río');
  assert.ok(n.cana > 30, 'caña');
  assert.ok(n.muro > 10, 'muros');
  assert.ok(n.camino > 10, 'camino');
  assert.equal(b.ground[2][17], 'plaza');
  assert.equal(b.ground[b.plaza.y][17], 'plaza');
  // el camino cruza el río (puente)
  let bridge = false;
  for (let y = 0; y < b.ground.length; y++) if (b.ground[y][17] === 'camino' && (b.ground[y][16] === 'rio' || b.ground[y][18] === 'rio')) bridge = true;
  assert.ok(bridge, 'puente');
});

test('el río frena, la artillería no entra y el muro tapa el tiro', () => {
  const b = createBattle({ mode: 'attack', cityId: 'trinidad', terrain: 'monte', tactic: 'emboscada', army, enemy: 40 });
  const rio = find(b, 'rio');
  const tierra = (() => {
    for (let y = ROWS - 1; y >= 0; y--) for (let x = 0; x < COLS; x++) {
      if (b.ground[y][x] === 'tierra' && zone(b, x, y)) return { x, y };
    }
    return null;
  })();
  assert.ok(tierra, 'tierra en tu mitad');
  const inf = { kind: 'fusil', side: 'player', alive: true, x: -1, y: -1 };
  const cab = { kind: 'cab', side: 'player', alive: true, x: -1, y: -1 };
  const art = { kind: 'art', side: 'player', alive: true, x: -1, y: -1 };
  assert.ok(passCost(b, inf, rio.x, rio.y) > passCost(b, inf, tierra.x, tierra.y));
  assert.ok(passCost(b, cab, rio.x, rio.y) > passCost(b, inf, rio.x, rio.y));
  assert.equal(passCost(b, art, rio.x, rio.y), Infinity);
  let wall = null;
  for (let y = 0; y < b.ground.length && !wall; y++) for (let x = 1; x < COLS - 1; x++) {
    if (b.ground[y][x] === 'muro' && b.ground[y][x - 1] !== 'muro' && b.ground[y][x + 1] !== 'muro') wall = { x, y };
  }
  assert.ok(wall, 'un muro de una casilla');
  assert.equal(blockedLos(b, { x: wall.x - 1, y: wall.y }, { x: wall.x + 1, y: wall.y }), true);
  assert.equal(placeWork(b, 'barricada', tierra.x, tierra.y), null);
  assert.equal(passCost(b, inf, tierra.x, tierra.y), Infinity);
});

test('formar la tropa deja a todo el mundo colocado', () => {
  const b = createBattle({ mode: 'attack', cityId: 'bayamo', terrain: 'llano', tactic: 'asedio', army, enemy: 32 });
  assert.equal(typeof canStart(b), 'string');
  assert.equal(autoDeploy(b), null);
  assert.equal(b.budget.inf, 0);
  assert.equal(b.budget.cab, 0);
  assert.ok(alive(b, 'player').some((u) => u.kind === 'machete'));
  assert.ok(alive(b, 'player').some((u) => u.kind === 'fusil'));
  assert.ok(alive(b, 'player').some((u) => u.kind === 'cab'));
  assert.ok(alive(b, 'player').some((u) => u.kind === 'art'));
  assert.ok(b.works.size > 0);
  const c = casualties(b);
  assert.equal(c.inf + c.cab + c.cart, 0);
  assert.ok(alive(b, 'enemy').length >= 2);
});

test('la carga duele más y el cañaveral cubre', () => {
  function blow(order, cover) {
    const b = createBattle({ mode: 'attack', cityId: 'x', terrain: 'llano', tactic: 'carga', army, enemy: 30 });
    b.units = [];
    const p = spawn(b, { side: 'player', kind: 'machete', men: 8, pool: 'inf', x: 10, y: 14 });
    const e = spawn(b, { side: 'enemy', kind: 'fusil', men: 8, pool: 'foe', power: 32, x: 10, y: 13 });
    if (cover) b.ground[13][10] = 'cana';
    b.phase = 'fight';
    b.seed = 4242;
    p.order = { t: order, x: 10, y: 13 };
    resolveSide(b, 'player');
    return e.max - e.hp;
  }
  const carga = blow('carga', false);
  const avanzar = blow('avanzar', false);
  const cubierta = blow('avanzar', true);
  assert.ok(carga > avanzar, `carga ${carga} vs avanzar ${avanzar}`);
  assert.ok(cubierta < avanzar, `caña ${cubierta} vs descubierto ${avanzar}`);
});

test('pisar la plaza libera y la retirada saca a la tropa', () => {
  const b = createBattle({ mode: 'attack', cityId: 'holguin', terrain: 'llano', tactic: 'carga', army, enemy: 20 });
  b.units = b.units.filter((u) => u.side !== 'player');
  const p = spawn(b, { side: 'player', kind: 'fusil', men: 8, pool: 'inf', x: 10, y: 20 });
  b.phase = 'fight';
  for (const e of alive(b, 'enemy')) e.alive = false;
  p.x = b.plaza.x; p.y = b.plaza.y;
  assert.equal(outcome(b), 'win');
  p.x = 12; p.y = 22;
  p.alive = true;
  for (const e of b.units) if (e.side === 'enemy') e.alive = true;
  // que no ganen por plaza
  assert.notEqual(b.ground[22][12], 'muro');
  setOrder(b, p.id, 'retirada', 12, 23);
  resolveSide(b, 'player');
  assert.equal(p.retreated, true);
  const c = casualties(b);
  assert.ok(c.inf > 0 && c.inf <= 8);
});

test('defensa: milicia, trinchera y cañón del fortín', () => {
  const b = createBattle({
    mode: 'defense', cityId: 'bayamo', terrain: 'llano',
    garrison: { inf: 10, cab: 4 }, militia: 18, defenses: { trinchera: 1, fortin: 1 }, enemy: 50,
  });
  assert.ok(b.budget.mil.length >= 1);
  assert.ok(b.budget.trench >= 7);
  assert.equal(b.budget.guns, 1);
  assert.equal(autoDeploy(b), null);
  assert.ok(alive(b, 'player').some((u) => u.pool === 'mil'));
  assert.ok(alive(b, 'player').some((u) => u.kind === 'art'));
  b.phase = 'fight';
  for (const e of alive(b, 'enemy')) { e.alive = false; e.hp = 0; }
  assert.equal(outcome(b), 'win');
  const c = casualties(b);
  assert.equal(c.inf, 0);
  assert.equal(c.garInf, 0);
});
