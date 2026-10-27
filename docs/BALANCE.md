# Auditoría de economía y balance (oct 2026)

Script: `node tests/balance-sim.mjs` (o `--json`). Solo usa node y lee las tablas reales (`src/data.js`, `src/central/data.js`),
así que los números cambian solos si cambian las tablas. **Los cambios de la sección «Pasada de balance aplicada» ya están en el juego (rama `balance`).**

## Modelo del jugador "típico"
- Cuenta solo **tiempo de juego activo** (con la app abierta). Pasos de 10 s.
- ~13 acciones útiles por minuto (22 toques/min × 60 % de eficiencia). Siembra el cultivo que más pesos+XP da por minuto
  (desde el nivel 4 siempre gana el **tabaco**), riega siempre (−30 %) y vende por pedidos de camión (×1,45), hasta
  ~3 pedidos/min (×2 con el segundo andén). Lo que sobra se vende suelto.
- Compra cuando le alcanza: gallinas → almacén → abono → trabajadores → parcelas → obras → campos grandes → etapas del central.
- Cada trabajador de campo hace ~7 tareas/min. El tope sale de `4 + nivel/4 + casas del batey`.
- Con ⏩ el reloj de juego va ~6× más rápido de media (x5/x20 a ratos), pero las acciones y los camiones siguen en tiempo real.
- **Típico** = usa el ⏩ a ratos (reloj ~2× de media). Es la columna con la que se fijan las metas.
- Es un modelo grueso: sirve para comparar tramos y propuestas, no para predecir minutos exactos.

## Antes de la pasada (tablas hasta el commit 7562f48)
| Nivel | XP total | sin ⏩ | con ⏩ |
|---:|---:|---:|---:|
| 2 | 20 | <1 min | <1 min |
| 5 | 190 | 3 min | 1 min |
| 10 | 1 200 | 7 min | 4 min |
| 15 | 3 825 | 13 min | 8 min |
| 20 | 8 700 | 21 min | 14 min |
| 25 | 15 825 | 29 min | 20 min |
| 32 | 29 580 | 44 min | 30 min |
| 40 | 50 700 | **1,0 h** | **40 min** |

### Diagnóstico
1. **Demasiado rápido en todo el juego, sobre todo del 10 al 40.** La curva (`1200 + 300k + 45k²`) crece mucho más
   despacio que los ingresos. Los ingresos se disparan por tres cosas: más canteros, trabajadores baratos sin tope de
   pago y el tabaco (10 XP y 70 pesos por mata).
   Los campos grandes (25) y el central (32) llegan en menos de 1 h y se "gastan" enseguida.
2. **No hay muros de pesos** después del nivel 12: siempre hay dinero de sobra para la siguiente parcela u obra. Las
   etapas del central (15k–60k) se pagan en minutos. La madera (120–250 por etapa, tope 500) tampoco frena.
3. **El ⏩ ayuda poco desde el 10** (solo un 30 % más rápido), porque ahí el freno son las manos (jugador y
   trabajadores), no el reloj. En los niveles 1–8 sí es fuerte (unas 2× más rápido).
4. **El tabaco domina** desde el nivel 4: el tomate y la caña dejan de tener sentido en el cantero. Solo se siembran
   para recetas.
5. **Contratar más trabajadores del mismo oficio** cuesta casi nada comparado con lo que rinden
   (`precio × (1 + 0,75·n)`). Son el motor principal de la XP.
6. Bien: en los niveles 1–5 los camiones piden huevos y tomate y el arranque se siente fluido. No sale ningún muro
   abrupto (la heurística busca tramos de más de 2,5× la media de los anteriores).

## Propuestas originales (ya aplicadas, con la curva afinada; ver abajo)
Simuladas con `xpProposed` y `PROPOSED_TWEAK` en el mismo script:
| Nivel | XP propuesta | sin ⏩ | con ⏩ |
|---:|---:|---:|---:|
| 10 | 1 600 | 10 min | 5 min |
| 15 | 13 725 | 40 min | 26 min |
| 20 | 45 600 | 1,7 h | 1,1 h |
| 25 | 103 975 | 3,5 h | 2,3 h |
| 32 | 243 072 | 7,0 h | 4,3 h |
| 40 | 505 600 | 11,9 h | 6,3 h |

1. **Curva de XP más empinada desde el 6** (`src/data.js`):
   `LEVEL_XP = [0,0,20,55,110,190,320,520,800,1150,1600]` y, desde el 11,
   `1600 + 900k + 260k² + 9k³`. Llegar al 40 pasa de 1 h a unas 12 h de juego activo (varios días de partidas cortas).
2. **Tabaco con menos XP y algo más lento**: `ITEMS.tobacco.xp 10 → 6`, `CROPS.tobacco.grow 300 → 420`. Así el tomate
   (rápido) y la caña (recetas) vuelven a competir. Los puros conservan el valor.
3. **Trabajadores**: tope `+1 cada 5 niveles` (`WORKER_LEVEL_CAP 4 → 5`) y precio de repetir oficio más empinado:
   `workerHirePrice = price × (1 + n)²` redondeado a 5. Además, un **salario diario suave** (p. ej. 5 % del precio cada
   10 min de juego) para que el dinero tenga salida.
4. **Sumideros de pesos de verdad a partir del 12**: subir ×2 el precio de las parcelas 13–22 y de las obras de nivel 12+.
   Las etapas del central deberían pedir también azúcar o caña (p. ej. `cost.items`) y no solo pesos y madera.
