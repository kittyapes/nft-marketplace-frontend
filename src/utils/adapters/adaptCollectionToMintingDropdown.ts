import type { Collection } from '$utils/api/collection';

// NEEDS CHANGING
export function adaptCollectionToMintingDropdown(collection: Collection) {

	let options = {
		label: collection.name,
		value: collection._id,
		iconUrl: collection.logoImageUrl,
	}
	return options;
}
