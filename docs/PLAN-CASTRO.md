# Contraataques del Régimen (fin de partida que nunca se acaba)

Código: `src/mambi/castro.js` (lógica, guardado, registro) y `src/mambi/castro-ui.js` (aviso, mapa, hojas, batalla de
defensa). Se registran en `src/extensions.js` después de la campaña. Los únicos cambios en archivos de la campaña son
una línea en `ensureMambi` (src/mambi/sim.js) para conservar `s.ext.mambi.castro`; el resto se engancha envolviendo
métodos (`mbBattle`, `mbFarmRate`, `MambiUI.frame/openCity/openCamp/closeMap`).

## Reglas
- Empiezan cuando hay al menos una ciudad libre (y la campaña abierta). Primer ataque a los 12 min; después cada
  18 min − 50 s por ciudad libre (mínimo 7 min), ±20 %. Tiempo **real**: ⏩ no adelanta los ataques.
- Un solo ataque a la vez. Aviso en la finca y en el mapa (cartel + anillo rojo + marca con cuenta atrás de 2:30).
- Objetivo: las ciudades con finca y las más flojas atraen más. 40 % de las veces, si hay finca, es un **saqueo**
  (columna ×0,7; si gana se lleva la renta pendiente y la finca para 10 min, la ciudad sigue libre).
- Fuerza de la columna = guardias originales × (0,45 + 0,035 × ciudades libres + 0,04 × oleadas[≤25]) × azar 0,9–1,1.
  Sigue llegando con las 13 libres: amenaza permanente.
- Defensa = (pueblo [¼ de los guardias originales] + guarnición [infante 4, jinete 10]) × (1 + 0,2 × trinchera[≤3] +
  0,5 × fortín[≤2]). Se resuelve como la campaña: defensa × azar 0,85–1,15 ≥ columna. Probabilidad en la hoja.
- Pérdidas: los que se dispersan vuelven a su casa (como en la campaña; 20 % menos por estar atrincherados).
- Si la ciudad cae: vuelve a gris (sale de `freed`), la guarnición superviviente vuelve al campamento, cada obra baja
  un nivel, la finca regional se conserva pero **ocupada** (renta 0). Se recupera con una batalla normal (es la
  «próxima» de la campaña); el botín de recuperar es la mitad.
- Juego cerrado: al cargar se resuelven los ataques atrasados (máximo 4), y como mucho **1** pérdida por ausencia
  (**2** si fueron más de 8 h); el resto «se retiró sin atacar». Resumen «Mientras no estabas» al entrar.
- Trucos con `?dev=1` (hoja de ciudad y campamento): Ataque ahora, Ataque fuerte, Que llegue ya, Simular 3 h fuera.

## Guardado (`s.ext.mambi.castro`, v1; tolerante a campos que falten)
```
{ v: 1,
  cities: { [cityId]: { owner: 'jugador' | 'regimen' | <id de jugador futuro>, gar: { inf, cab },
                        def: { trinchera, fortin }, raidUntil, since } },
  attack: null | { id, city, kind: 'retomar' | 'saqueo', power, at, hit },   // segundos epoch reales
  next, waves, seen, stats: { attacks, held, lost, retaken, raids }, log: [..], report: null | { away, lines } }
```
`cities[id]` está pensado para un multijugador futuro (otros jugadores atacando fincas): `owner` puede ser un id de
jugador y `gar`/`def` describen la defensa sin depender del Régimen. No hay red: todo es local.

## Pruebas
`tests/castro.mjs` (iPhone y iPad en WebKit, computadora en Chromium): aviso, defensa ganada (batalla animada),
ciudad perdida, recuperada, ataques al volver con tope, guardado y recarga, 0 errores de consola.
