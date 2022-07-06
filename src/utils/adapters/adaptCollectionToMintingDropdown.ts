import type { Collection } from '$utils/api/collection';

export function adaptCollectionToMintingDropdown(collection: Collection) {
	let options = {
		label: collection.name,
		value: collection.id,
		iconUrl: collection.logoImageUrl,
		collectionAddress: collection.collectionAddress,
		collectionId: collection.id
	};
	return options;
}
