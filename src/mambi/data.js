// La Campaña Mambisa: datos (ciudades, tropas, tácticas, fincas regionales). Alegórico y familiar: un "Régimen" gris sin
// nombre; nadie real aparece. Ver docs/PLAN-MAMBI.md.
export const MAMBI_LEVEL = 35;
export const MAMBI_CENTRAL_STAGE = 4; // el central completo

// Mapa: lon/lat aproximados → coordenadas del mapa (x al este, z al sur). 1° ≈ 10 unidades.
export const K = 10;
export const toMap = (lon, lat) => [(lon + 79.5) * K, -(lat - 21.6) * K];

// Silueta simplificada de Cuba (lon, lat), en sentido horario empezando por el cabo de San Antonio
export const CUBA = [
  [-84.95, 21.86], [-84.45, 22.2], [-84.0, 22.6], [-83.5, 22.85], [-83.0, 22.98], [-82.6, 23.05], [-82.2, 23.15], [-81.6, 23.12],
  [-81.1, 23.15], [-80.5, 23.0], [-79.95, 22.8], [-79.4, 22.55], [-78.7, 22.42], [-78.1, 22.3], [-77.6, 21.95], [-77.1, 21.65],
  [-76.5, 21.3], [-75.9, 21.15], [-75.4, 20.95], [-74.9, 20.65], [-74.45, 20.35], [-74.13, 20.22], [-74.4, 20.05], [-75.0, 19.92],
  [-75.6, 19.9], [-76.2, 19.95], [-76.9, 19.88], [-77.45, 19.85], [-77.7, 19.88], [-77.35, 20.25], [-77.15, 20.55], [-77.6, 20.72],
  [-78.1, 20.75], [-78.6, 21.05], [-79.1, 21.5], [-79.6, 21.7], [-80.1, 21.82], [-80.5, 22.02], [-81.0, 22.05], [-81.45, 22.1],
  [-81.9, 22.2], [-82.1, 22.35], [-82.0, 22.55], [-82.5, 22.65], [-82.95, 22.6], [-83.4, 22.25], [-83.95, 21.95], [-84.45, 21.8],
];
// Isla de la Juventud (decorado)
export const PINOS = [[-83.15, 21.85], [-82.75, 21.92], [-82.55, 21.75], [-82.65, 21.48], [-82.95, 21.42], [-83.15, 21.55]];

// Sierras: [lon, lat, radio°, altura]
export const SIERRAS = [
  [-83.6, 22.6, 0.45, 1.5], [-83.1, 22.75, 0.3, 1.1], // Órganos / Rosario
  [-80.05, 21.95, 0.35, 1.6], [-79.8, 21.95, 0.25, 1.1], // Escambray
  [-76.9, 20.05, 0.35, 2.4], [-76.4, 20.05, 0.35, 2.2], [-77.3, 20.0, 0.25, 1.6], [-75.9, 20.1, 0.3, 1.6], // Sierra Maestra
  [-75.4, 20.55, 0.4, 1.6], [-74.7, 20.35, 0.35, 1.5], // Nipe-Sagua-Baracoa
  [-81.3, 22.85, 0.25, 0.6], [-78.3, 21.6, 0.3, 0.5],
];

// Las seis provincias de la época (por longitud). Tinte del terreno (antes / después de liberarla).
export const PROVINCES = [
  { id: 'pinar', name: 'Pinar del Río', lon: [-85.5, -82.95], tint: 0x8aa04e },
  { id: 'habana', name: 'La Habana', lon: [-82.95, -81.75], tint: 0x9aa65a },
  { id: 'matanzas', name: 'Matanzas', lon: [-81.75, -80.6], tint: 0x8e9a50 },
  { id: 'villas', name: 'Las Villas', lon: [-80.6, -78.7], tint: 0x98a85c },
  { id: 'camaguey', name: 'Camagüey', lon: [-78.7, -77.5], tint: 0xa3a862 },
  { id: 'oriente', name: 'Oriente', lon: [-77.5, -73.5], tint: 0x86a050 },
];
export const provinceAt = (lon) => PROVINCES.find((p) => lon >= p.lon[0] && lon < p.lon[1]) || PROVINCES[0];

// Productos regionales: valor en pesos por unidad, víveres por unidad
export const GOODS = {
  arroz: { name: 'Arroz', icon: 'seed', value: 40, viveres: 2 },
  ganado: { name: 'Ganado', icon: 'leche', value: 90, viveres: 3 },
  cacao: { name: 'Cacao', icon: 'coco', value: 110, viveres: 1 },
  cafe: { name: 'Café', icon: 'cafe', value: 130, viveres: 1 },
  maiz: { name: 'Maíz', icon: 'seed', value: 60, viveres: 3 },
  cana: { name: 'Caña', icon: 'cane', value: 70, viveres: 1 },
  tabaco: { name: 'Tabaco', icon: 'tobacco', value: 160, viveres: 0 },
  pesca: { name: 'Pesca', icon: 'fish', value: 85, viveres: 3 },
  citricos: { name: 'Cítricos', icon: 'guayaba', value: 75, viveres: 2 },
  ron: { name: 'Ron y puerto', icon: 'ron', value: 260, viveres: 1 },
};

