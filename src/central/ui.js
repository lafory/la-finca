// Hojas y etiquetas de los campos grandes, el central y la estación (mismo estilo que ../ui.js).
import { ICON } from '../icons.js';
import { now } from '../state.js';
import { fmtTime, fmtClock } from '../sim.js';
import { ITEMS } from '../data.js';
import {
  IND, IND_ORDER, WHOLESALE, FIELD_CROPS, FIELD_CROP_ORDER, FIELDS, FIELD_BY_ID, STAGES, WOOD_PRICE, MILL, STILL, TRAIN,
  CAMPOS_LEVEL, CENTRAL_LEVEL, BLOCKS, STOPS,
} from './data.js';

const svg = (body) => `<svg viewBox="0 0 32 32" aria-hidden="true" class="ico">${body}</svg>`;
// iconos nuevos (se agregan al mismo diccionario)
Object.assign(ICON, {
  melaza: ICON.melaza || svg('<path d="M9 6h14v3l2 3v15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V12l2-3z" fill="#5a2e14" stroke="#2e170a" stroke-width="2"/><rect x="10" y="15" width="12" height="6" rx="1" fill="#e8d9b5"/><path d="M12 4h8v3h-8z" fill="#8a6a3a"/>'),
  ron: ICON.ron || svg('<path d="M13 3h6v6l3 4v14a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V13l3-4z" fill="#b8642a" stroke="#5a2e14" stroke-width="2"/><rect x="11" y="16" width="10" height="7" rx="1" fill="#f3e6c8"/><path d="M13 19h6" stroke="#c0392b" stroke-width="1.6"/>'),
  train: ICON.train || svg('<rect x="4" y="12" width="16" height="10" rx="1" fill="#2f3b33" stroke="#1a1816" stroke-width="2"/><rect x="18" y="8" width="9" height="14" rx="1" fill="#8f3324" stroke="#3a1a10" stroke-width="2"/><path d="M8 12V6h4v6" fill="#2f3b33" stroke="#1a1816" stroke-width="2"/><circle cx="9" cy="25" r="3" fill="#a83a2a" stroke="#1a1816" stroke-width="1.5"/><circle cx="17" cy="25" r="3" fill="#a83a2a" stroke="#1a1816" stroke-width="1.5"/><circle cx="24" cy="25" r="2.5" fill="#a83a2a" stroke="#1a1816" stroke-width="1.5"/><circle cx="10" cy="4" r="2" fill="#ddd"/>'),
  factory: ICON.factory || svg('<path d="M3 28V15l6 4v-4l6 4v-4l6 4V4h5v24z" fill="#9c5a3c" stroke="#4a2a1a" stroke-width="2" stroke-linejoin="round"/><path d="M23 4h3" stroke="#e8dcc0" stroke-width="2"/><circle cx="25" cy="2.5" r="2" fill="#bbb"/><rect x="7" y="22" width="3" height="3" fill="#2a2420"/><rect x="13" y="22" width="3" height="3" fill="#2a2420"/>'),
  field: ICON.field || svg('<path d="M2 18l14-8 14 8-14 8z" fill="#9b4a2a" stroke="#5a2a14" stroke-width="2"/><path d="M7 18l9-5M11 20l9-5M15 22l9-5" stroke="#5a2a14" stroke-width="1.5"/><path d="M16 10V3M13 5l3-2 3 2" stroke="#5b8a34" stroke-width="2" fill="none"/>'),
  tractor: ICON.tractor || svg('<rect x="6" y="11" width="12" height="7" fill="#a8432e" stroke="#4a1a10" stroke-width="2"/><rect x="16" y="6" width="7" height="9" fill="#a8432e" stroke="#4a1a10" stroke-width="2"/><circle cx="21" cy="22" r="6" fill="#2b2622"/><circle cx="21" cy="22" r="2.5" fill="#a8432e"/><circle cx="8" cy="23" r="4" fill="#2b2622"/><path d="M9 11V5" stroke="#2b2622" stroke-width="2"/>'),
});
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const k1 = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `${n}`);

