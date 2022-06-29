import type { Collection } from '$utils/api/collection';
import { currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';

export function adaptCollectionToCollectionCard(collection: Collection, address: string) {
	let options = {
		title: collection.name,
		slug: collection.slug,
		logoUrl: collection.logoImageUrl,
		bannerUrl: collection.backgroundImageUrl,
		ownerAddress: address
	};
	return options;
}
