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

## 10b. v2 – fila de camiones y gráficos más realistas
- **Fila de camiones** (pedido del usuario): 3 camiones (4 desde nivel 4) en fila en el camino real (x≈15.5,
  z = 9.5 / 13.8 / 18.1 / 22.4). Modelos de los años 50 variados (pickup, camión de acopio con barandas, pickup con lona),
  7 colores desgastados con óxido. El primero muestra su pedido (artículos, cantidad, pago). Al tocarlo: "Cargar"
  (carga parcial permitida, paga recompensa ×1.45 + XP al completar) o "No tenemos, siguiente" (sin multa; lo ya
  cargado se paga a precio base). El camión se va, la fila avanza suave y llega otro al final a los 4 s.
- Pedidos ponderados por lo que el jugador puede producir: el primero siempre 3 huevos; huevos con peso alto;
  cultivos/recetas solo si están desbloqueados, con más peso si hay existencias o se están cultivando/cocinando.
- Gráficos: MeshStandardMaterial + detalle procedural en shader (atributo matId), tone mapping ACES, sRGB,
  luz hemisférica + sol cálido con sombras PCF, niebla, cielo degradado, sombras de contacto, hierba instanciada,
  palmas reales con pencas curvas, viento en vértices, viñeta CSS. Calidad Alta/Media/Baja/Auto (pixelRatio,
  sombras 2048/1024/512, densidad de hierba, entorno). Descarga total ≈ 0.75 MB.

## 10c. v3 – trabajadores y adelantar el tiempo
- 6 trabajadores (pago único, sin salario; mejora ★2 = precio×0.8+20, ★3 = precio×1.6+20): recolector 30 (N1),
  regador 55 (N2), sembradora 70 (N2, compra semillas si se activa), cosechadora 90 (N3), cocinera 180 (N4), camionero 45 (N2; antes 300 N5).
  Rapidez ★1/2/3: caminar 2.6/3.3/4.1, trabajar 1.4/0.9/0.55 s. Burbujas de estado, animación de trabajo, herramientas en la mano.
- ⏩ x1/x5/x20: reloj de juego = Date.now + clockOffset (guardado). Simulación en subpasos de ≤0.1 s de juego; el guajiro
  camina a velocidad real. Día = 240 s de juego al adelantar; a x1 la luz vuelve sola a la tarde.

## 10d. v3.1 – la finca crece
- Mapa 46×40 (antes 22×18); el núcleo queda arriba a la izquierda y el camino (x15–16) cruza todo el mapa.
- 18 tierras nuevas generadas de forma determinista (`genParcel`): franjas de canteros (2 filas + 1 de paso), palmas en las
  esquinas, ~30 % de los canteros tapados por obstáculos más algunos sueltos. Total 22 tierras, ~314 canteros, 169 obstáculos.
  Precios/niveles: cuartón 90 (N2), rinconada 220 (N4), esquinita 380 (N6), potrero 650 (N8) … caminoreal 3 700 (N20),
  ojodeagua 4 200 (N21), lavuelta 5 000 (N22). Solo se compra tierra alcanzable (pegada al camino o a lo tuyo).
- Obstáculos: piedra (6 + nivel·2, 2 XP), marabú (10 + nivel·3, 3 XP), tocón (8 + nivel·2, 2 XP).
- Obras (STRUCTURES): andén 450 N6, vacas 700 N8 (2 leche/120 s), chivos 820 N9 (queso/150 s), pozo 600 N10 (riego +45 %),
  cerdos 1 000 N11 (carne/240 s), trapiche 1 300 N12 (melao 2 caña/60 s, azúcar 3 caña/90 s), gallinero 2 900 N13,
  fogón 2 1 100 N14, casa de tabaco 1 800 N15 (puros 3 tabaco/120 s). Los trabajadores las atienden (recolector, cocinera, camionero).
- Niveles hasta 30: XP(N>10) = 1200 + k·300 + k²·45. Almacén 20/40/80/150/250. Productos nuevos: leche 30, queso 55, carne 95,
  melao 80, azúcar 125, puros 260.
- Cámara: límites = tierra tuya ±3; alejar máx = max(46, encuadre·1.2), animados. "Ver finca" y "Centrar".
- Rendimiento: hierba en trozos 8×8 instanciados (frustum culling) con LOD por distancia (100/60/35 %), obras y solares
  fusionados en la malla estática, obstáculos instanciados por tipo, niebla/sombras/plano lejano siguen a la cámara.

## 10e. v3.1 – camionero automático
- Chucho baja a nivel 2 y 45 pesos, con etiqueta "Vende a los camiones por ti" y tarjeta destacada primera en la hoja.
- Ciclo: esperar en el andén (x14, z9) → si un camión parqueado pide algo que hay, ir al bohío ("Juntando la mercancía") →
  volver con la caja en brazos → cargar (parcial vale; completo = cobra y se va). Sin mercancía: espera CAM_WAIT = 20 s de juego
  desde que parqueó o desde la última carga y lo despide (sin castigo). Con dos andenes atiende los dos.
- Venta suelta opcional: rec.sell (No por defecto) y rec.keep ∈ {5, 10, 20, 40}; sobrante = inventario − guardar − lo que piden los camiones.
- Sin toasts ni sonidos propios (solo flotantes sobre el camión); el panel del camión dice qué está haciendo Chucho.

## 11. Hitos
- v1 (este): todo lo anterior jugable, build estática para GitHub Pages (base relativa).
- v2 (hecho): fila de camiones con saltar pedido, gráficos PBR procedurales, selector de calidad.
- v3 (hecho): trabajadores, ⏩ y día/noche. v3.1 (hecho): finca grande, obstáculos, vacas/chivos/cerdos, trapiche, tabaco.
- v4: eventos (carnaval), logros, PWA offline, balance con telemetría local.
