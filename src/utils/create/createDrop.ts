import axios from 'axios';
import { api } from '$constants/api';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';
import { ethers } from 'ethers';
import { getAxiosConfig } from '$utils/auth/axiosConfig';

export const createDropOnAPI = async ({
	contractId,
	title,
	artist,
	creator,
	description
}: DropPostObject) => {
	const res = await axios.post(
		`${api}/v1/drops`,
		{
			contractId: contractId || 0,
			description,
			title,
			artist,
			creator
		},
		getAxiosConfig()
	);

	return res.data.data as DropApiReturnValue;
};

export const createDropOnChain = async (dropId: string) => {
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
