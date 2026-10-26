// Pruebas unitarias del código de partida (node --test tests/savecode.test.mjs)
import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeCode, decodeCode, encodeFile, decodeFile, CodeError, summary, fileName } from '../src/savecode.js';

const save = { v: 2, level: 7, money: 1234, xp: 900, parcels: ['a', 'b'], inv: { huevo: 3 }, workers: [{ id: 'recolector' }], note: 'ñandú «kétchup» 🇨🇺', big: 'x'.repeat(50000) };

test('ida y vuelta del código', () => {
  const c = encodeCode(save, 1700000000000);
  assert.match(c, /^LF1\.[0-9a-f]{8}\.[A-Za-z0-9_-]+$/);
  assert.ok(c.length < 2000, 'comprimido');
  const env = decodeCode(c);
  assert.deepEqual(env.save, save);
  assert.deepEqual(summary(env), { level: 7, money: 1234, at: 1700000000000, workers: 1 });
  // tolera espacios y saltos de línea al pegar
  assert.deepEqual(decodeCode(`  ${c.slice(0, 20)}\n${c.slice(20)} `).save, save);
});
test('detecta código dañado, cortado o ajeno', () => {
  const c = encodeCode(save);
  const [p, crc, body] = c.split('.');
  const flip = body.slice(0, 30) + (body[30] === 'A' ? 'B' : 'A') + body.slice(31);
  assert.throws(() => decodeCode(`${p}.${crc}.${flip}`), CodeError);
  assert.throws(() => decodeCode(`${p}.00000000.${body}`), /comprobación/);
  assert.throws(() => decodeCode(c.slice(0, c.length - 40)), CodeError);
  assert.throws(() => decodeCode('hola'), /LF1/);
  assert.throws(() => decodeCode(''), /Pega/);
  assert.throws(() => decodeCode(`LF2.${crc}.${body}`), /más nueva/);
});
test('rechaza partidas de otra versión', () => {
  assert.throws(() => encodeCode({ ...save, v: 1 }), CodeError);
});
test('archivo .lafinca', () => {
  const f = encodeFile(save, 5);
  assert.deepEqual(decodeFile(f).save, save);
  assert.deepEqual(decodeFile(encodeCode(save)).save, save); // archivo con un código dentro
  assert.throws(() => decodeFile('{"app":"otra"}'), /no es una partida/);
  assert.throws(() => decodeFile('nada'), CodeError);
  assert.match(fileName(save, Date.UTC(2026, 9, 25, 12)), /^la-finca-nivel7-2026-10-25\.lafinca$/);
});

test('decodeAny: código con texto alrededor, guiones tipográficos, BOM y JSON pelado', async () => {
  const { decodeAny } = await import('../src/savecode.js');
  const save = { v: 2, level: 7, money: 99, parcels: [], inv: {} };
  const c = encodeCode(save);
  assert.deepEqual(decodeAny(`Mi finca:\n${c}\n`).save, save);
  assert.deepEqual(decodeAny('\uFEFF' + encodeFile(save)).save, save);
  assert.deepEqual(decodeAny(JSON.stringify(save)).save, save);
  assert.deepEqual(decodeAny(c.replace(/-/g, '\u2010')).save, save);
  assert.throws(() => decodeAny(''), /vacío/i);
  assert.throws(() => decodeAny('{"a":1}'), CodeError);
});
