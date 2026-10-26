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

## 10f. Plan v4 – salir de la finca: manigua, batey, campos y central
Mapa global en cuadrícula de 88×80 (la finca de 46×40 queda arriba a la izquierda). Cada zona es una región con su
rectángulo, nivel de apertura y vista propia que se construye "perezosa" (al abrirse o cuando la cámara se acerca),
así más adelante se puede añadir un mapa del mundo con otras regiones (pueblos, ciudades) sin tocar la finca.

| Zona | Tiles | Abre | Qué hay |
|---|---|---|---|
| Camino del sur | x0–87, z40–41 (+ camino real x15–16 hasta z79) | siempre | une finca, batey, manigua y campos |
| La manigua (monte salvaje) | x46–87, z0–39 | N3 | guásimas y algarrobos (leña), marabú, ceibas (no se tumban), palmas reales, cocoteros, mangos, guayabas, arroyo con pasos de piedra, mogotes; jutías, puercos jíbaros, guineas, gallinas perdidas, caballos |
| El batey (pueblo) | x0–30, z42–57 | N5 | plaza con ceiba, 8 solares de casas (bohío → casa de zinc), bodega, escuela, iglesia |
| Campos grandes | x32–87, z42–79 | N18–30 | bloques de 6×6 de caña, tabaco y tomate que se siembran y cosechan enteros; tractor/carreta de bueyes y cuadrillas |
| Central azucarero | x0–30, z58–79 | N28 (obra en 4 etapas) | basculador, casa de calderas con chimenea humeante, almacenes, estación; tren cañero de vía estrecha en lazo por los campos |

Recursos nuevos: **leña** (contador propio, tope 500; machete gratis al abrir la manigua; árbol 3, marabú 1; vuelven a crecer en 5 min),
frutas sueltas (mango 8, guayaba 10, coco 14 pesos), animales (jutía 40, puerco jíbaro 70 o +1 pieza en el chiquero,
guinea/gallina → al gallinero, caballo domado → el guajiro camina 50 % más rápido). Lo capturado se lleva en brazos (máx. 3)
y se entrega al entrar en la finca. Industria: caña en masa → azúcar crudo, melaza y ron en el central; pedidos de tren.

Economía: niveles hasta 40 (misma fórmula). Leña en obras: casas del batey (8–20), bodega 12, escuela 30, iglesia 40,
obras v3.1 aún no construidas (6–20) y almacén 4–5 (15/30). Tope de trabajadores: 4 + 1 por bohío + 2 por casa de zinc
(los saves viejos conservan a todos). Nuevo trabajador: leñero (N4, 120 pesos) que tumba árboles y trae la leña al bohío.
Bodega −15 % en semillas y gallinas; escuela +10 % XP; iglesia +5 % en pedidos.
Campos: N18 caña (6×6 = 36 cañas por cosecha), N22 tabaco, N25 tomate; tractor N24 y cuadrilla de campo (trabajadores extra).
Central: N28, cuatro etapas (cimientos, basculador y vía, calderas y chimenea, estación) con leña + pesos + azúcar/caña;
después tren cañero (locomotora + 4 vagones) y pedidos de tren de 60–200 unidades.

Guardado: misma clave y versión; los campos nuevos se rellenan con valores por defecto (no se borra el progreso).
Truco de desarrollo (solo `npm run dev`): en Ajustes, subir nivel, +pesos, +leña. Rendimiento: árboles y hierba de cada zona
en trozos instanciados con culling por trozo y LOD (copa simplificada lejos), suelo de zona en una textura pequeña,
pathfinding con montículo binario sobre 88×80.

Entregas: **v4a** manigua + batey + leña + leñero; **v4b** campos grandes + central + tren.

## 10g. v5 – campos grandes, central azucarero y tren cañero (`src/central/`)
Módulo aparte registrado en `src/extensions.js`; estado en `s.ext.central` (partidas viejas: valores por defecto).
- **Campos grandes** (zona `campos`, nivel 25): bloques de 6×6 que se compran, siembran y cortan enteros. Caña (25), tabaco (27), tomate (29).
  Siembra con tractor Belarus y cuadrilla; corte con cuadrilla de macheteros y carretas de bueyes que llevan la caña al **acopio**.
  Lo cosechado va a un almacén industrial aparte (no ocupa la canasta) y se vende al por mayor desde el acopio.
- **Central azucarero** (zona `central`, nivel 32): 4 etapas de obra con pesos + **madera** (la de la manigua; si falta, el aserrío la vende):
  cimientos (32) → vía estrecha y locomotora (33) → casa de calderas y chimenea con humo (34) → almacenes, estación y destilería (35).
  El central muele caña en azúcar y melaza; la destilería convierte melaza en ron.
- **Tren cañero**: locomotora de vapor + 4 vagones en un lazo de vía estrecha; carga en el acopio, vuelca en el basculador del central
  y para en la estación. **Pedidos del tren** (más grandes que los de camión, con prima) se cargan en la estación y se cobran al salir.
- Rendimiento: estáticos fusionados (vía, central, acopio), cultivos/cuadrilla/carretas/humo instanciados con LOD, tren = 3 draw calls.
- Pruebas: `tests/central.mjs` (4 pantallas, `?dev=1` con trucos de nivel/pesos/campos/central).

