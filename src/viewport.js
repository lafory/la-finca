// Tamaño de la parte VISIBLE de la pantalla (Safari en iPhone esconde parte detrás de sus barras).
// Se publica en --app-w / --app-h para que el CSS nunca se salga de lo que se ve.
const ua = navigator.userAgent || '';
export const IS_IOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
export const STANDALONE = navigator.standalone === true
  || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches;
// En iOS solo hay pantalla completa abriendo desde la pantalla de inicio.
export const CAN_FULLSCREEN = !IS_IOS && !STANDALONE
  && !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);

export function viewSize() {
  const vv = window.visualViewport;
  const de = document.documentElement;
  let w = window.innerWidth || de.clientWidth, h = window.innerHeight || de.clientHeight;
  if (vv && vv.scale <= 1.01) { w = vv.width; h = vv.height; }
  return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}
let last = '';
export function applyViewport() {
  const { w, h } = viewSize();
  const key = `${w}x${h}`;
  if (key !== last) {
    last = key;
    const s = document.documentElement.style;
    s.setProperty('--app-w', `${w}px`);
    s.setProperty('--app-h', `${h}px`);
  }
  // si Safari desplazó la página (barra de direcciones), volver arriba
  if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
  return { w, h };
}
export function watchViewport(cb) {
  const run = () => { const v = applyViewport(); cb?.(v); };
  window.addEventListener('resize', run);
  window.addEventListener('orientationchange', () => { run(); setTimeout(run, 250); setTimeout(run, 700); });
  window.visualViewport?.addEventListener('resize', run);
  window.visualViewport?.addEventListener('scroll', run);
  // Safari ignora user-scalable=no: bloquear el zoom de página con gestos
  for (const ev of ['gesturestart', 'gesturechange']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
  document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
  applyViewport();
}
if (STANDALONE) document.documentElement.classList.add('standalone');
if (IS_IOS) document.documentElement.classList.add('ios');
applyViewport();
