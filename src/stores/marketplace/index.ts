import type { ListingType } from '$utils/api/listing';
import { writable } from 'svelte/store';

// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const collectionFilters = writable<string>(null);
export const filters = writable<{status: Set<ListingType>, price: { priceMin: number; priceMax: number }, collection: string }>({status: new Set([]), price: { priceMin: 0, priceMax: 0 }, collection: '' });
