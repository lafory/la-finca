// Campo de batalla táctico. Sin Three.js ni DOM: colocar tropa, órdenes y resolución.
// Sirve para liberar una ciudad y para defenderla del Régimen. El río frena, el cañaveral y
// los muros cubren, la trinchera y la barricada las pone el jugador.
// Quien pierde no muere: se dispersa y vuelve a su casa (igual que el resto de la campaña).

export const COLS = 34;
export const ROWS = 24;
export const TILE = 1.9;

export const KINDS = {
  machete: { name: 'Mambises al machete', short: 'Machete', move: 3.15, range: 1, melee: true, charge: 1.85 },
  fusil: { name: 'Fusileros', short: 'Fusil', move: 2.25, range: 4, shoot: true },
  cab: { name: 'Caballería', short: 'Caballería', move: 5.15, range: 1, melee: true, charge: 2.05, horse: true },
  art: { name: 'Artillería', short: 'Cañón', move: 1.35, range: 7, shoot: true, splash: true, minRange: 2 },
};

const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const N8 = [...N4, [1, 1], [1, -1], [-1, 1], [-1, -1]];

let SEQ = 1;
const key = (x, y) => y * COLS + x;
export const inb = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS;
export const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
export function tileWorld(x, y) {
  return [(x + 0.5 - COLS / 2) * TILE, (y + 0.5 - ROWS / 2) * TILE];
}
export function worldTile(wx, wz) {
  return [Math.floor(wx / TILE + COLS / 2), Math.floor(wz / TILE + ROWS / 2)];
}

function rng(b) {
  b.seed = (Math.imul(b.seed, 1664525) + 1013904223) >>> 0;
  return b.seed / 4294967296;
}
function seedOf(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0 || 1;
}
function cloneBudget(b) {
  return { inf: b.inf, cab: b.cab, cart: b.cart, guns: b.guns, trench: b.trench, bar: b.bar, mil: b.mil.map((m) => ({ ...m })) };
}

// ---- terreno (el mismo para atacar y defender: la ciudad al norte, el campo al sur)
function paint(g, x, y, k, only) {
  if (!inb(x, y)) return;
  if (only && g[y][x] !== only) return;
  g[y][x] = k;
}
export function makeGround(terrain = 'llano') {
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill('tierra'));
  const cane = terrain === 'monte'
    ? [[1, 5, 9, 6], [24, 5, 9, 6], [1, 14, 8, 5], [25, 14, 8, 5], [9, 7, 5, 3]]
    : [[1, 6, 8, 5], [25, 6, 8, 5], [1, 15, 7, 4], [26, 15, 7, 4]];
  for (const [x0, y0, w, h] of cane) {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) paint(g, x, y, 'cana', 'tierra');
  }
  const riverY = terrain === 'costa' ? 11 : 11;
  const wide = terrain === 'costa';
  for (let x = 0; x < COLS; x++) {
    const y = riverY + Math.round(Math.sin(x * 0.42) * 0.8);
    const ford = (x >= 6 && x <= 8) || (x >= 25 && x <= 27);
    if (!ford) {
      paint(g, x, y, 'rio');
      if (wide) paint(g, x, y + 1, 'rio');
    }
  }
  const walls = [[5, 6, 0, 4], [28, 6, 0, 4], [8, 16, 5, 0], [21, 16, 5, 0]];
  if (terrain === 'monte') walls.push([11, 8, 0, 4], [22, 13, 4, 0], [4, 13, 0, 3]);
  if (terrain === 'llano') walls.push([10, 8, 3, 0]);
  for (const [x, y, dx, dy] of walls) {
    const n = Math.max(Math.abs(dx), Math.abs(dy), 1);
    const sx = Math.sign(dx), sy = Math.sign(dy);
    for (let i = 0; i < n; i++) paint(g, x + sx * i, y + sy * i, 'muro', 'tierra');
  }
  // fortín al norte, con una puerta al camino
  for (let y = 0; y <= 4; y++) for (let x = 14; x <= 20; x++) {
    const edge = y === 0 || y === 4 || x === 14 || x === 20;
    g[y][x] = edge ? 'muro' : 'tierra';
  }
  g[2][17] = 'plaza';
  g[3][17] = 'camino';
  g[4][17] = 'camino';
  for (let y = 5; y < ROWS; y++) if (g[y][17] !== 'muro') g[y][17] = 'camino';
  return g;
}

export function tileLabel(k) {
  return { tierra: 'tierra limpia', cana: 'cañaveral (da cobertura)', rio: 'río (frena a la tropa)', muro: 'muro (tapa el tiro)', camino: 'camino real', plaza: 'la plaza' }[k] || k;
}

function workAt(b, x, y) { return b.works.get(key(x, y)) || null; }
export function workAtTile(b, x, y) { return workAt(b, x, y); }
export function unitAt(b, x, y, ignore) {
  return b.units.find((u) => u.alive && !u.retreated && u !== ignore && u.x === x && u.y === y) || null;
}

