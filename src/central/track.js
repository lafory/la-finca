// Geometría del lazo del tren: punto y rumbo a una distancia s a lo largo de la vía.
import { TRACK, LOOP_LEN } from './data.js';

const R = (TRACK.BOT - TRACK.TOP) / 2;
const LS = TRACK.XR - TRACK.XL;
const CZ = (TRACK.TOP + TRACK.BOT) / 2;
const ARC = Math.PI * R;

export const wrap = (s) => ((s % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;

// Devuelve { x, z, dx, dz } (dx,dz = dirección de marcha unitaria)
export function loopAt(s, out = {}) {
  s = wrap(s);
  if (s < LS) { out.x = TRACK.XL + s; out.z = TRACK.TOP; out.dx = 1; out.dz = 0; return out; }
  s -= LS;
  if (s < ARC) { // media vuelta por el este: de arriba (z=TOP) a abajo (z=BOT)
    const a = -Math.PI / 2 + s / R; // ángulo desde el centro, -90° = arriba
    out.x = TRACK.XR + Math.cos(a) * R; out.z = CZ + Math.sin(a) * R;
    out.dx = -Math.sin(a); out.dz = Math.cos(a); return out;
  }
  s -= ARC;
  if (s < LS) { out.x = TRACK.XR - s; out.z = TRACK.BOT; out.dx = -1; out.dz = 0; return out; }
  s -= LS;
  const a = Math.PI / 2 + s / R; // por el oeste: de abajo a arriba
  out.x = TRACK.XL + Math.cos(a) * R; out.z = CZ + Math.sin(a) * R;
  out.dx = -Math.sin(a); out.dz = Math.cos(a);
  return out;
}
// Rumbo para modelos que miran hacia −z
export const headingOf = (dx, dz) => Math.atan2(-dx, -dz);
// distancia hacia delante de a → b sobre el lazo
export const ahead = (a, b) => wrap(b - a);
export { LOOP_LEN };
