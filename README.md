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
node tests/v4.mjs           # v4: manigua (leña, frutas, animales), batey, leñero → screenshots/v4-*.png y v4-report.json
npm run smoke               # escritorio, iPad, teléfono vertical y horizontal → screenshots/v2-*.png y smoke-report-v2.json
node tests/showcase.mjs     # capturas de una finca avanzada
node tests/fullscreen.mjs   # pantalla completa: Android (al tocar «Entrar»), botón, computadora
node tests/ios.mjs          # iPhone/iPad Safari (WebKit): cabe en pantalla, pista «Añadir a pantalla de inicio»
node --test tests/savecode.test.mjs && node tests/savecode.mjs   # guardar partida: código y archivo .lafinca
node tests/granja.mjs       # granja grande: gallinero 1–4, surcos, potrero, batey → screenshots/granja-*.png
node tests/central.mjs      # campos grandes, central y tren (usa ?dev=1)
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
- **Salir de la finca (v4):** el mundo ahora mide 88×80 casillas. Por el **camino del sur** se llega a:
  - **La manigua** (nivel 3, al este): monte con guásimas, marabú, ceibas, palmas reales, mangos, guayabos, cocoteros, un arroyo con
    pasos de piedra y mogotes. Toca un árbol y el guajiro lo tumba con el machete (**leña**; vuelve a crecer). Toca frutales para
    recoger mangos, guayabas y cocos. Atrapa jutías, puercos jíbaros, guineas y gallinas perdidas (hasta 3 en brazos) y doma el
    caballo cimarrón (3 intentos): al volver a la finca se entregan solos (gallinas/guineas al corral, jíbaro al chiquero, el
    caballo hace caminar más rápido). Botones **Manigua** / **Batey** (arriba a la izquierda) y **Volver a la finca** cuando estás fuera.
  - **El batey** (nivel 5, al sur): bohíos (y luego casas de zinc) con pesos + leña; cada casa sube el tope de trabajadores
    (empiezas con 4). La bodega (semillas y gallinas −15 %), la escuelita (+10 % XP) y la iglesita (+5 % en pedidos). Los
    trabajadores sin tarea se van a descansar a su casa del batey.
  - **Leña:** recurso nuevo (tope 500) que piden los corrales, el trapiche y las casas. **Tato, el leñero** (nivel 4) va solo a la
    manigua, tumba 3 árboles y trae la leña al bohío.
  - Próximamente: los campos grandes (6×6, nivel 18) y el central azucarero con su tren (nivel 28).
  - Partidas v3 se migran sin perder nada. Trucos de desarrollo (solo `npm run dev`): Ajustes → +1 nivel / +pesos / +leña.
- **Granja grande (`src/granja/`):**
  - **Gallinero por niveles** (Terreno y obras → Granja): 1 gallinero (4 gallinas), 2 ampliado (8, nivel 3; es la «Ampliación» de la
    tienda), 3 de zinc (12, nivel 6: sombra de zinc con perchas), 4 granja avícola (16, nivel 10: segunda caseta). El corral crece y
    cada nivel pone más nidales y huevos más seguidos.
  - **Surcos:** los canteros son lomos de tierra colorada con las matas encima; los vecinos forman surcos largos. «Arar surcos» abre
    campos nuevos en tu tierra libre tocando el suelo (bloques de 1×1 a 4×4, 3 pesos por cantero, hasta 600).
  - **Vacas** más grandes (holandesa pinta, criolla colorada y cebú con giba). El corral se amplía a potrero mediano (4 vacas, nivel 10)
    y grande (6 vacas y rancho de ordeño, nivel 14), con más leche por ordeño.
  - **Batey más grande:** calles nuevas, 4 solares más (casas 9–12), placita del dominó (−5 %), consultorio (+5 % XP), panadería
    (+5 % en pedidos) y un tercer nivel de casa: **mampostería** (+3 trabajadores).
- **Guardar partida** (Ajustes): copiar/pegar un código `LF1.…` o descargar/cargar un archivo `.lafinca`; antes de reemplazar se guarda
  una copia que se puede restaurar.
- **Calidad gráfica:** Ajustes → Auto / Alta / Media / Baja. En Auto baja sola si el cuadro tarda > 25 ms.
- Pantalla completa: botón ⛶ arriba (Android/escritorio); en iPhone, "Añadir a pantalla de inicio" abre a pantalla completa.

## Estructura
- `src/data.js` – economía, niveles, mapa (cuadrícula 22×18), parcelas.
- `src/state.js` – estado, guardado en localStorage (`lafinca-v2`), cuadrícula de bloqueos.
- `src/zones.js` – zonas del mundo (camino, manigua, batey, campos, central), plantas y animales del monte (datos).
- `src/sim-v4.js` / `src/world-v4.js` – lógica y vistas (perezosas, por trozos instanciados con LOD) de las zonas de fuera.
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
