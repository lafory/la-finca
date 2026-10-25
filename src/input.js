import * as THREE from 'three';

// Toques, arrastre (paneo), pellizco y rueda (zoom), teclado.
export class Input {
  constructor(canvas, rig, { onTap, onUse }) {
    this.canvas = canvas; this.rig = rig; this.onTap = onTap; this.onUse = onUse;
    this.pointers = new Map();
    this.ray = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.keys = new Set();
    this.moved = false;
    this.lastPinch = 0;
    this.lastMid = null;
    this.joy = { x: 0, z: 0 };
    canvas.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('pointermove', (e) => this.move(e));
    window.addEventListener('pointerup', (e) => this.up(e));
    window.addEventListener('pointercancel', (e) => this.up(e, true));
    canvas.addEventListener('wheel', (e) => this.wheel(e), { passive: false });
    // Safari: gesto de pellizco del trackpad
    canvas.addEventListener('gesturestart', (e) => e.preventDefault());
    canvas.addEventListener('gesturechange', (e) => { e.preventDefault(); if (e.scale) this.rig.zoomBy(1 / Math.pow(e.scale, 0.15)); });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('keydown', (e) => this.keydown(e));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
  }
  ndc(x, y) {
    const r = this.canvas.getBoundingClientRect();
    return new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  }
  ground(x, y) {
    this.ray.setFromCamera(this.ndc(x, y), this.rig.camera);
    const p = new THREE.Vector3();
    return this.ray.ray.intersectPlane(this.plane, p) ? p : null;
  }
  down(e) {
    this.canvas.setPointerCapture?.(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now() });
    if (this.pointers.size === 1) this.moved = false;
    if (this.pointers.size === 2) { this.moved = true; this.lastPinch = this.pinchDist(); this.lastMid = this.mid(); }
  }
  pinchDist() { const [a, b] = [...this.pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); }
  mid() { const [a, b] = [...this.pointers.values()]; return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
  move(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    const px = p.x, py = p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (this.pointers.size === 1) {
      if (!this.moved && Math.hypot(p.x - p.sx, p.y - p.sy) > 9) this.moved = true;
      if (this.moved) this.panScreen(px, py, p.x, p.y);
    } else if (this.pointers.size === 2) {
      const d = this.pinchDist();
      if (this.lastPinch > 0 && d > 0) this.rig.zoomBy(this.lastPinch / d);
      this.lastPinch = d;
      const m = this.mid();
      if (this.lastMid) this.panScreen(this.lastMid.x, this.lastMid.y, m.x, m.y);
      this.lastMid = m;
    }
  }
  panScreen(x0, y0, x1, y1) {
    const a = this.ground(x0, y0), b = this.ground(x1, y1);
    if (a && b) this.rig.panBy(a.x - b.x, a.z - b.z);
  }
  up(e, cancel) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) { this.lastPinch = 0; this.lastMid = null; }
    if (!cancel && !this.moved && this.pointers.size === 0 && performance.now() - p.t < 600) {
      this.onTap(e.clientX, e.clientY);
    }
    if (this.pointers.size === 0) this.moved = false;
  }
  wheel(e) {
    e.preventDefault();
    // ctrlKey = pellizco del trackpad en Chrome/Firefox
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    const k = e.ctrlKey ? 0.01 : 0.0015;
    this.rig.zoomBy(Math.exp(dy * k));
  }
  keydown(e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    this.keys.add(e.code);
    if ((e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
      if (e.code === 'Space') e.preventDefault();
      this.onUse(); // inmediato: no se pierde una pulsación rápida
    }
    if (e.code === 'Equal' || e.code === 'NumpadAdd') this.rig.zoomBy(0.85);
    if (e.code === 'Minus' || e.code === 'NumpadSubtract') this.rig.zoomBy(1.18);
  }
  // Dirección de movimiento relativa a la cámara (pantalla arriba = -x -z).
  moveDir() {
    let sx = 0, sy = 0;
    const k = this.keys;
    if (k.has('KeyW') || k.has('ArrowUp')) sy += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) sy -= 1;
    if (k.has('KeyA') || k.has('ArrowLeft')) sx -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) sx += 1;
    sx += this.joy.x; sy += this.joy.z;
    const len = Math.hypot(sx, sy);
    if (len < 0.15) return null;
    const n = Math.min(1, len);
    sx /= len; sy /= len;
    const yaw = this.rig.yaw;
    // adelante (pantalla arriba) = -(sin yaw, cos yaw); derecha = (cos yaw, -sin yaw)
    const x = -Math.sin(yaw) * sy + Math.cos(yaw) * sx;
    const z = -Math.cos(yaw) * sy - Math.sin(yaw) * sx;
    return { x: x * n, z: z * n };
  }
}
