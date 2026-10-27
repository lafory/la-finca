// Pantalla del campo de batalla: colocar tropa, órdenes y la opción de resolver rápido.
import { ICON } from '../icons.js';
import { save } from '../state.js';
import { registerAct, registerGameModule } from '../registry.js';
import { CITY_BY_ID } from './data.js';
import { MambiUI } from './ui.js';
import { FieldView } from './field-view.js';
import {
  KINDS, alive, unitAt, unitName, tileLabel, workAtTile, zone,
  createBattle, placeUnit, placeWork, liftUnit, liftWork, autoDeploy, canStart,
  reachable, setOrder, orderAll, resolveSide, outcome, casualties, strength, describeOrders,
} from './field.js';

const MARK = { avanzar: 0xf2c14e, flanquear: 0x6aa8d8, carga: 0xd4543c, retirada: 0xb9a4d6 };
const LETTER = { machete: 'M', fusil: 'F', cab: 'C', art: 'A' };
const ORD = { avanzar: '→', flanquear: '⤷', carga: '!', retirada: '↩', esperar: '·' };

const STYLE = `
#field{position:absolute;inset:0;z-index:6;pointer-events:none}
#field.hidden{display:none}
#mambi.field-on .mb-top,#mambi.field-on .mb-title,#mambi.field-on #mb-cities,#mambi.field-on .mb-zoom,#mambi.field-on #mb-bottom,#mambi.field-on .mb-skip,#mambi.field-on .mb-banner,#mambi.field-on #cs-mbanner,#mambi.field-on #cs-marks,#mambi.field-on #cs-skip{display:none!important}
#field-stage{position:absolute;inset:0;pointer-events:auto;touch-action:none}
.fd-top{position:absolute;left:calc(8px + var(--sal,0px));right:calc(8px + var(--sar,0px));top:calc(6px + var(--sat,0px));z-index:4;pointer-events:none;display:flex;flex-direction:column;gap:4px;align-items:stretch}
.fd-card{pointer-events:auto;background:rgba(246,234,208,.96);border:2px solid #5a4636;border-radius:16px;padding:8px 10px;color:#2a1f15;box-shadow:0 3px 0 rgba(60,40,20,.25)}
.fd-card h2{margin:0;font-family:var(--serif,Georgia,serif);font-size:18px;line-height:1.15}
.fd-card p{margin:3px 0 0;font-size:13px;line-height:1.3}
.fd-log{font-size:12.5px;line-height:1.3;color:#3a2a1e}
.fd-log div{background:rgba(42,31,21,.88);color:#fff6e4;border-radius:10px;padding:4px 8px;margin-top:3px}
.fd-zoom{position:absolute;right:calc(8px + var(--sar,0px));top:42%;z-index:4;display:flex;flex-direction:column;gap:8px;pointer-events:auto}
.fd-bar{position:absolute;left:0;right:0;bottom:0;z-index:4;pointer-events:auto;background:rgba(246,234,208,.97);border-top:2px solid #5a4636;padding:8px 8px calc(8px + var(--sab,0px));display:flex;flex-direction:column;gap:6px;max-height:46dvh;overflow:auto;-webkit-overflow-scrolling:touch}
.fd-tools{display:flex;gap:6px;flex-wrap:wrap}
.fd-tools .btn{flex:1 1 46%}
.fd-tools .btn.on{background:#3f6a2a;border-color:#274416;color:#fff}
.fd-tools .btn small{display:block;font-weight:700;font-size:11px;opacity:.85}
.fd-row{display:flex;flex-wrap:wrap;gap:6px}
.fd-row .btn{flex:1 1 40%}
.fd-all{display:flex;gap:6px;flex-wrap:wrap}
.fd-all .btn{flex:1 1 46%}
.fd-go{display:flex;gap:6px}
.fd-go .btn{flex:1 1 40%}
.fd-bar{max-height:40dvh}
.fd-sel{margin:0;font-size:13px;font-weight:700}
.fd-tag{position:absolute;transform:translate(-50%,-120%);pointer-events:none;z-index:3;display:flex;flex-direction:column;align-items:center;gap:1px}
.fd-tag b{font-size:11px;line-height:1;background:rgba(42,31,21,.88);color:#fff6e4;border-radius:8px;padding:2px 5px}
.fd-tag.player b{background:#3f6a2a}
.fd-tag.enemy b{background:#6a3030}
.fd-tag.on b{outline:2px solid #f2c14e}
.fd-tag i{display:block;width:28px;height:4px;border-radius:3px;background:rgba(0,0,0,.35);overflow:hidden}
.fd-tag i span{display:block;height:100%;background:#d6ec6a}
.fd-tag.enemy i span{background:#e07a6a}
.fd-tact{flex-wrap:wrap}
.fd-tact-btns{display:flex;flex-direction:column;gap:6px;flex:1 1 150px}
.fd-tact-btns .btn{width:100%}
.cs-banner{flex-wrap:wrap}
.cs-banner .cs-txt{flex:1 1 120px}
`;

