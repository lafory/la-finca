// UI de los contraataques del Régimen: aviso con cuenta atrás (en la finca y en el mapa), marcas en el mapa,
// guarnición y defensas en la hoja de cada ciudad, batalla de defensa animada y resumen al volver.
// Se engancha a MambiUI envolviendo sus métodos (sin tocar ui.js) para que los cambios del mapa no choquen.
import * as THREE from 'three';
import { ICON } from '../icons.js';
import { save } from '../state.js';
import { MambiUI } from './ui.js';
import { CITIES, CITY_BY_ID, GOODS } from './data.js';
import { CS, DEFENSES, DEF_ORDER, KIND, rt } from './castro.js';

const svg = (body) => `<svg viewBox="0 0 32 32" aria-hidden="true" class="ico">${body}</svg>`;
Object.assign(ICON, {
  trench: ICON.trench || svg('<path d="M3 22h26v5H3z" fill="#7a5a36"/><path d="M4 20c2-3 4-3 6 0M11 20c2-3 4-3 6 0M18 20c2-3 4-3 6 0M24 20c1.5-2.5 3.5-2.5 5 0" fill="#c9b27a" stroke="#6b5530" stroke-width="1.6"/><path d="M3 22h26" stroke="#4a3520" stroke-width="2"/>'),
  fort: ICON.fort || svg('<path d="M5 28V12h4v3h3v-3h4v3h3v-3h4v3h3v-3h1v16z" fill="#d8ccb0" stroke="#5a4636" stroke-width="2" stroke-linejoin="round"/><path d="M13 28v-6a3 3 0 0 1 6 0v6" fill="#5a4636"/><path d="M16 12V4" stroke="#5a4636" stroke-width="1.8"/><path d="M16 4h8v5h-8z" fill="#2f5da8"/>'),
  alarm: ICON.alarm || svg('<path d="M16 3l13 24H3z" fill="#e8a23a" stroke="#6a3a10" stroke-width="2" stroke-linejoin="round"/><path d="M16 11v8" stroke="#3a1a08" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="23.5" r="1.8" fill="#3a1a08"/>'),
});
const k1 = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${Math.floor(n)}`);
const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const hm = (s) => { const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h ? `${h} h ${m} min` : `${m} min`; };

const STYLE = `
.cs-banner{position:absolute;z-index:5;display:flex;align-items:center;gap:8px;padding:7px 8px 7px 10px;border-radius:14px;background:rgba(92,30,22,.92);color:#fff3e0;font-weight:700;font-size:13px;line-height:1.25;box-shadow:0 3px 0 rgba(40,10,6,.35);pointer-events:auto}
.cs-banner.hidden{display:none}
.cs-banner .ico{width:22px;height:22px;flex:none}
.cs-banner .cs-txt{flex:1;min-width:0}
.cs-banner .cs-cd{display:inline-block;min-width:38px;padding:1px 6px;border-radius:8px;background:#fff3e0;color:#7a1e12;text-align:center;font-variant-numeric:tabular-nums}
.cs-banner .btn{flex:none;padding:6px 10px}
#cs-fbanner{left:calc(84px + var(--sal,0px));right:calc(8px + var(--sar,0px));top:calc(60px + var(--sat,0px));max-width:560px;margin:0 auto}
#cs-mbanner{left:calc(8px + var(--sal,0px));right:calc(62px + var(--sar,0px));bottom:calc(78px + var(--sab,0px));max-width:560px;margin:0 auto}
#cs-marks{position:absolute;inset:0;pointer-events:none}
.cs-mark{position:absolute;transform:translate(-50%,40%);padding:1px 7px;border-radius:10px;font-size:11px;font-weight:800;white-space:nowrap;display:flex;align-items:center;gap:3px}
.cs-mark .ico{width:13px;height:13px}
.cs-mark.threat{background:#b8321f;color:#fff;animation:csBlink 1s steps(2) infinite}
.cs-mark.occ{background:#7c8084;color:#fff}
.cs-mark.gar{background:rgba(40,60,30,.82);color:#eaf6d8}
@keyframes csBlink{50%{background:#7a1e12}}
.mb-city.cs-occ{background:#c9cbcd!important;border-color:#5c6064!important;color:#2a2c2e}
#cs-skip{position:absolute;right:calc(12px + var(--sar,0px));bottom:calc(14px + var(--sab,0px))}
#cs-skip.hidden{display:none}
.cs-sec h3{display:flex;align-items:center;gap:6px}
.cs-sec h3 .ico{width:20px;height:20px}
.cs-step{display:flex;gap:4px;flex:none}
.cs-step .btn{min-width:42px;padding:6px 8px}
.cs-warn{background:#f8d9cf;border:2px solid #b8321f;border-radius:12px;padding:6px 10px;margin:6px 0;color:#5a1a10;font-weight:700}
.cs-log{margin:4px 0 0 18px;padding:0;font-size:13px}
`;

export class CastroUI {
  constructor(game) {
    this.g = game; this.ui = game.ui;
    this.defense = null;
    this.reportShown = false;
    if (!document.getElementById('castro-style')) { const st = document.createElement('style'); st.id = 'castro-style'; st.textContent = STYLE; document.head.appendChild(st); }
    // aviso en la finca
    const fb = (this.fb = document.createElement('div'));
    fb.id = 'cs-fbanner'; fb.className = 'cs-banner hidden';
    this.ui.root.appendChild(fb);
    // aviso, marcas y botón de saltar en el mapa
    const mel = game.mambi?.el;
    if (mel) {
      const mb = (this.mbn = document.createElement('div')); mb.id = 'cs-mbanner'; mb.className = 'cs-banner hidden'; mel.appendChild(mb);
      const mk = (this.marks = document.createElement('div')); mk.id = 'cs-marks'; mel.insertBefore(mk, mel.querySelector('#mb-cities'));
      this.markEls = {};
      for (const c of CITIES) { const e = document.createElement('div'); e.className = 'cs-mark'; e.style.display = 'none'; mk.appendChild(e); this.markEls[c.id] = e; }
      const sk = (this.skip = document.createElement('button')); sk.id = 'cs-skip'; sk.className = 'btn hidden'; sk.dataset.act = 'csok'; sk.dataset.id = 'skip'; sk.textContent = 'Saltar ⏭'; mel.appendChild(sk);
    }
    this.bannerKey = '';
  }
  get sim() { return this.g.sim; }
  get mambi() { return this.g.mambi; }
  dev() { return !!(window.__fincaDev || import.meta.env.DEV); }
  modalOpen() { const w = document.getElementById('modal-wrap'); return !!w && !w.classList.contains('hidden'); }

  // ---------------------------------------------------------------- avisos
  bannerHtml(A) {
    const c = CITY_BY_ID[A.city];
    const what = A.kind === 'saqueo' ? `viene a saquear la finca de <b>${c.name}</b>` : `marcha sobre <b>${c.name}</b>`;
    return `${ICON.alarm}<span class="cs-txt">Una columna del Régimen (${A.power}) ${what} · <span class="cs-cd" data-hit="${A.hit}">${mmss(A.hit - rt())}</span></span><button class="btn primary" data-act="csgo" data-id="${A.city}">Defender</button>`;
  }
  updateBanner(el, A, show) {
    if (!el) return;
    if (!A || !show) { if (!el.classList.contains('hidden')) el.classList.add('hidden'); return; }
    const key = `${A.id}|${A.power}`;
    if (el.dataset.key !== key) { el.innerHTML = this.bannerHtml(A); el.dataset.key = key; }
    el.classList.remove('hidden');
  }
  tickCountdowns() {
    const t = rt();
    for (const e of document.querySelectorAll('.cs-cd[data-hit]')) { const v = mmss(+e.dataset.hit - t); if (e.textContent !== v) e.textContent = v; }
  }
  // cada cuadro de la finca
  farmFrame() {
    if (!this.g.started) return;
    const sim = this.sim; let A = null;
    try { A = sim.cs().attack; } catch { return; }
    const onMap = !!this.mambi?.open;
    this.updateBanner(this.fb, A, !onMap);
    this.tickCountdowns();
    if (!onMap) this.drainEvents(false);
    this.showReport();
  }
  // resumen de lo que pasó con el juego cerrado
  showReport() {
    if (this.modalOpen()) return;
    const C = this.sim.cs();
    if (!C.report || !C.report.lines.length) return;
    this.ui.modal(`<h2>${ICON.alarm} Mientras no estabas</h2><p>${C.report.away ? `Estuviste fuera ${hm(C.report.away)}. ` : ''}El Régimen mandó columnas contra tus ciudades:</p><ul class="cs-log">${C.report.lines.map((l) => `<li>${l}</li>`).join('')}</ul><p class="note">Pon guarnición y cava trincheras en cada ciudad para que resistan.</p><button class="btn primary" data-act="csok" data-id="report">Entendido</button>`);
  }
  // resultados de ataques: en el mapa se ven con la batalla; en la finca, con un cartel
  drainEvents(onMap) {
    const q = this.sim.csEvents;
    if (!q || !q.length || this.defense || this.mambi?.battle || this.modalOpen()) return;
    const r = q.shift();
    if (onMap) this.startDefense(r); else this.resultModal(r);
  }

  // ---------------------------------------------------------------- mapa
  mapFrame() {
    const sim = this.sim, sc = this.mambi.scenes, C = sim.cs(), A = C.attack;
    this.updateBanner(this.mbn, A, !this.mambi.battle && !this.defense);
    this.tickCountdowns();
    if (!this.mambi.battle && !this.defense) this.drainEvents(true);
    if (!sc.built || this.mambi.battle || this.defense) { if (this.marks) this.marks.style.display = 'none'; return; }
    this.marks.style.display = '';
    // anillo rojo en la ciudad amenazada
    if (!this.ring) {
      this.ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.11, 6, 28), new THREE.MeshBasicMaterial({ color: 0xd8321f }));
      this.ring.rotation.x = Math.PI / 2; sc.map.add(this.ring);
    }
    this.ring.visible = !!A;
    if (A) { const p = sc.cityPos[A.city]; this.ring.position.set(p.x, p.y + 0.08, p.z); this.ring.scale.setScalar(1 + Math.sin(performance.now() / 160) * 0.12); }
    const t = rt();
    for (const c of CITIES) {
      const e = this.markEls[c.id], lab = this.mambi.cityEls[c.id];
      const cc = C.cities[c.id], occ = sim.csOccupied(c.id), threat = A?.city === c.id;
      lab?.classList.toggle('cs-occ', occ);
      let cls = '', html = '';
      if (threat) { cls = 'threat'; html = `${ICON.machete}${A.kind === 'saqueo' ? 'saqueo' : 'ataque'} ${mmss(A.hit - t)}`; }
      else if (occ) { cls = 'occ'; html = 'Ocupada'; }
      else if (cc && sim.mbFreed(c.id) && (cc.gar.inf + cc.gar.cab || cc.def.trinchera)) { cls = 'gar'; html = `${cc.def.fortin ? ICON.fort : cc.def.trinchera ? ICON.trench : ICON.soldier}${cc.gar.inf + cc.gar.cab}`; }
      if (!cls) { if (e.style.display !== 'none') e.style.display = 'none'; continue; }
      const p = sc.project(sc.cityPos[c.id]);
      e.style.display = p.vis ? '' : 'none';
      e.style.left = `${p.x.toFixed(1)}px`; e.style.top = `${p.y.toFixed(1)}px`;
      const k = `${cls}|${html}`;
      if (e.dataset.k !== k) { e.className = `cs-mark ${cls}`; e.innerHTML = html; e.dataset.k = k; }
    }
  }

  // ---------------------------------------------------------------- hojas
  citySection(id) {
    const sim = this.sim, C = sim.cs(), c = CITY_BY_ID[id], cc = C.cities[id], A = C.attack;
    if (sim.csOccupied(id)) {
      const farm = sim.mb().farms[id];
      return `<div class="cs-sec"><h3>${ICON.alarm} Ocupada por el Régimen</h3><p class="note">La bandera gris volvió a la plaza.${farm ? ` La finca de ${GOODS[c.farm[0]].name.toLowerCase()} sigue siendo tuya pero está ocupada: no paga renta hasta que la recuperes.` : ''} Recupérala con una batalla normal (el botín es la mitad).</p></div>`;
    }
    if (!sim.mbFreed(id)) return '';
    const g = cc || { gar: { inf: 0, cab: 0 }, def: { trinchera: 0, fortin: 0 }, raidUntil: 0 };
    const a = sim.mb().army;
    let out = `<div class="cs-sec"><h3>${ICON.fort} Defensa de ${c.name}</h3>`;
    if (A?.city === id) {
      const ch = sim.csChance(id, A.power);
      out += `<div class="cs-warn">${ICON.alarm} ${KIND[A.kind]}: ${A.power} soldados del Régimen llegan en <span class="cs-cd" data-hit="${A.hit}">${mmss(A.hit - rt())}</span>. Tu defensa: ${Math.round(sim.csDefense(id))} · ${this.mambi.oddsTag(ch)}</div>`;
    } else if (A) out += `<p class="note">Ahora mismo el Régimen ataca ${CITY_BY_ID[A.city].name}.</p>`;
    if (g.raidUntil > rt()) out += `<p class="note">La finca fue saqueada: vuelve a dar renta en ${mmss(g.raidUntil - rt())}.</p>`;
    out += `<p class="note">Defensa ${Math.round(sim.csDefense(id))} = (pueblo ${sim.csMilitia(id)} + guarnición ${sim.csGarPower(id)}) × ${sim.csDefMult(id).toFixed(2).replace('.', ',')} por las obras. Si la ciudad cae, la guarnición vuelve al campamento.</p>`;
    const step = (k, n, lbl, dis) => `<button class="btn" data-act="csgar" data-id="${id}" data-k="${k}" data-n="${n}" ${dis ? 'disabled' : ''}>${lbl}</button>`;
    for (const [k, nm, ico, n] of [['inf', 'Infantes', ICON.soldier, 5], ['cab', 'Jinetes', ICON.machete, 2]]) {
      out += `<div class="row"><div class="row-ico">${ico}</div><div class="row-main"><b>${nm} en la guarnición: ${g.gar[k]}</b><small>En el campamento: ${a[k]}</small></div><div class="cs-step">${step(k, -n, `−${n}`, !g.gar[k])}${step(k, n, `+${n}`, !a[k])}</div></div>`;
    }
    for (const k of DEF_ORDER) {
      const D = DEFENSES[k], L = g.def[k], cost = sim.csDefCost(id, k), why = cost ? sim.csCanBuild(id, k) : null;
      const btn = !cost ? '<button class="btn" disabled>Máximo</button>'
        : `<button class="btn ${why ? 'poor' : 'primary'}" data-act="csdef" data-id="${id}" data-k="${k}" ${why ? 'disabled' : ''}>${L ? 'Mejorar' : 'Construir'} · ${ICON.coin}${k1(cost.pesos)}<span class="wd">${ICON.food}${cost.viveres}</span>${cost.azucar ? `<span class="wd">${ICON.azucar || ICON.cane}${cost.azucar}</span>` : ''}</button>`;
      out += `<div class="row ${why && why !== 'Todavía no alcanzan los pesos.' ? 'dim' : ''}"><div class="row-ico">${k === 'fortin' ? ICON.fort : ICON.trench}</div><div class="row-main"><b>${D.name} · nivel ${L}/${D.max}</b><small>${(cost && why) || D.detail}</small></div>${btn}</div>`;
    }
    out += '</div>';
    return out + this.cheats(id);
  }
  campSection() {
    const C = this.sim.cs(), A = C.attack;
    let out = `<div class="cs-sec"><h3>${ICON.fort} Defensa de la isla</h3><p class="note">${this.sim.csGarTotal()} soldados en guarniciones · ataques ${C.stats.attacks} · resistidos ${C.stats.held} · ciudades perdidas ${C.stats.lost} · recuperadas ${C.stats.retaken}.${A ? ` <b>Ataque en curso contra ${CITY_BY_ID[A.city].name}.</b>` : C.next && this.sim.csOwned().length ? ` Próxima columna en unos ${hm(Math.max(60, C.next - rt()))}.` : ''}</p>`;
    if (C.log.length) out += `<ul class="cs-log">${C.log.slice(-4).reverse().map((l) => `<li>${l}</li>`).join('')}</ul>`;
    return out + '</div>' + this.cheats(null);
  }
  cheats(id) {
    if (!this.dev()) return '';
    const b = (k, l) => `<button class="btn" data-act="cscheat" data-k="${k}" ${id ? `data-id="${id}"` : ''}>${l}</button>`;
    return `<h3>Trucos del Régimen (desarrollo)</h3><div class="seg">${b('attack', 'Ataque ahora')}${b('strong', 'Ataque fuerte')}${b('now', 'Que llegue ya')}${b('away', 'Simular 3 h fuera')}</div>`;
  }

  // ---------------------------------------------------------------- acciones
  act(a, d) {
    const sim = this.sim, ui = this.ui;
    switch (a) {
      case 'csgar': sim.csStation(d.id, d.k, +d.n); ui.refreshSheet(); return;
      case 'csdef': sim.csBuild(d.id, d.k); ui.refreshSheet(); return;
      case 'csgo': {
        const m = this.mambi; if (!m) return;
        if (!m.open) m.openMap();
        if (m.open) { m.scenes.focus(d.id, 40); m.openCity(d.id); }
        return;
      }
      case 'cscheat': {
        const r = sim.csCheat(d.k, d.id ? { city: d.id } : {});
        if (d.k === 'away') { save(sim.s); ui.toast('Listo: recarga la página para ver lo que pasó «mientras no estabas».'); }
        else if (!r && d.k !== 'now') ui.toast('No hay ciudades libres que atacar.');
        ui.refreshSheet(); return;
      }
      case 'csok':
        if (d.id === 'skip') { if (this.defense) this.defense.t = 6.7; return; }
        if (d.id === 'report') { sim.cs().report = null; save(sim.s); }
        document.getElementById('modal-wrap')?.classList.add('hidden');
        return;
      default:
    }
  }

  // ---------------------------------------------------------------- resultado
  lostTxt(r) {
    const n = r.lost.inf + r.lost.cab;
    if (!n) return r.before.inf + r.before.cab ? 'Toda la guarnición quedó entera.' : '';
    return `${r.lost.inf ? `${r.lost.inf} infantes ` : ''}${r.lost.cab ? `${r.lost.cab} jinetes ` : ''}se dispersaron y volvieron a sus casas.`;
  }
  resultModal(r) {
    const c = CITY_BY_ID[r.city], farm = this.sim.mb().farms[r.city];
    const vs = `Defensa ${r.power} contra ${r.attack} soldados del Régimen`;
    let h;
    if (r.held) h = `<h2>${ICON.flagcu} ¡${c.name} resistió!</h2><p>${vs}${r.def.trinchera || r.def.fortin ? ` (trinchera ${r.def.trinchera}, fortín ${r.def.fortin})` : ''}: la columna gris se retiró por donde vino.</p><p>${this.lostTxt(r)} +${r.xp || 0} XP.</p><button class="btn primary" data-act="modal-close">¡Viva Cuba libre!</button>`;
    else if (!r.occupied) h = `<h2>Saquearon la finca de ${c.name}</h2><p>${vs}: no alcanzó. Se llevaron <b>${r.stolen} pesos</b> de renta${r.crops ? ` y ${r.crops} cosas del almacén` : ''} y la finca no produce (ni vienen camiones) durante ${Math.round(CS.RAID_BLOCK / 60)} minutos.</p><p>${this.lostTxt(r)} La ciudad sigue siendo libre.</p><button class="btn primary" data-act="modal-close">A reforzarla</button>`;
    else h = `<h2>${c.name} cayó</h2><p>${vs}: esta vez no alcanzó. ${r.back.inf + r.back.cab ? `${r.back.inf + r.back.cab} soldados de la guarnición volvieron al campamento. ` : ''}${this.lostTxt(r)}</p><p>La bandera gris ondea en la plaza${farm ? ` y la finca de ${GOODS[c.farm[0]].name.toLowerCase()} está ocupada: no paga renta` : ''}. Recupérala con una batalla normal desde el mapa.</p><button class="btn primary" data-act="modal-close">Volver</button>`;
    this.g.sound?.play(r.held ? 'level' : 'error');
    save(this.sim.s);
    this.ui.modal(h);
  }

  // ---------------------------------------------------------------- batalla de defensa (mismo estilo que la campaña, sin sangre)
  startDefense(r) {
    const m = this.mambi, sc = m.scenes;
    this.ui.closeSheet();
    if (!sc.bScene) sc.buildBattle();
    if (!this.trench) {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x7a5a36, roughness: 1, flatShading: true });
      const bag = new THREE.MeshStandardMaterial({ color: 0xc9b27a, roughness: 1, flatShading: true });
      for (let i = 0; i < 9; i++) {
        const z = -5.6 + i * 1.4;
        const e = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 1.3), mat); e.position.set(3.2, 0.15, z); g.add(e);
        const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.6, 2, 6), bag); b.rotation.x = Math.PI / 2; b.position.set(2.75, 0.45, z); g.add(b);
      }
      sc.bScene.add(g); this.trench = g;
    }
    this.trench.visible = r.def.trinchera > 0;
    const b = r.before;
    this.defense = { r, t: 0, n: { inf: Math.min(24, Math.max(b.inf ? 1 : 0, b.inf)), cab: Math.min(14, b.cab), foe: Math.min(18, Math.max(5, Math.round(r.attack / 12))), militia: Math.min(24 - Math.min(24, b.inf), Math.max(3, Math.round(r.militia / 6))) } };
    this.clock = performance.now();
    this.g.sound?.play('horn');
    for (const s of ['#mb-bottom', '#mb-cities', '.mb-zoom']) m.el.querySelector(s)?.classList.add('hidden');
    this.skip?.classList.remove('hidden');
    const bn = m.el.querySelector('#mb-banner');
    if (bn) { bn.textContent = `Defensa de ${CITY_BY_ID[r.city].name}`; bn.classList.remove('hidden'); }
  }
  frameDefense() {
    const m = this.mambi, t0 = performance.now(), dt = Math.min(0.1, (t0 - (this.clock || t0)) / 1000); this.clock = t0;
    if (this.g.started) m.sim.update(dt, dt);
    this.ui.update(dt);
    const t = this.renderDefense(dt);
    if (t > 6.6) this.endDefense();
  }
  renderDefense(dt) {
    const D = this.defense, sc = this.mambi.scenes, r = D.r, t = (D.t += dt);
    const cam = sc.bCam, size = new THREE.Vector2(); sc.renderer.getSize(size);
    cam.aspect = size.x / Math.max(1, size.y); cam.updateProjectionMatrix();
    if (cam.aspect < 1) { cam.position.set(-31 + t * 0.5, 17, 10); cam.lookAt(-2 + t * 0.4, 0, -0.5); }
    else { const d = 21 / Math.min(1, cam.aspect / 1.5); cam.position.set(-2 - t * 0.3, d * 0.72, d * 0.78); cam.lookAt(0 - t * 0.3, 0.5, 0); }
    const held = r.held, adv = Math.min(1, t / 3.2);
    const back = t > 3.4 ? Math.min(1, (t - 3.4) / 2.4) : 0;
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), S = new THREE.Vector3(), E = new THREE.Euler();
    const set = (mesh, i, x, y, z, ry, s = 1) => { Q.setFromEuler(E.set(0, ry, 0)); M.compose(V.set(x, y, z), Q, S.set(s, s, s)); mesh.setMatrixAt(i, M); };
    const T = sc.troops;
    // defensores: detrás de la trinchera, mirando hacia el camino
    const nInf = D.n.inf + D.n.militia;
    for (let i = 0; i < nInf; i++) {
      const row = i % 8, col = Math.floor(i / 8);
      let x = 4.2 + col * 1.1, ry = Math.PI / 2;
      if (!held && back) { x += back * 16; ry = -Math.PI / 2; }
      set(T.inf, i, x, Math.abs(Math.sin(t * 7 + i)) * 0.05, -4.8 + row * 1.25 + (col % 2) * 0.5, ry);
    }
    for (let i = 0; i < D.n.cab; i++) {
      let x = 8 + Math.floor(i / 7) * 1.6, z = -4.5 + (i % 7) * 1.5, ry = Math.PI / 2;
      if (held && t > 2.8) { const k = Math.min(1, (t - 2.8) / 2); x -= k * 10; } // carga al machete para espantarlos
      if (!held && back) { x += back * 16; ry = -Math.PI / 2; }
      set(T.cab, i, x, Math.abs(Math.sin(t * 11 + i)) * 0.1, z, ry);
    }
    // columna gris que avanza por el camino
    for (let i = 0; i < D.n.foe; i++) {
      const row = i % 6, col = Math.floor(i / 6);
      let x = -22 - col * 1.1 + adv * 19, z = -2.4 + row * 0.95, ry = -Math.PI / 2, s = 1;
      if (held && back) { x -= back * back * 20; ry = Math.PI / 2; s = 1 - back * 0.3; }
      if (!held && back) x += back * 6;
      set(T.foe, i, x, Math.abs(Math.sin(t * 9 + i)) * 0.06, z, ry, s);
    }
    T.inf.count = nInf; T.cab.count = D.n.cab; T.cart.count = 0; T.foe.count = D.n.foe;
    for (const k of Object.keys(T)) T[k].instanceMatrix.needsUpdate = true;
    sc.dust.count = 0;
    // banderas: la cubana arriba; si cae, sube la gris
    const fl = !held ? Math.max(0, Math.min(1, (t - 4.2) / 1.5)) : 0;
    sc.bCuba.position.y = 6.2 - fl * 2.6; sc.bCuba.visible = fl < 0.98;
    sc.bGray.position.y = 3.6 + fl * 2.6; sc.bGray.visible = fl > 0.02;
    sc.bGray.rotation.y = Math.sin(t * 3) * 0.2; sc.bCuba.rotation.y = Math.sin(t * 3 + 1) * 0.2;
    sc.renderer.render(sc.bScene, cam);
    return t;
  }
  endDefense() {
    const D = this.defense; if (!D) return;
    this.defense = null;
    const m = this.mambi, sc = m.scenes;
    if (sc.dust) sc.dust.count = 40;
    if (this.trench) this.trench.visible = false;
    for (const s of ['#mb-bottom', '#mb-cities', '.mb-zoom']) m.el.querySelector(s)?.classList.remove('hidden');
    this.skip?.classList.add('hidden');
    m.el.querySelector('#mb-banner')?.classList.add('hidden');
    m.ver = -1;
    sc.focus(D.r.city);
    m.clock = performance.now();
    this.resultModal(D.r);
  }
}

// ---- ganchos en el mapa de la campaña (envolver, sin editar ui.js)
const P = MambiUI.prototype;
const oFrame = P.frame, oCity = P.openCity, oCamp = P.openCamp, oClose = P.closeMap;
P.frame = function () {
  const cs = this.g.castro;
  if (cs?.defense) { try { cs.frameDefense(); return; } catch (e) { console.warn('[castro] batalla', e); cs.defense = null; } }
  oFrame.call(this);
  if (cs && this.open && !this.visit) { try { cs.mapFrame(); } catch (e) { if (!cs.err) console.warn('[castro] mapa', e); cs.err = 1; } }
};
const addSection = (ui, fn) => {
  const sh = ui.sheet; if (!sh) return;
  const r = sh.render;
  sh.render = () => { let h = r(); try { h += fn(); } catch (e) { console.warn('[castro] hoja', e); } return h; };
  ui.refreshSheet();
};
P.openCity = function (id) { oCity.call(this, id); const cs = this.g.castro; if (cs) addSection(this.ui, () => cs.citySection(id)); };
P.openCamp = function () { oCamp.call(this); const cs = this.g.castro; if (cs) addSection(this.ui, () => cs.campSection()); };
P.closeMap = function () { const cs = this.g.castro; if (cs?.defense) { try { cs.endDefense(); } catch { cs.defense = null; } } return oClose.call(this); };
