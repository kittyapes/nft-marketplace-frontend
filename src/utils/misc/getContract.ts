import { appSigner } from '$stores/wallet';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import HinataMarketplaceStorageContract from '$utils/contracts/hinataMarketplaceStorage';
import { get } from 'svelte/store';

export function getContract(contract: 'marketplace' | 'storage') {
	const signer = get(appSigner);

	return {
		marketplace: HinataMarketplaceContract(signer),
		storage: HinataMarketplaceStorageContract(signer)
	}[contract];
}
