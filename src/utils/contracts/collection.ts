import HinataMarketplaceStorageContract from "./hinataMarketplaceStorage";
import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';
import contractCaller from "./contractCaller";
import HinataCollectionFactoryContract from "./collectionFactory";
import type { Collection } from "$utils/api/collection";

export async function contractCreateCollection(options: Collection) {
    try {
		const CollectionFactoryContract = HinataCollectionFactoryContract(get(appSigner));
     
		await contractCaller(CollectionFactoryContract, 'spawn', 150, 1, options.name, options.paymentTokenTicker, 'hinata', options.royalties, false);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create collection on chain');
		//return false;
	}
}