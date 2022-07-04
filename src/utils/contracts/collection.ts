import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';
import contractCaller from './contractCaller';
import HinataCollectionFactoryContract from './collectionFactory';
import type { Collection } from '$utils/api/collection';
import { parseUnits } from 'ethers/lib/utils';

export async function contractCreateCollection(options: Collection) {
	try {
		const CollectionFactoryContract = HinataCollectionFactoryContract(get(appSigner));
		console.log(options);
		options.royalties = options.royalties.filter((item) => item.fees && item.address);
		await contractCaller(
			CollectionFactoryContract,
			'spawn',
			150,
			1,
			options.name,
			options.paymentTokenTicker,
			options.slug,
			options.royalties.length > 0 ? options.royalties.map((item) => item.address) : ['0x0000000000000000000000000000000000000000'],
			options.royalties.length > 0 ? options.royalties.map((item) => parseUnits(item.fees.toString(), 2)) : [ parseUnits('0', 2) ],
			false
		);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create collection on chain');
		//return false;
	}
}