export function passCost(b, unit, x, y) {
  if (!inb(x, y)) return Infinity;
  const g = b.ground[y][x];
  const w = workAt(b, x, y);
  if (g === 'muro' || w === 'barricada') return Infinity;
  if (unitAt(b, x, y, unit)) return Infinity;
  if (g === 'rio' && unit.kind === 'art') return Infinity;
  let c = g === 'camino' || g === 'plaza' ? 0.68 : g === 'cana' ? 1.45 : g === 'rio' ? 2.65 : 1;
  if (g === 'cana' && (unit.kind === 'cab' || unit.kind === 'art')) c += 0.85;
  if (g === 'rio' && unit.kind === 'cab') c += 1.25;
  if (w === 'trinchera') c = unit.side === 'player' ? 0.72 : 1.3;
  return c;
}

// Zona donde el jugador puede poner tropa o defensas. El enemigo ya está colocado.
export function zone(b, x, y) {
  if (!inb(x, y)) return null;
  if (b.mode === 'attack') {
    if (y >= ROWS - 6) return 'troop';
    if (y >= ROWS - 10) return 'work';
    return null;
  }
  if (y <= 5) return 'troop';
  if (y <= 10) return 'work';
  return null;
}

function homeY(b, side) {
  if (b.mode === 'attack') return side === 'player' ? ROWS - 1 : 0;
  return side === 'player' ? 0 : ROWS - 1;
}
function defaultFace(b, side) {
  // el jugador mira al enemigo
  if (b.mode === 'attack') return side === 'player' ? [0, -1] : [0, 1];
  return side === 'player' ? [0, 1] : [0, -1];
}

function powerOfMen(kind, men) {
  return men * (kind === 'cab' ? 10 : kind === 'art' ? 14 : 4);
}

export function spawn(b, o) {
  const [fx, fy] = defaultFace(b, o.side);
  const power = o.power ?? powerOfMen(o.kind, o.men || 1);
  const max = Math.max(8, Math.round(power * 7));
  const u = {
    id: SEQ++, side: o.side, kind: o.kind, men: o.men || 1, pool: o.pool || o.kind,
    power, hp: o.hp ?? max, max, atk: power * 0.9,
    x: o.x, y: o.y, fx: o.fx ?? fx, fy: o.fy ?? fy,
    alive: true, retreated: false, exposed: false, order: null,
  };
  b.units.push(u);
  return u;
}

export function unitName(u) {
  if (!u) return '';
  if (u.side === 'enemy') {
    if (u.banner) {
      if (u.kind === 'cab') return `Jinetes de ${u.banner}`;
      if (u.kind === 'art') return `Cañón de ${u.banner}`;
      if (u.kind === 'machete') return `Macheteros de ${u.banner}`;
      return `Fusileros de ${u.banner}`;
    }
    if (u.kind === 'cab') return 'Jinetes grises';
    if (u.kind === 'art') return 'Cañón del Régimen';
    if (u.kind === 'machete') return 'Guardias al machete';
    return 'Fusileros del Régimen';
  }
  if (u.pool === 'mil') return 'Milicia del pueblo';
  if (u.pool === 'fort') return 'Cañón del fortín';
  return KINDS[u.kind].name;
}

function splitPower(total) {
  const t = Math.max(0, Math.round(total));
  if (!t) return [];
  const n = Math.max(2, Math.min(14, Math.round(t / 18)));
  const base = Math.floor(t / n);
  const arr = Array(n).fill(base);
  let rem = t - base * n;
  for (let i = 0; i < arr.length && rem > 0; i++, rem--) arr[i]++;
  return arr.filter((p) => p > 0);
}

function freeTiles(b, pred) {
  const out = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const g = b.ground[y][x];
    if (g === 'muro' || g === 'rio') continue;
    if (unitAt(b, x, y)) continue;
    if (pred(x, y, g)) out.push({ x, y, g });
  }
  return out;
}
function pickTile(list, score) {
  let best = null, s = 1e9;
  for (const t of list) { const v = score(t); if (v < s) { s = v; best = t; } }
  return best;
}

function placeEnemies(b, power) {
  const parts = splitPower(Math.max(8, power));
  const kinds = parts.map((p, i) => {
    if (i === parts.length - 1 && power >= 70) return 'art';
    if (i < Math.max(1, Math.round(parts.length * (b.terrain === 'llano' ? 0.28 : 0.16)))) return 'cab';
    return 'fusil';
  });
  // el cañón no debe ser el único si cabe un fusil
  const south = b.mode === 'defense';
  for (let i = 0; i < parts.length; i++) {
    const kind = kinds[i];
    const zonePred = (x, y) => (south ? y >= ROWS - 4 : (y >= 1 && y <= 7));
    let tiles = freeTiles(b, (x, y, g) => zonePred(x, y) && g !== 'plaza' && (kind !== 'art' || g === 'camino' || g === 'tierra'));
    if (!tiles.length) tiles = freeTiles(b, (x, y) => zonePred(x, y));
    if (!tiles.length) tiles = freeTiles(b, (x, y) => (south ? y >= ROWS - 6 : y <= 9));
    if (!tiles.length) break;
    const tile = pickTile(tiles, (t) => {
      let s = 0;
      if (kind === 'art') s += south ? -t.y : t.y;
      else if (kind === 'cab') s += -Math.abs(t.x - 17);
      else if (t.g === 'cana') s -= 3;
      s += Math.abs(t.x - 17) * 0.15;
      return s;
    });
    const men = Math.max(4, Math.round(parts[i] / (kind === 'cab' ? 10 : kind === 'art' ? 14 : 4)));
    const u = spawn(b, { side: 'enemy', kind, men, pool: 'foe', power: parts[i], x: tile.x, y: tile.y });
    if (b.foeName) u.banner = b.foeName;
  }
}

