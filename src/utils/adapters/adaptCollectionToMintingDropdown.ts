import type { Collection } from '$utils/api/collection';

export function adaptCollectionToMintingDropdown(collection: Collection) {
	const options = {
		label: collection.name,
		value: collection.id,
		iconUrl: collection.logoImageUrl,
		collectionAddress: collection.collectionAddress,
	};

	return options;
}
