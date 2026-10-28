// Hoja de invasiones, aviso de columnas y resultado. El campo de batalla lo abre FieldUI.
import { ICON } from '../icons.js';
import { save } from '../state.js';
import { registerAct, registerGameModule } from '../registry.js';
import { MambiUI } from './ui.js';
import { CITY_BY_ID } from './data.js';
import { RIVAL_BY, RIVALS, friendPower, rt, suggestDetachment } from './war.js';
import { attachLive, liveFinca, liveNombre, livePower, liveState, pushFinca, reportLive, signInGoogle, signOutGoogle } from './live.js';

const k1 = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${Math.floor(n)}`);
const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const hm = (s) => { const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h ? `${h} h ${m} min` : `${m} min`; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));
const moodWord = (m) => (m < 0.7 ? 'debilitada' : m < 0.9 ? 'tocada' : m > 1.08 ? 'crecida' : 'en forma');

const STYLE = `
.war-banner{position:absolute;z-index:5;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:7px 8px 7px 10px;border-radius:14px;background:rgba(28,58,92,.94);color:#fff6e4;font-weight:700;font-size:13px;line-height:1.25;box-shadow:0 3px 0 rgba(12,24,40,.35);pointer-events:auto}
.war-banner.hidden{display:none}
.war-banner .war-txt{flex:1 1 140px;min-width:0}
.war-banner .war-cd{display:inline-block;min-width:38px;padding:1px 6px;border-radius:8px;background:#fff3e0;color:#1d3f66;text-align:center;font-variant-numeric:tabular-nums}
.war-banner .btn{flex:none;min-height:44px;padding:8px 12px}
#war-fbanner{left:calc(84px + var(--sal,0px));right:calc(8px + var(--sar,0px));top:calc(112px + var(--sat,0px));max-width:560px}
#war-mbanner{left:calc(8px + var(--sal,0px));right:calc(62px + var(--sar,0px));bottom:calc(148px + var(--sab,0px));max-width:560px}
#ui.mambi-on #war-fbanner{display:none!important}
.war-code{font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.35;word-break:break-all;background:#fff8ea;border:2px solid #5a4636;border-radius:12px;padding:8px 10px;margin:6px 0}
.war-in{width:100%;box-sizing:border-box;font:700 16px/1.3 inherit;padding:10px 12px;border-radius:12px;border:2px solid #5a4636;background:#fff8ea;color:#2a1f15;min-height:44px}
.war-row{flex-wrap:wrap}
.war-row .row-main{flex:1 1 140px}
.war-step{display:flex;gap:4px;flex:1 1 auto;justify-content:flex-end}
.war-step .btn{min-width:44px;min-height:44px;padding:6px 8px}
`;

export class WarUI {
  constructor(game) {
    this.g = game;
    this.ui = game.ui;
    this.det = { inf: 0, cab: 0, cart: 0 };
    this.which = null;
    this.sheet = 'home';
    this.reportShown = false;
    if (!document.getElementById('war-style')) {
      const st = document.createElement('style');
      st.id = 'war-style';
      st.textContent = STYLE;
      document.head.appendChild(st);
    }
    const root = this.ui.root;
    if (root && !document.getElementById('war-fbanner')) {
      const fb = document.createElement('div');
      fb.id = 'war-fbanner';
      fb.className = 'war-banner hidden';
      root.appendChild(fb);
      this.fb = fb;
    }
    const mel = game.mambi?.el;
    if (mel && !mel.querySelector('#war-mbanner')) {
      const mb = document.createElement('div');
      mb.id = 'war-mbanner';
      mb.className = 'war-banner hidden';
      mel.appendChild(mb);
      this.mbn = mb;
      const bar = mel.querySelector('#mb-bottom');
      if (bar && !bar.querySelector('[data-act="waropen"]')) {
        const b = document.createElement('button');
        b.className = 'big';
        b.dataset.act = 'waropen';
        b.innerHTML = `${ICON.machete}<span>Invasiones</span><em id="war-badge" class="hidden">!</em>`;
        bar.appendChild(b);
      }
    }
    try { attachLive(game); } catch (e) { console.warn('[vivo]', e); }
  }

  get sim() { return this.g.sim; }
  dev() { return !!(window.__fincaDev || import.meta.env.DEV); }
  modalOpen() { const w = document.getElementById('modal-wrap'); return !!w && !w.classList.contains('hidden'); }

  rivalOf(id) { return id === 'friend' ? null : RIVAL_BY[id]; }

  bannerHtml(A) {
    const c = CITY_BY_ID[A.city];
    const who = RIVAL_BY[A.rivalId]?.name || 'Otra finca';
    return `<span class="war-txt">La tropa de <b>${who}</b> (${A.power}) marcha sobre <b>${c?.name || A.city}</b> · <span class="war-cd" data-hit="${A.hit}">${mmss(A.hit - rt())}</span></span><button class="btn" data-act="waropen" data-id="defend">Ver</button><button class="btn primary" data-act="warfield">Al campo</button>`;
  }

  paintBanner(el, A, show) {
    if (!el) return;
    if (!A || !show) { if (!el.classList.contains('hidden')) el.classList.add('hidden'); return; }
    const key = `${A.id}|${A.power}|${A.city}`;
    if (el.dataset.key !== key) { el.innerHTML = this.bannerHtml(A); el.dataset.key = key; }
    el.classList.remove('hidden');
  }

  tick() {
    if (!this.g.started) return;
    let A = null;
    try { A = this.sim.war().inbound; } catch { return; }
    const onMap = !!this.g.mambi?.open;
    const onField = !!this.g.field?.active;
    this.paintBanner(this.fb, A, !onMap && !onField);
    this.paintBanner(this.mbn, A, onMap && !onField);
    const t = rt();
    for (const e of document.querySelectorAll('.war-cd[data-hit]')) {
      const v = mmss(+e.dataset.hit - t);
      if (e.textContent !== v) e.textContent = v;
    }
    const badge = document.getElementById('war-badge');
    if (badge) badge.classList.toggle('hidden', !A);
    try { pushFinca(this.sim); } catch { /* sin cuenta */ }
    this.drain();
    this.showReport();
  }

  drain() {
    const q = this.sim.warEvents;
    if (!q?.length || this.g.field?.active || this.modalOpen()) return;
    const r = q.shift();
    if (r && !r.cancelled) this.resultModal(r);
  }

  showReport() {
    let W = null;
    try { W = this.sim.war(); } catch { return; }
    if (this.reportShown || !W?.report?.lines?.length || this.modalOpen() || this.g.field?.active) return;
    this.reportShown = true;
    const away = W.report.away;
    this.ui.modal(`<h2>${ICON.machete} Mientras no estabas</h2><p>${away ? `Estuviste fuera ${hm(away)}. ` : ''}Otras fincas mandaron tropa contra tus ciudades. No es el Régimen: si perdieron una escaramuza, la ciudad sigue libre.</p><ul class="cs-log">${W.report.lines.map((l) => `<li>${l}</li>`).join('')}</ul><button class="btn primary" data-act="warok" data-id="report">Entendido</button>`);
  }

  resultModal(r) {
    if (!r || r.cancelled) return;
    this.g.sound?.play(r.win ? 'level' : 'error');
    try { save(this.sim.s); } catch { /* sin guardar */ }
    if (r.live) reportLive(this.sim, r.live, r);
    else pushFinca(this.sim, true);
    const field = r.field ? ' La jugaste en el campo.' : '';
    const reach = r.live ? ' Le llega a su teléfono. Sus ciudades siguen libres.' : '';
    this.ui.modal(`<h2>${r.win ? ICON.flagcu : ICON.machete} ${r.title}</h2><p>${r.line}${field}${reach}</p><button class="btn primary" data-act="modal-close">Volver</button>`);
  }

  stepRow(k, label, step) {
    const a = this.sim.mb().army;
    const n = this.det[k] | 0;
    const max = a[k] | 0;
    const btn = (d, text) => `<button class="btn" data-act="wardet" data-k="${k}" data-d="${d}" ${n + d < 0 || n + d > max ? 'disabled' : ''}>${text}</button>`;
    const pads = step > 1 ? `${btn(-step, '−' + step)}${btn(-1, '−')}${btn(1, '+')}${btn(step, '+' + step)}` : `${btn(-1, '−')}${btn(1, '+')}`;
    return `<div class="row war-row"><div class="row-main"><b>${label}</b><small>${n} de ${max} en el campamento</small></div><div class="war-step">${pads}</div></div>`;
  }

  costLine(det) {
    const need = (det.inf | 0) + (det.cab | 0);
    const have = this.sim.s.res.viveres || 0;
    const short = need > have;
    return `<p class="note">La marcha gasta <b>${need}</b> víveres (tienes ${Math.floor(have)}).${det.cart ? ` Llevas ${det.cart} carreta${det.cart > 1 ? 's' : ''}, que trae${det.cart > 1 ? 'n' : ''} cañón.` : ''}${short ? '<span class="mb-why">No alcanzan los víveres. Mándalos desde la finca.</span>' : ''}</p>`;
  }

  openHome() {
    this.sheet = 'home';
    this.ui.openSheet('Invasiones', () => this.homeHtml());
  }

  homeHtml() {
    const sim = this.sim;
    let W = null;
    try { W = sim.war(); } catch { return '<p class="note">La guerra de las fincas todavía no está lista.</p>'; }
    const code = sim.warCode();
    let out = `<p class="note">El mismo ejército libera ciudades, aguanta al Régimen, rechaza invasores e invade. Cachita, Pancho, Nené y Tato son para jugar solo. Con Google, la invasión le llega a la otra persona.</p>`;
    out += this.liveHtml();
    out += `<h3>Tu código</h3><p class="note">Pásaselo a un amigo para que pelee contra tu tropa de ahora. El resultado se queda en su teléfono.</p>`;
    out += `<div class="war-code" id="war-code">${code}</div>`;
    out += `<div class="row"><div class="row-main"><b>Apodo en el código</b><small>Letras, sin espacios. Ahora: ${W.nick}.</small></div></div>`;
    out += `<input class="war-in" id="war-nick" maxlength="10" value="${W.nick}" aria-label="Apodo">`;
    out += `<div class="row"><button class="btn" data-act="warnick">Guardar apodo</button><button class="btn primary" data-act="warcopy">Copiar código</button></div>`;
    out += `<h3>Código de otra finca</h3><p class="note">Pega el código que te pasen. Peleas contra esos números aquí. La finca de tu amigo no se entera.</p>`;
    out += `<input class="war-in" id="war-code-in" placeholder="LAF-…" autocomplete="off" aria-label="Código de otra finca">`;
    out += `<button class="btn" data-act="waruse">Usar este código</button>`;
    if (W.friend) {
      const f = W.friend;
      const p = friendPower(f);
      out += `<div class="row sel"><div class="row-main"><b>Finca de ${f.name}</b><small>${f.inf} infantes · ${f.cab} jinetes · ${f.cart} carretas · guarnición ${f.garInf}+${f.garCab} · fuerza ${p}. Código, no una persona en vivo.</small></div><button class="btn primary" data-act="warinvade" data-id="friend">Invadir</button></div>`;
    }
    out += `<h3>Otras fincas</h3><p class="note">Para jugar solo, sin que nadie se entere.</p>`;
    const inn = W.inbound;
    for (const r of RIVALS) {
      const mood = W.rivals[r.id]?.mood || 1;
      const power = sim.warPower(r.id);
      const away = inn && inn.rivalId === r.id ? ` Ahora marcha sobre ${CITY_BY_ID[inn.city]?.name || 'una ciudad'}: en casa quedan menos.` : '';
      out += `<div class="row"><div class="row-main"><b>${r.name} · ${r.finca}</b><small>${r.motto}. Fuerza ${power} · ${moodWord(mood)}.${away}</small></div><button class="btn primary" data-act="warinvade" data-id="${r.id}">Invadir</button></div>`;
    }
    if (inn) {
      const who = RIVAL_BY[inn.rivalId]?.name || 'Otra finca';
      const city = CITY_BY_ID[inn.city]?.name || inn.city;
      out += `<div class="row sel"><div class="row-main"><b>${who} marcha sobre ${city}</b><small>${inn.power} de fuerza. La guarnición y la milicia aguantan. Puedes llevar tropa del campamento.</small></div><button class="btn primary" data-act="waropen" data-id="defend">Defender</button></div>`;
    } else out += `<p class="note">Cuando una finca marche sobre una ciudad libre, sale un aviso azul (no es la columna gris del Régimen). El reloj es de verdad: adelantar el día no lo adelanta.</p>`;
    const st = W.stats;
    out += `<p class="note">Invasiones: ${st.invaded} · plazas tomadas ${st.won} · retiradas ${st.lost} · ciudades aguantadas ${st.held} · saqueos ${st.raided}.</p>`;
    if (W.log.length) out += `<ul class="cs-log">${W.log.slice(-3).map((l) => `<li>${l}</li>`).join('')}</ul>`;
    if (this.dev()) out += `<h3>Trucos</h3><div class="seg"><button class="btn" data-act="warcheat" data-id="raid">Invasión en 20 s</button><button class="btn" data-act="warcheat" data-id="now">Que lleguen ya</button></div>`;
    return out;
  }

  liveHtml() {
    const err = liveState.error ? `<p class="note">${esc(liveState.error)}</p>` : '';
    if (!liveState.user) {
      return `<h3>Fincas en vivo</h3><p class="note">Aquí salen las otras personas, justo debajo de este título. Primero toca Entrar con Google. Tú no apareces en tu propia lista. Cachita, Pancho, Nené y Tato están más abajo: son para jugar solo.</p><button class="btn primary" data-act="wargoogle">Entrar con Google</button>${err}`;
    }
    const nombre = liveNombre() || liveState.user.email || 'tu cuenta';
    let out = `<h3>Fincas en vivo</h3><p class="note">Entraste como <b>${esc(nombre)}</b>. Los jugadores van aquí, no en Otras fincas.</p>`;
    out += `<button class="btn" data-act="warout">Salir de Google</button>`;
    if (liveState.error) return out + err;
    if (!liveState.fincas.length) {
      out += (liveState.total | 0) > 0
        ? `<p class="note">Solo está publicada tu ficha. Si el otro teléfono entró con este mismo Google, no sale. Tiene que usar otra cuenta.</p>`
        : `<p class="note">Todavía no hay otra finca. La otra persona también tiene que tocar Entrar con Google y esperar unos segundos.</p>`;
      return out;
    }
    for (const f of liveState.fincas) {
      const uid = String(f.uid || '');
      if (!/^[A-Za-z0-9_-]{6,128}$/.test(uid)) continue;
      const p = livePower(f);
      out += `<div class="row"><div class="row-main"><b>${esc(f.nombre || 'Finca')}</b><small>${f.inf | 0} infantes · ${f.cab | 0} jinetes · ${f.cart | 0} carretas · guarnición ${f.garInf | 0}+${f.garCab | 0} · fuerza ${p}</small></div><button class="btn primary" data-act="warinvade" data-id="g:${uid}">Invadir</button></div>`;
    }
    return out;
  }

  onLive() {
    if (this.sheet !== 'home' || this.ui.sheet?.title !== 'Invasiones') return;
    this.ui.refreshSheet();
  }

  openInvade(id) {
    const sim = this.sim;
    const W = sim.war();
    if (id === 'friend') {
      if (!W.friend) { this.ui.toast('Primero pega el código de una finca.'); return; }
      this.which = 'friend';
      this.det = suggestDetachment(sim.mb().army, friendPower(W.friend));
    } else if (String(id || '').startsWith('g:')) {
      const f = liveFinca(id.slice(2));
      if (!f) { this.ui.toast('Esa finca ya no está en la lista.'); return; }
      this.which = `g:${f.uid}`;
      this.det = suggestDetachment(sim.mb().army, livePower(f));
    } else if (!RIVAL_BY[id]) return;
    else {
      this.which = id;
      this.det = suggestDetachment(sim.mb().army, sim.warPower(id));
    }
    this.sheet = 'invade';
    let title = `Invadir ${RIVAL_BY[id]?.finca || 'la finca'}`;
    if (id === 'friend') title = `Invadir la finca de ${W.friend.name}`;
    else if (String(id || '').startsWith('g:')) title = `Invadir la finca de ${liveFinca(id.slice(2))?.nombre || 'otro'}`;
    this.ui.openSheet(title, () => this.invadeHtml());
  }

  invadeHtml() {
    const id = this.which;
    const sim = this.sim;
    const W = sim.war();
    const friend = id === 'friend';
    const live = !friend && String(id || '').startsWith('g:') ? liveFinca(id.slice(2)) : null;
    const rival = friend || live ? null : RIVAL_BY[id];
    if (friend && !W.friend) return '<p class="note">No hay código cargado.</p>';
    if (!friend && !live && !rival) return '<p class="note">Esa finca ya no está.</p>';
    const foe = friend ? W.friend.name : live ? (live.nombre || 'Otra finca') : rival.name;
    const place = friend || live ? `la finca de ${foe}` : rival.finca;
    const power = friend ? friendPower(W.friend) : live ? livePower(live) : sim.warPower(id);
    const why = sim.warCanSend(this.det);
    const extra = live
      ? 'Es una persona con Google: el resultado le llega a su teléfono. Sus ciudades de la campaña siguen libres.'
      : friend
        ? 'Es el código de otra finca: el resultado no le llega.'
        : 'No es una persona en vivo, y no es una ciudad de la campaña.';
    let out = `<p class="note">Mandas un destacamento del campamento contra ${esc(place)} (${esc(foe)}, fuerza ${power}). Quien pierde se dispersa y vuelve a su casa. ${extra}</p>`;
    out += this.stepRow('inf', 'Infantes', 5);
    out += this.stepRow('cab', 'Jinetes', 1);
    out += this.stepRow('cart', 'Carretas', 1);
    out += this.costLine(this.det);
    out += `<div class="row"><button class="btn ${why ? 'poor' : 'primary'}" data-act="wargo" data-id="field" ${why ? 'disabled' : ''}>Jugar en el campo</button><button class="btn ${why ? 'poor' : ''}" data-act="wargo" data-id="quick" ${why ? 'disabled' : ''}>Resolver rápido</button></div>`;
    if (why) out += `<p class="note">${why}</p>`;
    return out;
  }

  openDefend() {
    const A = this.sim.war()?.inbound;
    if (!A) { this.ui.toast('No hay una tropa marchando sobre tus ciudades.'); return; }
    const gap = Math.max(0, A.power - this.sim.warDefensePower(A.city, {}));
    this.det = gap > 0 ? suggestDetachment(this.sim.mb().army, gap) : { inf: 0, cab: 0, cart: 0 };
    this.which = A.city;
    this.sheet = 'defend';
    const name = CITY_BY_ID[A.city]?.name || A.city;
    this.ui.openSheet(`Defender ${name}`, () => this.defendHtml());
  }

  defendHtml() {
    const sim = this.sim;
    const A = sim.war()?.inbound;
    if (!A) return '<p class="note">Esa columna ya se fue.</p>';
    const city = CITY_BY_ID[A.city];
    const who = RIVAL_BY[A.rivalId]?.name || 'Otra finca';
    let gar = { inf: 0, cab: 0 }, mil = 0, def = { trinchera: 0, fortin: 0 };
    try {
      const c = sim.csCity(A.city);
      gar = c.gar; def = c.def; mil = sim.csMilitia(A.city);
    } catch { /* sin guarnición */ }
    const why = sim.warCanRepel(A.city, this.det);
    let out = `<p class="note">La tropa de <b>${who}</b> (${A.power}) viene a saquear <b>${city?.name || A.city}</b>. No es el Régimen. Si pierdes, la ciudad <b>sigue libre</b>: se llevan renta o unos pesos y se van.</p>`;
    out += `<p class="note">En la ciudad: ${gar.inf} infantes y ${gar.cab} jinetes de guarnición, milicia ${mil}, trincheras ${def.trinchera}, fortines ${def.fortin}. Eso sale al campo aunque no lleves a nadie del campamento.</p>`;
    out += `<h3>Llevar del campamento</h3><p class="note">Opcional. Esos soldados salen del campamento y los que vuelven regresan. Gastan víveres.</p>`;
    out += this.stepRow('inf', 'Infantes', 5);
    out += this.stepRow('cab', 'Jinetes', 1);
    out += this.stepRow('cart', 'Carretas', 1);
    out += this.costLine(this.det);
    out += `<div class="row"><button class="btn ${why ? 'poor' : 'primary'}" data-act="wargo" data-id="field" ${why ? 'disabled' : ''}>Jugar en el campo</button><button class="btn ${why ? 'poor' : ''}" data-act="wargo" data-id="quick" ${why ? 'disabled' : ''}>Resolver rápido</button></div>`;
    if (why) out += `<p class="note">${why}</p>`;
    return out;
  }

  invadeSpec(det) {
    const id = this.which;
    const sim = this.sim;
    const W = sim.war();
    if (id === 'friend') {
      const f = W.friend;
      return {
        war: 'invade', friend: true, rivalId: 'friend', foe: 'amigo', foeName: f.name,
        cityId: 'amigo', city: `Finca de ${f.name}`, terrain: f.terrain || 'llano',
        enemy: friendPower(f), army: { ...det }, tactic: det.cart ? 'asedio' : det.cab > det.inf ? 'carga' : 'emboscada',
      };
    }
    if (String(id || '').startsWith('g:')) {
      const f = liveFinca(id.slice(2));
      if (!f) return null;
      const terrains = ['llano', 'monte', 'costa'];
      return {
        war: 'invade', rivalId: 'live', foe: 'amigo', foeName: String(f.nombre || 'Otra finca').replace(/[<>]/g, '').slice(0, 24),
        cityId: 'vivo', city: `Finca de ${f.nombre || 'otro'}`, terrain: terrains[(f.freed | 0) % 3] || 'llano',
        enemy: livePower(f), army: { ...det }, tactic: det.cart ? 'asedio' : det.cab > det.inf ? 'carga' : 'emboscada',
        live: {
          uid: f.uid, nombre: f.nombre || 'Finca',
          inf: f.inf | 0, cab: f.cab | 0, cart: f.cart | 0, garInf: f.garInf | 0, garCab: f.garCab | 0,
        },
      };
    }
    const r = RIVAL_BY[id];
    return {
      war: 'invade', rivalId: id, foe: r.foe, foeName: r.name,
      cityId: r.id, city: r.finca, terrain: r.terrain,
      enemy: sim.warPower(id), army: { ...det }, tactic: det.cart ? 'asedio' : det.cab > det.inf ? 'carga' : 'emboscada',
    };
  }

  repelSpec(det) {
    const A = this.sim.war().inbound;
    const r = RIVAL_BY[A.rivalId];
    const c = CITY_BY_ID[A.city];
    let gar = { inf: 0, cab: 0 }, def = { trinchera: 0, fortin: 0 }, mil = 0;
    try {
      const cc = this.sim.csCity(A.city);
      gar = { inf: cc.gar.inf, cab: cc.gar.cab };
      def = { trinchera: cc.def.trinchera, fortin: cc.def.fortin };
      mil = this.sim.csMilitia(A.city);
    } catch { /* sin castro */ }
    return {
      war: 'repel', rivalId: A.rivalId, foe: r?.foe || 'ocre', foeName: r?.name || 'Otra finca',
      cityId: A.city, city: c?.name || A.city, terrain: c?.terrain || 'llano',
      enemy: A.power, garrison: gar, militia: mil, defenses: def, camp: { ...det },
    };
  }

  go(kind) {
    const det = { inf: this.det.inf | 0, cab: this.det.cab | 0, cart: this.det.cart | 0 };
    if (this.sheet === 'defend') {
      const A = this.sim.war()?.inbound;
      if (!A) { this.ui.toast('Esa columna ya se fue.'); return; }
      if (kind === 'quick') {
        const spec = this.repelSpec(det);
        const r = this.sim.warQuick({
          war: 'repel', rivalId: spec.rivalId, cityId: spec.cityId, foeName: spec.foeName,
          enemyPower: spec.enemy, sent: det,
        });
        this.ui.closeSheet();
        if (r && !r.cancelled) this.resultModal(r);
        return;
      }
      this.g.field?.openWar(this.repelSpec(det));
      return;
    }
    if (kind === 'quick') {
      const spec = this.invadeSpec(det);
      if (!spec) { this.ui.toast('Esa finca ya no está en la lista.'); return; }
      const r = this.sim.warQuick({
        war: 'invade', rivalId: spec.rivalId, cityId: spec.cityId, foeName: spec.foeName,
        friend: spec.friend, enemyPower: spec.enemy, tactic: spec.tactic, sent: det,
      });
      this.ui.closeSheet();
      if (r && spec.live) r.live = spec.live;
      if (r && !r.cancelled) this.resultModal(r);
      return;
    }
    const spec = this.invadeSpec(det);
    if (!spec) { this.ui.toast('Esa finca ya no está en la lista.'); return; }
    this.g.field?.openWar(spec);
  }

  act(a, d) {
    const sim = this.sim;
    if (a === 'waropen') {
      if (d.id === 'defend') return this.openDefend();
      return this.openHome();
    }
    if (a === 'warfield') {
      const A = sim.war()?.inbound;
      if (!A) { this.ui.toast('No hay una tropa marchando sobre tus ciudades.'); return; }
      this.which = A.city;
      this.sheet = 'defend';
      return this.g.field?.openWar(this.repelSpec({ inf: 0, cab: 0, cart: 0 }));
    }
    if (a === 'warinvade') return this.openInvade(d.id);
    if (a === 'wardet') {
      const k = d.k;
      if (k !== 'inf' && k !== 'cab' && k !== 'cart') return;
      const aArmy = sim.mb().army;
      const n = Math.max(0, Math.min(aArmy[k] | 0, (this.det[k] | 0) + (+d.d || 0)));
      this.det[k] = n;
      this.ui.refreshSheet();
      return;
    }
    if (a === 'wargo') return this.go(d.id === 'quick' ? 'quick' : 'field');
    if (a === 'wargoogle') {
      signInGoogle().catch(() => {});
      return;
    }
    if (a === 'warout') {
      signOutGoogle().catch(() => this.ui.toast('No se pudo salir de Google.'));
      return;
    }
    if (a === 'warcopy') return this.copy();
    if (a === 'warnick') {
      const nick = document.getElementById('war-nick')?.value || '';
      sim.warSetNick(nick);
      this.ui.toast(`Apodo: ${sim.war().nick}.`);
      this.ui.refreshSheet();
      return;
    }
    if (a === 'waruse') {
      const raw = document.getElementById('war-code-in')?.value || '';
      if (sim.warUseCode(raw)) this.ui.refreshSheet();
      return;
    }
    if (a === 'warok') {
      if (d.id === 'report') { try { sim.war().report = null; save(sim.s); } catch { /* nada */ } }
      this.ui.closeModal?.();
      const w = document.getElementById('modal-wrap');
      if (w && !w.classList.contains('hidden')) w.classList.add('hidden');
      return;
    }
    if (a === 'warcheat') {
      if (!this.dev()) return;
      sim.warCheat(d.id);
      this.ui.refreshSheet();
      this.tick();
    }
  }

  async copy() {
    const code = this.sim.warCode();
    try {
      await navigator.clipboard.writeText(code);
      this.ui.toast('Código copiado. Pásaselo a tu amigo.');
    } catch {
      this.ui.toast('No se pudo copiar solo. Mantenlo pulsado y cópialo a mano.');
    }
  }
}

const prev = MambiUI.prototype.frame;
MambiUI.prototype.frame = function () {
  const r = prev.call(this);
  try { this.g.war?.tick(); } catch (e) { if (!this.g.war?.err) console.warn('[guerra] mapa', e); if (this.g.war) this.g.war.err = 1; }
  return r;
};

registerGameModule({
  attach(game) { try { game.war = new WarUI(game); } catch (e) { console.warn('[guerra] UI', e); } },
  frame(game) { try { game.war?.tick(); } catch { /* el mapa ya avisa */ } },
});

for (const a of ['waropen', 'warfield', 'warinvade', 'wardet', 'wargo', 'wargoogle', 'warout', 'warcopy', 'warnick', 'waruse', 'warok', 'warcheat']) {
  registerAct(a, (ui, d) => ui.g.war?.act(a, d));
}
