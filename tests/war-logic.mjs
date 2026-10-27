// Invasiones: destacamento, código, botín y que una derrota no quite la ciudad.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createBattle, autoDeploy, alive, casualties, canStart } from '../src/mambi/field.js';
import {
  troopCode, readTroopCode, settleWar, suggestDetachment, detachmentError, reinforcementError, friendPower, slugNick,
} from '../src/mambi/war.js';

test('el código de tropa va y vuelve, y uno trucado no entra', () => {
  const code = troopCode({ inf: 40, cab: 12, cart: 2, garInf: 8, garCab: 3, freed: 4, nick: 'La Fory' });
  assert.match(code, /^LAF-40\.12\.2\.8\.3\.4\.LAFORY-[A-Z2-9]{2}$/);
  const back = readTroopCode(code);
  assert.equal(back.name, 'Lafory');
  assert.equal(back.inf, 40);
  assert.equal(back.cab, 12);
  assert.equal(back.garInf, 8);
  assert.equal(back.freed, 4);
  assert.equal(back.foe, 'amigo');
  assert.equal(readTroopCode(code.slice(0, -1) + (code.endsWith('A') ? 'B' : 'A')), null);
  assert.equal(readTroopCode('LAF-1.0.0.0.0.0.AB-ZZ'), null);
  assert.equal(slugNick('ñame'), 'NAME');
  assert.ok(friendPower(back) > 40 * 4);
});

test('el destacamento no puede pasar del campamento ni salir sin víveres', () => {
  const army = { inf: 10, cab: 2, cart: 1 };
  assert.equal(detachmentError(army, 100, { inf: 0, cab: 0, cart: 1 }), 'Manda al menos un soldado del campamento.');
  assert.match(detachmentError(army, 100, { inf: 11, cab: 0, cart: 0 }), /infantes/);
  assert.match(detachmentError(army, 3, { inf: 4, cab: 0, cart: 0 }), /víveres/);
  assert.equal(detachmentError(army, 4, { inf: 4, cab: 0, cart: 0 }), null);
  assert.equal(reinforcementError(army, 0, { inf: 0, cab: 0, cart: 0 }), null);
  const s = suggestDetachment(army, 30);
  assert.ok(s.inf <= 10 && s.cab <= 2 && s.cart <= 1);
  assert.ok(s.inf + s.cab >= 1);
});

test('ganar o perder una invasión no toca las ciudades libres', () => {
  const base = {
    army: { inf: 20, cab: 4, cart: 1 },
    gar: { inf: 6, cab: 1 },
    freed: ['manzanillo', 'bayamo'],
    money: 5000,
    farmBank: 800,
    viveres: 40,
    mood: 1,
  };
  const win = settleWar(base, {
    war: 'invade', win: true, enemyPower: 40, friend: false,
    sent: { inf: 8, cab: 2, cart: 0 }, lost: { inf: 3, cab: 1, cart: 0 },
  });
  assert.deepEqual(win.freed, base.freed);
  assert.equal(win.army.inf, 17);
  assert.equal(win.army.cab, 3);
  assert.equal(win.loot, 40 * 46);
  assert.ok(win.mood < 1);
  assert.equal(win.viveres, 40 - 10);
  assert.equal(win.gar.inf, 6);

  const lose = settleWar(base, {
    war: 'invade', win: false, enemyPower: 40,
    sent: { inf: 8, cab: 0, cart: 1 }, lost: { inf: 99, cab: 9, cart: 1, garInf: 6 },
  });
  assert.deepEqual(lose.freed, base.freed);
  assert.equal(lose.army.inf, 12);
  assert.equal(lose.army.cab, 4);
  assert.equal(lose.army.cart, 0);
  assert.equal(lose.gar.inf, 6);
  assert.equal(lose.loot, 0);

  const raid = settleWar(base, {
    war: 'repel', win: false, hasFarm: true, enemyPower: 30, now: 1000, raidBlock: 600,
    sent: { inf: 0, cab: 0, cart: 0 }, lost: { inf: 50, cab: 0, garInf: 2, garCab: 0 },
  });
  assert.deepEqual(raid.freed, ['manzanillo', 'bayamo']);
  assert.equal(raid.army.inf, 20);
  assert.equal(raid.gar.inf, 4);
  assert.equal(raid.farmBank, 0);
  assert.equal(raid.stolen, 800);
  assert.equal(raid.raidUntil, 1600);
  assert.equal(raid.money, 5000);

  const purse = settleWar({ ...base, farmBank: 0 }, {
    war: 'repel', win: false, hasFarm: false, enemyPower: 30,
    sent: { inf: 4, cab: 0, cart: 0 }, lost: { inf: 2, garInf: 1 },
  });
  assert.deepEqual(purse.freed, base.freed);
  assert.equal(purse.army.inf, 18);
  assert.equal(purse.gar.inf, 5);
  assert.ok(purse.stolen > 0 && purse.money < 5000);
});

test('en el campo, la tropa del campamento no se confunde con la guarnición', () => {
  const b = createBattle({
    mode: 'defense', war: 'repel', foe: 'ocre', foeName: 'Cachita', rivalId: 'guasima',
    cityId: 'bayamo', city: 'Bayamo', terrain: 'llano',
    garrison: { inf: 8, cab: 2 }, militia: 8, defenses: { trinchera: 1, fortin: 0 },
    camp: { inf: 10, cab: 2, cart: 1 }, enemy: 40,
  });
  assert.equal(autoDeploy(b), null);
  assert.equal(canStart(b), null);
  assert.ok(alive(b, 'player').some((u) => u.pool === 'ginf' || u.pool === 'gcab'));
  assert.ok(alive(b, 'player').some((u) => u.pool === 'inf' || u.pool === 'cab'));
  assert.ok(alive(b, 'enemy').every((u) => u.banner === 'Cachita'));
  for (const u of alive(b, 'player')) if (u.pool === 'inf' || u.pool === 'cab' || u.pool === 'cart') { u.alive = false; u.hp = 0; }
  const c = casualties(b);
  assert.ok(c.inf + c.cab + c.cart > 0);
  assert.equal(c.garInf, 0);
  assert.equal(c.garCab, 0);
});

test('la defensa del Régimen sigue contando bajas solo en la guarnición', () => {
  const b = createBattle({
    mode: 'defense', cityId: 'bayamo', terrain: 'llano',
    garrison: { inf: 10, cab: 0 }, militia: 0, defenses: { trinchera: 0, fortin: 0 }, enemy: 20,
  });
  assert.equal(autoDeploy(b), null);
  const u = alive(b, 'player').find((x) => x.pool === 'inf');
  assert.ok(u);
  u.alive = false; u.hp = 0;
  const c = casualties(b);
  assert.equal(c.inf, 0);
  assert.ok(c.garInf > 0);
});
