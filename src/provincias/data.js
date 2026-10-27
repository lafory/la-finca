// Fincas de provincia: cada ciudad liberada con finca tiene una finca GRANDE, copia de la principal (mismo motor:
// mundo, guajiro, canteros, animales, obras, tienda, terreno, trabajadores, camiones, cocina, ⏩), con lo típico de
// su región: cultivos, animales, productos, colores y paisaje. La principal no cambia. Ver docs/PROVINCIAS.md.

// Cultivos nuevos (además de tomate, caña y tabaco). grow en segundos de juego.
export const PV_CROPS = {
  arroz: { name: 'Arroz', seedName: 'Semilla de arroz', seed: 6, grow: 90, level: 1, item: 'arroz', xpPlant: 1 },
  cacao: { name: 'Cacao', seedName: 'Postura de cacao', seed: 18, grow: 300, level: 1, item: 'cacao', xpPlant: 2 },
  cafe: { name: 'Café', seedName: 'Postura de café', seed: 15, grow: 240, level: 1, item: 'cafe', xpPlant: 2 },
  naranja: { name: 'Naranjo', seedName: 'Postura de naranjo', seed: 12, grow: 200, level: 1, item: 'naranja', xpPlant: 1 },
  henequen: { name: 'Henequén', seedName: 'Hijo de henequén', seed: 14, grow: 260, level: 1, item: 'henequen', xpPlant: 2 },
  cocotero: { name: 'Cocotero', seedName: 'Coco para sembrar', seed: 12, grow: 220, level: 1, item: 'coco', xpPlant: 1 },
};

// Cosas nuevas de la canasta (se venden en los camiones de la finca de provincia que las produce)
export const PV_ITEMS = {
  arroz: { name: 'Arroz', plural: 'Matules de arroz', sell: 14, xp: 3 },
  cacao: { name: 'Mazorca de cacao', plural: 'Mazorcas de cacao', sell: 40, xp: 5 },
  cafe: { name: 'Café en grano', plural: 'Latas de café', sell: 36, xp: 5 },
  naranja: { name: 'Naranja', plural: 'Naranjas', sell: 16, xp: 3 },
  henequen: { name: 'Penca de henequén', plural: 'Pencas de henequén', sell: 24, xp: 3 },
  potro: { name: 'Potro domado', plural: 'Potros domados', sell: 160, xp: 10 },
  pescado: { name: 'Pescado fresco', plural: 'Pescados frescos', sell: 26, xp: 3 },
  sacoArroz: { name: 'Saco de arroz', plural: 'Sacos de arroz', sell: 70, xp: 7 },
  arrozLeche: { name: 'Arroz con leche', plural: 'Dulceras de arroz con leche', sell: 75, xp: 7 },
  quesoBlanco: { name: 'Queso blanco', plural: 'Quesos blancos', sell: 120, xp: 9 },
  chocolate: { name: 'Chocolate', plural: 'Barras de chocolate', sell: 200, xp: 14 },
  chorote: { name: 'Chorote', plural: 'Jarras de chorote', sell: 70, xp: 6 },
  cucurucho: { name: 'Cucurucho de coco', plural: 'Cucuruchos de coco', sell: 85, xp: 7 },
  cafeTostado: { name: 'Café tostado', plural: 'Sacos de café tostado', sell: 190, xp: 13 },
  cafeColado: { name: 'Café colado', plural: 'Jarros de café colado', sell: 70, xp: 6 },
  ronAnejo: { name: 'Ron añejo', plural: 'Botellas de ron añejo', sell: 230, xp: 15 },
  dulceLeche: { name: 'Dulce de leche', plural: 'Potes de dulce de leche', sell: 90, xp: 8 },
  jugo: { name: 'Jugo de naranja', plural: 'Jarras de jugo de naranja', sell: 60, xp: 6 },
  pescadoSalado: { name: 'Pescado salado', plural: 'Barriles de pescado salado', sell: 110, xp: 9 },
  soga: { name: 'Soga de henequén', plural: 'Rollos de soga', sell: 95, xp: 8 },
  purosVuelta: { name: 'Puros de Vuelta Abajo', plural: 'Cajas de puros de Vuelta Abajo', sell: 340, xp: 22 },
};

// Recetas: kitchen = el fogón del bohío (y fogon2); trapiche y casaTabaco = los solares de obras de proceso,
// que en cada provincia son otra cosa (molino arrocero, chocolatera, tostadero, destilería…)
const R = (name, needs, time, out, where) => ({ name, needs, time, level: 1, out, where });
const KETCHUP = R('Kétchup', { tomato: 3 }, 30, 'ketchup', ['kitchen', 'fogon2']);
const GUARAPO = R('Guarapo', { cane: 2 }, 45, 'guarapo', ['kitchen', 'fogon2']);

