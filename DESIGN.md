# La Finca — Campo Adentro · Plan de diseño (v1)

Base spec: `reference/original-prompt.md` (Township-style Cuban farm, player-controlled guajiro,
rundown-but-charming finca). Prototype reference: `reference/` (live build of moss-amber-gem-meadow.grok.me).

## 0. Requisitos base (prompt original del usuario + QA)
- Estilo Township: vista isométrica, el jugador **controla un personaje** (guajiro) con teclado o toque.
- Bucle pedido: gallinas → huevos → camión → pesos → tierra; semillas → sembrar → crecer → cosechar → camión;
  procesado (tomate → kétchup); trabajadores que siembran, recogen y procesan; dinero simple y mejoras.
- Tema cubano: banderas (pocas y con gusto: 1 en mástil + 1 en el bohío), palmas reales, finca **gastada**
  (madera desteñida, pintura caída, cercas parchadas, zinc y camión oxidados) pero limpia y legible.
- QA del prototipo (`/workspace/qa/baseline/bugs.md`): zoom/paneo en todo, mapa que llena la pantalla, horizontal
  usable, progresión más larga, pedidos, tutorial con flecha que sigue el estado real, textos con tiempos reales,
  progreso offline, "Empezar de cero" en Ajustes con confirmación, "kétchup", sin "Cocina quieta".
- **Pantalla completa**: canvas al 100 % (100dvh, viewport-fit=cover, safe areas), botón de pantalla completa
  (Fullscreen API + webkit; oculto donde no existe), pedido automático al entrar en táctil, PWA con
  `display: fullscreen` y `apple-mobile-web-app-capable`.

## 1. Visión
Una finca cubana cozy, un poco gastada, que crece poco a poco con lo que vendes. El jugador es un
guajiro con sombrero de yarey que camina por la finca: recoge huevos, los carga en un camión viejo
de los años 50, compra semillas y tierra, siembra, cosecha, hace kétchup y contrata ayuda.
Tono: cálido, tranquilo, nostálgico. Todo el texto del juego en español (Cuba).

## 2. Dirección de arte
- Low-poly procedural (sin assets externos → sin problemas de licencias). Flat shading, colores por vértice.
- "Gastado pero limpio": madera desteñida, pintura descascarada (parches de color), cerca de tablas
  parchadas con alguna tabla torcida/faltante, óxido en el camión, techo de guano, pero siluetas
  claras y legibles.
- Paleta (golden hour):
  - Tierra roja `#a8502e` / `#8a3f24`, surcos `#6e3220`
  - Hierba seca/verde `#7d8f45` `#93a050` `#6a7a3a`, camino de polvo `#c9a477`
  - Guano `#b48a4a` `#8d6a38`, madera gastada `#8b6a45` `#a68a62`, pintura desteñida azul `#6f8fa8` y crema `#e8d9b5`
  - Camión: verde menta desteñido `#7fa89a` con óxido `#8a4b2a`, cromo opaco `#b9b2a2`
  - Bandera: azul `#1d3f86`, blanco `#f3ecdc`, rojo `#c0392b`
  - Cielo/neblina: `#f2c58a` → `#e7a76a`; luz sol `#ffd6a0`; sombra cálida.
- Elementos cubanos: palmas reales (tronco blanco-gris con abombamiento, penacho verde), ceiba
  grande, bohío con techo de guano, cocina de carbón techada, gallinero de tablas, banderas cubanas
  en mástiles y en el bohío, campos de tabaco y caña, gallo en la cerca, camión de los 50.

## 3. Cuadrícula y cámara
- Mundo en cuadrícula 22×18 tiles (más un entorno de cañaverales, palmares y mogotes para que nunca se vea vacío) (1 tile = 1 unidad). Todo (edificios, canteros, cercas, árboles)
  se alinea a tiles. La tierra se compra por parcelas (bloques de tiles).
- Cámara en perspectiva con FOV estrecho (look isométrico), yaw 45°, pitch ~52°.
- Zoom: rueda del ratón / pellizco, limitado [min,max], suavizado exponencial.
- Paneo: arrastrar (1 dedo / ratón) y 2 dedos, limitado al rectángulo de la finca.
- La cámara sigue suavemente al guajiro cuando camina (se desactiva mientras el jugador paneа; se
  re-centra con botón "centrar").

