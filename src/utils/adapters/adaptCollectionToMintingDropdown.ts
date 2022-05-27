import type { Collection } from '$utils/api/collection';

// NEEDS CHANGING
export function adaptCollectionToMintingDropdown(collection: Collection) {

	let options = {
		label: collection.name,
		value: collection.slug,
		iconUrl: collection.logoImageUrl,
	}
	return options;
}