function chunks(inf, cab) {
  return {
    inf: Math.max(6, Math.ceil((inf || 0) / 8)) || 6,
    cab: Math.max(2, Math.ceil((cab || 0) / 5)) || 2,
  };
}

export function createBattle(spec) {
  const terrain = spec.terrain || 'llano';
  const b = {
    mode: spec.mode, cityId: spec.cityId, city: spec.city || spec.cityId, terrain,
    tactic: spec.tactic || null, kind: spec.kind || null,
    war: spec.war || null, foe: spec.foe || (spec.war ? 'ocre' : 'regimen'),
    foeName: spec.foeName || '', friend: !!spec.friend, rivalId: spec.rivalId || null,
    enemyPower: spec.enemy | 0,
    ground: makeGround(terrain), works: new Map(), units: [],
    plaza: { x: 17, y: 2 },
    seed: seedOf(`${spec.cityId}|${spec.mode}|${terrain}|${spec.foe || ''}|${spec.foeName || ''}`),
    phase: 'deploy', turn: 1, maxTurn: spec.mode === 'attack' ? 14 : 10,
    cols: COLS, rows: ROWS,
  };
  if (spec.mode === 'attack') {
    const a = spec.army || { inf: 0, cab: 0, cart: 0 };
    const ch = chunks(a.inf, a.cab);
    const trench = 3 + (a.cart || 0) + (spec.tactic === 'asedio' ? 2 : 0) + (spec.tactic === 'emboscada' ? 1 : 0);
    const bar = 2 + ((a.cart || 0) >= 2 ? 1 : 0) + (spec.tactic === 'asedio' ? 1 : 0);
    b.chunk = ch;
    b.stock = { inf: a.inf | 0, cab: a.cab | 0, cart: a.cart | 0, guns: a.cart | 0, trench, bar, mil: [] };
    if (spec.war === 'invade') {
      b.stock.campInf = b.stock.inf;
      b.stock.campCab = b.stock.cab;
      b.stock.campCart = b.stock.cart;
    }
  } else {
    const g = spec.garrison || { inf: 0, cab: 0 };
    const camp = spec.camp || { inf: 0, cab: 0, cart: 0 };
    const cinf = Math.max(0, camp.inf | 0), ccab = Math.max(0, camp.cab | 0), ccart = Math.max(0, camp.cart | 0);
    const split = spec.war === 'repel' && (cinf > 0 || ccab > 0 || ccart > 0);
    const ch = chunks((g.inf | 0) + (split ? cinf : 0), (g.cab | 0) + (split ? ccab : 0));
    const mil = splitPower(spec.militia || 0).map((p) => ({ kind: 'fusil', power: p, men: Math.max(3, Math.round(p / 4)), pool: 'mil' }));
    const fort = spec.defenses?.fortin || 0;
    const tr = spec.defenses?.trinchera || 0;
    b.chunk = ch;
    b.stock = {
      inf: (g.inf | 0) + (split ? cinf : 0),
      cab: (g.cab | 0) + (split ? ccab : 0),
      cart: split ? ccart : 0,
      guns: fort + (split ? ccart : 0),
      trench: 3 + tr * 4, bar: 2 + fort * 3, mil,
    };
    if (split) {
      b.stock.garInf = g.inf | 0;
      b.stock.garCab = g.cab | 0;
      b.stock.campInf = cinf;
      b.stock.campCab = ccab;
      b.stock.campCart = ccart;
    }
    b.budget = cloneBudget(b.stock);
    if (split) {
      b.budget.ginf = g.inf | 0;
      b.budget.gcab = g.cab | 0;
      b.budget.cinf = cinf;
      b.budget.ccab = ccab;
      b.budget.ccart = ccart;
      b.budget.fortGuns = fort;
    }
  }
  if (!b.budget) b.budget = cloneBudget(b.stock);
  placeEnemies(b, spec.enemy | 0);
  return b;
}

export function alive(b, side) {
  return b.units.filter((u) => u.alive && !u.retreated && (!side || u.side === side));
}

function coverOf(b, unit) {
  const g = b.ground[unit.y][unit.x];
  const w = workAt(b, unit.x, unit.y);
  let m = 1, tag = null;
  if (w === 'trinchera') { m *= 0.58; tag = 'trinchera'; }
  else if (g === 'cana') { m *= 0.72; tag = 'cana'; }
  let muro = false, bari = false;
  for (const [dx, dy] of N4) {
    const x = unit.x + dx, y = unit.y + dy;
    if (!inb(x, y)) continue;
    if (b.ground[y][x] === 'muro') muro = true;
    if (workAt(b, x, y) === 'barricada') bari = true;
  }
  if (muro) { m *= 0.8; tag = tag || 'muro'; }
  if (bari) { m *= 0.84; tag = tag || 'barricada'; }
  return { mult: Math.max(0.4, m), tag };
}

