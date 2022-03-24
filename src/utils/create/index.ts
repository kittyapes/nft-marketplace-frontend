import { api } from '$constants/api';
import { appProvider } from '$stores/wallet';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import axios from 'axios';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

export const getLastDropID = async () => {
	const marketplaceContract = HinataMarketplaceContract(get(appProvider));
	const maxDropId = +ethers.utils.formatEther(await marketplaceContract.maxDropId());

	return maxDropId;
};

export const generateNewDropID = async () => {
	return await axios
		.get(`${api}/v1/drops/usableDropId`)
		.then((data) => {
			if ((data.data as unknown as { error: any; data: number }).error) {
				throw new Error((data as unknown as { error: any; data: number }).error);
			}
			return data.data.data;
		})
		.catch((err) => {
			return generateNewDropID();
		});
};
