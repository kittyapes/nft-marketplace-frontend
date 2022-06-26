import type { ListingType } from '$utils/api/listing';
import { writable } from 'svelte/store';

// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const collectionFilters = writable<string>(null);
export const filters = writable<{ status: Set<ListingType>; price: { min: number; max: number }; collection: string }>({ status: new Set(['sale']), price: { min: 0, max: 0 }, collection: '' });
