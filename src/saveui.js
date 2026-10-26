// Ajustes → «Guardar partida»: copiar/pegar código y descargar/cargar archivo .lafinca.
// Todo local: sin cuenta. Antes de reemplazar la finca se guarda una copia para poder volver atrás.
import { SAVE_KEY } from './data.js';
import { save } from './state.js';
import { encodeCode, decodeCode, encodeFile, decodeFile, summary, fileName, validSave, CodeError } from './savecode.js';
import { registerAct } from './registry.js';

export const BACKUP_KEY = 'lafinca-v2-backup';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (ms) => { try { return new Date(ms).toLocaleString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
const $ = (s) => document.querySelector(s);

export function readBackup() {
  try { const b = JSON.parse(localStorage.getItem(BACKUP_KEY) || 'null'); return b && validSave(b.save) ? b : null; } catch { return null; }
}

// Partida actual (recién guardada) como objeto plano.
function current(g) { save(g.sim.s); return JSON.parse(JSON.stringify(g.sim.s)); }

function copyFallback(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px;';
  document.body.appendChild(ta);
  ta.focus(); ta.select(); ta.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}

export function settingsSection(ui) {
  const b = readBackup();
  return `<h3>Guardar partida</h3>
    <p class="note">Copia tu finca en un código o en un archivo para pasarla a otro teléfono o tenerla guardada por si acaso.</p>
    <div class="seg"><button class="btn" data-act="code-copy">Copiar código</button><button class="btn" data-act="code-paste">Pegar código</button></div>
    <div class="seg"><button class="btn" data-act="file-save">Descargar archivo</button><button class="btn" data-act="file-load">Cargar archivo</button></div>
    ${b ? `<div class="row"><div class="row-ico">↺</div><div class="row-main"><b>Copia anterior</b><small>Nivel ${summary(b).level} · ${summary(b).money} pesos · ${esc(fmtDate(b.at))}</small></div><button class="btn" data-act="backup-restore">Restaurar</button></div>` : ''}`;
}

export class SaveTransfer {
  constructor(ui) { this.ui = ui; this.g = ui.g; this.pending = null; }

  async copyCode() {
    let code;
    try { code = encodeCode(current(this.g)); } catch (e) { return this.ui.toast(e.message || 'No se pudo crear el código.'); }
    let ok = false;
    try { if (navigator.clipboard?.writeText && window.isSecureContext) { await navigator.clipboard.writeText(code); ok = true; } } catch { ok = false; }
    if (!ok) ok = copyFallback(code);
    this.ui.modal(`<h2>Código de tu finca</h2>
      <p>${ok ? '¡Copiado! Pégalo en otro teléfono en Ajustes → <b>Pegar código</b>.' : 'Mantén el dedo sobre el código, elige <b>Seleccionar todo</b> y luego <b>Copiar</b>.'}</p>
      <textarea class="codebox" id="code-out" readonly rows="5" aria-label="Código de la partida">${esc(code)}</textarea>
      <p class="small">${code.length.toLocaleString('es')} letras · guárdalo completo, de “LF1.” hasta el final.</p>
      <div class="modal-btns">${navigator.share ? '<button class="btn" data-act="code-share">Compartir</button>' : ''}<button class="btn primary" data-act="modal-close">Listo</button></div>`);
    this.lastCode = code;
    const ta = $('#code-out');
    ta.addEventListener('focus', () => { ta.select(); ta.setSelectionRange(0, code.length); });
    return ok;
  }
  share() { navigator.share?.({ title: 'La Finca', text: this.lastCode }).catch(() => {}); }

  pasteCode() {
    this.ui.closeSheet();
    this.ui.modal(`<h2>Pegar código</h2>
      <p>Pega aquí el código de tu finca (empieza por “LF1.”).</p>
      <textarea class="codebox edit" id="code-in" rows="5" placeholder="LF1.…" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Código de la partida"></textarea>
      <p class="code-err hidden" id="code-err" role="alert"></p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button>${navigator.clipboard?.readText ? '<button class="btn" data-act="code-clip">Pegar</button>' : ''}<button class="btn primary" data-act="code-check">Revisar</button></div>`);
  }
  async fromClipboard() {
    try { const t = await navigator.clipboard.readText(); $('#code-in').value = t; this.check(); } catch { $('#code-in').focus(); }
  }
  check() {
    try { this.preview(decodeCode($('#code-in').value)); } catch (e) { this.showErr(e); }
  }
  showErr(e) {
    const el = $('#code-err');
    const msg = e instanceof CodeError ? e.message : 'No se pudo leer esa partida.';
    if (el) { el.textContent = msg; el.classList.remove('hidden'); } else this.ui.toast(msg);
  }

  preview(env) {
    this.pending = env;
    const n = summary(env), s = this.g.sim.s;
    this.ui.modal(`<h2>¿Usar esta partida?</h2>
      <div class="row"><div class="row-main"><b>Nivel ${n.level} · ${n.money.toLocaleString('es')} pesos</b><small>${n.workers} trabajador${n.workers === 1 ? '' : 'es'}${n.at ? ` · guardada el ${esc(fmtDate(n.at))}` : ''}</small></div></div>
      <p>Reemplaza tu finca de ahora (nivel ${s.level}, ${s.money.toLocaleString('es')} pesos). Se guarda una copia de la de ahora y la puedes restaurar en Ajustes.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn primary" data-act="code-apply">Usar esta partida</button></div>`);
  }

  // Guarda copia de la actual, escribe la nueva y recarga.
  apply(env = this.pending) {
    if (!env || !validSave(env.save)) return;
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify({ app: 'la-finca', f: 1, at: Date.now(), save: current(this.g) }));
      localStorage.setItem(SAVE_KEY, JSON.stringify(env.save));
    } catch { return this.ui.toast('No hay espacio para guardar la partida en este teléfono.'); }
    this.g.resetting = true; // que pagehide no la pise
    location.reload();
  }

  confirmRestore() {
    const b = readBackup();
    if (!b) return;
    this.ui.closeSheet();
    const n = summary(b);
    this.pending = b;
    this.ui.modal(`<h2>¿Restaurar la copia anterior?</h2>
      <p>Vuelves a la finca de nivel ${n.level} con ${n.money.toLocaleString('es')} pesos (${esc(fmtDate(b.at))}). La de ahora queda como copia.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn primary" data-act="code-apply">Restaurar</button></div>`);
  }

  downloadFile() {
    let text, name;
    try { const s = current(this.g); text = encodeFile(s); name = fileName(s); } catch (e) { return this.ui.toast(e.message || 'No se pudo crear el archivo.'); }
    const url = URL.createObjectURL(new Blob([text], { type: 'application/octet-stream' }));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    this.ui.toast(`Archivo «${name}» descargado.`);
    return name;
  }

  pickFile() {
    let inp = $('#file-in');
    if (!inp) {
      inp = document.createElement('input');
      inp.type = 'file'; inp.id = 'file-in'; // sin accept: en iPhone .lafinca saldría gris
      inp.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;';
      inp.addEventListener('change', () => { const f = inp.files?.[0]; inp.value = ''; if (f) this.readFile(f); });
      document.body.appendChild(inp);
    }
    inp.click();
  }
  async readFile(f) {
    if (f.size > 5 * 1024 * 1024) return this.ui.toast('Ese archivo es demasiado grande para ser una partida.');
    try { this.ui.closeSheet(); this.preview(decodeFile(await f.text())); } catch (e) { this.ui.toast(e instanceof CodeError ? e.message : 'No se pudo leer ese archivo.'); }
  }
}

const T = (ui) => (ui.saves ||= new SaveTransfer(ui));
registerAct('code-copy', (ui) => T(ui).copyCode());
registerAct('code-share', (ui) => T(ui).share());
registerAct('code-paste', (ui) => T(ui).pasteCode());
registerAct('code-clip', (ui) => T(ui).fromClipboard());
registerAct('code-check', (ui) => T(ui).check());
registerAct('code-apply', (ui) => T(ui).apply());
registerAct('backup-restore', (ui) => T(ui).confirmRestore());
registerAct('file-save', (ui) => T(ui).downloadFile());
registerAct('file-load', (ui) => T(ui).pickFile());