export function blockedLos(b, a, t) {
  let x0 = a.x, y0 = a.y, x1 = t.x, y1 = t.y;
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy, guard = 0;
  while (guard++ < 80) {
    if (!((x0 === a.x && y0 === a.y) || (x0 === t.x && y0 === t.y))) {
      if (b.ground[y0][x0] === 'muro' || workAt(b, x0, y0) === 'barricada') return true;
    }
    if (x0 === x1 && y0 === y1) return false;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
  return false;
}

function isFlank(atk, def) {
  const dx = atk.x - def.x, dy = atk.y - def.y;
  if (!dx && !dy) return false;
  return def.fx * dx + def.fy * dy <= 0;
}

// ---- colocar
function occ(b, x, y) { return unitAt(b, x, y) || workAt(b, x, y); }

export function placeUnit(b, kind, x, y) {
  if (b.phase !== 'deploy') return 'La tropa ya salió: ahora se dan órdenes.';
  const z = zone(b, x, y);
  if (z !== 'troop') return 'Esa casilla está fuera de tu zona. La tropa se forma en tu borde del campo.';
  const g = b.ground[y][x];
  if (g === 'muro') return 'Ahí hay un muro: no se puede formar.';
  if (g === 'rio') return 'El río no sostiene a la tropa. Cruza por el camino o los vados.';
  if (occ(b, x, y)) return 'Esa casilla ya está ocupada.';
  const B = b.budget;
  if (kind === 'art') {
    const owns = (b.stock.guns || 0) > 0;
    if (!owns) return b.mode === 'attack' ? 'Hace falta una carreta para traer el cañón.' : 'El fortín no tiene cañón. Constrúyelo en la ciudad.';
    if (B.guns <= 0) return 'Ya colocaste toda la artillería.';
    if (B.ginf != null) {
      let pool = 'fort';
      if ((B.fortGuns || 0) > 0) { B.fortGuns--; pool = 'fort'; }
      else if ((B.ccart || 0) > 0) { B.ccart--; B.cart = Math.max(0, B.cart - 1); pool = 'cart'; }
      else return 'Ya colocaste toda la artillería.';
      B.guns--;
      spawn(b, { side: 'player', kind: 'art', men: 1, pool, x, y });
      return null;
    }
    B.guns--;
    if (b.mode === 'attack') B.cart = Math.max(0, B.cart - 1);
    const pool = b.mode === 'defense' ? 'fort' : 'cart';
    spawn(b, { side: 'player', kind: 'art', men: 1, pool, x, y });
    return null;
  }
  if (kind === 'mil') {
    if (!B.mil.length) return 'La milicia del pueblo ya está en el campo.';
    const m = B.mil.pop();
    spawn(b, { side: 'player', kind: 'fusil', men: m.men, pool: 'mil', power: m.power, x, y });
    return null;
  }
  if (kind === 'cab') {
    if (B.cab <= 0) return 'Ya no te quedan jinetes por colocar.';
    let pool = 'cab';
    let cap = B.cab;
    if (B.ginf != null) {
      if ((B.gcab || 0) > 0) { pool = 'gcab'; cap = B.gcab; }
      else { pool = 'cab'; cap = B.ccab || 0; }
    }
    const men = Math.min(b.chunk.cab, cap, B.cab);
    if (men <= 0) return 'Ya no te quedan jinetes por colocar.';
    B.cab -= men;
    if (pool === 'gcab') B.gcab -= men;
    else if (B.ginf != null) B.ccab -= men;
    spawn(b, { side: 'player', kind: 'cab', men, pool, x, y });
    return null;
  }
  if (kind !== 'machete' && kind !== 'fusil') return 'Esa tropa no existe.';
  if (B.inf <= 0) return 'Ya no te queda infantería por colocar.';
  let pool = 'inf';
  let cap = B.inf;
  if (B.ginf != null) {
    if ((B.ginf || 0) > 0) { pool = 'ginf'; cap = B.ginf; }
    else { pool = 'inf'; cap = B.cinf || 0; }
  }
  const men = Math.min(b.chunk.inf, cap, B.inf);
  if (men <= 0) return 'Ya no te queda infantería por colocar.';
  B.inf -= men;
  if (pool === 'ginf') B.ginf -= men;
  else if (B.ginf != null) B.cinf -= men;
  spawn(b, { side: 'player', kind, men, pool, x, y });
  return null;
}

export function placeWork(b, kind, x, y) {
  if (b.phase !== 'deploy') return 'Las defensas se cavan antes de empezar.';
  const z = zone(b, x, y);
  if (z !== 'troop' && z !== 'work') return 'Eso queda demasiado lejos: cava en tu mitad del campo.';
  const g = b.ground[y][x];
  if (g === 'muro' || g === 'rio' || g === 'plaza') return g === 'rio' ? 'En el río no se cava.' : g === 'plaza' ? 'La plaza queda libre: es el objetivo.' : 'El muro ya tapa ese lado.';
  if (occ(b, x, y)) return 'Esa casilla ya está ocupada.';
  if (kind === 'trinchera') {
    if (b.budget.trench <= 0) return 'Ya cavaste todas las trincheras.';
    b.budget.trench--;
  } else if (kind === 'barricada') {
    if (b.budget.bar <= 0) return 'Ya no te quedan barricadas.';
    b.budget.bar--;
  } else return 'Esa defensa no existe.';
  b.works.set(key(x, y), kind);
  return null;
}

export function liftUnit(b, id) {
  if (b.phase !== 'deploy') return 'Ya empezó el combate.';
  const i = b.units.findIndex((u) => u.id === id && u.side === 'player');
  if (i < 0) return 'Esa tropa no está.';
  const u = b.units[i];
  b.units.splice(i, 1);
  const B = b.budget;
  if (u.pool === 'ginf') { B.inf += u.men; B.ginf += u.men; }
  else if (u.pool === 'gcab') { B.cab += u.men; B.gcab += u.men; }
  else if (u.pool === 'inf') { B.inf += u.men; if (B.cinf != null) B.cinf += u.men; }
  else if (u.pool === 'cab') { B.cab += u.men; if (B.ccab != null) B.ccab += u.men; }
  else if (u.pool === 'cart') { B.cart++; B.guns++; if (B.ccart != null) B.ccart++; }
  else if (u.pool === 'fort') { B.guns++; if (B.fortGuns != null) B.fortGuns++; }
  else if (u.pool === 'mil') B.mil.push({ kind: 'fusil', power: u.power, men: u.men, pool: 'mil' });
  return null;
}

export function liftWork(b, x, y) {
  if (b.phase !== 'deploy') return 'Ya empezó el combate.';
  const k = workAt(b, x, y);
  if (!k) return 'Ahí no hay nada que quitar.';
  b.works.delete(key(x, y));
  if (k === 'trinchera') b.budget.trench++;
  else b.budget.bar++;
  return null;
}

export function canStart(b) {
  const B = b.budget;
  if (!alive(b, 'player').length) return 'Coloca al menos una tropa.';
  if (B.inf > 0) return `Todavía quedan ${B.inf} infantes sin colocar.`;
  if (B.cab > 0) return `Todavía quedan ${B.cab} jinetes sin colocar.`;
  if (B.mil.length) return 'Falta colocar la milicia del pueblo.';
  return null;
}

export function autoDeploy(b) {
  if (b.phase !== 'deploy') return 'Ya empezó el combate.';
  for (const u of [...b.units]) if (u.side === 'player') liftUnit(b, u.id);
  for (const [k, kind] of [...b.works]) {
    const x = k % COLS, y = (k / COLS) | 0;
    if (kind) liftWork(b, x, y);
  }
  const B = b.budget;
  const spots = (pred) => freeTiles(b, (x, y, g) => zone(b, x, y) === 'troop' && pred(x, y, g) && !workAt(b, x, y));
  const put = (kind, pred) => {
    const list = spots(pred);
    if (!list.length) return false;
    const south = b.mode === 'attack';
    const t = pickTile(list, (p) => {
      let s = south ? -p.y : p.y;
      if (kind === 'cab') {
        const flank = Math.min(Math.abs(p.x - 7), Math.abs(p.x - 27));
        s += flank * 0.55 + (Math.abs(p.x - 17) < 4 ? 8 : 0);
      }
      if (kind === 'art') s += south ? p.y : -p.y;
      if (kind === 'fusil' && p.g === 'cana') s -= 2;
      if (kind === 'machete') s += south ? -1 : 1;
      return s + Math.abs(p.x - 17) * 0.05;
    });
    return placeUnit(b, kind, t.x, t.y) == null;
  };
  // infantería: un poco más de fusil que de machete, salvo la carga
  const preferMachete = b.tactic === 'carga';
  let guard = 0;
  while (B.inf > 0 && guard++ < 40) {
    const macheteFirst = preferMachete ? (B.inf > b.chunk.inf) : false;
    const kind = macheteFirst || (!preferMachete && B.inf <= b.chunk.inf && !alive(b, 'player').some((u) => u.kind === 'machete'))
      ? (preferMachete ? 'machete' : 'fusil')
      : (alive(b, 'player').filter((u) => u.kind === 'fusil').length <= alive(b, 'player').filter((u) => u.kind === 'machete').length ? 'fusil' : 'machete');
    if (!put(kind, () => true)) break;
  }
  guard = 0;
  while (B.cab > 0 && guard++ < 20) { if (!put('cab', (x) => Math.abs(x - 17) >= 3)) { if (!put('cab', () => true)) break; } }
  guard = 0;
  while (B.mil.length && guard++ < 20) { if (!put('mil', (x, y, g) => g !== 'camino')) { if (!put('mil', () => true)) break; } }
  // un cañón en el camino, si hay
  if (B.guns > 0) put('art', (x, y, g) => g === 'camino' || Math.abs(x - 17) <= 1);
  // trincheras delante de la zona de tropa
  const yT = b.mode === 'attack' ? ROWS - 7 : 6;
  for (let x = 8; x <= 26 && b.budget.trench > 0; x += 2) {
    if (inb(x, yT) && !placeWork(b, 'trinchera', x, yT)) { /* puesta */ }
    else if (inb(x, yT + (b.mode === 'attack' ? 1 : -1))) placeWork(b, 'trinchera', x, yT + (b.mode === 'attack' ? 1 : -1));
  }
  // barricadas a los lados del camino, tapando un vado si alcanza
  const bars = b.mode === 'attack' ? [[16, ROWS - 8], [18, ROWS - 8], [7, ROWS - 9]] : [[16, 8], [18, 8], [26, 9]];
  for (const [x, y] of bars) if (b.budget.bar > 0) placeWork(b, 'barricada', x, y);
  return canStart(b);
}

// ---- movimiento
function dijkstra(b, unit, maxCost) {
  const W = COLS, H = ROWS, N = W * H;
  const dist = new Float32Array(N);
  dist.fill(1e9);
  const prev = new Int16Array(N);
  prev.fill(-1);
  const used = new Uint8Array(N);
  const start = key(unit.x, unit.y);
  dist[start] = 0;
  const heap = [start];
  const up = (i) => { while (i && dist[heap[i]] < dist[heap[(i - 1) >> 1]]) { const p = (i - 1) >> 1; const t = heap[i]; heap[i] = heap[p]; heap[p] = t; i = p; } };
  const down = (i) => {
    for (;;) {
      let m = i, l = i * 2 + 1, r = l + 1;
      if (l < heap.length && dist[heap[l]] < dist[heap[m]]) m = l;
      if (r < heap.length && dist[heap[r]] < dist[heap[m]]) m = r;
      if (m === i) break;
      const t = heap[i]; heap[i] = heap[m]; heap[m] = t; i = m;
    }
  };
  const pop = () => { const v = heap[0]; const x = heap.pop(); if (heap.length) { heap[0] = x; down(0); } return v; };
  while (heap.length) {
    const cur = pop();
    if (used[cur]) continue;
    used[cur] = 1;
    if (dist[cur] > maxCost) continue;
    const cx = cur % W, cy = (cur / W) | 0;
    for (const [dx, dy] of N8) {
      const nx = cx + dx, ny = cy + dy;
      if (!inb(nx, ny)) continue;
      let step = passCost(b, unit, nx, ny);
      if (step > 50) continue;
      if (dx && dy) step *= 1.32;
      const nd = dist[cur] + step;
      if (nd > maxCost + 0.001) continue;
      const ni = key(nx, ny);
      if (nd >= dist[ni]) continue;
      dist[ni] = nd; prev[ni] = cur;
      heap.push(ni); up(heap.length - 1);
    }
  }
  return { dist, prev };
}

export function reachable(b, unit, orderT) {
  const K = KINDS[unit.kind];
  const budget = K.move + (orderT === 'carga' && K.melee ? 1.15 : 0);
  const { dist } = dijkstra(b, unit, budget);
  const cells = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const d = dist[key(x, y)];
    if (d > budget) continue;
    if ((x !== unit.x || y !== unit.y) && unitAt(b, x, y, unit)) continue;
    if (orderT === 'retirada') {
      const hy = homeY(b, unit.side);
      if (Math.abs(y - hy) >= Math.abs(unit.y - hy) && !(x === unit.x && y === unit.y)) continue;
    }
    cells.push({ x, y });
  }
  return cells;
}