export class FieldUI {
  constructor(game) {
    this.g = game;
    this.ui = game.ui;
    this.view = new FieldView(game.world.renderer);
    this.active = false;
    this.battle = null;
    this.busy = false;
    this.tool = 'fusil';
    this.sel = null;
    this.arm = null;
    this.log = [];
    this.hold = false;
    if (!document.getElementById('field-style')) {
      const st = document.createElement('style');
      st.id = 'field-style';
      document.head.appendChild(st);
    }
    document.getElementById('field-style').textContent = STYLE;
    const root = (this.root = document.createElement('div'));
    root.id = 'field';
    root.className = 'hidden';
    root.innerHTML = `
      <div id="field-stage"></div>
      <div id="field-tags"></div>
      <div class="fd-top">
        <div class="fd-card"><h2 id="fd-title">Campo de batalla</h2><p id="fd-hint"></p></div>
        <div class="fd-log" id="fd-log"></div>
      </div>
      <div class="fd-zoom">
        <button class="round" data-act="fdzoom" data-f="0.82" aria-label="Acercar">+</button>
        <button class="round" data-act="fdzoom" data-f="1.22" aria-label="Alejar">−</button>
        <button class="round" data-act="fdfit" data-who="player" aria-label="Ver mi tropa">Yo</button>
        <button class="round" data-act="fdfit" data-who="all" aria-label="Ver todo el campo">Todo</button>
      </div>
      <div class="fd-bar" id="fd-bar"></div>`;
    game.mambi.el.appendChild(root);
    this.stage = root.querySelector('#field-stage');
    this.tags = root.querySelector('#field-tags');
    this.bar = root.querySelector('#fd-bar');
    this.setupPointers();
  }

  get sim() { return this.g.sim; }

