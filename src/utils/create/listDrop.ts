import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import axios from 'axios';
import { ethers } from 'ethers';
import type { CreateListingOnChainObject } from 'src/interfaces/drops/listing/createListingOnChainObject';
import type { CreateListingServerObject } from 'src/interfaces/drops/listing/createListingServerObject';
import { get } from 'svelte/store';

export const listDropOnAPI = async ({
	dropId,
	type,
	price,
	creator
}: CreateListingServerObject) => {
	const res = await axios.post(
		`${api}/v1/listings`,
		{
			dropId,
			type,
			price,
			creator
		},
		getAxiosConfig()
	);

	return res.data.data;
};

export const listDropOnChain = async ({
	dropId,
	startingPrice,
	endingPrice,
	duration, // in seconds
	payToken, // address
	quantity, // default is 1 - for inventoried drop pass > 1
	listingType
}: CreateListingOnChainObject) => {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const createListingTransaction: ethers.ContractTransaction =
			await MarketplaceContract.createListing(
				ethers.utils.parseEther(dropId.toString()),
				ethers.utils.parseEther(startingPrice.toString()),
				ethers.utils.parseEther(endingPrice.toString()),
				ethers.utils.parseEther(duration.toString()), // in seconds
				payToken, // address
				ethers.utils.parseEther(quantity.toString()), // default is 1 - for inventoried drop pass > 1
				ethers.utils.parseEther(listingType.toString())
			);

		// Wait for at least once confirmation
		await createListingTransaction.wait(1);

		return true;
	} catch (error) {
		console.log(error);
		// Can also notify error
		return false;
	}
};
