// Texturas procedurales en canvas: suelo de la finca, hierba repetible, sombras de contacto, cielo.
import * as THREE from 'three';
import { W, H, PEN, ROAD } from './data.js';
import { isOwned, isRoad } from './state.js';
import { rng } from './models.js';

const rgb = (h, k = 1) => `rgb(${Math.min(255, ((h >> 16) & 255) * k) | 0},${Math.min(255, ((h >> 8) & 255) * k) | 0},${Math.min(255, (h & 255) * k) | 0})`;

export function groundTexture(s, plotTiles, px = 64) {
  const r = rng(77);
  const cw = W * px, ch = H * px;
  const base = document.createElement('canvas');
  base.width = cw; base.height = ch;
  const b = base.getContext('2d');
  const kind = (x, z) => {
    if (isRoad(x)) return 'road';
    if (!isOwned(s, x, z)) return 'wild';
    if (x >= PEN.x0 && x <= PEN.x1 && z >= PEN.z0 && z <= PEN.z1) return 'pen';
    if (plotTiles.has(`${x},${z}`)) return 'earth';
    if (x >= 4 && x <= 8 && z >= 4 && z <= 8) return 'batey';
    if (x >= 9 && x <= 14 && z >= 4 && z <= 5) return 'batey';
    return 'grass';
  };
  const col = { road: 0xc4a072, wild: 0x5e7434, pen: 0xa8875a, earth: 0x9e4a2c, batey: 0xb8946a, grass: 0x7c8f42 };
  // capa base (se suaviza con blur para que no se vean los tiles)
  for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
    const k = kind(x, z);
    b.fillStyle = rgb(col[k], 0.94 + r() * 0.12);
    b.fillRect(x * px - 2, z * px - 2, px + 4, px + 4);
  }
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const g = c.getContext('2d');
  g.filter = `blur(${Math.round(px * 0.18)}px)`;
  g.drawImage(base, 0, 0);
  g.filter = 'none';
  // manchas grandes de variación
  for (let i = 0; i < W * H * 0.8; i++) {
    const x = r() * cw, y = r() * ch, rad = px * (0.3 + r() * 1.1);
    const k = kind(Math.floor(x / px), Math.floor(y / px));
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    const tint = k === 'grass' || k === 'wild' ? (r() < 0.5 ? 'rgba(160,150,70,' : 'rgba(40,70,20,') : (r() < 0.5 ? 'rgba(120,60,30,' : 'rgba(230,200,150,');
    grd.addColorStop(0, tint + (0.12 + r() * 0.12) + ')');
    grd.addColorStop(1, tint + '0)');
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // detalle por tile
  for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) {
    const k = kind(x, z), ox = x * px, oy = z * px;
    if (k === 'grass' || k === 'wild') {
      const n = k === 'wild' ? 70 : 45;
      for (let i = 0; i < n; i++) {
        const gx = ox + r() * px, gy = oy + r() * px, L = px * (0.05 + r() * 0.09);
        g.strokeStyle = r() < 0.5 ? `rgba(${60 + r() * 40},${85 + r() * 50},${25 + r() * 20},0.8)` : `rgba(${150 + r() * 40},${150 + r() * 30},${70 + r() * 20},0.55)`;
        g.lineWidth = Math.max(1, px / 48);
        g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + (r() - 0.5) * L * 0.6, gy - L); g.stroke();
      }
    } else if (k === 'road' || k === 'batey' || k === 'pen') {
      for (let i = 0; i < 26; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(90,60,35,0.25)' : 'rgba(240,215,170,0.3)';
        const d = px * (0.02 + r() * 0.04);
        g.beginPath(); g.ellipse(ox + r() * px, oy + r() * px, d, d * 0.7, r() * 3, 0, 7); g.fill();
      }
      if (k === 'pen') for (let i = 0; i < 18; i++) {
        g.strokeStyle = 'rgba(225,195,110,0.7)'; g.lineWidth = Math.max(1, px / 64);
        const sx = ox + r() * px, sy = oy + r() * px, a = r() * 6.28, L = px * 0.12;
        g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a) * L, sy + Math.sin(a) * L); g.stroke();
      }
    } else if (k === 'earth') {
      for (let i = 0; i < 30; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(90,30,15,0.35)' : 'rgba(200,110,70,0.3)';
        const d = px * (0.02 + r() * 0.05);
        g.beginPath(); g.ellipse(ox + r() * px, oy + r() * px, d, d * 0.7, 0, 0, 7); g.fill();
      }
    }
  }
  // huellas de llantas en el camino (dos surcos por carril)
  g.filter = `blur(${Math.max(1, Math.round(px * 0.05))}px)`;
  for (const rx of [ROAD.x0 + 0.42, ROAD.x0 + 1.58]) {
    g.strokeStyle = 'rgba(110,72,40,0.45)';
    g.lineWidth = px * 0.16;
    g.beginPath();
    for (let y = 0; y <= ch; y += px / 4) g.lineTo(rx * px + Math.sin(y * 0.01) * px * 0.05, y);
    g.stroke();
    g.strokeStyle = 'rgba(80,50,25,0.3)';
    g.lineWidth = px * 0.05;
    g.stroke();
  }
  g.filter = 'none';
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function grassTileTexture(size = 256) {
  const r = rng(5);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#b8b8b0'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 1400; i++) {
    const x = r() * size, y = r() * size, L = 3 + r() * 7;
    const v = 140 + r() * 110;
    g.strokeStyle = `rgba(${v},${v},${v * 0.9},0.6)`;
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 3, y - L); g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function blobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(0,0,0,0.75)');
  grd.addColorStop(0.5, 'rgba(0,0,0,0.4)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function skyTexture() {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#8fb2c9');
  grd.addColorStop(0.45, '#e9c79a');
  grd.addColorStop(1, '#e8b47e');
  g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
