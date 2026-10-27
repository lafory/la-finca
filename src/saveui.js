// Ajustes → «Guardar partida»: copiar/pegar código y descargar/cargar archivo .lafinca.
// Todo local: sin cuenta. Antes de reemplazar la finca se guarda una copia para poder volver atrás.
import { SAVE_KEY } from './data.js';
import { save, RESCUE_KEY } from './state.js';
import { encodeCode, decodeAny, encodeFile, summary, fileName, validSave, CodeError } from './savecode.js';
import { registerAct } from './registry.js';
import { IS_IOS } from './viewport.js';

export const BACKUP_KEY = 'lafinca-v2-backup';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (ms) => { try { return new Date(ms).toLocaleString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
const $ = (s) => document.querySelector(s);

// Partida que no se pudo abrir (se guardó aparte en lugar de borrarla).
export function readRescue() {
  try {
    const raw = localStorage.getItem(RESCUE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return validSave(d) ? { app: 'la-finca', f: 1, at: (+d.savedAt || 0) * 1000 - (+d.clockOffset || 0) * 1000 || null, save: d, rescue: true } : null;
  } catch { return null; }
}
export function readBackup() {
  try { const b = JSON.parse(localStorage.getItem(BACKUP_KEY) || 'null'); return b && validSave(b.save) ? b : null; } catch { return null; }
}

// Partida actual (recién guardada) como objeto plano.
// En una finca de provincia, lo guardado es la partida entera (finca principal con las provincias dentro).
function current(g) { save(g.sim.s); try { const raw = localStorage.getItem(SAVE_KEY); if (raw) return JSON.parse(raw); } catch { /* sin almacenamiento */ } return JSON.parse(JSON.stringify(g.sim.s)); }

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

let UI = null;
export function settingsSection(ui) {
  UI = ui;
  const b = readBackup();
  const r = readRescue();
  return `<h3>Guardar partida</h3>
    ${r ? `<div class="row"><div class="row-ico">⚠</div><div class="row-main"><b>Partida guardada aparte</b><small>No abrió antes · Nivel ${summary(r).level} · ${summary(r).money} pesos</small></div><button class="btn" data-act="rescue-restore">Restaurar</button></div>` : ''}
    <p class="note">Copia tu finca en un código o en un archivo para pasarla a otro teléfono o tenerla guardada por si acaso.</p>
    <div class="seg"><button class="btn" data-act="code-copy">Copiar código</button><button class="btn" data-act="code-paste">Pegar código</button></div>
    <div class="seg"><button class="btn" data-act="file-save">Descargar archivo</button><label class="btn filebtn" for="file-in">Cargar archivo<input type="file" id="file-in" class="file-in" aria-label="Cargar archivo de partida"></label></div>
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
      <p>Pega aquí el código de tu finca (empieza por “LF1.”). En iPad: mantén el dedo en el cuadro y toca <b>Pegar</b>.</p>
      <textarea class="codebox edit" id="code-in" rows="5" placeholder="LF1.…" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Código de la partida"></textarea>
      <p class="code-err hidden" id="code-err" role="alert"></p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button>${navigator.clipboard?.readText ? '<button class="btn" data-act="code-clip">Pegar</button>' : ''}<button class="btn primary" data-act="code-check">Revisar</button></div>`);
  }
  async fromClipboard() {
    const box = $('#code-in');
    try {
      const t = await navigator.clipboard.readText();
      if (!t || !t.trim()) throw new Error('vacío');
      box.value = t; this.check();
    } catch {
      // Safari puede negar el permiso o no tener nada copiado: pegar a mano.
      box.focus();
      this.showErr(new CodeError('No pude leer el portapapeles. Mantén el dedo en el cuadro, toca «Pegar» y luego «Revisar».'));
    }
  }
  check() {
    try { this.preview(decodeAny($('#code-in').value)); } catch (e) { this.showErr(e); }
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
      if (env.rescue) localStorage.removeItem(RESCUE_KEY); // si vuelve a fallar, el aviso de arranque la guarda otra vez
    } catch { return this.ui.toast('No hay espacio para guardar la partida en este teléfono.'); }
    this.g.resetting = true; // que pagehide no la pise
    location.reload();
  }

  confirmRestore(which) {
    const b = which === 'rescue' ? readRescue() : readBackup();
    if (!b) return;
    this.ui.closeSheet();
    const n = summary(b);
    this.pending = b;
    this.ui.modal(`<h2>¿Restaurar la copia anterior?</h2>
      <p>Vuelves a la finca de nivel ${n.level} con ${n.money.toLocaleString('es')} pesos${b.at ? ` (${esc(fmtDate(b.at))})` : ''}. La de ahora queda como copia.</p>
      <div class="modal-btns"><button class="btn" data-act="modal-close">Cancelar</button><button class="btn primary" data-act="code-apply">Restaurar</button></div>`);
  }

  downloadFile() {
    let text, name;
    try { const s = current(this.g); text = encodeFile(s); name = fileName(s); } catch (e) { return this.ui.toast(e.message || 'No se pudo crear el archivo.'); }
    // iPhone/iPad: hoja de compartir con «Guardar en Archivos» (Safari a veces abre el blob en otra pestaña).
    if (IS_IOS && typeof File === 'function' && navigator.canShare && navigator.share) {
      try {
        const file = new File([text], name, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'La Finca' })
            .then(() => this.ui.toast('Listo. Para cargarla: Ajustes → Cargar archivo.'))
            .catch((e) => { if (e?.name !== 'AbortError') this.anchorDownload(text, name, true); });
          return name;
        }
      } catch { /* sigue con descarga normal */ }
    }
    this.anchorDownload(text, name, IS_IOS);
    return name;
  }
  anchorDownload(text, name, explain) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/octet-stream' }));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    if (!explain) return this.ui.toast(`Archivo «${name}» descargado.`);
    this.ui.closeSheet();
    this.ui.modal(`<h2>Archivo descargado</h2>
      <p>Lo encuentras en la app <b>Archivos</b> → <b>Descargas</b> como «${esc(name)}». Si Safari lo abrió en otra pestaña o no aparece, usa <b>Copiar código</b>: funciona igual.</p>
      <div class="modal-btns"><button class="btn" data-act="code-copy">Copiar código</button><button class="btn primary" data-act="modal-close">Listo</button></div>`);
  }

  // El botón «Cargar archivo» es un <label> con el <input type=file> real encima (opacidad 0):
  // el toque cae directo en el input. En iPad el selector es un globo anclado al input; si el input
  // está fuera de pantalla (left:-9999px) el globo no aparece. Sin «accept»: iOS pondría en gris
  // los .lafinca (y los renombrados .json/.txt). Se valida el contenido, no la extensión.
  pickFile() { $('#file-in')?.click(); }
  async onPicked(inp) {
    const f = inp.files && inp.files[0];
    if (!f) return;
    let text;
    try { text = await readText(f); } catch (e) { inp.value = ''; return this.fail(e); }
    inp.value = ''; // permite elegir el mismo archivo otra vez
    this.fromText(text);
  }
  async readFile(f) {
    try { this.fromText(await readText(f)); } catch (e) { this.fail(e); }
  }
  fromText(text) {
    try { const env = decodeAny(text); this.ui.closeSheet(); this.preview(env); } catch (e) { this.fail(e); }
  }
  fail(e) {
    const msg = e instanceof CodeError ? e.message : 'No se pudo leer ese archivo.';
    this.ui.closeSheet();
    this.ui.modal(`<h2>No se pudo cargar</h2>
      <p class="code-err" role="alert">${esc(msg)}</p>
      <p class="small">Elige el archivo de La Finca (termina en .lafinca; si iPad lo guardó como .json o .txt también vale). También puedes usar <b>Pegar código</b>.</p>
      <div class="modal-btns"><button class="btn" data-act="code-paste">Pegar código</button><button class="btn primary" data-act="modal-close">Cerrar</button></div>`);
  }
}

