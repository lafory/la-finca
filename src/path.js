import { GW, GH } from './data.js';

// Dijkstra (8 direcciones) con montículo binario sobre la cuadrícula global GW×GH, hacia la meta más cercana.
// canWalk(x,z) -> bool ; edgeBlocked(ax,az,bx,bz) -> bool
const N = GW * GH;
const dist = new Float32Array(N);
const prev = new Int32Array(N);
const stamp = new Uint32Array(N); // evita limpiar los arreglos en cada búsqueda
const closed = new Uint32Array(N);
let gen = 0;
const heapI = new Int32Array(N * 4);
const heapD = new Float32Array(N * 4);
const DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];

export function findPath(sx, sz, goals, canWalk, edgeBlocked) {
  gen++;
  const goalSet = new Set();
  for (const [x, z] of goals) if (x >= 0 && z >= 0 && x < GW && z < GH) goalSet.add(z * GW + x);
  if (!goalSet.size) return null;
  const start = sz * GW + sx;
  if (goalSet.has(start)) return [[sx, sz]];
  let n = 0;
  const push = (i, d) => {
    let k = n++;
    while (k > 0) { const p = (k - 1) >> 1; if (heapD[p] <= d) break; heapI[k] = heapI[p]; heapD[k] = heapD[p]; k = p; }
    heapI[k] = i; heapD[k] = d;
  };
  const pop = () => {
    const top = heapI[0];
    const li = heapI[--n], ld = heapD[n];
    let k = 0;
    for (;;) {
      let c = 2 * k + 1;
      if (c >= n) break;
      if (c + 1 < n && heapD[c + 1] < heapD[c]) c++;
      if (heapD[c] >= ld) break;
      heapI[k] = heapI[c]; heapD[k] = heapD[c]; k = c;
    }
    heapI[k] = li; heapD[k] = ld;
    return top;
  };
  dist[start] = 0; prev[start] = -1; stamp[start] = gen;
  push(start, 0);
  while (n) {
    const cur = pop();
    if (closed[cur] === gen) continue;
    closed[cur] = gen;
    if (goalSet.has(cur)) {
      const out = [];
      for (let c = cur; c !== -1; c = prev[c]) out.push([c % GW, (c / GW) | 0]);
      return out.reverse();
    }
    const cx = cur % GW, cz = (cur / GW) | 0, cd = dist[cur];
    for (const [dx, dz, cost] of DIRS) {
      const nx = cx + dx, nz = cz + dz;
      if (nx < 0 || nz < 0 || nx >= GW || nz >= GH) continue;
      const ni = nz * GW + nx;
      if (closed[ni] === gen) continue;
      if (!canWalk(nx, nz)) continue;
      if (dx && dz) {
        // sin cortar esquinas
        if (!canWalk(cx + dx, cz) || !canWalk(cx, cz + dz)) continue;
        if (edgeBlocked(cx, cz, cx + dx, cz) || edgeBlocked(cx, cz, cx, cz + dz)) continue;
        if (edgeBlocked(cx + dx, cz, nx, nz) || edgeBlocked(cx, cz + dz, nx, nz)) continue;
      } else if (edgeBlocked(cx, cz, nx, nz)) continue;
      const nd = cd + cost;
      if (stamp[ni] !== gen || nd < dist[ni]) {
        stamp[ni] = gen; dist[ni] = nd; prev[ni] = cur;
        if (n < heapI.length) push(ni, nd);
      }
    }
  }
  return null;
}
