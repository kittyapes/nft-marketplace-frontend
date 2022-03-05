import axios from 'axios';
import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/api';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';
import { ethers } from 'ethers';

export const createDropOnAPI = async ({
	contractId,
	title,
	artist,
	creator,
	description,
	signature
}: DropPostObject) => {
	const res = await axios.post(
		`${api}/v1/drops`,
		{
			contractId: contractId || 0,
			description,
			title,
			artist,
			creator,
			signature
		},
		getAxiosConfig()
	);

	return res.data.data;
};

export const createDropOnChain = async (dropId: number) => {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const dropCreationTransaction: ethers.ContractTransaction =
			await MarketplaceContract.createDrop(ethers.utils.parseEther(dropId.toString()));

		// Wait for at least once confirmation
		await dropCreationTransaction.wait(1);

		return true;
	} catch (error) {
		console.log(error);
		// Can also notify error
		return false;
	}
};
