# La Finca · Campo adentro

Juego cozy de granja cubana (estilo Township/Hay Day) en 3D low-poly isométrico. Three.js + Vite, sin assets externos
(todo el arte, la música y los sonidos son procedurales). Todo el texto del juego está en español.

## Requisitos
- Node.js 20+ y npm.

## Comandos (para QA)
```bash
cd /workspace/la-finca
npm install                 # una vez

# Servidor de desarrollo (recarga en caliente) → http://localhost:5173/
npm run dev

# Build de producción → carpeta dist/
npm run build

# Servir el build de producción → http://localhost:4173/
npm run preview             # = vite preview --host 0.0.0.0 --port 4173 --strictPort

# Prueba de humo headless (con el preview corriendo en :4173)
npm run smoke               # capturas en screenshots/, informe en screenshots/smoke-report.json
node tests/showcase.mjs     # capturas de una finca avanzada
```
Alternativa sin Vite para servir `dist/`: `npx serve dist -l 4173` o `python3 -m http.server 4173 -d dist`.

## GitHub Pages
`vite.config.js` usa `base: './'`, así que `dist/` funciona tal cual bajo cualquier subruta
(`https://usuario.github.io/la-finca/`). No se ha publicado nada todavía.

## Cómo se juega
- **Toca** el suelo para caminar; toca huevos, canteros, el camión o el fogón y el guajiro va y lo usa.
- **Teclado:** WASD/flechas para caminar, E/Espacio/Enter para usar, +/− para zoom.
- **Cámara:** arrastra para mover la vista, pellizca o usa la rueda (o pellizco del trackpad) para acercar/alejar.
- Joystick en pantalla opcional (Ajustes). Botón "Usar" contextual en táctil (Recoger / Sembrar / Regar / Cosechar / Camión).
- Pantalla completa: botón ⛶ arriba (Android/escritorio); en iPhone, "Añadir a pantalla de inicio" abre a pantalla completa.

## Estructura
- `src/data.js` – economía, niveles, mapa (cuadrícula 22×18), parcelas.
- `src/state.js` – estado, guardado en localStorage (`lafinca-v2`), cuadrícula de bloqueos.
- `src/sim.js` – lógica: jugador, gallinas, huevos, canteros, riego, camión y pedidos, fogón, trabajadores, XP.
- `src/world.js` / `src/models.js` – escena Three.js y modelos low-poly procedurales.
- `src/camera.js` / `src/input.js` – cámara con zoom/paneo suavizado y limitado; toques, pellizco, rueda, teclado.
- `src/ui.js` – HUD, hojas (Tienda, Terreno, Canasta, Camión, Fogón, Ajustes), tutorial con flecha, etiquetas del mundo.
- `src/audio.js` – efectos WebAudio y música guajira procedural (6/8: tres, guitarra, güiro, clave).
- `reference/` – copia del prototipo original y el prompt original del usuario.
- `DESIGN.md` – plan de diseño.