// Animales: kind de modelo (cow, goat, pig, hen, horse, mule, ox, none) y lo que dan.
// slots = cambios a las obras de la finca principal (mismo solar, otro nombre/animal/producto/modelo)
export const PROFILES = {
  granma: {
    name: 'Oriente · Granma', short: 'Granma', blurb: 'Llanos del Cauto: arrozales, vacas de leche y caballos criollos.',
    crops: ['arroz', 'tomato', 'cane'], seeds: { arroz: 8, tomato: 2 },
    slots: {
      vacas: { name: 'Vaquería', detail: 'Vacas criollas: leche para el queso blanco.' },
      chivos: { name: 'Potrero de caballos', detail: 'Caballos criollos: un potro domado cada 5 min.', animal: 'horse', n: 3, produce: { item: 'potro', qty: 1, time: 300 } },
      trapiche: { name: 'Molino arrocero', detail: 'Descascara el arroz y lo ensaca.', model: 'mill' },
      casaTabaco: { name: 'Quesería', detail: 'Leche de la vaquería → queso blanco.', model: 'dairy' },
    },
    recipes: {
      arrozLeche: R('Arroz con leche', { arroz: 2, leche: 1 }, 50, 'arrozLeche', ['kitchen', 'fogon2']),
      guarapo: GUARAPO,
      sacoArroz: R('Saco de arroz', { arroz: 4 }, 70, 'sacoArroz', ['trapiche']),
      quesoBlanco: R('Queso blanco', { leche: 3 }, 90, 'quesoBlanco', ['casaTabaco']),
    },
    demand: { arroz: 1.8, sacoArroz: 1.6, quesoBlanco: 1.5, leche: 1.3 },
    tint: 0xd8f0c0, light: 0xfff0d8, fog: 0xd8c8a0, landmark: 'sierra',
  },
  baracoa: {
    name: 'Baracoa · Guantánamo', short: 'Baracoa', blurb: 'La Primada: cacao, cocoteros y chivos frente al Yunque.',
    crops: ['cacao', 'cocotero', 'tomato'], seeds: { cacao: 6, cocotero: 3 },
    slots: {
      vacas: { name: 'Rebaño de chivas', detail: 'Chivas lecheras: leche cada 2 min.', animal: 'goat', n: 4 },
      chivos: { name: 'Corral de chivos', detail: 'Los chivos dan queso de cabra cada 2 min y medio.' },
      trapiche: { name: 'Chocolatera', detail: 'Tuesta y muele el cacao: chocolate.', model: 'choco' },
      casaTabaco: { name: 'Dulcería', detail: 'Coco rallado con miel en yagua: cucuruchos.', model: 'sweets' },
    },
    recipes: {
      chorote: R('Chorote', { cacao: 2 }, 45, 'chorote', ['kitchen', 'fogon2']),
      ketchup: KETCHUP,
      chocolate: R('Chocolate', { cacao: 3 }, 100, 'chocolate', ['trapiche']),
      cucurucho: R('Cucurucho de coco', { coco: 3 }, 70, 'cucurucho', ['casaTabaco']),
    },
    demand: { cacao: 1.7, chocolate: 1.8, cucurucho: 1.6, coco: 1.4 },
    tint: 0xc0e8b0, light: 0xf0f4e0, fog: 0xb8c8b0, landmark: 'yunque',
  },
  santiago: {
    name: 'Santiago de Cuba', short: 'Santiago', blurb: 'Cafetales de la Sierra, arrias de mulos y ron del Caney.',
    crops: ['cafe', 'tomato', 'cane'], seeds: { cafe: 6, cane: 2 },
    slots: {
      chivos: { name: 'Arria de mulos', detail: 'Los mulos bajan el café de la loma: 3 latas cada 3 min.', animal: 'mule', n: 3, produce: { item: 'cafe', qty: 3, time: 180 } },
      trapiche: { name: 'Tostadero de café', detail: 'Tuesta el grano: café tostado.', model: 'roaster' },
      casaTabaco: { name: 'Destilería', detail: 'Caña de la finca → ron añejo santiaguero.', model: 'distillery' },
    },
    recipes: {
      cafeColado: R('Café colado', { cafe: 2 }, 40, 'cafeColado', ['kitchen', 'fogon2']),
      guarapo: GUARAPO,
      cafeTostado: R('Café tostado', { cafe: 3 }, 90, 'cafeTostado', ['trapiche']),
      ronAnejo: R('Ron añejo', { cane: 3 }, 120, 'ronAnejo', ['casaTabaco']),
    },
    demand: { cafe: 1.7, cafeTostado: 1.8, ronAnejo: 1.4, cafeColado: 1.3 },
    tint: 0xf0dcc0, light: 0xffe4c8, fog: 0xd8b898, landmark: 'morro',
  },
  camaguey: {
    name: 'Camagüey', short: 'Camagüey', blurb: 'Hato ganadero en la sabana: leche, queso, puercos y tinajones.',
    crops: ['tomato', 'cane', 'arroz'], seeds: { tomato: 4, arroz: 4 },
    slots: {
      vacas: { name: 'Hato de vacas', detail: 'Vacas cebú en la sabana: 3 cantinas de leche cada 2 min.', n: 4, produce: { item: 'leche', qty: 3, time: 120 } },
      chivos: { name: 'Potrero de los vaqueros', detail: 'Caballos de vaquero: un potro domado cada 5 min.', animal: 'horse', n: 3, produce: { item: 'potro', qty: 1, time: 300 } },
      cerdos: { name: 'Chiquero grande', detail: 'Puercos criollos: 2 piezas de carne cada 4 min.', n: 4, produce: { item: 'carne', qty: 2, time: 240 } },
      trapiche: { name: 'Quesería', detail: 'Leche del hato → queso blanco camagüeyano.', model: 'dairy' },
      casaTabaco: { name: 'Dulcería de leche', detail: 'Leche hervida con azúcar: dulce de leche.', model: 'sweets' },
    },
    recipes: {
      ketchup: KETCHUP, guarapo: GUARAPO,
      quesoBlanco: R('Queso blanco', { leche: 3 }, 90, 'quesoBlanco', ['trapiche']),
      dulceLeche: R('Dulce de leche', { leche: 2 }, 70, 'dulceLeche', ['casaTabaco']),
    },
    demand: { leche: 1.8, quesoBlanco: 1.8, carne: 1.4, dulceLeche: 1.4 },
    tint: 0xf4ecb8, light: 0xfff0c8, fog: 0xe0cc98, landmark: 'tinajones',
  },
  villas: {
    name: 'Las Villas', short: 'Las Villas', blurb: 'Valle de los Ingenios: caña, tabaco, bueyes, ron y tabaco torcido.',
    crops: ['cane', 'tobacco', 'tomato'], seeds: { cane: 6, tobacco: 2 },
    slots: {
      vacas: { name: 'Yunta de bueyes', detail: 'Los bueyes tiran de la carreta: 3 cañas cada 2 min y medio.', animal: 'ox', n: 2, produce: { item: 'cane', qty: 3, time: 150 } },
      trapiche: { name: 'Destilería de ron', detail: 'Caña → ron añejo (y también azúcar).', model: 'distillery' },
      casaTabaco: { name: 'Casa de tabaco', detail: 'Tuerce las hojas en tabacos.' },
    },
    recipes: {
      guarapo: GUARAPO, ketchup: KETCHUP,
      ronAnejo: R('Ron añejo', { cane: 3 }, 120, 'ronAnejo', ['trapiche']),
      azucar: R('Azúcar', { cane: 3 }, 90, 'azucar', ['trapiche']),
      puros: R('Tabaco torcido', { tobacco: 3 }, 120, 'puros', ['casaTabaco']),
    },
    demand: { cane: 1.4, ronAnejo: 1.8, puros: 1.6, tobacco: 1.3 },
    tint: 0xe8f0c8, light: 0xffecd0, fog: 0xd8c4a0, landmark: 'iznaga',
  },
  matanzas: {
    name: 'Matanzas · Cienfuegos', short: 'Matanzas', blurb: 'Naranjales, henequén y un muelle de pesca en la bahía.',
    crops: ['naranja', 'henequen', 'tomato'], seeds: { naranja: 6, henequen: 3 },
    slots: {
      cerdos: { name: 'Muelle de pesca', detail: 'Los botes traen 3 pescados cada 2 min.', animal: 'none', produce: { item: 'pescado', qty: 3, time: 120 }, model: 'dock' },
      trapiche: { name: 'Desfibradora', detail: 'Saca la fibra del henequén: soga.', model: 'fiber' },
      casaTabaco: { name: 'Salador de pescado', detail: 'Pescado en sal: no se echa a perder.', model: 'nets' },
    },
    recipes: {
      jugo: R('Jugo de naranja', { naranja: 3 }, 40, 'jugo', ['kitchen', 'fogon2']),
      ketchup: KETCHUP,
      soga: R('Soga de henequén', { henequen: 3 }, 90, 'soga', ['trapiche']),
      pescadoSalado: R('Pescado salado', { pescado: 3 }, 90, 'pescadoSalado', ['casaTabaco']),
    },
    demand: { naranja: 1.6, jugo: 1.6, pescado: 1.5, pescadoSalado: 1.7, soga: 1.5 },
    tint: 0xd8ecc8, light: 0xf4f0e0, fog: 0xc0ccc0, landmark: 'bahia',
  },
  pinar: {
    name: 'Pinar del Río', short: 'Pinar', blurb: 'Vuelta Abajo: el mejor tabaco del mundo entre los mogotes.',
    crops: ['tobacco', 'tomato', 'cane'], seeds: { tobacco: 6, tomato: 2 },
    slots: {
      vacas: { name: 'Yunta de bueyes', detail: 'Bueyes que aran la vega: 2 hojas de tabaco cada 2 min y medio.', animal: 'ox', n: 2, produce: { item: 'tobacco', qty: 2, time: 150 } },
      casaTabaco: { name: 'Casa de tabaco de Vuelta Abajo', detail: 'Cura las hojas: tabacos y puros de Vuelta Abajo.' },
    },
    recipes: {
      ketchup: KETCHUP, guarapo: GUARAPO,
      melao: R('Melao de caña', { cane: 2 }, 60, 'melao', ['trapiche']),
      azucar: R('Azúcar', { cane: 3 }, 90, 'azucar', ['trapiche']),
      puros: R('Tabacos torcidos', { tobacco: 3 }, 120, 'puros', ['casaTabaco']),
      purosVuelta: R('Puros de Vuelta Abajo', { tobacco: 4 }, 160, 'purosVuelta', ['casaTabaco']),
    },
    demand: { tobacco: 1.8, puros: 1.6, purosVuelta: 1.8 },
    tint: 0xffd8c0, light: 0xffe8d0, fog: 0xd8c0a8, landmark: 'mogotes', extraTobaccoHouses: true,
  },
  habana: {
    name: 'La Habana', short: 'La Habana', blurb: 'Cultivos de todo un poco, mercado grande y un batey más grande.',
    crops: ['tomato', 'cane', 'tobacco', 'naranja', 'arroz'], seeds: { tomato: 4, naranja: 2, arroz: 2 },
    slots: {
      trapiche: { name: 'Trapiche y alambique', detail: 'Melao, azúcar y ron.' },
      iglesia: { name: 'El mercado', detail: 'Mercado del batey: +15 % en los pedidos de los camiones.', effect: { pay: 0.15 }, model: 'market' },
    },
    recipes: {
      ketchup: KETCHUP, guarapo: GUARAPO,
      jugo: R('Jugo de naranja', { naranja: 3 }, 40, 'jugo', ['kitchen', 'fogon2']),
      melao: R('Melao de caña', { cane: 2 }, 60, 'melao', ['trapiche']),
      azucar: R('Azúcar', { cane: 3 }, 90, 'azucar', ['trapiche']),
      ronAnejo: R('Ron añejo', { cane: 3 }, 120, 'ronAnejo', ['trapiche']),
      puros: R('Tabacos torcidos', { tobacco: 3 }, 120, 'puros', ['casaTabaco']),
    },
    demand: { ronAnejo: 1.4, puros: 1.3, jugo: 1.3 },
    houseDiscount: 0.4, // batey más grande: las casas cuestan 40 % menos
    tint: 0xf4f0d8, light: 0xfff4e4, fog: 0xd8d0c0, landmark: 'habana',
  },
};
export const PROFILE_ORDER = ['granma', 'baracoa', 'santiago', 'camaguey', 'villas', 'matanzas', 'pinar', 'habana'];

// Cada una de las 13 ciudades de la campaña → su provincia
export const CITY_PROFILE = {
  manzanillo: 'granma', bayamo: 'granma', holguin: 'granma',
  baracoa: 'baracoa', santiago: 'santiago', camaguey: 'camaguey',
  spiritus: 'villas', trinidad: 'villas', santaclara: 'villas',
  cienfuegos: 'matanzas', matanzas: 'matanzas',
  pinar: 'pinar', habana: 'habana',
};
export const profileOf = (cityId) => PROFILES[CITY_PROFILE[cityId]] || null;
export const profileIdOf = (cityId) => CITY_PROFILE[cityId] || null;

// Zonas que existen en una finca de provincia (sin campos grandes ni central: esos son de la principal)
export const PV_ZONES = ['camino', 'manigua', 'batey'];
// Lo que trae una finca recién fundada: la tierra inicial + el cantero del este
export const PV_START_PARCELS = ['este'];