function pathToward(b, unit, goal, budget) {
  const { dist, prev } = dijkstra(b, unit, budget);
  let best = key(unit.x, unit.y), bestS = 1e9;
  for (let i = 0; i < dist.length; i++) {
    if (dist[i] > budget) continue;
    const x = i % COLS, y = (i / COLS) | 0;
    if ((x !== unit.x || y !== unit.y) && unitAt(b, x, y, unit)) continue;
    const s = Math.max(Math.abs(x - goal.x), Math.abs(y - goal.y)) * 20 + dist[i];
    if (s < bestS) { bestS = s; best = i; }
  }
  const path = [];
  let c = best, n = 0;
  while (c >= 0 && n++ < 80) {
    path.push({ x: c % COLS, y: (c / COLS) | 0 });
    if (c === key(unit.x, unit.y)) break;
    c = prev[c];
  }
  path.reverse();
  return path;
}

function closest(list, u) {
  let best = null, d = 1e9;
  for (const f of list) { const k = cheb(u, f); if (k < d) { d = k; best = f; } }
  return best;
}

function flankTile(b, unit, enemy) {
  const fx = enemy.fx, fy = enemy.fy;
  const sides = [[fy, -fx], [-fy, fx]];
  let best = null, s = 1e9;
  for (const [sx, sy] of sides) {
    if (!sx && !sy) continue;
    for (const step of [2, 3]) {
      const x = enemy.x + sx * step, y = enemy.y + sy * step;
      if (!inb(x, y)) continue;
      if (passCost(b, unit, x, y) > 50) continue;
      const d = Math.abs(x - unit.x) + Math.abs(y - unit.y);
      if (d < s) { s = d; best = { x, y }; }
    }
  }
  return best;
}

