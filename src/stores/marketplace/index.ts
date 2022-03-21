import { writable } from 'svelte/store';

// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const statusFilters = writable<Set<string>>(new Set());
export const priceFilters = writable<{ min: number; max: number }>({ min: 0, max: 0 });
