// Extension hooks: otros módulos (p. ej. src/central/*) registran zonas, obras, recursos, cosas, trabajadores,
// lógica, vistas 3D y secciones de UI SIN tocar los archivos compartidos. Ver DESIGN.md → "Extension hooks".
// Todo se registra al importar el módulo, ANTES de crear la partida: añade tu import en src/extensions.js.
import { ITEMS, SELLABLE, STRUCTURES, WORKERS, WORKER_ORDER, WOOD_CAP } from './data.js';
import { ZONES, ZONE_ORDER } from './zones.js';

// ---- recursos (contadores aparte de la canasta: no ocupan almacén)
export const RESOURCES = {
  madera: { name: 'Madera', icon: 'wood', cap: WOOD_CAP, start: 0, hud: true, detail: 'Se saca de la manigua. Sirve para construir.' },
};
export function registerResource(id, def) { RESOURCES[id] = { cap: 9999, start: 0, hud: false, ...def }; }
export function resDefaults() { return Object.fromEntries(Object.entries(RESOURCES).map(([k, r]) => [k, r.start || 0])); }

// ---- zonas del mapa global (rect en casillas de GW×GH; sign = [x, z] del letrero cuando está cerrada)
export function registerZone(id, def) { ZONES[id] = def; if (!ZONE_ORDER.includes(id)) ZONE_ORDER.push(id); }

// ---- cosas de la canasta (vendibles en camiones)
export function registerItem(id, def, { sellable = true } = {}) { ITEMS[id] = def; if (sellable && !SELLABLE.includes(id)) SELLABLE.push(id); }

// ---- obras: { name, detail, price, madera, cost?: { res: {}, items: {} }, level, kind, zone | parcel, x, z, w, h, model?(M) }
export const STRUCT_MODELS = {}; // id → (M, built) => geometry para el mesh estático
export function registerStructure(id, def) { STRUCTURES[id] = def; if (def.model) STRUCT_MODELS[id] = def.model; }

// ---- trabajadores: def como en WORKERS (who, name, detail, price, level, icon, look); hooks.pick(sim, w, free) y hooks.do(sim, w, t)
export const WORKER_HOOKS = {};
export function registerWorker(id, def, hooks = {}) { WORKERS[id] = def; if (!WORKER_ORDER.includes(id)) WORKER_ORDER.push(id); WORKER_HOOKS[id] = hooks; }

// ---- lógica: { id, init?(sim), update?(sim, dt), goals?(sim, target) → [[x,z]] | null, perform?(sim, target) → bool | undefined }
export const SIM_MODULES = [];
export function registerSimModule(mod) { SIM_MODULES.push(mod); }

// ---- vistas 3D por zona: factory(world) → { update?(dt, time, rig), pick?(ray) → 'kind:id' | null, blobs?(add), grassCounts?(f), rebuild?() }
// Se construyen perezosas: cuando la zona se abre o la cámara se acerca.
export const ZONE_VIEWS = {};
export function registerZoneView(zoneId, factory) { ZONE_VIEWS[zoneId] = factory; }

// ---- UI: secciones extra en hojas ('land' = Terreno y obras), acciones data-act, toques en el mundo y desbloqueos por nivel
export const UI_SECTIONS = { land: [] };
export function registerUISection(sheet, fn) { (UI_SECTIONS[sheet] ||= []).push(fn); }
export const UI_ACTS = {};
export function registerAct(name, fn) { UI_ACTS[name] = fn; } // fn(ui, dataset)
export const TAP_HANDLERS = {};
export function registerTap(prefix, fn) { TAP_HANDLERS[prefix] = fn; } // pick devuelve 'prefix:id' → fn(game, id)
export const UNLOCKS = [];
export function registerUnlock(level, text) { UNLOCKS.push({ level, text }); }

// ---- guardado: migraciones (s = estado nuevo ya mezclado, d = lo guardado). Guarda tu estado en s.ext[tuId].
export const MIGRATIONS = [];
export function registerMigration(fn) { MIGRATIONS.push(fn); }
export function runMigrations(s, d) { for (const f of MIGRATIONS) { try { f(s, d); } catch (e) { console.warn('[migración]', e); } } }

// ---- juego: módulos con acceso al Game (vistas propias, botones, cámara). attach(game) al crear la partida; frame(game, dt, time) cada cuadro
// ---- ajustes de la finca (opcionales): henCap(s, base) → tope de gallinas; layFactor(s) → factor del tiempo entre huevos
export const FARM_HOOKS = { henCap: null, layFactor: null, demand: null }; // demand(s, weights): ajusta los pedidos de los camiones
export const GAME_MODULES = [];
export function registerGameModule(mod) { GAME_MODULES.push(mod); }
