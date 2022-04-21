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
		getApiUrl('sprint-26', 'drops'),
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
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const dropCreationTransaction: ethers.ContractTransaction = await MarketplaceContract.createDrop(ethers.utils.parseEther(dropId.toString()));

		// Wait for at least once confirmation
		await dropCreationTransaction.wait(1);

		return true;
	} catch (error) {
		console.log(error);
		// Can also notify error
		return false;
	}
};