export function autoGoal(b, unit, orderT) {
  const foes = alive(b, unit.side === 'player' ? 'enemy' : 'player');
  const near = closest(foes, unit);
  if (orderT === 'retirada') return { x: unit.x, y: homeY(b, unit.side) };
  if (orderT === 'esperar') return { x: unit.x, y: unit.y };
  if ((orderT === 'carga' && !KINDS[unit.kind].melee)) return autoGoal(b, unit, 'avanzar');
  if (orderT === 'flanquear' && near) return flankTile(b, unit, near) || { x: near.x, y: near.y };
  if (orderT === 'carga' && near) return { x: near.x, y: near.y };
  const wantPlaza = (b.mode === 'attack' && unit.side === 'player') || (b.mode === 'defense' && unit.side === 'enemy');
  if (wantPlaza && (!near || cheb(unit, near) > 5)) return { ...b.plaza };
  if (near) return { x: near.x, y: near.y };
  return wantPlaza ? { ...b.plaza } : { x: unit.x, y: unit.y };
}

function faceToward(unit, tx, ty) {
  const dx = tx - unit.x, dy = ty - unit.y;
  if (!dx && !dy) return;
  if (Math.abs(dx) >= Math.abs(dy)) { unit.fx = Math.sign(dx); unit.fy = 0; }
  else { unit.fx = 0; unit.fy = Math.sign(dy); }
}

