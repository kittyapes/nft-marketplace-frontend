import type { Collection } from '$utils/api/collection';

export function adaptCollectionToMintingDropdown(collection: Collection) {
	let options = {
		label: collection.name,
		value: collection.id,
		iconUrl: collection.logoImageUrl,
		contractAddress: collection.collectionAddress
	};
	return options;
}
