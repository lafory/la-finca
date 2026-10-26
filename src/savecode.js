// Código de partida: copia de seguridad local sin cuenta.
// Formato del código:  LF1.<crc32 hex de 8>.<base64url(deflate(JSON))>
// El JSON es { app: 'la-finca', f: 1, at: <ms reales>, save: <partida v2> }.
// Archivo .lafinca: el mismo sobre en JSON legible.
import { deflateSync, inflateSync, strToU8, strFromU8 } from 'fflate';

export const CODE_PREFIX = 'LF1';
export const FILE_EXT = '.lafinca';
export const SAVE_VERSION = 2;

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
export function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return ((c ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}
function b64urlEncode(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) throw new CodeError('El código tiene letras que no van.');
  const b = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export class CodeError extends Error {}

// Comprueba que parezca una partida de La Finca v2.
export function validSave(d) {
  return !!d && typeof d === 'object' && d.v === SAVE_VERSION && Number.isFinite(+d.level) && Number.isFinite(+d.money)
    && Array.isArray(d.parcels) && d.inv && typeof d.inv === 'object';
}

export function summary(env) {
  const s = env.save;
  return { level: Math.floor(+s.level) || 1, money: Math.floor(+s.money) || 0, at: +env.at || null, workers: Array.isArray(s.workers) ? s.workers.length : 0 };
}

export function envelope(save, at = Date.now()) {
  if (!validSave(save)) throw new CodeError('La partida actual no se pudo leer.');
  return { app: 'la-finca', f: 1, at, save };
}

export function encodeCode(save, at) {
  const json = JSON.stringify(envelope(save, at));
  const raw = strToU8(json);
  const packed = deflateSync(raw, { level: 9 });
  return `${CODE_PREFIX}.${crc32(raw)}.${b64urlEncode(packed)}`;
}

function checkEnvelope(env) {
  if (!env || env.app !== 'la-finca') throw new CodeError('Eso no es una partida de La Finca.');
  if (env.f !== 1) throw new CodeError('Esta partida es de una versión más nueva del juego. Recarga la página.');
  if (!validSave(env.save)) throw new CodeError(env.save && env.save.v !== SAVE_VERSION ? 'Esta partida es de otra versión del juego.' : 'La partida está incompleta.');
  return env;
}

export function decodeCode(text) {
  const t = String(text || '').replace(/\s+/g, '');
  if (!t) throw new CodeError('Pega el código primero.');
  const parts = t.split('.');
  if (parts.length !== 3 || !/^LF\d+$/.test(parts[0])) throw new CodeError('Eso no parece un código de La Finca (empieza por “LF1.”).');
  if (parts[0] !== CODE_PREFIX) throw new CodeError('Este código es de una versión más nueva del juego. Recarga la página.');
  if (!/^[0-9a-f]{8}$/i.test(parts[1])) throw new CodeError('El código está cortado o le falta un pedazo.');
  let raw;
  try { raw = inflateSync(b64urlDecode(parts[2])); } catch (e) { if (e instanceof CodeError) throw e; throw new CodeError('El código está cortado o le falta un pedazo.'); }
  if (crc32(raw) !== parts[1].toLowerCase()) throw new CodeError('El código está dañado (no cuadra la comprobación). Cópialo otra vez completo.');
  let env;
  try { env = JSON.parse(strFromU8(raw)); } catch { throw new CodeError('El código está dañado.'); }
  return checkEnvelope(env);
}

export function encodeFile(save, at) {
  return JSON.stringify(envelope(save, at), null, 1);
}

// Archivo .lafinca (JSON). También acepta un archivo de texto con un código LF1 dentro.
export function decodeFile(text) {
  const t = String(text || '').trim();
  if (t.startsWith('LF')) return decodeCode(t);
  let env;
  try { env = JSON.parse(t); } catch { throw new CodeError('Ese archivo no es una partida de La Finca.'); }
  return checkEnvelope(env);
}

export function fileName(save, at = Date.now()) {
  const d = new Date(at);
  const p = (n) => String(n).padStart(2, '0');
  return `la-finca-nivel${Math.floor(+save.level) || 1}-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}${FILE_EXT}`;
}