function rangeOf(b, unit) {
  const K = KINDS[unit.kind];
  return K.range + (unit.kind === 'art' && b.tactic === 'asedio' ? 1 : 0);
}

function pickTarget(b, unit) {
  const K = KINDS[unit.kind];
  const minR = K.minRange || (K.melee ? 1 : 1);
  const maxR = K.melee ? 1 : rangeOf(b, unit);
  const foes = alive(b, unit.side === 'player' ? 'enemy' : 'player');
  let best = null, s = 1e9;
  for (const f of foes) {
    const d = cheb(unit, f);
    if (d < minR || d > maxR) continue;
    if (!K.melee && blockedLos(b, unit, f)) continue;
    const sc = d * 10 + f.hp / f.max;
    if (sc < s) { s = sc; best = f; }
  }
  return best;
}

function strike(b, atk, def, mods) {
  const cov = coverOf(b, def);
  let dmg = atk.atk * (0.9 + rng(b) * 0.2);
  if (mods.charge) dmg *= (KINDS[atk.kind].charge || 1) + (b.tactic === 'carga' ? 0.22 : 0);
  if (mods.flank) dmg *= 1.42;
  if (b.tactic === 'emboscada' && b.terrain === 'monte' && atk.side === 'player' && cov.tag === 'cana') dmg *= 1.28;
  if (b.tactic === 'asedio' && atk.kind === 'art') dmg *= 1.2;
  dmg *= cov.mult;
  if (def.exposed) dmg *= 1.28;
  dmg = Math.max(1, Math.round(dmg));
  def.hp -= dmg;
  const killed = def.hp <= 0;
  if (killed) { def.hp = 0; def.alive = false; }
  return { dmg, cover: cov.tag, killed, flank: !!mods.flank, charge: !!mods.charge };
}

function actUnit(b, unit, events) {
  if (!unit.alive || unit.retreated) return;
  const order = unit.order || { t: 'esperar', x: unit.x, y: unit.y };
  const K = KINDS[unit.kind];
  if (order.t !== 'carga') unit.exposed = false;
  const goal = (order.x == null) ? autoGoal(b, unit, order.t) : { x: order.x, y: order.y };
  if (order.t !== 'esperar') {
    const budget = K.move + (order.t === 'carga' && K.melee ? 1.15 : 0);
    const path = pathToward(b, unit, goal, budget);
    if (path.length > 1) {
      const end = path[path.length - 1];
      const river = path.some((p) => b.ground[p.y][p.x] === 'rio');
      unit.x = end.x; unit.y = end.y;
      faceToward(unit, goal.x, goal.y);
      events.push({ t: 'move', id: unit.id, path, river, kind: unit.kind });
    } else if (order.t === 'avanzar' || order.t === 'carga') {
      const ahead = { x: unit.x, y: unit.y + (goal.y === unit.y ? 0 : Math.sign(goal.y - unit.y)) };
      if (inb(ahead.x, ahead.y) && b.ground[ahead.y]?.[ahead.x] === 'rio' && unit.kind === 'art') events.push({ t: 'note', id: unit.id, note: 'rio-art' });
    }
  }
  if (order.t === 'carga' && K.melee) unit.exposed = true;
  const tgt = pickTarget(b, unit);
  if (tgt) {
    const mods = {
      charge: order.t === 'carga' && !!K.melee && cheb(unit, tgt) === 1,
      flank: order.t === 'flanquear' && isFlank(unit, tgt),
    };
    const hit = strike(b, unit, tgt, mods);
    events.push({ t: 'hit', id: unit.id, tid: tgt.id, ...hit });
    if (K.splash && tgt.alive !== undefined) {
      for (const f of alive(b, tgt.side)) {
        if (f === tgt || cheb(tgt, f) > 1) continue;
        const splash = strike(b, { ...unit, atk: unit.atk * 0.45 }, f, {});
        events.push({ t: 'hit', id: unit.id, tid: f.id, ...splash, splash: true });
      }
    }
  }
  if (order.t === 'retirada' && unit.alive && unit.y === homeY(b, unit.side)) {
    unit.retreated = true; unit.alive = false;
    events.push({ t: 'off', id: unit.id });
  }
  unit.order = null;
}

