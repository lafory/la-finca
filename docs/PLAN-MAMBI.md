# Plan: La Campaña Mambisa (fase después del central)

> Para El daddy. Tono **alegórico y familiar**: un "Régimen" gris sin nombre, sus "guardias" y los mambises del pueblo.
> No sale ninguna persona real (ni viva ni muerta) con nombre o cara. No hay sangre: los vencidos **se retiran** y las
> tropas propias que pierden **se dispersan** (vuelven a casa).

## 1. Idea
Cuando el central está completo (nivel 35 y las 4 etapas), la finca financia un **ejército mambí**. En el **mapa de
Cuba** se liberan ciudades del Régimen una a una. Cada ciudad liberada deja fundar una **finca regional** (café, cacao,
ganado, tabaco…) cuya renta paga más tropas. El ciclo es finca → ejército → ciudad → nueva finca → más ejército.

## 2. Mapa y progresión (de oriente a occidente, como la Invasión)
Isla low-poly de una sola malla (relieve facetado por celdas, sierras como bultos), seis provincias de la época con
tintes suaves: Pinar del Río, La Habana, Matanzas, Las Villas, Camagüey y Oriente. Al liberarlas se ponen más verdes.

| # | Ciudad | Provincia | Guardias | Terreno | Finca regional |
|---|---|---|---:|---|---|
| 1 | Manzanillo | Oriente | 20 | costa | Arroz |
| 2 | Bayamo | Oriente | 32 | llano | Ganado (leche y queso) |
| 3 | Baracoa | Oriente | 40 | monte | Cacao |
| 4 | Santiago de Cuba | Oriente | 60 | monte | Café |
| 5 | Holguín | Oriente | 75 | llano | Maíz |
| 6 | Camagüey | Camagüey | 95 | llano | Ganado |
| 7 | Sancti Spíritus | Las Villas | 120 | llano | Caña |
| 8 | Trinidad | Las Villas | 140 | monte | Café del Escambray |
| 9 | Santa Clara | Las Villas | 170 | llano | Tabaco de Remedios |
| 10 | Cienfuegos | Las Villas | 200 | costa | Pesca |
| 11 | Matanzas | Matanzas | 240 | costa | Cítricos |
| 12 | Pinar del Río | Pinar del Río | 290 | monte | Tabaco de Vuelta Abajo |
| 13 | La Habana | La Habana | 380 | costa | Ron y puerto (final) |

Solo se puede atacar la siguiente ciudad de la lista. La fuerza enemiga sube unas 1,25× por ciudad.

## 3. Tropas (campamento mambí)
| Unidad | Costo | Fuerza | Nota |
|---|---|---:|---|
| Infantería mambisa | 400 pesos + 10 víveres | 4 | Base del ejército |
| Caballería al machete | 1 200 pesos + 25 víveres | 10 | Pega duro en la carga |
| Carreta de avituallamiento | 800 pesos + 6 sacos de azúcar | — | +8 % de fuerza y −5 % de dispersión cada una (máx. 5) |

- **Víveres** (recurso aparte): se mandan desde la canasta de la finca (huevos, tomates, leche, carne, frutas,
  kétchup…). Cada cosa vale `⌈precio/10⌉` víveres.
- **Azúcar**: sale de los almacenes del central.
- El tope del ejército es `30 + 10 por ciudad liberada`. Cada batalla gasta 1 víver por soldado.

## 4. Batallas (táctica ligera, se resuelven solas)
Antes de atacar se elige una táctica, con la probabilidad de ganar a la vista:
- **Carga al machete**: más fuerte cuanta más caballería lleves (×0,9 a ×1,7), pero se dispersan más.
- **Emboscada en la manigua**: ×1,25 en terreno de monte (×1,0 en el resto), menos dispersión.
- **Asedio con carretas**: ×(0,95 + 0,06 por carreta) y muy poca dispersión. Necesita al menos 1 carreta.

`fuerza = Σ unidades × táctica × moral(carretas) × azar(0,85–1,15)`. Si es mayor o igual que la de los guardias, se gana.
Escena corta de unos 6 s (se puede saltar):
- se ven el fortín gris, la columna mambisa y polvo
- los guardias corren fuera del escenario
- baja la bandera gris y sube la bandera cubana
- si se pierde, la columna se retira

## 5. Economía (finca ↔ ejército)
- Al liberar una ciudad se cobra un botín (`guardias × 50` pesos) y XP.
- **Finca regional** (en cada ciudad liberada): se compra con pesos y produce su renta por minuto real, también con la
  app cerrada (hasta 8 h). Tiene 3 niveles (×1, ×2, ×3,5). Sus productos se venden solos y suman pesos y víveres.
- El gasto en tropas, víveres y azúcar da salida al dinero de sobra, que es el gran problema del juego ahora (ver
  BALANCE.md).

## 6. Pantallas
1. **Botón "Campaña"** con bandera, junto a Manigua/Batey/Central. Aparece al cumplir las condiciones.
2. **Mapa**: la isla en 3D, ciudades con su bandera (gris o cubana) y una etiqueta tocable. Arriba: volver, pesos,
   víveres, azúcar, ejército y renta por cobrar. Abajo: Campamento, Mandar víveres y Cobrar renta.
3. **Hoja de la ciudad**: guardias, terreno, finca regional y el botón Atacar, que lleva a la hoja de tácticas.
4. **Escena de batalla** con su cartel de resultado.
5. **Hoja del campamento**: reclutar, ver el tope y, con `?dev=1`, los trucos.

## 7. Arte
Low-poly facetado con la misma paleta cálida que la finca. El mar va en azul turquesa con degradado. Las sierras
(Órganos, Escambray, Maestra) tienen tonos ocres. Los mambises llevan guayabera crema, sombrero de yarey y machete; los
guardias, uniforme gris liso y sin insignias. Las banderas son la de la estrella solitaria y una gris lisa para el
Régimen.

## 8. Rendimiento en móviles
- El mapa y la batalla reutilizan el mismo `WebGLRenderer`. Mientras el mapa está abierto, **la finca no se dibuja**
  (la simulación sigue corriendo).
- Terreno en 1 malla (unos 4k triángulos), sin sombras y con 2 luces. Las ciudades están fusionadas en 1 malla y las
  banderas son mallas pequeñas.
- La batalla usa ≤ 6 mallas instanciadas para los soldados, los caballos, las carretas y el polvo.

## 9. Hitos
- **M1** (hecho): mapa de Cuba, desbloqueo, Manzanillo atacable, reclutamiento básico, batalla automática, guardado en
  `s.ext.mambi`.
- **M2** (hecho): las 13 ciudades en orden, tácticas, carretas, víveres, fincas regionales con renta y 3 niveles,
  escena animada, trucos de desarrollo y prueba `tests/mambi.mjs`.
- **M3**: eventos en el mapa (emboscadas del Régimen, refuerzos), héroes ficticios con nombre inventado y moral.
- **M4**: acercar la cámara a la ciudad liberada para ver su finca en 3D (reutilizando los modelos de la finca).
- **M5**: final en La Habana con fiesta en el malecón, créditos y "partida+" con más dificultad.