## 4. Control del personaje
- Tocar/clic en el suelo → el guajiro camina (A* en la cuadrícula) hasta allí.
- Tocar un objeto (huevo, gallinero, cantero, camión, cocina) → camina al lado y hace la acción.
- Teclado: WASD/flechas mueven, E/Espacio = Usar (objeto más cercano).
- Joystick virtual opcional (ajustes) + botón grande "Usar" en móvil.
- Respuesta inmediata: feedback visual del destino (anillo), sonido, partículas y números flotantes.

## 5. Bucle principal
huevos → (cargar en mano) → camión → pesos → semillas/tierra/gallinas → sembrar → cosechar →
cocina (3 tomates → kétchup) → camión → contratar trabajadores (automatizan) → más tierra.
- Los huevos se llevan en la canasta (inventario); al llegar al camión se cargan. El camión sale
  con "Enviar" (o solo cuando está lleno/tiempo) y vuelve al rato. Pesos al despachar.

## 6. Economía y progresión
(Valores finales de v1, en `src/data.js`; ajustados tras el QA para una primera sesión de 1–2 h.)

| Nivel | XP acumulada | Desbloquea |
|---|---|---|
| 1 | 0 | Gallinas, huevos, camión con pedidos, tomate, parcela Este (40) |
| 2 | 20 | Fogón: kétchup, Recolector (90), almacén 40 (60) |
| 3 | 55 | Caña de azúcar, Sembradora (160), ampliar gallinero (90), parcela Norte/vega de tabaco (150) |
| 4 | 110 | Tabaco, Cocinera (240), abono (120) |
| 5 | 190 | Guarapo, parcela Oeste (320), almacén 80 (220) |
| 6 | 300 | Camionero (400) |
| 7 | 450 | Parcela Sur / cañaveral (600) |
| 8+ | 650, 900, 1200… | pedidos más grandes |

| Cosa | Coste | Venta | Tiempo | XP |
|---|---|---|---|---|
| Huevo | gratis | 5 | 1 cada ~30 s por gallina | 1 |
| Tomate | semilla 5 | 12 | 1 min | 3 |
| Caña | esqueje 10 | 32 | 3 min | 6 |
| Tabaco | semilla 20 | 70 | 5 min | 10 |
| Kétchup | 3 tomates | 48 | 30 s | 6 |
| Guarapo | 2 cañas | 85 | 45 s | 8 |
| Gallina | 28 × 1,25^(n−3) | – | – | – |
- Regar (opcional): una vez por siembra, quita el 30 % del tiempo restante. Abono: −20 % de tiempo.
- Pedidos del camión: 1–3 productos desbloqueados; pagan ×1,45 el valor + 5 y dan XP extra.
- Venta suelta en el camión a precio base (capacidad 20; sale solo al llenarse).

## 7. UI
- HUD superior: nivel (insignia) + barra XP, pesos, canasta (huevos/cosechas), botón ajustes.
- Barra inferior con botones grandes (≥56 px): Tienda, Terreno, Canasta, Semilla activa, Centrar.
- Hojas inferiores (bottom sheets) para Tienda/Terreno/Camión; toasts cortos; números flotantes.
- Safe-area insets, sin zoom de navegador, texto ≥14 px, contraste alto sobre papel crema.

## 8. Tutorial (primera vez, saltable)
1) Toca un huevo para recogerlo. 2) Lleva los huevos al camión y toca "Enviar". 3) Abre la Tienda y
compra semillas. 4) Toca un cantero vacío para sembrar. 5) Cosecha cuando esté maduro. 6) Compra
tierra en Terreno. Avanza por eventos; se guarda el progreso.

## 9. Audio
- WebAudio procedural: efectos (recoger, sembrar, cosechar, caja registradora, error, subir nivel,
  claxon del camión, cacareo).
- Música guajira procedural: tres (punteo pulsado), guitarra en tumbao 6/8, güiro y clave suaves,
  en Sol mayor, I–IV–V. Se puede apagar (música y efectos por separado). Arranca tras el primer toque.

## 10. Rendimiento (objetivo 60 fps en móvil)
- pixelRatio ≤ 2 (≤1.5 en pantallas pequeñas), sombras 1024², una sola luz direccional con sombra.
- Escenario estático fusionado en pocas mallas (vertex colors, 1 material); terreno en una malla.
- Cultivos y huevos con InstancedMesh; < ~60 draw calls.
- Guardado en localStorage con autosave cada 10 s y al ocultar la pestaña.

## 11. Hitos
- v1 (este): todo lo anterior jugable, build estática para GitHub Pages (base relativa).
- v2: más animales (cerdo, vaca), pedidos del pueblo (tablero), decoraciones, día/noche, más recetas.
- v3: eventos (carnaval), logros, PWA offline, balance con telemetría local.
