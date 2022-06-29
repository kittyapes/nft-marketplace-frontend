import type { Collection } from '$utils/api/collection';

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