export class CentralUI {
  constructor(game) {
    this.g = game;
    this.ui = game.ui;
    const ex = document.getElementById('explore');
    if (ex && !document.getElementById('btn-campos')) {
      const b = document.createElement('button');
      b.className = 'round cam hidden'; b.id = 'btn-campos'; b.dataset.act = 'cengo'; b.setAttribute('aria-label', 'Ir a los campos y el central');
      b.innerHTML = `${ICON.factory}<span>Central</span>`;
      ex.appendChild(b);
      this.btn = b;
    }
  }
  get s() { return this.g.sim.s; }
  get sim() { return this.g.sim; }
  dev() { return !!(window.__fincaDev || import.meta.env.DEV); }

  act(a, d) {
    const sim = this.sim, ui = this.ui;
    switch (a) {
      case 'cengo': ui.closeSheet(); return this.g.viewCentral();
      case 'cenfield': return this.openField(d.id);
      case 'cenbuy': if (sim.buyField(d.id)) this.openField(d.id); else ui.refreshSheet(); return;
      case 'cenplant': if (sim.plantField(d.id, d.crop)) ui.closeSheet(); else ui.refreshSheet(); return;
      case 'cenharvest': if (sim.harvestField(d.id)) ui.closeSheet(); else ui.refreshSheet(); return;
      case 'cenff': this.g.setSpeed(20); this.g.cenFF = d.id; ui.closeSheet(); return;
      case 'cenacopio': return this.openAcopio();
      case 'censell': sim.sellInd(d.id, d.qty === 'all' ? 1e9 : +d.qty); ui.refreshSheet(); return;
      case 'cencentral': return this.openCentral();
      case 'censtage': if (sim.startStage()) ui.closeSheet(); else ui.refreshSheet(); return;
      case 'cenwood': sim.buyWood(+d.qty); ui.refreshSheet(); return;
      case 'censtill': sim.toggleStill(); ui.refreshSheet(); return;
      case 'censtation': return this.openStation();
      case 'cenload': sim.loadOrder(); ui.refreshSheet(); return;
      case 'censkip': sim.skipOrder(); ui.refreshSheet(); return;
      case 'cencheat': sim.cenCheat(d.id); ui.refreshSheet(); ui.refreshHud(); return;
      default:
    }
  }
  tapPick(kind) {
    if (kind.startsWith('field:')) return this.openField(kind.slice(6));
    if (kind === 'acopio') return this.openAcopio();
    if (kind === 'station' || kind === 'train') return this.s.ext.central.stage >= 4 ? this.openStation() : this.openTrain();
    if (kind === 'central') return this.openCentral();
  }
  btnPrice(price, act, attrs = '', label = '', wood = 0) {
    const poor = this.s.money < price || (wood && (this.s.res.madera || 0) < wood);
    return `<button class="btn ${poor ? 'poor' : ''}" data-act="${act}" ${attrs} ${poor ? 'disabled' : ''}>${label}${ICON.coin}${k1(price)}${wood ? `<span class="wd">${ICON.wood}${wood}</span>` : ''}</button>`;
  }
  cheats() {
    if (!this.dev()) return '';
    const b = (id, l) => `<button class="btn" data-act="cencheat" data-id="${id}">${l}</button>`;
    return `<h3>Trucos (desarrollo)</h3><div class="seg">${b('l25', 'Nivel 25')}${b('l32', 'Nivel 32')}${b('l35', 'Nivel 35')}${b('rich', '+250k y madera')}</div><div class="seg">${b('fields', 'Campos')}${b('central', 'Central listo')}${b('ripe', 'Madurar')}${b('cane', '+300 caña')}</div>`;
  }
  // ---------------------------------------------------------------- campo
  openField(id) {
    const f = FIELD_BY_ID[id];
    this.ui.openSheet(`Campo ${f.n} · 6×6`, () => {
      const s = this.s, sim = this.sim, c = s.ext.central, st = sim.fieldState(id), fs = c.fields[id];
      let out = '';
      if (st === 'locked' || st === 'forsale') {
        out += `<p class="note">Un bloque grande de 36 canteros que se siembra y se cosecha de una vez, con tractor y cuadrilla. La cosecha va al acopio${c.stage >= 2 ? ' y el tren lleva la caña al central' : ''}.</p>`;
        out += `<div class="row ${st === 'locked' ? 'dim' : ''}"><div class="row-ico">${ICON.field}</div><div class="row-main"><b>Comprar el campo ${f.n}</b><small>${st === 'locked' ? `Se abre en el nivel ${f.level}.` : 'Tierra colorada, lista para el tractor.'}</small></div>${st === 'locked' ? `<button class="btn locked" disabled>Nivel ${f.level}</button>` : this.btnPrice(f.price, 'cenbuy', `data-id="${id}"`)}</div>`;
        return out + this.cheats();
      }
      if (st === 'empty') {
        out += '<p class="note">Elige qué sembrar en todo el campo. La cuadrilla y el tractor lo siembran en unos segundos.</p>';
        for (const k of FIELD_CROP_ORDER) {
          const cr = FIELD_CROPS[k], lock = s.level < cr.level;
          const value = Math.round(cr.yield * IND[k].sell * WHOLESALE);
          out += `<div class="row ${lock ? 'dim' : ''}"><div class="row-ico">${ICON[k]}</div><div class="row-main"><b>${cr.name} en grande</b><small>${cr.yield} ${IND[k].plural.toLowerCase()} · crece en ${fmtTime(sim.fieldGrow(k))} · al por mayor ≈ ${k1(value)} pesos</small></div>${lock ? `<button class="btn locked" disabled>Nivel ${cr.level}</button>` : this.btnPrice(cr.seed, 'cenplant', `data-id="${id}" data-crop="${k}"`, 'Sembrar · ')}</div>`;
        }
        return out + this.cheats();
      }
      const cr = FIELD_CROPS[fs.crop];
      const p = Math.round(sim.fieldProgress(id) * 100);
      if (st === 'planting' || st === 'harvesting') {
        out += `<div class="row"><div class="row-ico">${ICON.tractor}</div><div class="row-main"><b>${st === 'planting' ? `Sembrando ${cr.name.toLowerCase()}` : `Cortando ${cr.name.toLowerCase()}`}</b><small>La cuadrilla trabaja surco a surco · ${p} %</small></div></div>`;
        out += `<div class="capbar"><b style="width:${p}%"></b></div>`;
      } else if (st === 'growing') {
        out += `<div class="row"><div class="row-ico">${ICON[fs.crop]}</div><div class="row-main"><b>${cr.name} creciendo · ${p} %</b><small>Lista en ${fmtClock(fs.at + fs.dur - now())} · dará ${cr.yield} ${IND[fs.crop].plural.toLowerCase()}</small></div><button class="btn" data-act="cenff" data-id="${id}">${ICON.ff}Adelantar</button></div>`;
      } else if (st === 'ripe') {
        out += `<div class="row sel"><div class="row-ico">${ICON[fs.crop]}</div><div class="row-main"><b>¡${cr.name} lista para cortar!</b><small>${cr.yield} ${IND[fs.crop].plural.toLowerCase()} al acopio · espacio: ${sim.indSpace()}</small></div><button class="btn primary" data-act="cenharvest" data-id="${id}">Cosechar</button></div>`;
      }
      out += `<div class="row"><div class="row-ico">${ICON.cane}</div><div class="row-main"><b>Acopio</b><small>Caña esperando: ${c.yard}${c.stage >= 2 ? ' · el tren la recoge' : ' · se vende al por mayor'}</small></div><button class="btn" data-act="cenacopio">Ver</button></div>`;
      return out + this.cheats();
    });
  }
  // ---------------------------------------------------------------- acopio y almacenes
  stockRows(keys) {
    const c = this.s.ext.central;
    return keys.map((k) => {
      const have = k === 'cane' ? c.yard : c.stock[k];
      const pay = Math.round(IND[k].sell * WHOLESALE);
      return `<div class="row ${have ? '' : 'dim'}"><div class="row-ico">${ICON[k]}</div><div class="row-main"><b>${IND[k].name}: ${have}</b><small>Al por mayor: ${pay} pesos c/u</small></div><div class="row-btns"><button class="btn" data-act="censell" data-id="${k}" data-qty="${Math.max(1, Math.ceil(have / 2))}" ${have ? '' : 'disabled'}>Mitad</button><button class="btn" data-act="censell" data-id="${k}" data-qty="all" ${have ? '' : 'disabled'}>Todo ${ICON.coin}${k1(have * pay)}</button></div></div>`;
    }).join('');
  }
  openAcopio() {
    this.ui.openSheet('Acopio · campos grandes', () => {
      const s = this.s, sim = this.sim, c = s.ext.central;
      let out = `<p class="note">Aquí llega la cosecha de los campos en carretas de bueyes. ${c.stage >= 2 ? 'El tren cañero carga la caña y la lleva al central.' : `Hasta que levantes el central (nivel ${CENTRAL_LEVEL}) la caña se vende al por mayor.`}</p>`;
      out += `<div class="capbar">${ICON.basket}<b>Ocupado: ${sim.indTotal()}/${sim.indCap()}</b><small>${c.stage >= 4 ? 'Almacenes del central' : 'Sube a 4000 con los almacenes del central'}</small></div>`;
      out += this.stockRows(['cane', 'tobacco', 'tomato']);
      if (c.stage >= 3) out += '<h3>Del central</h3>' + this.stockRows(['azucar', 'melaza', 'ron']);
      return out + this.cheats();
    });
  }
  // ---------------------------------------------------------------- central
  openCentral() {
    this.ui.openSheet('Central azucarero · obra', () => {
      const s = this.s, sim = this.sim, c = s.ext.central;
      let out = '';
      if (c.stage < STAGES.length) {
        out += `<p class="note">El central se levanta en ${STAGES.length} etapas con pesos y madera${s.level < CENTRAL_LEVEL ? `. Empieza en el nivel ${CENTRAL_LEVEL}` : ''}.</p>`;
        out += `<div class="capbar">${ICON.wood}<b>Madera: ${s.res.madera || 0}</b><small>La de la manigua sirve. Si falta, el aserrío vende a ${WOOD_PRICE} pesos.</small></div>`;
        out += `<div class="seg">${[10, 50].map((q) => this.btnPrice(q * WOOD_PRICE, 'cenwood', `data-qty="${q}"`, `+${q} madera · `)).join('')}</div>`;
      }
      STAGES.forEach((st, i) => {
        const done = c.stage > i, cur = c.stage === i, lock = s.level < st.level;
        let btn;
        if (done) btn = '<button class="btn locked" disabled>Listo</button>';
        else if (cur && c.building) btn = `<button class="btn locked" disabled>${fmtClock(c.building.at + c.building.dur - now())}</button>`;
        else if (!cur) btn = `<button class="btn locked" disabled>${lock ? `Nivel ${st.level}` : 'Después'}</button>`;
        else if (lock) btn = `<button class="btn locked" disabled>Nivel ${st.level}</button>`;
        else btn = this.btnPrice(st.price, 'censtage', '', 'Construir · ', st.wood);
        const p = cur && c.building ? Math.round(Math.min(1, (now() - c.building.at) / c.building.dur) * 100) : 0;
        out += `<div class="row ${done ? 'sel' : lock || !cur ? 'dim' : ''}"><div class="row-ico">${i === 1 ? ICON.train : ICON.factory}</div><div class="row-main"><b>${i + 1}. ${st.name}</b><small>${st.detail}${st.items ? ` · También: ${Object.entries(st.items).map(([k, n]) => `${n} ${ITEMS[k].plural.toLowerCase()}`).join(', ')}.` : ''}${cur && c.building ? ` · obra al ${p} %` : ''}</small></div>${btn}</div>`;
      });
      if (c.stage >= 3) {
        const busy = sim.millBusy();
        const mp = busy && c.millAt ? Math.round(Math.min(1, (now() - c.millAt) / MILL.time) * 100) : 0;
        out += `<h3>Molienda</h3><div class="row"><div class="row-ico">${ICON.azucar}</div><div class="row-main"><b>${busy ? `Moliendo · ${mp} %` : 'Esperando caña'}</b><small>Caña en el basculador: ${c.mill} · cada ${MILL.time} s: ${MILL.cane} caña → ${MILL.azucar} sacos de azúcar + ${MILL.melaza} barriles de melaza</small></div></div>`;
        if (c.stage >= 4) out += `<div class="row"><div class="row-ico">${ICON.ron}</div><div class="row-main"><b>Destilería ${c.still ? 'encendida' : 'apagada'}</b><small>Cada ${STILL.time} s: ${STILL.melaza} melaza → ${STILL.ron} cajas de ron</small></div><button class="switch ${c.still ? 'on' : ''}" data-act="censtill" role="switch" aria-checked="${c.still}"><i></i></button></div>`;
        out += `<div class="row"><div class="row-ico">${ICON.basket}</div><div class="row-main"><b>Almacenes</b><small>Azúcar ${c.stock.azucar} · melaza ${c.stock.melaza} · ron ${c.stock.ron} · total ${sim.indTotal()}/${sim.indCap()}</small></div><button class="btn" data-act="cenacopio">Vender</button></div>`;
      }
      if (c.stage >= 2) out += `<div class="row"><div class="row-ico">${ICON.train}</div><div class="row-main"><b>Tren cañero</b><small>${this.trainStatus()}</small></div>${c.stage >= 4 ? '<button class="btn" data-act="censtation">Estación</button>' : ''}</div>`;
      return out + this.cheats();
    });
  }
  trainStatus() {
    const tr = this.s.ext.central.train;
    const where = tr.wait > 0 ? `Parado en ${STOPS[tr.at].name.toLowerCase()}` : `Va hacia ${STOPS[tr.next].name.toLowerCase()}`;
    return `${where} · lleva ${tr.load}/${TRAIN.cap * TRAIN.wagons} de caña · ${this.s.ext.central.stats.trips} viajes`;
  }
  openTrain() {
    this.ui.openSheet('Tren cañero · vía estrecha', () => `<p class="note">Locomotora de vapor y ${TRAIN.wagons} vagones: carga la caña en el acopio y la descarga en el basculador del central. Da la vuelta solo.</p>
      <div class="row"><div class="row-ico">${ICON.train}</div><div class="row-main"><b>Ahora</b><small>${this.trainStatus()}</small></div></div>
      <div class="row"><div class="row-ico">${ICON.cane}</div><div class="row-main"><b>Acopio: ${this.s.ext.central.yard} · central: ${this.s.ext.central.mill}</b><small>${this.s.ext.central.stage >= 3 ? 'El central muele lo que llega.' : 'Falta la casa de calderas para moler.'}</small></div><button class="btn" data-act="cencentral">Central</button></div>`);
  }
  // ---------------------------------------------------------------- estación: pedidos del tren
  openStation() {
    this.ui.openSheet('Estación · pedidos del tren', () => {
      const s = this.s, sim = this.sim, c = s.ext.central, o = c.order;
      let out = `<p class="note">Los pedidos del tren son grandes y pagan mucho más que los camiones. Carga el pedido en el andén y se cobra cuando el tren pare en la estación.</p>`;
      if (!o) out += `<div class="row dim"><div class="row-ico">${ICON.train}</div><div class="row-main"><b>Sin pedido</b><small>El próximo llega en ${fmtClock(Math.max(0, c.orderAt - now()))}.</small></div></div>`;
      else {
        const items = Object.entries(o.items).map(([k, q]) => `<span class="oi ${c.stock[k] >= q || o.loaded ? 'ok' : 'no'}">${ICON[k]}${q}<small>/${o.loaded ? q : c.stock[k]}</small></span>`).join(' ');
        out += `<div class="row ${o.loaded ? 'sel' : ''}"><div class="row-ico">${ICON.train}</div><div class="row-main"><b>Tren para ${esc(o.dest)}</b><small>${items}</small><small>Paga ${ICON.coin}${k1(o.reward)} · +${o.xp} XP</small></div></div>`;
        if (o.loaded) out += '<p class="note">¡Cargado! Se cobra cuando el tren pare en la estación.</p>';
        else out += `<div class="seg"><button class="btn primary" data-act="cenload" ${sim.canFillOrder() ? '' : 'disabled'}>Cargar en el tren</button><button class="btn" data-act="censkip">No hay, siguiente</button></div>`;
      }
      out += `<div class="row"><div class="row-ico">${ICON.basket}</div><div class="row-main"><b>Almacenes</b><small>${IND_ORDER.filter((k) => k !== 'cane').map((k) => `${IND[k].name.toLowerCase()} ${c.stock[k]}`).join(' · ')}</small></div><button class="btn" data-act="cenacopio">Ver</button></div>`;
      out += `<div class="row"><div class="row-ico">${ICON.coin}</div><div class="row-main"><b>${c.stats.orders} pedidos · ${k1(c.stats.earned)} pesos</b><small>${this.trainStatus()}</small></div></div>`;
      return out + this.cheats();
    });
  }
  // ---------------------------------------------------------------- etiquetas del mundo
  labels(v) {
    const s = this.s, sim = this.sim, c = s.ext.central, t = now(), far = this.g.rig.dist > 70;
    if (s.level >= CAMPOS_LEVEL) {
      for (const f of FIELDS) {
        const st = sim.fieldState(f.id, t), x = f.x + 3, z = f.z + 3, fs = c.fields[f.id];
        if (st === 'locked') { if (f.level <= s.level + 2 && !far) v.label(`f-${f.id}`, x, 0.8, z, `Campo ${f.n} · nivel ${f.level}`, 'muted'); continue; }
        if (st === 'forsale') { v.label(`f-${f.id}`, x, 0.8, z, `Campo ${f.n} · ${ICON.coin}${k1(f.price)}`, 'sale', `cenfield|${f.id}`); continue; }
        if (st === 'empty') { if (!far) v.label(`f-${f.id}`, x, 0.8, z, `${ICON.seed}Sembrar`, '', `cenfield|${f.id}`); continue; }
        const p = Math.round(sim.fieldProgress(f.id, t) * 100);
        if (st === 'planting') v.label(`f-${f.id}`, x, 1.4, z, `${ICON.tractor}Sembrando ${p}%`, 'mini');
        else if (st === 'harvesting') v.label(`f-${f.id}`, x, 2.0, z, `${ICON[fs.crop]}Cortando ${p}%`, 'mini');
        else if (st === 'ripe') v.label(`f-${f.id}`, x, 2.0, z, `${ICON[fs.crop]}¡Lista!`, 'ready', `cenfield|${f.id}`);
        else if (!far) v.label(`f-${f.id}`, x, 1.8, z, `${ICON[fs.crop]}${fmtClock(fs.at + fs.dur - t)}`, 'mini', `cenfield|${f.id}`);
      }
      v.label('acopio', BLOCKS.acopio.x + 2, 3.3, BLOCKS.acopio.z + 1.5, `<span class="lt">Acopio</span>${ICON.cane}${c.yard}`, '', 'cenacopio');
    }
    const B = BLOCKS.mill;
    if (c.stage < STAGES.length && (s.level >= CENTRAL_LEVEL - 3 || c.stage)) {
      const st = STAGES[c.stage];
      const txt = c.building ? `${ICON.factory}${st.name.split(' ')[0]} · ${fmtClock(c.building.at + c.building.dur - t)}` : s.level < st.level ? `Central · etapa ${c.stage + 1} · nivel ${st.level}` : `${ICON.factory}Construir: ${st.name.toLowerCase()}`;
      v.label('central', B.x + B.w / 2, c.stage >= 3 ? 5 : 1.6, B.z + B.h / 2, txt, c.building ? '' : s.level < st.level ? 'muted' : 'sale', 'cencentral');
    } else if (c.stage >= 3) {
      v.label('central', B.x + 3.4, 4.8, B.z + 2.6, sim.millBusy() ? `${ICON.azucar}Moliendo · ${c.mill}` : `${ICON.factory}Central · sin caña`, sim.millBusy() ? '' : 'muted', 'cencentral');
    }
    if (c.stage >= 4) {
      const o = c.order;
      const html = o ? `<span class="lt">Tren</span>${Object.entries(o.items).map(([k, q]) => `${ICON[k]}${q}`).join(' ')}<span class="pay">${ICON.coin}${k1(o.reward)}</span>${o.loaded ? '<span class="go">¡Cargado!</span>' : sim.canFillOrder() ? '<span class="go">¡Listo!</span>' : ''}` : `<span class="lt">Estación</span>${fmtClock(Math.max(0, c.orderAt - t))}`;
      v.label('station', BLOCKS.station.x + 4.5, 3.2, BLOCKS.station.z + 1.5, html, o && (o.loaded || sim.canFillOrder()) ? 'ready' : '', 'censtation');
    }
    if (c.stage >= 2 && c.train.load > 0 && !far && v.loco) {
      const p = v.loco.position;
      v.label('train', p.x, 2.6, p.z, `${ICON.cane}${c.train.load}`, 'mini');
    }
  }
  refreshButton() {
    if (!this.btn) return;
    const show = this.s.level >= CAMPOS_LEVEL - 1 || this.s.ext.central?.owned.length > 0;
    this.btn.classList.toggle('hidden', !show);
  }
}
