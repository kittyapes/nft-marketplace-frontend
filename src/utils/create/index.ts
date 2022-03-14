import { appProvider } from '$stores/wallet';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

export const getLastDropID = async () => {
	const marketplaceContract = HinataMarketplaceContract(get(appProvider));
	const maxDropId = +ethers.utils.formatEther(await marketplaceContract.maxDropId());

	return maxDropId;
};
