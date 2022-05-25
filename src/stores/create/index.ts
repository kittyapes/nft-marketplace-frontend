import type { DropListingType } from '$interfaces/drops/';
import { writable } from 'svelte/store';

interface NewDropProperties {
	listingType?: DropListingType;
}

interface newNFTs {
	nftId: string;
	amount: number;
}

export const newDropProperties = writable<NewDropProperties>({});
export const newNFTs = writable<newNFTs[]>([]);