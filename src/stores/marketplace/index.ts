import { currentUserAddress } from '$stores/wallet';
import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
import { derived, writable } from 'svelte/store';

// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
//export const statusFilters = writable<Set<string>>(new Set());
//export const priceFilters = writable<{ min: number; max: number }>({ min: 0, max: 0 });
export const collectionFilters = writable<string>(null);
export const filters = writable<{status: Set<string>, price: { min: number; max: number }, collection: string }>({status: new Set(), price: { min: 0, max: 0 }, collection: '' });