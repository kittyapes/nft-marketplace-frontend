import { currentUserAddress } from '$stores/wallet';
import type { ListingType } from '$utils/api/listing';
import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
import { derived, writable } from 'svelte/store';

// popup
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const collectionFilters = writable<string>(null);
export const filters = writable<{status: Set<ListingType>, price: { priceMin: number; priceMax: number }, collection: string }>({status: new Set(['sale', 'auction', 'raffle']), price: { priceMin: 0, priceMax: 0 }, collection: '' });