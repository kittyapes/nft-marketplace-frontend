import type { Collection } from '$utils/api/collection';

// NEEDS CHANGING
export async function adaptCollectionToMintingDropdown(collection: Collection) {

	let options = {
		label: collection.name,
		value: '',
		iconUrl: collection.logoImageUrl,
	}
	return options;
}
