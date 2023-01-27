import type { Listing, ListingType } from '$utils/api/listing';
import { LISTING_TYPE } from '$utils/contracts/listing';
import { getContract } from '$utils/misc/getContract';
import dayjs from 'dayjs';
import { BigNumber, ethers } from 'ethers';
import { cloneDeep } from 'lodash-es';

interface ChainListingData {
	collections: string[];
	duration: BigNumber;
	id: BigNumber;
	listingType: number;
	payToken: string;
	price: BigNumber;
	reservePrice: BigNumber;
	seller: string;
	startTime: BigNumber;
	tokenAmounts: BigNumber[];
	tokenIds: BigNumber[];
	quantity: BigNumber;
}

export function dateToTimestamp(date: string): number {
	return dayjs(date).unix();
}

export function enumListingTypeToString(enumValue: LISTING_TYPE): ListingType {
	return {
		[LISTING_TYPE.FIXED_PRICE]: 'sale',
		[LISTING_TYPE.TIME_LIMITED_WINER_TAKE_ALL_AUCTION]: 'auction',
	}[enumValue];
}

export function stringListingTypeToEnum(s: ListingType) {
	return {
		sale: LISTING_TYPE.FIXED_PRICE,
		auction: LISTING_TYPE.TIME_LIMITED_WINER_TAKE_ALL_AUCTION,
	}[s];
}

export async function getChainListingData(id: string): Promise<ChainListingData> {
	const contract = getContract('marketplace', true);
	return await contract.getListingInfo(id);
}

export async function listingExistsOnChain(id: string): Promise<boolean> {
	const contract = getContract('marketplace', true);
	return !(await contract.getListingInfo(id)).id.eq(ethers.constants.Zero);
}

/**
 * Takes a listing object returned by the API and updates some of it's values with data
 * retrieved from the chain.
 * @param apiListingData Listing data retrieved from API.
 * @returns A copy of the original object with updated values.
 */
export async function getListingUpdatedWithChainData(apiListingData: Listing): Promise<Listing | void> {
	const listing = cloneDeep(apiListingData);

	const onChainListing: ChainListingData = await getChainListingData(listing.listingId);

	// If the listing is not found on chain, do nothing
	if (onChainListing.id.eq(ethers.constants.Zero)) {
		return;
	}

	console.log({ newOnChain: onChainListing });

	const updatedListing: Listing = {
		...listing,
		seller: onChainListing.seller,
		// This is temporary, should be changed to a timestamp on the API
		startTime: new Date(onChainListing.startTime.toNumber() * 1000).toISOString(),
		duration: onChainListing.duration.toNumber(),
		listingType: enumListingTypeToString(onChainListing.listingType),
		paymentTokenAddress: onChainListing.payToken,
		listing: {
			...listing.listing,
			price: onChainListing.price.toString(),
			reservePrice: onChainListing.reservePrice.toString(),
			quantity: parseInt(onChainListing.quantity.toString()),
		},
		nfts: [],
	};

	for (const [index, tokenId] of onChainListing.tokenIds.entries()) {
		const tokenContract = onChainListing.collections[index];
		// The following is not safe and should be refactorized
		const tokenAmount = onChainListing.tokenAmounts[index].toNumber();

		const fullId = tokenContract + ':' + tokenId;

		const originalNftData = listing.nfts.find((nft) => (nft.fullId = fullId));

		updatedListing.nfts.push({
			...originalNftData,
			amount: tokenAmount,
		});
	}

	return updatedListing;
}
