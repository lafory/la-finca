import { W, H } from './data.js';

// Dijkstra en cuadrícula de 8 direcciones hacia el conjunto de metas más cercano.
// canWalk(x,z) -> bool ; edgeBlocked(ax,az,bx,bz) -> bool
export function findPath(sx, sz, goals, canWalk, edgeBlocked) {
  const N = W * H;
  const dist = new Float32Array(N).fill(Infinity);
  const prev = new Int32Array(N).fill(-1);
  const goalSet = new Set(goals.map(([x, z]) => z * W + x));
  const start = sz * W + sx;
  if (goalSet.has(start)) return [[sx, sz]];
  dist[start] = 0;
  // Cola de prioridad simple (grid pequeño).
  const open = [start];
  const inOpen = new Uint8Array(N);
  inOpen[start] = 1;
  const dirs = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (dist[open[i]] < dist[open[bi]]) bi = i;
    const cur = open[bi];
    open[bi] = open[open.length - 1];
    open.pop();
    inOpen[cur] = 0;
    if (goalSet.has(cur)) {
      const out = [];
      for (let c = cur; c !== -1; c = prev[c]) out.push([c % W, (c / W) | 0]);
      return out.reverse();
    }
    const cx = cur % W, cz = (cur / W) | 0;
    for (const [dx, dz, cost] of dirs) {
      const nx = cx + dx, nz = cz + dz;
      if (nx < 0 || nz < 0 || nx >= W || nz >= H) continue;
      if (!canWalk(nx, nz)) continue;
      if (dx && dz) {
        // Sin cortar esquinas.
        if (!canWalk(cx + dx, cz) || !canWalk(cx, cz + dz)) continue;
        if (edgeBlocked(cx, cz, cx + dx, cz) || edgeBlocked(cx, cz, cx, cz + dz)) continue;
        if (edgeBlocked(cx + dx, cz, nx, nz) || edgeBlocked(cx, cz + dz, nx, nz)) continue;
      } else if (edgeBlocked(cx, cz, nx, nz)) continue;
      const ni = nz * W + nx;
      const nd = dist[cur] + cost;
      if (nd < dist[ni]) {
        dist[ni] = nd;
        prev[ni] = cur;
        if (!inOpen[ni]) { open.push(ni); inOpen[ni] = 1; }
      }
    }
  }
  return null;
}
