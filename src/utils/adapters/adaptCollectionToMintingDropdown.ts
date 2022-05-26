import { apiGetCollection, Collection } from '$utils/api/collection';

// NEEDS CHANGING
export async function adaptCollectionToMintingDropdown(collection: Collection) {
	let collectionData = await apiGetCollection(collection._id);
	console.log(collectionData);
	let options = {
		label: collection.name,
		value: collection.name,
		iconUrl: collection.logoImageUrl,
	}
	return options;
}
