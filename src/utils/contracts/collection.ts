import { get } from 'svelte/store';
import { appSigner, currentUserAddress } from '$stores/wallet';
import contractCaller from "./contractCaller";
import HinataCollectionFactoryContract from "./collectionFactory";
import type { Collection } from "$utils/api/collection";

export async function contractCreateCollection(options: Collection) {
    try {
		const CollectionFactoryContract = HinataCollectionFactoryContract(get(appSigner));
		
		await contractCaller(CollectionFactoryContract, 'spawn', 150, 1, options.name, options.paymentTokenTicker, options.slug, options.royalties[0].address ? options.royalties[0].address : '0x0000000000000000000000000000000000000000', options.royalties[0].fees ?? 0, false);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create collection on chain');
		//return false;
	}
}