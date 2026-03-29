export const FILTER_CATEGORIES_KEY = 'filter_categories';

export interface FilterCategory {
  label: string;
  icon: string;
  color: string;
}

/** Todas las categorías disponibles para filtrar (excluye Todos y Favoritos que son especiales) */
export const ALL_CATEGORY_FILTERS: FilterCategory[] = [
  { label: 'Viaje', icon: 'flight_takeoff', color: 'text-blue-500' },
  { label: 'Comida', icon: 'restaurant', color: 'text-orange-500' },
  { label: 'Cine', icon: 'movie', color: 'text-purple-500' },
  { label: 'Hito', icon: 'celebration', color: 'text-yellow-500' },
  { label: 'Tometa', icon: 'local_bar', color: 'text-red-500' },
  { label: 'Cumpleaños', icon: 'cake', color: 'text-pink-500' },
  { label: 'Plan espontáneo', icon: 'bolt', color: 'text-green-500' },
  { label: 'Tarde con amigos', icon: 'group', color: 'text-sky-500' },
  { label: 'Sorpresa', icon: 'card_giftcard', color: 'text-indigo-500' },
  { label: 'Fiesta', icon: 'celebration', color: 'text-pink-500' },
  { label: 'Plan Casero', icon: 'home', color: 'text-gray-500' },
  { label: 'Deporte', icon: 'fitness_center', color: 'text-green-600' },
  { label: 'Libro', icon: 'menu_book', color: 'text-violet-500' },
  { label: 'Amor', icon: 'favorite', color: 'text-rose-500' },
];

/** Obtiene las categorías visibles en el filtro. Si no hay config, devuelve todas. */
export function getVisibleFilterCategories(): string[] {
  if (typeof window === 'undefined') return ALL_CATEGORY_FILTERS.map(f => f.label);
  try {
    const saved = localStorage.getItem(FILTER_CATEGORIES_KEY);
    if (!saved) return ALL_CATEGORY_FILTERS.map(f => f.label);
    const parsed = JSON.parse(saved) as string[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ALL_CATEGORY_FILTERS.map(f => f.label);
  } catch {
    return ALL_CATEGORY_FILTERS.map(f => f.label);
  }
}

/** Guarda las categorías visibles en el filtro. */
export function setVisibleFilterCategories(labels: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FILTER_CATEGORIES_KEY, JSON.stringify(labels));
}

/** Devuelve la config de filtros a mostrar: Todos, Favoritos + categorías visibles. */
export function getFiltersToDisplay(): FilterCategory[] {
  const visible = getVisibleFilterCategories();
  const categorySet = new Set(visible);
  const categories = ALL_CATEGORY_FILTERS.filter(f => categorySet.has(f.label));
  return [
    { label: 'Todos', icon: 'apps', color: 'text-gray-500' },
    { label: 'Favoritos', icon: 'favorite', color: 'text-primary' },
    ...categories,
  ];
}
