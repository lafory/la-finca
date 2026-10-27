# Fincas de provincia

Cada ciudad liberada donde fundas finca tiene una **finca grande**, copia de la principal (mismo motor: mundo 3D,
guajiro, canteros, animales, obras, tienda, terreno, trabajadores, camiones, cocina, ⏩), cambiada según su provincia:
cultivos, animales, productos, recetas, colores y un paisaje propio al fondo. La finca principal no cambia.

## Perfiles

| Perfil | Ciudades | Cultivos | Animales / obras | Recetas | Paisaje |
|---|---|---|---|---|---|
| Oriente · Granma | manzanillo, bayamo, holguin | arroz, tomato, cane | Vaquería, Potrero de caballos, Molino arrocero, Quesería | arrozLeche, guarapo, sacoArroz, quesoBlanco | sierra |
| Baracoa · Guantánamo | baracoa | cacao, cocotero, tomato | Rebaño de chivas, Corral de chivos, Chocolatera, Dulcería | chorote, ketchup, chocolate, cucurucho | yunque |
| Santiago de Cuba | santiago | cafe, tomato, cane | Arria de mulos, Tostadero de café, Destilería | cafeColado, guarapo, cafeTostado, ronAnejo | morro |
| Camagüey | camaguey | tomato, cane, arroz | Hato de vacas, Potrero de los vaqueros, Chiquero grande, Quesería, Dulcería de leche | ketchup, guarapo, quesoBlanco, dulceLeche | tinajones |
| Las Villas | spiritus, trinidad, santaclara | cane, tobacco, tomato | Yunta de bueyes, Destilería de ron, Casa de tabaco | guarapo, ketchup, ronAnejo, azucar, puros | iznaga |
| Matanzas · Cienfuegos | cienfuegos, matanzas | naranja, henequen, tomato | Muelle de pesca, Desfibradora, Salador de pescado | jugo, ketchup, soga, pescadoSalado | bahia |
| Pinar del Río | pinar | tobacco, tomato, cane | Yunta de bueyes, Casa de tabaco de Vuelta Abajo | ketchup, guarapo, melao, azucar, puros, purosVuelta | mogotes |
| La Habana | habana | tomato, cane, tobacco, naranja, arroz | Trapiche y alambique, El mercado | ketchup, guarapo, jugo, melao, azucar, ronAnejo, puros | habana |


## Cómo funciona

- Código: `src/provincias/` (`data.js` perfiles, `models.js` modelos 3D, `index.js` motor y UI).
- Estado: `s` es la finca principal (guardado `lafinca-v2`, sin cambios). Cada finca de provincia es un estado
  completo en `s.ext.mambi.farms[ciudad].full` (+ `sum`, un resumen para el mapa).
- Compartido entre fincas: pesos, XP/nivel, víveres/recursos, ajustes, campaña mambisa y central. Propio de cada
  finca: tierra, canteros, animales, obras, trabajadores, almacén y camiones.
- Cambiar de finca: botón «Fincas» (columna izquierda), o «Ir a la finca» en el mapa de Cuba. Guarda, recuerda la finca
  (`ext.mambi.cur`) y recarga la página: el mundo nuevo se arma desde cero (sin fugas). Tarda 1–3 s.
- En provincia solo se abren Camino, Manigua y Batey; el central azucarero es solo de la principal.
- Partidas viejas: las finquitas viejas se convierten; lo sembrado, construido, la tierra comprada y la renta juntada
  se devuelven en pesos (a precio de costo) y aparece un aviso.
- Castro: un saqueo se lleva el 30 % del almacén de esa finca y la para 10 min (camiones, trabajadores, canteros,
  animales y fogones). Una ciudad ocupada no deja entrar a su finca; si estás dentro te manda a la principal.

## Prueba

`URL=http://127.0.0.1:4180/ ONLY=phone,ipad,desktop node tests/provincias.mjs` (reemplaza a `tests/regional.mjs`).
