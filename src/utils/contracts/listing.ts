import { appSigner } from '$stores/wallet';
import type { ListingType } from '$utils/api/listing';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import HinataMarketplaceContract from './hinataMarketplace';

export enum LISTING_TYPE {
	FIXED_PRICE,
	INVENTORIED_FIXED_PRICE,
	TIME_LIMITED_WINER_TAKE_ALL_AUCTION,
	TIERED_1_OF_N_AUCTION,
	TIME_LIMITED_PRICE_PER_TICKET_RAFFLE,
	TIME_LIMITED_1_OF_N_WINNING_TICKETS_RAFFLE
}

export interface ContractCreateListingOptions {
	bundleId: string;
	startingPrice: number;
	endingPrice: number;
	duration: number;
	payToken: string;
	quantity: number;
	listingType: LISTING_TYPE;
}

export async function contractCreateListing(options: ContractCreateListingOptions) {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));

		console.log(options);

		const dropCreationTransaction: ethers.ContractTransaction = await MarketplaceContract.createListing(
			options.bundleId,
			ethers.utils.parseEther(options.startingPrice.toString()),
			ethers.utils.parseEther(options.endingPrice.toString()),
			options.duration,
			options.payToken,
			options.quantity,
			options.listingType
		);

		// Wait for at least once confirmation
		await dropCreationTransaction.wait(1);
	} catch (error) {
		console.log(error);
		return false;
	}

	return true;
}
