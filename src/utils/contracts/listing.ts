import { appSigner, currentUserAddress } from '$stores/wallet';
import type { ListingType } from '$utils/api/listing';
import type { ethers } from 'ethers';
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
	startingPrice: number;
	duration: number;
	payToken: string;
	quantity: number;
	listingType: LISTING_TYPE;
	tokenIds: string[];
	tokenAmounts: number[];
}

export async function contractCreateListing(options: ContractCreateListingOptions) {
	console.log(options)
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const dropCreationTransaction: ethers.ContractTransaction = await MarketplaceContract.createListing(
			{
			seller: get(currentUserAddress),
			payToken: options.payToken,
			price: options.startingPrice,
			startTime: 0,
			duration: 0,
			quantity: options.quantity,
			listingType: options.listingType,
			tokenIds: options.tokenIds,
			tokenAmounts: options.tokenAmounts,
			}
		);

		// Wait for at least once confirmation
		await dropCreationTransaction.wait(1);
	} catch (error) {
		console.log(error);
		return false;
	}

	return true;
}
