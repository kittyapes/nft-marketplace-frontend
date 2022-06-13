import type { Collection } from '$utils/api/collection';

export function adaptCollectionToCollectionCard(collection: Collection) {
	let options = {
		title: collection.name,
        slug: collection.slug,
		logoUrl: collection.logoImageUrl,
		bannerUrl: collection.backgroundImageUrl,
	}
	return options;
}
