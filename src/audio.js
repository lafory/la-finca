// Efectos y música guajira procedural con WebAudio.
export class Sound {
  constructor() {
    this.ctx = null; this.sfxOn = true; this.musicOn = true;
    this.nextTime = 0; this.step = 0; this.timer = null;
  }
  unlock() {
    try { this.unlockInner(); } catch (e) { console.warn('[sonido]', e); }
  }
  unlockInner() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC({ latencyHint: 'interactive' }); } catch { this.ctx = new AC(); }
      this.master = this.ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain(); this.sfxBus.gain.value = 0.8; this.sfxBus.connect(this.master);
      this.musicBus = this.ctx.createGain(); this.musicBus.gain.value = 0.0; this.musicBus.connect(this.master);
      const len = this.ctx.sampleRate * 0.5;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') this.ctx.resume()?.catch?.(() => {});
    this.setMusic(this.musicOn);
  }
  tone(freq, dur, type = 'triangle', vol = 0.08, delay = 0, bus = this.sfxBus, glide = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.02);
  }
  noiseHit(dur, freq, vol, delay = 0, bus = this.sfxBus, q = 1.2) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(t, Math.random() * 0.3); s.stop(t + dur + 0.02);
  }
  play(name) {
    if (!this.ctx || !this.sfxOn) return;
    const T = (...a) => this.tone(...a);
    switch (name) {
      case 'egg': T(660, 0.08, 'triangle', 0.08); T(990, 0.1, 'triangle', 0.06, 0.06); break;
      case 'plant': this.noiseHit(0.12, 600, 0.15); T(330, 0.1, 'sine', 0.06, 0.04); break;
      case 'harvest': T(520, 0.08, 'triangle', 0.08); T(780, 0.12, 'triangle', 0.07, 0.07); this.noiseHit(0.08, 2000, 0.06); break;
      case 'water': for (let i = 0; i < 4; i++) this.noiseHit(0.09, 3000 + i * 300, 0.05, i * 0.05, this.sfxBus, 3); break;
      case 'coins': T(1046, 0.08, 'square', 0.03); T(1318, 0.12, 'square', 0.03, 0.07); T(1568, 0.16, 'triangle', 0.05, 0.14); break;
      case 'load': T(220, 0.1, 'triangle', 0.08); this.noiseHit(0.1, 400, 0.12); break;
      case 'horn': T(370, 0.32, 'sawtooth', 0.04); T(466, 0.32, 'sawtooth', 0.03); T(370, 0.25, 'sawtooth', 0.04, 0.38); T(466, 0.25, 'sawtooth', 0.03, 0.38); break;
      case 'buy': T(523, 0.1, 'triangle', 0.07); T(659, 0.12, 'triangle', 0.07, 0.08); break;
      case 'level': [523, 659, 784, 1046].forEach((f, i) => T(f, 0.2, 'triangle', 0.07, i * 0.1)); break;
      case 'cluck': T(700, 0.06, 'square', 0.025, 0, this.sfxBus, 0.7); T(620, 0.08, 'square', 0.02, 0.09, this.sfxBus, 0.7); break;
      case 'tap': T(880, 0.04, 'sine', 0.03); break;
      case 'error': T(180, 0.15, 'square', 0.03); break;
      case 'cook': this.noiseHit(0.4, 900, 0.06); T(392, 0.15, 'triangle', 0.05); break;
      default: break;
    }
  }
  setSfx(on) { this.sfxOn = on; }
  setMusic(on) {
    this.musicOn = on;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(t);
    this.musicBus.gain.setTargetAtTime(on ? 0.55 : 0, t, 0.4);
    if (on && !this.timer) { this.nextTime = this.ctx.currentTime + 0.1; this.schedule(); }
  }
  // Guajira en 6/8, Sol mayor: I - IV - V - I. Tres punteado, bajo, güiro y clave.
  schedule = () => {
    if (!this.ctx) return;
    if (!this.musicOn && this.musicBus.gain.value < 0.01) { this.timer = null; return; }
    const eighth = 60 / 112 / 2;
    const chords = [[196, 247, 294], [262, 330, 392], [294, 370, 440], [196, 247, 294], [262, 330, 392], [196, 247, 294], [294, 370, 440], [196, 247, 294]];
    const melody = [
      [4, 2, 1, 2, 4, 5], [6, 5, 4, 2, 4, 2], [5, 4, 2, 1, 2, 4], [2, 1, 0, -1, 0, 2],
      [4, 5, 6, 5, 4, 2], [4, 2, 1, 0, 1, 2], [1, 2, 4, 2, 1, 0], [0, -1, 0, -1, 0, -1],
    ];
    const scale = [392, 440, 494, 523, 587, 659, 740, 784];
    while (this.nextTime < this.ctx.currentTime + 0.25) {
      const s = this.step % 48, bar = Math.floor(s / 6), beat = s % 6;
      const ch = chords[bar];
      const t = this.nextTime - this.ctx.currentTime;
      const mb = this.musicBus;
      if (beat === 0) this.tone(ch[0] / 2, 0.5, 'triangle', 0.09, t, mb);
      if (beat === 3) this.tone(ch[2] / 2, 0.4, 'triangle', 0.07, t, mb);
      // guitarra rasgueada
      if (beat === 2 || beat === 5) ch.forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.018, t + i * 0.012, mb));
      // tres
      const m = melody[bar][beat];
      if (m >= 0 && !(bar === 7 && beat > 0)) {
        const f = scale[m];
        this.tone(f, 0.18, 'square', 0.012, t, mb);
        this.tone(f * 2, 0.12, 'triangle', 0.02, t, mb);
        this.tone(f * 1.003, 0.16, 'triangle', 0.016, t + 0.008, mb);
      }
      // güiro y clave
      if (beat % 3 === 0) this.noiseHit(0.12, 3500, 0.025, t, mb, 4);
      if (beat % 3 === 2) this.noiseHit(0.05, 4200, 0.02, t, mb, 4);
      if ((bar % 2 === 0 && (beat === 0 || beat === 4)) || (bar % 2 === 1 && beat === 2)) this.tone(1800, 0.04, 'sine', 0.025, t, mb);
      this.nextTime += eighth;
      this.step++;
    }
    this.timer = setTimeout(this.schedule, 90);
  };
}
