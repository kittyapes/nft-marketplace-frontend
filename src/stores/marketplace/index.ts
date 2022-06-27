import type { MarketplaceFilters } from '$interfaces/marketplaceFilters';
import { writable } from 'svelte/store';



// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const collectionQuery = writable<string>('');
export const filters = writable<MarketplaceFilters>({ status: new Set([]), sortBy: 'NEWEST' });