function planEnemy(b) {
  for (const u of alive(b, 'enemy')) {
    const foes = alive(b, 'player');
    const near = closest(foes, u);
    const d = near ? cheb(u, near) : 99;
    const K = KINDS[u.kind];
    let t = 'avanzar';
    const canShoot = near && d <= rangeOf(b, u) && d >= (K.minRange || 1) && (K.melee || !blockedLos(b, u, near));
    if (u.hp < u.max * 0.28 && d < 5) t = 'retirada';
    else if (K.melee && d <= K.move + 1) t = 'carga';
    else if (u.kind === 'cab' && d > 3) t = 'flanquear';
    else if (u.kind === 'art' && d < 2) t = 'retirada';
    else if ((u.kind === 'fusil' || u.kind === 'art') && canShoot) t = 'esperar';
    const goal = autoGoal(b, u, t);
    u.order = { t, x: goal.x, y: goal.y };
  }
}

const SPEED = { art: 0, fusil: 1, machete: 2, cab: 3 };
export function resolveSide(b, side) {
  const events = [];
  if (side === 'enemy') planEnemy(b);
  const list = alive(b, side).sort((a, c) => SPEED[a.kind] - SPEED[c.kind]);
  for (const u of list) actUnit(b, u, events);
  return events;
}

export function outcome(b) {
  const P = alive(b, 'player'), E = alive(b, 'enemy');
  const on = (list) => list.some((u) => u.x === b.plaza.x && u.y === b.plaza.y);
  const pp = P.reduce((s, u) => s + u.hp, 0), ep = E.reduce((s, u) => s + u.hp, 0);
  if (b.mode === 'attack') {
    if (on(P)) return 'win';
    if (!E.length) return 'win';
    if (!P.length) return 'lose';
    if (b.turn > b.maxTurn) return pp >= ep * 1.2 ? 'win' : 'lose';
  } else {
    if (on(E)) return 'lose';
    if (!E.length) return 'win';
    if (!P.length) return 'lose';
    if (b.turn > b.maxTurn) return pp >= ep ? 'win' : 'lose';
  }
  return null;
}

export function setOrder(b, id, t, x, y) {
  const u = b.units.find((n) => n.id === id && n.alive && n.side === 'player');
  if (!u) return 'Esa tropa ya no está en el campo.';
  if (t === 'carga' && !KINDS[u.kind].melee) return 'La carga al machete es de macheteros y caballería.';
  if (x == null) { const g = autoGoal(b, u, t); x = g.x; y = g.y; }
  u.order = { t, x, y };
  return null;
}

export function orderAll(b, t) {
  let n = 0;
  for (const u of alive(b, 'player')) {
    const tt = t === 'carga' && !KINDS[u.kind].melee ? 'avanzar' : t;
    const g = autoGoal(b, u, tt);
    u.order = { t: tt, x: g.x, y: g.y };
    n++;
  }
  return n;
}

export function casualties(b) {
  const lost = { inf: 0, cab: 0, cart: 0, garInf: 0, garCab: 0 };
  for (const u of b.units) {
    if (u.side !== 'player') continue;
    let frac = 0;
    if (u.retreated) frac = 0.1;
    else if (!u.alive) frac = 0.62;
    else frac = (1 - u.hp / u.max) * 0.42;
    const n = Math.min(u.men, Math.round(u.men * frac));
    if (u.pool === 'inf') lost.inf += n;
    else if (u.pool === 'cab') lost.cab += n;
    else if (u.pool === 'cart' && !u.alive && !u.retreated) lost.cart += 1;
    else if (u.pool === 'ginf') lost.garInf += n;
    else if (u.pool === 'gcab') lost.garCab += n;
  }
  // defensa del Régimen: la guarnición es pool inf/cab, pero NO es el ejército de campaña
  if (b.mode === 'defense' && b.budget.ginf == null) {
    lost.garInf = lost.inf; lost.garCab = lost.cab;
    lost.inf = 0; lost.cab = 0; lost.cart = 0;
  }
  const campInf = b.stock.campInf ?? b.stock.inf;
  const campCab = b.stock.campCab ?? b.stock.cab;
  const garInfCap = b.stock.garInf ?? b.stock.inf;
  const garCabCap = b.stock.garCab ?? b.stock.cab;
  lost.inf = Math.min(campInf, lost.inf);
  lost.cab = Math.min(campCab, lost.cab);
  lost.cart = Math.min(b.stock.cart, lost.cart);
  lost.garInf = Math.min(garInfCap, lost.garInf);
  lost.garCab = Math.min(garCabCap, lost.garCab);
  return lost;
}

export function strength(b, side) {
  return alive(b, side).reduce((s, u) => s + u.hp, 0);
}

export function describeOrders(t) {
  return {
    avanzar: 'Avanza hacia donde toques y dispara si alcanza.',
    flanquear: 'Se mueve al costado del enemigo: duele más si llega de lado.',
    carga: 'Macheteros y jinetes se lanzan. Pega duro y queda expuesto.',
    retirada: 'Vuelve a tu borde. Si sale del campo, se salva.',
    esperar: 'Se queda. El fusil y el cañón disparan si tienen tiro.',
  }[t] || '';
}