// Lee el archivo como texto: file.text() y, si falla (iPadOS viejo / iCloud), FileReader.
export async function readText(f) {
  if (!f) throw new CodeError('No se eligió ningún archivo.');
  if (f.size > 5 * 1024 * 1024) throw new CodeError('Ese archivo es demasiado grande para ser una partida.');
  if (f.size === 0) throw new CodeError('El archivo está vacío. Si está en iCloud, ábrelo primero en la app Archivos para que se descargue.');
  if (typeof f.text === 'function') { try { return await f.text(); } catch { /* prueba FileReader */ } }
  return new Promise((res, rej) => {
    try {
      const r = new FileReader();
      r.onload = () => res(String(r.result || ''));
      r.onerror = () => rej(new CodeError('No se pudo abrir el archivo. Si está en iCloud, ábrelo primero en la app Archivos y vuelve a intentarlo.'));
      r.readAsText(f);
    } catch { rej(new CodeError('No se pudo abrir el archivo.')); }
  });
}

// El input vive dentro de la hoja de Ajustes (se vuelve a pintar): escuchar en document.
if (typeof document !== 'undefined') {
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t && t.id === 'file-in' && UI) T(UI).onPicked(t);
  });
}

const T = (ui) => (ui.saves ||= new SaveTransfer(ui));
registerAct('code-copy', (ui) => T(ui).copyCode());
registerAct('code-share', (ui) => T(ui).share());
registerAct('code-paste', (ui) => T(ui).pasteCode());
registerAct('code-clip', (ui) => T(ui).fromClipboard());
registerAct('code-check', (ui) => T(ui).check());
registerAct('code-apply', (ui) => T(ui).apply());
registerAct('backup-restore', (ui) => T(ui).confirmRestore());
registerAct('rescue-restore', (ui) => T(ui).confirmRestore('rescue'));
registerAct('file-save', (ui) => T(ui).downloadFile());
registerAct('file-load', (ui) => T(ui).pickFile());