## 10h. Granja grande (`src/granja/`)
Gallinero 1–4 (el corral `PEN` cambia de tamaño; nidales, sombra de zinc y segunda caseta), surcos (`plotGeo` en lomos; «Arar surcos» en bloques de hasta 4×4), potrero 1–3 (`STRUCTURES.vacas` crece; vacas nuevas más grandes) y batey más grande (casas 9–12, dominó, consultorio, panadería, calles, casas de mampostería = `tier 3` con `st.upgrade2`). Estado en `s.ext.granja`.

## 10h. v6 – La Campaña Mambisa (`src/mambi/`, plan en `docs/PLAN-MAMBI.md`)
Extensión registrada en `src/extensions.js`. Estado en `s.ext.mambi` y víveres en `s.res.viveres`.
- Se abre en el nivel 35 con el central completo; aparece el botón **Campaña** (con `?dev=1`: trucos en el campamento).
- **Mapa low-poly de Cuba** (terreno facetado, 6 provincias de la época, sierras, palmas instanciadas) dibujado con el
  mismo `WebGLRenderer`: mientras está abierto la finca no se dibuja, pero la simulación sigue.
- 13 ciudades de oriente a occidente. Tropas: infantería, caballería al machete y carretas de avituallamiento (azúcar
  del central). Víveres desde la canasta.
- Tácticas (carga, emboscada, asedio) con su probabilidad a la vista y una escena corta animada que se puede saltar.
  Tono alegórico: los guardias grises se retiran y los propios "se dispersan".
- Cada ciudad libre deja fundar una **finca regional** (arroz, ganado, cacao, café, maíz, caña, tabaco, pesca, cítricos,
  ron) con renta por minuto, también con la app cerrada (hasta 8 h), y 3 niveles.
- Prueba: `tests/mambi.mjs` (4 pantallas).

## 11. Hitos
- v1 (este): todo lo anterior jugable, build estática para GitHub Pages (base relativa).
- v2 (hecho): fila de camiones con saltar pedido, gráficos PBR procedurales, selector de calidad.
- v3 (hecho): trabajadores, ⏩ y día/noche. v3.1 (hecho): finca grande, obstáculos, vacas/chivos/cerdos, trapiche, tabaco.
- v4: eventos (carnaval), logros, PWA offline, balance con telemetría local.

## Extension hooks (para módulos aparte, p. ej. `src/central/*`)
Todo vive en `src/registry.js`. Un módulo se registra al importarse; añade **una línea** en `src/extensions.js`
(`import './central/index.js';`). `main.js` importa `extensions.js` antes de crear la partida, así que los
registros ya están cuando se hace `newGame()`/`load()`. No hace falta tocar `data.js`, `state.js`, `sim.js`, `world.js` ni `ui.js`.

| Hook | Qué hace |
|---|---|
| `registerZone(id, { name, blurb, level, rect:{x0,z0,x1,z1}, sign:[x,z] })` | Región nueva del mapa global 88×80 (caminable cuando `level` ≤ nivel). Libres: campos x32–87 × z42–79, central x0–30 × z58–79. Los caminos x15–16 y z40–41 ya llegan. |
| `registerResource(id, { name, icon, cap, start })` | Recurso fuera de la canasta en `s.res[id]` (ya existe `madera`, tope 500). `sim.addRes / hasRes / spendRes`. |
| `registerItem(id, def, { sellable })` | Cosa nueva de la canasta (aparece en `s.inv`, camiones, venta). |
| `registerStructure(id, { name, detail, price, madera, cost:{res,items}, level, kind, zone, x,z,w,h, model(M, built) })` | Obra en un solar; `sim.build(id)` cobra con `sim.pay(cost)`. `model` devuelve la geometría (API `Builder/part/place` de `models.js`). |
| `registerWorker(id, def, { pick(sim,w,free), do(sim,w,t) })` | Rol nuevo de trabajador (sale en la hoja Trabajadores; reserva tareas con claves `free(key)`). |
| `registerSimModule({ init, update(sim,dt), goals(sim,t), perform(sim,t) })` | Lógica por tick y objetivos nuevos para `sim.command({ kind, ... })`. Guarda estado en `s.ext[id]`. |
| `registerZoneView(zoneId, factory(world) → { update, pick(ray), blobs(add), grassCounts(f) })` | Vista 3D perezosa (se crea al abrirse la zona o acercarse la cámara). `pick` devuelve `'prefijo:id'`. |
| `registerTap(prefijo, fn(game, id))` | Qué pasa al tocar algo que tu vista devolvió en `pick`. |
| `registerUISection('land', fn(ui) → html)` / `registerAct(nombre, fn(ui, dataset))` | Filas en "Terreno y obras" y botones `data-act`. |
| `registerUnlock(nivel, texto)` | Línea en el aviso de subir de nivel. |
| `registerMigration(fn(s, d))` | Migrar partidas viejas (corre en `load()`). |
| `registerGameModule({ attach(game), frame(game, dt, time) })` | Acceso al `Game` (vistas propias, botones, cámara, ⏩). `attach` al crear la partida, `frame` después de `world.update`. |
| `FARM_HOOKS.henCap(s, base)` / `FARM_HOOKS.layFactor(s)` | Tope de gallinas y factor del tiempo entre huevos (los usa `src/granja/`). |

Costes genéricos: `sim.canPay({ pesos, madera, res:{}, items:{} })` / `sim.pay(...)` (todo o nada).