5. **Campos grandes y central como meta**: con la curva nueva, el 25 llega a las ~3,5 h y el 32 a las ~7 h. Precios de
   los campos ×1,5 y XP de cosecha de campo `110 → 160`, para que el tramo 25–40 dependa de los campos y no de los
   canteros.
   - Extra: `ORDER_BONUS` 1,45 → 1,35 desde el nivel 15 (escalonado), y un ⏩ que cueste algo (madera o pesos por
     minuto adelantado) para que sea una decisión y no un botón gratis.

## Pasada de balance aplicada (oct 2026)
Metas: nivel 10 en 20–30 min, nivel 25 en 3–4 h y nivel 40 en 10–15 h de juego activo (jugador típico), con la
primera hora entretenida y siempre algo que comprar.

### Cambios (solo tablas, salvo lo mínimo para cobrar y mostrar)
| Qué | Antes | Ahora | Dónde |
|---|---|---|---|
| Curva de XP, niveles 6–10 | 300, 450, 650, 900, 1 200 | 440, 950, 1 800, 3 000, 4 800 | `src/data.js` `LEVEL_XP` |
| Curva de XP, desde el 11 (k = nivel − 10) | `1200 + 300k + 45k²` | `4800 + 600k + 220k² + 15k³` | `xpForLevel` |
| Tabaco | 10 XP, crece en 300 s | 6 XP, crece en 420 s | `ITEMS.tobacco`, `CROPS.tobacco` |
| Tope de trabajadores | +1 cada 4 niveles | +1 cada 5 niveles | `WORKER_LEVEL_CAP` |
| Repetir oficio | `precio × (1 + 0,75·n)` | `precio × (1 + n)²` (70 → 280 → 630 → 1 120…) | `workerHirePrice` |
| Parcelas y obras de nivel 12+ (y mejoras de casa de nivel 12+) | precio de tabla | ×2 (`LATE_MUL`) | `src/data.js` |
| Campos grandes | 6 000 … 36 000 | ×1,5: 9 000 … 54 000 | `src/central/data.js` `FIELD_PRICE_MUL` |
| XP de cosecha de campo | caña 110, tabaco 140, tomate 70 | 160, 200, 100 | `FIELD_CROPS` |
| Etapas del central | pesos + madera | además 60 cañas / 20 / 35 / 50 sacos de azúcar | `STAGES[].items` (+1 línea en `central/sim.js` y `central/ui.js`) |
| Mambí: botín | 50 pesos por guardia (Manzanillo 1 000) | 75 (Manzanillo 1 500) | `src/mambi/data.js` `LOOT_PER_GUARD` |
| Mambí: primeras fincas | Manzanillo 3 000, Bayamo 4 500 | 1 500, 3 500 | `CITIES[].farm` |

No se añadió salario: haría falta tocar la simulación, el ⏩ y la cuenta con el juego cerrado, y el dinero podría
quedar en negativo. El precio cuadrático al repetir oficio ya hace de freno. Las obras de `src/granja/` no se tocaron.

### Antes / después (`node tests/balance-sim.mjs`)
| Nivel | XP antes | XP ahora | Antes sin ⏩ | Antes con ⏩ | Ahora sin ⏩ | **Ahora típico** | Ahora con ⏩ |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 5 | 190 | 190 | 3 min | 1 min | 4 min | 3 min | 1 min |
| 10 | 1 200 | 4 800 | 7 min | 4 min | 36 min | **20 min** | 11 min |
| 15 | 3 825 | 15 175 | 13 min | 8 min | 1,4 h | **44 min** | 26 min |
| 20 | 8 700 | 47 800 | 21 min | 14 min | 3,5 h | **1,7 h** | 1,0 h |
| 25 | 15 825 | 113 925 | 29 min | 20 min | 7,1 h | **3,7 h** | 2,3 h |
| 32 | 29 580 | 284 200 | 44 min | 30 min | 13,6 h | **7,2 h** | 4,2 h |
| 35 | 36 825 | 391 675 | 52 min | 35 min | 16,7 h | **8,8 h** | 5,1 h |
| 40 | 50 700 | 625 800 | **1,0 h** | 40 min | 21,9 h | **11,6 h** | 6,5 h |

- Primera hora: los niveles 6–13 salen cada 3–10 min y nunca pasan más de ~5 min sin poder comprar algo (9 min con ⏩
  fuerte). Ningún muro ni tramo raro según la heurística del script.
- La campaña mambí (nivel 35) llega a las ~9 h de juego típico en vez de ~45 min.

### Partidas guardadas
- `s.xpCurve` (nuevo, `XP_CURVE = 2`). Al abrir una partida sin él, `migrateXp` la pasa a la curva nueva con **el
  mismo nivel y el mismo % de avance** al siguiente nivel; nunca baja de nivel ni deja XP negativa
  (`state.js`, después de leer `level` y `xp`). Lo mismo al cargar un código o un archivo `.lafinca` viejo.
- Quien ya tenga más trabajadores que el tope nuevo los conserva; solo no puede contratar más hasta subir de nivel o
  construir casas. Las fincas regionales ya fundadas no cambian.
- Riesgo: si alguien abre la partida nueva con la versión vieja guardada en la caché de Safari, la curva vieja vería
  mucha XP y le subiría niveles de golpe (no pierde nada, gana niveles). Se evita recargando la página.
