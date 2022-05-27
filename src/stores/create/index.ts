import type { DropListingType } from '$interfaces/drops/';
import type { NftDraft } from '$interfaces/nft/nftDraft';
import { writable } from 'svelte/store';

interface NewDropProperties {
	listingType?: DropListingType;
}


export const newDropProperties = writable<NewDropProperties>({});
export const nftDraft = writable<Partial<NftDraft>>({});