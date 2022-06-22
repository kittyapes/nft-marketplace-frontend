import { appSigner } from '$stores/wallet';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { get } from 'svelte/store';

export function getContract(contract: 'marketplace') {
	return {
		marketplace: HinataMarketplaceContract(get(appSigner))
	}[contract];
}
