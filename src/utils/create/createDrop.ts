import axios from 'axios';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';
import { ethers } from 'ethers';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import type { DropApiReturnValue } from 'src/interfaces/drops/dropApiReturnValue';
import type { DropPostObject } from 'src/interfaces/drops/dropPostObject';
import { getApiUrl } from '$utils/api';

export const createDropOnAPI = async ({ contractId, title, artist, creator, description }: DropPostObject) => {
	const res = await axios.post(
		getApiUrl('latest', 'drops'),
		{
			contractId: contractId,
			description,
			title,
			artist,
			creator
		},
		getAxiosConfig()
	);

	return res.data.data as DropApiReturnValue;
};

export const createDropOnChain = async (dropId: number) => {
	try {
		console.log('here 1');
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		console.log('here 2');
		const dropCreationTransaction: ethers.ContractTransaction = await MarketplaceContract.createDrop(dropId);
		console.log('here 3');

		// Wait for at least once confirmation
		await dropCreationTransaction.wait(1);
		console.log('here 4');

		return true;
	} catch (error) {
		console.log(error);
		// Can also notify error
		return false;
	}
};
