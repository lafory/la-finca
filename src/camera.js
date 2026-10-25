import * as THREE from 'three';

// Cámara isométrica en perspectiva con zoom/paneo suavizados y limitados.
export class CameraRig {
  constructor(aspect) {
    this.camera = new THREE.PerspectiveCamera(30, aspect, 0.5, 220);
    this.yaw = Math.PI / 4;
    this.pitch = THREE.MathUtils.degToRad(52);
    this.minDist = 9;
    this.maxDist = 46;
    this.dist = 26; this.goalDist = 26;
    this.target = new THREE.Vector3(10, 0, 9);
    this.goal = new THREE.Vector3(10, 0, 9);
    this.bounds = { x0: -1, z0: -1, x1: 23, z1: 19 };
    this.follow = null; // Vector3 a seguir
    this.manualUntil = 0;
    this.update(1);
  }
  setAspect(a) { this.camera.aspect = a; this.camera.updateProjectionMatrix(); }
  // Los límites y el zoom máximo crecen con la tierra propia y se animan suave.
  setBounds(b, snap = false) { this.boundsGoal = { ...b }; if (snap || !this.bounds) this.bounds = { ...b }; }
  setMaxDist(d, snap = false) { this.maxGoal = d; if (snap) this.maxDist = d; }
  // Distancia para que el rectángulo quepa en la vista
  fitDist(x0, z0, x1, z1) {
    const w = Math.max(x1 - x0, 1), d = Math.max(z1 - z0, 1);
    const across = (w + d) * Math.SQRT1_2;
    const deep = (w + d) * Math.SQRT1_2 * Math.sin(this.pitch);
    const vfov = THREE.MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    return Math.max((across / 2) / Math.tan(hfov / 2), (deep / 2) / Math.tan(vfov / 2)) * 1.05;
  }
  // Encaja un rectángulo del mundo en la vista.
  fit(x0, z0, x1, z1, snap = false) {
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    this.goalDist = THREE.MathUtils.clamp(this.fitDist(x0, z0, x1, z1), this.minDist, Math.max(this.maxDist, this.maxGoal || 0));
    this.goal.set(cx, 0, cz);
    if (snap) { this.dist = this.goalDist; this.target.copy(this.goal); }
  }
  zoomBy(f) {
    this.goalDist = THREE.MathUtils.clamp(this.goalDist * f, this.minDist, this.maxDist);
  }
  panBy(dx, dz) {
    this.goal.x += dx; this.goal.z += dz;
    this.clampGoal();
    this.manualUntil = performance.now() + 4000;
  }
  clampGoal() {
    const b = this.bounds;
    this.goal.x = THREE.MathUtils.clamp(this.goal.x, b.x0, b.x1);
    this.goal.z = THREE.MathUtils.clamp(this.goal.z, b.z0, b.z1);
  }
  recenter() { this.manualUntil = 0; }
  update(dt) {
    const kb = 1 - Math.exp(-dt * 2.5);
    if (this.boundsGoal) for (const k of ['x0', 'z0', 'x1', 'z1']) this.bounds[k] += (this.boundsGoal[k] - this.bounds[k]) * kb;
    if (this.maxGoal) this.maxDist += (this.maxGoal - this.maxDist) * kb;
    if (this.follow && this.follow.moving && performance.now() > this.manualUntil) {
      this.goal.x += (this.follow.x - this.goal.x) * Math.min(1, dt * 2.5);
      this.goal.z += (this.follow.z - this.goal.z) * Math.min(1, dt * 2.5);
      this.clampGoal();
    }
    const k = 1 - Math.exp(-dt * 10);
    this.target.lerp(this.goal, k);
    this.dist += (this.goalDist - this.dist) * k;
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    const c = this.camera;
    c.position.set(
      this.target.x + Math.sin(this.yaw) * cp * this.dist,
      this.target.y + sp * this.dist,
      this.target.z + Math.cos(this.yaw) * cp * this.dist,
    );
    c.lookAt(this.target);
  }
}
