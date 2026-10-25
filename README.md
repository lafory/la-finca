# La Finca · Campo adentro

Juego cozy de granja cubana (estilo Township/Hay Day) en 3D isométrico con materiales PBR procedurales. Three.js + Vite, sin assets externos
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
node tests/v3.mjs           # v3: contratar, ⏩, noche → screenshots/v3-*.png
node tests/v31.mjs          # v3.1: finca grande, obstáculos, obras, cámara → screenshots/v31-*.png
node tests/camionero.mjs    # camionero automático: cargar, despedir, venta suelta → screenshots/cam-*.png
npm run smoke               # escritorio, iPad, teléfono vertical y horizontal → screenshots/v2-*.png y smoke-report-v2.json
node tests/showcase.mjs     # capturas de una finca avanzada
```
Alternativa sin Vite para servir `dist/`: `npx serve dist -l 4173` o `python3 -m http.server 4173 -d dist`.

## GitHub Pages
`vite.config.js` usa `base: './'`, así que `dist/` funciona tal cual bajo cualquier subruta
(`https://lafory.github.io/la-finca/`). La rama `gh-pages` contiene el build; `main` el código.

## Cómo se juega
- **Toca** el suelo para caminar; toca huevos, canteros, el camión o el fogón y el guajiro va y lo usa.
- **Teclado:** WASD/flechas para caminar, E/Espacio/Enter para usar, +/− para zoom.
- **Cámara:** arrastra para mover la vista, pellizca o usa la rueda (o pellizco del trackpad) para acercar/alejar.
- Joystick en pantalla opcional (Ajustes). Botón "Usar" contextual en táctil (Recoger / Sembrar / Regar / Cosechar / Camión).
- **Fila de camiones:** 3–4 camiones viejos esperan en el camino. Toca el primero: "Cargar" (todo o lo que tengas;
  paga al completar el pedido) o "No tenemos, siguiente" (sin penalización: se va y avanza la fila; llega otro al final).
  Al principio piden sobre todo huevos, así puedes vender huevos y comprar semillas mientras crecen los tomates.
  También hay "Venta suelta" a precio normal.
- **Trabajadores** (botón en la barra inferior): Pancho (recolector, 30 pesos, nivel 1), Yoel (regador), María (sembradora,
  puede comprar semillas sola), Cachita (cosechadora), Caridad (cocinera), Chucho (camionero). Pago único, mejora de rapidez ★1–3,
  despedir con confirmación. Toca a un trabajador para ver qué hace.
- **Chucho, el camionero — "Vende a los camiones por ti"** (nivel 2, 45 pesos, destacado arriba en Trabajadores): espera en el andén,
  va al bohío por lo que pide el camión, lo trae en una caja (se ve caminando con ella), carga y cobra. Si el camión pide lo que no hay,
  espera 20 s de juego por si llega mercancía y luego lo despide. Opcional en su ficha: "Vender lo que sobra" (Sí/No) y
  "Guardar X de cada cosa" (5/10/20/40): vende suelto lo que pase de X, sin tocar lo que piden los camiones de la fila.
- **Adelantar el tiempo (⏩):** botón arriba: x1 → x5 → x20. Todo avanza (cultivos, huevos, fogón, trabajadores, camiones) en
  subpasos fijos de 0.1 s de juego. Ciclo de día y noche con farol en el bohío y sombras de nubes. Al tocar una mata que crece
  aparece "Adelantar" (x20 hasta que madura). El reloj adelantado se guarda (`clockOffset`), así que el progreso offline sigue igual.
- **Finca grande (v3.1):** mapa de 46×40 casillas (≈4.6× el original) con 22 pedazos de tierra. Se compra la tierra de al
  lado (pegada al camino o a lo tuyo), de nivel 2 a 22 y de 90 a 5 000 pesos. Las tierras nuevas traen piedras, marabú y tocones:
  tócalos para quitarlos (cuesta unos pesos, da XP y a veces destapa un cantero). Botón **Terreno** → "Terreno y obras".
- **Obras:** segundo andén para camiones (N6), corral de vacas → leche (N8), chivos → queso (N9), pozo con molino (riego dura más, N10),
  corral de cerdos → carne (N11), trapiche → melao y azúcar con caña (N12), segundo gallinero (N13), segundo fogón (N14) y
  casa de curar tabaco → puros (N15). Cada obra va en su solar dentro de su tierra.
- **Cámara:** "Ver finca" (a la derecha) encuadra toda la tierra tuya; "Centrar" vuelve a la vista cercana sobre el guajiro.
  El límite de alejar y de mover la vista crece (con animación) cada vez que compras tierra.
- **Calidad gráfica:** Ajustes → Auto / Alta / Media / Baja. En Auto baja sola si el cuadro tarda > 25 ms.
- Pantalla completa: botón ⛶ arriba (Android/escritorio); en iPhone, "Añadir a pantalla de inicio" abre a pantalla completa.

## Estructura
- `src/data.js` – economía, niveles, mapa (cuadrícula 22×18), parcelas.
- `src/state.js` – estado, guardado en localStorage (`lafinca-v2`), cuadrícula de bloqueos.
- `src/sim.js` – lógica: jugador, gallinas, huevos, canteros, riego, camión y pedidos, fogón, trabajadores, XP.
- `src/world.js` / `src/models.js` – escena Three.js (MeshStandardMaterial, ACES, sombras PCF, niebla, cielo) y modelos procedurales.
- `src/shaders.js` – detalle procedural por material (madera, guano, metal oxidado, zinc, follaje, tierra roja) y viento.
- `src/textures.js` – texturas en canvas (suelo pintado con huellas de goma, hierba, sombras de contacto, cielo).
- `CREDITS.md` – créditos (sin assets externos).
- `src/camera.js` / `src/input.js` – cámara con zoom/paneo suavizado y limitado; toques, pellizco, rueda, teclado.
- `src/ui.js` – HUD, hojas (Tienda, Terreno, Canasta, Camión, Fogón, Ajustes), tutorial con flecha, etiquetas del mundo.
- `src/audio.js` – efectos WebAudio y música guajira procedural (6/8: tres, guitarra, güiro, clave).
- `reference/` – copia del prototipo original y el prompt original del usuario.
- `DESIGN.md` – plan de diseño.
