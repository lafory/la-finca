# Auditoría de economía y balance (oct 2026)

Script: `node tests/balance-sim.mjs` (o `--json`). Solo usa node y lee las tablas reales (`src/data.js`, `src/central/data.js`),
así que los números cambian solos si cambian las tablas. **Ningún cambio de abajo está aplicado al juego.**

## Modelo del jugador "típico"
- Cuenta solo **tiempo de juego activo** (con la app abierta). Pasos de 10 s.
- ~13 acciones útiles por minuto (22 toques/min × 60 % de eficiencia). Siembra el cultivo que más pesos+XP da por minuto
  (desde el nivel 4 siempre gana el **tabaco**), riega siempre (−30 %) y vende por pedidos de camión (×1,45), hasta
  ~3 pedidos/min (×2 con el segundo andén). Lo que sobra se vende suelto.
- Compra cuando le alcanza: gallinas → almacén → abono → trabajadores → parcelas → obras → campos grandes → etapas del central.
- Cada trabajador de campo hace ~7 tareas/min. El tope sale de `4 + nivel/4 + casas del batey`.
- Con ⏩ el reloj de juego va ~6× más rápido de media (x5/x20 a ratos), pero las acciones y los camiones siguen en tiempo real.
- Es un modelo grueso: sirve para comparar tramos y propuestas, no para predecir minutos exactos.

## Resultado con las tablas actuales
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

## Propuestas concretas (no aplicadas)
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
