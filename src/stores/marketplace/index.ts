import { currentUserAddress } from '$stores/wallet';
import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
import { derived, writable } from 'svelte/store';

// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const statusFilters = writable<Set<string>>(new Set());
export const priceFilters = writable<{ min: number; max: number }>({ min: 0, max: 0 });