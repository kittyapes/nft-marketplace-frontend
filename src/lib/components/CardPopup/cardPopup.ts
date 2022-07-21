import { writable } from 'svelte/store';

export const _refreshOnChainListingHelper = writable(0);

export function refreshOnChainListing() {
	_refreshOnChainListingHelper.update((v) => v + 1);
}