  setupPointers() {
    const st = this.stage;
    const pts = new Map();
    let last = null, pinch = 0, moved = 0;
    st.addEventListener('pointerdown', (e) => {
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      last = [e.clientX, e.clientY];
      moved = 0;
      st.setPointerCapture?.(e.pointerId);
      e.stopPropagation();
    });
    st.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      e.stopPropagation();
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size >= 2) {
        const [a, c] = [...pts.values()];
        const d = Math.hypot(a[0] - c[0], a[1] - c[1]);
        if (pinch) this.view.zoom(pinch / d);
        pinch = d;
        return;
      }
      const dx = e.clientX - last[0], dy = e.clientY - last[1];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6) this.view.pan(dx, dy);
      last = [e.clientX, e.clientY];
    });
    const end = (e) => {
      const was = moved;
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = 0;
      e.stopPropagation();
      if (e.type === 'pointerup' && was < 12) this.tap(e.clientX, e.clientY);
    };
    st.addEventListener('pointerup', end);
    st.addEventListener('pointercancel', (e) => { pts.delete(e.pointerId); pinch = 0; e.stopPropagation(); });
    st.addEventListener('wheel', (e) => { e.preventDefault(); e.stopPropagation(); this.view.zoom(e.deltaY > 0 ? 1.1 : 0.9); }, { passive: false });
  }

  toast(m) { this.ui.toast(m); }
  selected() { return this.battle?.units.find((u) => u.id === this.sel) || null; }

  openAttack(cityId, tactic) {
    const why = this.sim.mbCanAttack(cityId, tactic);
    if (why) { this.toast(why); this.g.sound?.play('error'); return; }
    const c = CITY_BY_ID[cityId];
    const m = this.g.mambi;
    if (!m.open) m.openMap();
    this.ui.closeSheet();
    this.battle = createBattle({
      mode: 'attack', cityId, city: c.name, terrain: c.terrain, tactic,
      army: { ...this.sim.mb().army }, enemy: c.guards,
    });
    this.hold = false;
    this.begin();
  }

  openDefense() {
    let A = null;
    try { A = this.sim.cs().attack; } catch { A = null; }
    if (!A) { this.toast('No hay una columna del Régimen en camino.'); return; }
    const c = CITY_BY_ID[A.city];
    const cc = this.sim.csCity(A.city);
    const m = this.g.mambi;
    if (!m.open) m.openMap();
    this.ui.closeSheet();
    this.sim.csHold = true;
    this.hold = true;
    this.battle = createBattle({
      mode: 'defense', cityId: A.city, city: c.name, terrain: c.terrain, kind: A.kind,
      garrison: { inf: cc.gar.inf, cab: cc.gar.cab },
      militia: this.sim.csMilitia(A.city),
      defenses: { trinchera: cc.def.trinchera, fortin: cc.def.fortin },
      enemy: A.power,
    });
    this.begin();
  }

  begin() {
    this.active = true;
    this.busy = false;
    this.g.mambi.fielding = true;
    this.g.mambi.el.classList.add('field-on');
    this.root.classList.remove('hidden');
    this.tool = this.battle.budget.inf ? 'fusil' : this.battle.budget.cab ? 'cab' : 'mil';
    this.sel = null;
    this.arm = null;
    this.log = [];
    this.clock = performance.now();
    this.view.fit(this.battle, 'player');
    this.g.setSpeed?.(1);
    this.paint();
    this.g.sound?.play('tap');
  }

  close() {
    this.active = false;
    this.busy = false;
    if (this.g.mambi) {
      this.g.mambi.fielding = false;
      this.g.mambi.el.classList.remove('field-on');
    }
    this.root.classList.add('hidden');
    this.battle = null;
    this.arm = null;
  }

  chip(k, label, n) {
    const on = this.tool === k ? ' on' : '';
    return `<button class="btn${on}" data-act="fdtool" data-k="${k}">${label}<small>${n}</small></button>`;
  }

  paint() {
    const b = this.battle;
    if (!b) return;
    const title = this.root.querySelector('#fd-title');
    const hint = this.root.querySelector('#fd-hint');
    const log = this.root.querySelector('#fd-log');
    const deploy = b.phase === 'deploy';
    title.textContent = deploy
      ? `Campo de ${b.city}`
      : `Turno ${b.turn} · ${b.city}`;
    hint.textContent = deploy
      ? (b.mode === 'attack'
        ? 'Más grande que la finca. Coloca la tropa en tu zona (el borde de abajo): machete, fusil, caballería y cañón. El cañaveral cubre, el muro tapa el tiro y el río frena.'
        : 'Defiende la plaza, al fondo de tu zona. Cava trincheras y pon barricadas: el cañaveral y el muro cubren, el río les frena el paso.')
      : (this.arm
        ? `${describeOrders(this.arm.t)} Toca una casilla marcada, o la orden otra vez para que ellos elijan.`
        : (b.mode === 'attack' ? 'Toma la plaza (la bandera) o dispersa a los guardias.' : 'Que no pisen la plaza. Si rompes la columna, la ciudad aguanta.'));
    log.innerHTML = this.log.map((l) => `<div>${l}</div>`).join('');
    const B = b.budget;
    const u = this.selected();
    let html = '';
    if (deploy) {
      html += `<div class="fd-tools">`;
      html += this.chip('machete', 'Machete', B.inf ? `${B.inf}` : '0');
      html += this.chip('fusil', 'Fusil', B.inf ? `${B.inf}` : '0');
      html += this.chip('cab', 'Caballería', `${B.cab}`);
      html += this.chip('art', 'Cañón', `${B.guns}`);
      if (B.mil.length || b.stock.mil.length) html += this.chip('mil', 'Milicia', `${B.mil.length}`);
      html += this.chip('trinchera', 'Trinchera', `${B.trench}`);
      html += this.chip('barricada', 'Barricada', `${B.bar}`);
      html += `</div>`;
      const why = canStart(b);
      html += `<p class="fd-sel">${u && u.side === 'player' ? `${unitName(u)} · ${u.men} · tocada para quitar` : (why || 'Cuando la tropa esté colocada, empieza.')}</p>`;
      html += `<div class="fd-row">`;
      html += `<button class="btn" data-act="fdauto">Formar la tropa</button>`;
      html += `<button class="btn primary" data-act="fdstart">${b.mode === 'attack' ? '¡Al ataque!' : 'A defender'}</button>`;
      if (u && u.side === 'player') html += `<button class="btn" data-act="fdlift">Quitar</button>`;
      html += `<button class="btn" data-act="fdquick">Resolver rápido</button>`;
      html += `<button class="btn" data-act="fdcancel">Volver</button>`;
      html += `</div>`;
    } else if (this.busy) {
      html += `<p class="fd-sel">La tropa se mueve…</p>`;
    } else {
      const mine = u && u.side === 'player' && u.alive;
      html += `<div class="fd-tools">`;
      for (const t of ['avanzar', 'flanquear', 'carga', 'retirada']) {
        const on = this.arm && this.arm.t === t ? ' on' : '';
        const name = t === 'carga' ? 'Carga al machete' : t[0].toUpperCase() + t.slice(1);
        html += `<button class="btn${on}" data-act="fdorder" data-k="${t}">${name}</button>`;
      }
      html += `</div>`;
      html += `<p class="fd-sel">${mine ? `${unitName(u)} · ${u.hp}/${u.max}${u.order ? ` · orden: ${u.order.t}` : ' · sin orden (dispara si alcanza)'}` : 'Toca una tropa tuya y dale una orden. O manda a toda la tropa.'}</p>`;
      html += `<div class="fd-all">`;
      html += `<button class="btn" data-act="fdall" data-k="avanzar">Todos avanzar</button>`;
      html += `<button class="btn" data-act="fdall" data-k="flanquear">Todos flanquear</button>`;
      html += `<button class="btn" data-act="fdall" data-k="carga">Todos a la carga</button>`;
      html += `<button class="btn" data-act="fdall" data-k="retirada">Todos retirada</button>`;
      html += `</div>`;
      html += `<div class="fd-go">`;
      html += `<button class="btn primary" data-act="fdgo">Ejecutar</button>`;
      html += `<button class="btn" data-act="fdquick">Resolver rápido</button>`;
      html += `</div>`;
    }
    if (this.bar.dataset.sig !== html) { this.bar.innerHTML = html; this.bar.dataset.sig = html; }
  }

  marks() {
    if (!this.arm?.unit?.alive) return [];
    return reachable(this.battle, this.arm.unit, this.arm.t).filter((c) => c.x !== this.arm.unit.x || c.y !== this.arm.unit.y);
  }

  tap(cx, cy) {
    if (!this.active || this.busy || !this.battle) return;
    const t = this.view.pick(cx, cy, this.g.canvas);
    if (!t) return;
    const b = this.battle;
    const u = unitAt(b, t.x, t.y);
    if (b.phase === 'deploy') {
      if (u?.side === 'player') { this.sel = u.id; this.paint(); return; }
      if (this.tool === 'trinchera' || this.tool === 'barricada') {
        const w = workAtTile(b, t.x, t.y);
        const why = w === this.tool ? liftWork(b, t.x, t.y) : placeWork(b, this.tool, t.x, t.y);
        if (why) { this.toast(why); this.g.sound?.play('error'); }
        else this.g.sound?.play(w === this.tool ? 'tap' : 'plant');
      } else if (u?.side === 'enemy') {
        this.toast(`${unitName(u)} espera en ${tileLabel(b.ground[t.y][t.x])}.`);
      } else {
        const why = placeUnit(b, this.tool, t.x, t.y);
        if (why) { this.toast(why); this.g.sound?.play('error'); }
        else { this.g.sound?.play('tap'); this.sel = b.units[b.units.length - 1].id; }
      }
      this.paint();
      return;
    }
    if (this.arm?.unit?.alive) {
      const cells = reachable(b, this.arm.unit, this.arm.t);
      if (cells.some((c) => c.x === t.x && c.y === t.y)) {
        setOrder(b, this.arm.unit.id, this.arm.t, t.x, t.y);
        this.arm = null;
        this.g.sound?.play('tap');
        this.paint();
        return;
      }
    }
    if (u?.side === 'player') { this.sel = u.id; this.arm = null; this.paint(); return; }
    if (u?.side === 'enemy') {
      const g = b.ground[u.y][u.x];
      this.sel = u.id;
      this.toast(`${unitName(u)} · vida ${u.hp}/${u.max}${g === 'cana' ? ' · el cañaveral lo cubre' : g === 'rio' ? ' · metido en el río' : ''}.`);
      this.paint();
      return;
    }
    if (!u && !zone(b, t.x, t.y)) this.toast(tileLabel(b.ground[t.y][t.x]));
    this.arm = null;
    this.paint();
  }

  act(a, d) {
    const b = this.battle;
    if (!b && a !== 'csfield' && a !== 'mbfield') return;
    if (a === 'fdtool') { this.tool = d.k; this.arm = null; this.paint(); return; }
    if (a === 'fdzoom') { this.view.zoom(+d.f || 1); return; }
    if (a === 'fdfit') { this.view.fit(b, d.who === 'all' ? 'all' : 'player'); return; }
    if (a === 'fdauto') {
      const why = autoDeploy(b);
      this.g.sound?.play('tap');
      if (why) this.toast(why);
      else { this.toast('La tropa quedó formada. Puedes moverla antes de empezar.'); this.view.fit(b, 'player'); }
      this.paint();
      return;
    }
    if (a === 'fdlift') {
      const why = this.sel ? liftUnit(b, this.sel) : 'Toca una tropa tuya.';
      if (why) this.toast(why);
      this.sel = null;
      this.paint();
      return;
    }
    if (a === 'fdcancel') { this.cancel(); return; }
    if (a === 'fdstart') {
      const why = canStart(b);
      if (why) { this.toast(why); this.g.sound?.play('error'); return; }
      b.phase = 'fight';
      b.turn = 1;
      this.arm = null;
      this.tool = null;
      this.log = [b.mode === 'attack' ? 'Da una orden y toca Ejecutar. La plaza es la bandera.' : 'Aguanta la plaza o rompe la columna.'];
      this.g.sound?.play('horn');
      this.view.fit(b, 'all');
      this.paint();
      return;
    }
    if (a === 'fdorder') { this.armOrder(d.k); return; }
    if (a === 'fdall') {
      const n = orderAll(b, d.k);
      this.arm = null;
      this.toast(n ? `Orden a ${n} tropas. Toca Ejecutar.` : 'No hay tropa en el campo.');
      this.paint();
      return;
    }
    if (a === 'fdgo') { this.go(); return; }
    if (a === 'fdquick') { this.quick(); return; }
  }

  armOrder(t) {
    const u = this.selected();
    if (!u || u.side !== 'player' || !u.alive) { this.toast('Toca primero una tropa tuya.'); return; }
    if (t === 'carga' && !KINDS[u.kind].melee) { this.toast('La carga al machete es de macheteros y caballería.'); this.g.sound?.play('error'); return; }
    if (this.arm && this.arm.t === t && this.arm.unit.id === u.id) {
      const why = setOrder(this.battle, u.id, t);
      if (why) this.toast(why);
      else this.g.sound?.play('tap');
      this.arm = null;
    } else this.arm = { t, unit: u };
    this.paint();
  }

  go() {
    if (this.busy || this.battle.phase !== 'fight') return;
    this.arm = null;
    this.busy = true;
    this.after = 'player';
    this.events = resolveSide(this.battle, 'player');
    this.note(this.events);
    this.animUntil = performance.now() + 880;
    this.paint();
  }

  tickAnim() {
    if (!this.busy || performance.now() < this.animUntil) return;
    const end = outcome(this.battle);
    if (this.after === 'player') {
      if (end) { this.busy = false; this.finish(end); return; }
      this.after = 'enemy';
      this.events = resolveSide(this.battle, 'enemy');
      this.note(this.events);
      this.animUntil = performance.now() + 880;
      return;
    }
    this.busy = false;
    const end2 = outcome(this.battle);
    if (end2) { this.finish(end2); return; }
    this.battle.turn += 1;
    const end3 = outcome(this.battle);
    if (end3) { this.finish(end3); return; }
    this.paint();
  }

  note(events) {
    const b = this.battle;
    const by = (id) => b.units.find((u) => u.id === id);
    const lines = [];
    for (const e of events) {
      if (e.t === 'move' && e.river && e.kind === 'cab') lines.push('El río frenó a la caballería.');
      else if (e.t === 'move' && e.river) lines.push('Cruzar el río les quitó el paso.');
      if (e.t === 'note' && e.note === 'rio-art') lines.push('El cañón no entra al río: usa el puente o el vado.');
      if (e.t === 'hit') {
        const A = unitName(by(e.id)), D = unitName(by(e.tid));
        let s = e.charge ? `${A} carga al machete contra ${D}: ${e.dmg}.`
          : e.flank ? `${A} flanquea a ${D}: ${e.dmg}.`
            : e.splash ? `La metralla alcanza a ${D}: ${e.dmg}.`
              : `${A} le pega a ${D}: ${e.dmg}.`;
        if (e.cover === 'cana') s += ' El cañaveral cubre.';
        else if (e.cover === 'trinchera') s += ' La trinchera aguanta.';
        else if (e.cover === 'muro') s += ' El muro tapa parte.';
        else if (e.cover === 'barricada') s += ' La barricada tapa.';
        if (e.killed) s += ` ${D} se dispersa.`;
        lines.push(s);
        const t = by(e.tid);
        if (t) this.view.burst(t.x, t.y);
      }
      if (e.t === 'off') lines.push(`${unitName(by(e.id))} salió del campo y se salvó.`);
    }
    if (!lines.length && events.some((e) => e.t === 'move')) lines.push(this.after === 'enemy' ? 'Ellos también se mueven.' : 'Tu tropa avanzó. Todavía no hay contacto.');
    if (lines.length) this.log = [...lines.slice(-2), ...this.log].slice(0, 3);
  }

  finish(result) {
    const b = this.battle;
    if (!b) return;
    const win = result === 'win';
    const lost = casualties(b);
    if (b.mode === 'attack') {
      const res = this.sim.mbBattle(b.cityId, b.tactic, 0.5, { win, lost });
      const city = b.cityId;
      this.close();
      if (!res) return;
      this.g.mambi.ver = -1;
      try { this.g.mambi.scenes.focus(city); } catch { /* mapa */ }
      this.g.mambi.presentResult(res);
      return;
    }
    this.sim.csHold = false;
    this.hold = false;
    const r = this.sim.csResolve(0.5, { forced: win, lost: { inf: lost.garInf, cab: lost.garCab }, field: true });
    this.close();
    if (r && !r.cancelled) this.g.castro?.resultModal(r);
  }

  quick() {
    const b = this.battle;
    if (!b || this.busy) return;
    if (b.phase === 'deploy') {
      const mode = b.mode, cityId = b.cityId, tactic = b.tactic;
      this.cancel();
      if (mode === 'attack') this.g.mambi.startBattle(cityId, tactic);
      else {
        this.sim.csHold = false;
        const r = this.sim.csResolve();
        if (r && !r.cancelled) this.g.castro?.resultModal(r);
      }
      return;
    }
    const ahead = strength(b, 'player') >= strength(b, 'enemy');
    this.finish(ahead ? 'win' : 'lose');
  }

  cancel() {
    if (this.hold) { try { this.sim.csHold = false; } catch { /* sin castro */ } this.hold = false; }
    this.close();
  }

  frame() {
    const t = performance.now();
    const dt = Math.min(0.1, (t - (this.clock || t)) / 1000);
    this.clock = t;
    if (this.g.started) this.sim.update(dt, dt);
    this.saveT = (this.saveT || 0) + dt;
    if (this.saveT > 8) { this.saveT = 0; save(this.sim.s); }
    this.ui.update(dt);
    if (!this.battle) return;
    this.tickAnim();
    if (!this.battle) return;
    const sel = this.battle.units.find((u) => u.id === this.sel) || null;
    this.view.render(this.battle, dt, t / 1000, {
      anim: this.busy,
      marks: this.marks(),
      markColor: this.arm ? MARK[this.arm.t] : 0xf2c14e,
      zone: this.battle.phase === 'deploy',
      sel,
    });
    this.placeTags();
  }

  placeTags() {
    const b = this.battle, canvas = this.g.canvas;
    const units = b.units.filter((u) => u.alive);
    while (this.tags.children.length < units.length) {
      const d = document.createElement('div');
      d.className = 'fd-tag';
      this.tags.appendChild(d);
    }
    for (let i = 0; i < this.tags.children.length; i++) {
      const el = this.tags.children[i];
      const u = units[i];
      if (!u) { el.style.display = 'none'; continue; }
      const shown = this.view.shown.get(u.id);
      const p = this.view.project(u.x, u.y, canvas, shown ? { x: shown.x, z: shown.z } : null);
      if (!p.vis) { el.style.display = 'none'; continue; }
      el.style.display = '';
      el.style.left = `${p.x}px`;
      el.style.top = `${p.y}px`;
      const hp = Math.max(0, Math.round(100 * u.hp / u.max));
      const sig = `${u.id}|${hp}|${u.order?.t || ''}|${u.side}|${this.sel === u.id ? 1 : 0}`;
      if (el.dataset.sig === sig) continue;
      el.dataset.sig = sig;
      el.className = `fd-tag ${u.side}${this.sel === u.id ? ' on' : ''}`;
      const mark = u.order ? (ORD[u.order.t] || '') : '';
      el.innerHTML = `<b>${LETTER[u.kind] || '?'}${mark}</b><i><span style="width:${hp}%"></span></i>`;
    }
  }
}

const prevFrame = MambiUI.prototype.frame;
MambiUI.prototype.frame = function () {
  if (this.g.field?.active) {
    try { return this.g.field.frame(); }
    catch (e) {
      console.warn('[campo] batalla', e);
      try { this.g.field.close(); } catch { /* ya cerrado */ }
    }
  }
  return prevFrame.call(this);
};

registerGameModule({
  attach(game) { try { game.field = new FieldUI(game); } catch (e) { console.warn('[campo]', e); } },
});

registerAct('mbfield', (ui, d) => ui.g.field?.openAttack(d.id, d.tactic));
registerAct('csfield', (ui) => ui.g.field?.openDefense());
for (const a of ['fdtool', 'fdzoom', 'fdfit', 'fdauto', 'fdlift', 'fdcancel', 'fdstart', 'fdorder', 'fdall', 'fdgo', 'fdquick']) {
  registerAct(a, (ui, d) => ui.g.field?.act(a, d));
}

void ICON;