// Ciudades en orden de campaña (de oriente a occidente). guards = fuerza de los guardias del Régimen.
// farm: [producto, precio de la finca, unidades por minuto en el nivel 1]
export const CITIES = [
  { id: 'manzanillo', name: 'Manzanillo', lon: -77.12, lat: 20.34, guards: 20, terrain: 'costa', farm: ['arroz', 3000, 6] },
  { id: 'bayamo', name: 'Bayamo', lon: -76.64, lat: 20.38, guards: 32, terrain: 'llano', farm: ['ganado', 4500, 4] },
  { id: 'baracoa', name: 'Baracoa', lon: -74.5, lat: 20.35, guards: 40, terrain: 'monte', farm: ['cacao', 6000, 4] },
  { id: 'santiago', name: 'Santiago de Cuba', lon: -75.82, lat: 20.03, guards: 60, terrain: 'monte', farm: ['cafe', 8000, 4] },
  { id: 'holguin', name: 'Holguín', lon: -76.26, lat: 20.89, guards: 75, terrain: 'llano', farm: ['maiz', 9500, 8] },
  { id: 'camaguey', name: 'Camagüey', lon: -77.92, lat: 21.38, guards: 95, terrain: 'llano', farm: ['ganado', 12000, 7] },
  { id: 'spiritus', name: 'Sancti Spíritus', lon: -79.44, lat: 21.93, guards: 120, terrain: 'llano', farm: ['cana', 14000, 10] },
  { id: 'trinidad', name: 'Trinidad', lon: -79.98, lat: 21.8, guards: 140, terrain: 'monte', farm: ['cafe', 16000, 6] },
  { id: 'santaclara', name: 'Santa Clara', lon: -79.96, lat: 22.4, guards: 170, terrain: 'llano', farm: ['tabaco', 19000, 6] },
  { id: 'cienfuegos', name: 'Cienfuegos', lon: -80.44, lat: 22.15, guards: 200, terrain: 'costa', farm: ['pesca', 22000, 12] },
  { id: 'matanzas', name: 'Matanzas', lon: -81.58, lat: 23.04, guards: 240, terrain: 'costa', farm: ['citricos', 26000, 15] },
  { id: 'pinar', name: 'Pinar del Río', lon: -83.7, lat: 22.42, guards: 290, terrain: 'monte', farm: ['tabaco', 30000, 10] },
  { id: 'habana', name: 'La Habana', lon: -82.36, lat: 23.12, guards: 380, terrain: 'costa', farm: ['ron', 40000, 8] },
];
export const CITY_BY_ID = Object.fromEntries(CITIES.map((c, i) => [c.id, { ...c, n: i }]));

// Tropas
export const UNITS = {
  inf: { name: 'Infantería mambisa', short: 'Infantes', price: 400, viveres: 10, power: 4, detail: 'Guajiros con guayabera, sombrero y fusil viejo. La base del ejército.' },
  cab: { name: 'Caballería al machete', short: 'Jinetes', price: 1200, viveres: 25, power: 10, detail: 'Jinetes con machete en alto: la carga mambisa.' },
  cart: { name: 'Carreta de avituallamiento', short: 'Carretas', price: 800, azucar: 6, power: 0, max: 5, detail: 'Bueyes, víveres y agua: +8 % de fuerza y −5 % de dispersión cada una.' },
};
export const UNIT_ORDER = ['inf', 'cab', 'cart'];
export const ARMY_BASE = 30;
export const ARMY_PER_CITY = 10;
export const CART_POWER = 0.08;
export const CART_SAFE = 0.05;

export const TACTICS = {
  carga: { name: 'Carga al machete', detail: 'Más fuerte cuanta más caballería lleves. Se dispersan más.', loss: 1.25 },
  emboscada: { name: 'Emboscada en la manigua', detail: '¡Fuerte en el monte (×1,25)! Menos dispersión.', loss: 0.8 },
  asedio: { name: 'Asedio con carretas', detail: 'Lento y seguro: +6 % por carreta, casi nadie se dispersa. Hace falta 1 carreta.', loss: 0.45 },
};
export const TACTIC_ORDER = ['carga', 'emboscada', 'asedio'];

// Fincas regionales: multiplicador de renta por nivel y precio de mejora (× precio de la finca)
export const FARM_LEVELS = [null, { mult: 1, up: 0 }, { mult: 2, up: 1.2 }, { mult: 3.5, up: 2.5 }];
export const FARM_OFFLINE_CAP = 8 * 3600; // s
export const LOOT_PER_GUARD = 50;

// Víveres que da cada cosa de la canasta
export const FOOD = ['egg', 'tomato', 'leche', 'queso', 'carne', 'ketchup', 'guarapo', 'melao', 'mango', 'guayaba', 'coco', 'jutia', 'jibaro'];
