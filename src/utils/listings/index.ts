import type { AuctionDataModel, SaleDataModel } from '$interfaces';
import type { Listing, ListingType } from '$utils/api/listing';
import { LISTING_TYPE } from '$utils/contracts/listing';
import { getContract } from '$utils/misc/getContract';
import { formatToken } from '$utils/misc/priceUtils';
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
export async function getListingUpdatedWithChainData(apiListingData: Listing): Promise<Listing> {
	const listing = cloneDeep(apiListingData);

	const onChainListing: ChainListingData = await getChainListingData(listing.listingId);

	// If the listing is not found on chain, do nothing
	if (onChainListing.id.eq(ethers.constants.Zero)) {
		listing.foundOnChain = false;
		return listing;
	}

	const listingType = enumListingTypeToString(onChainListing.listingType);

	// Each listing type has different type properties shape saved into the 'listing' field,
	// generate that
	let listingData: SaleDataModel | AuctionDataModel;

	// Sale
	if (listingType === 'sale') {
		listingData = {
			price: onChainListing.price.toString(),
			formatPrice: Number.parseFloat(formatToken(onChainListing.price, onChainListing.payToken)),
			quantity: [], // is populated later
		} as SaleDataModel;
	}

	// Auction
	else if (listingType === 'auction') {
		listingData = {
			startingPrice: onChainListing.price.toString(),
			formatStartingPrice: Number.parseFloat(formatToken(onChainListing.price, onChainListing.payToken)),
		} as AuctionDataModel;
	}

	// Other
	else {
		throw new Error('Unsupported listing type read from chain.');
	}

	const updatedListing: Listing = {
		...listing,
		seller: onChainListing.seller,
		// This is temporary, should be changed to a timestamp on the API
		startTime: new Date(onChainListing.startTime.toNumber() * 1000).toISOString(),
		duration: onChainListing.duration.toNumber(),
		listingType: listingType,
		paymentTokenAddress: onChainListing.payToken,
		listing: {
			...listing.listing,
			...listingData,
		},
		nfts: [],
		foundOnChain: true,
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

		// Update sale detail quantity field
		if (listingType === 'sale') {
			(updatedListing.listing as SaleDataModel).quantity.push({ nftFullId: fullId, amount: tokenAmount });
		}
	}

	return updatedListing;
}

/**
 * Determines whether a listing is still valid depending on its expiry and whether
 * it has been found on chain.
 * @param listing A listing object gathered from the API.
 * @param options Can be used to ignore certain properties.
 * @returns Boolean indicating if the listing is valid.
 */
export function isListingValid(listing: Listing, options?: { ignoreExpiry: boolean; ignoreFoundOnChain: boolean }): boolean {
	options = {
		ignoreExpiry: false,
		ignoreFoundOnChain: false,
		...options,
	};

	const endDatetime = dayjs(listing.startTime).add(listing.duration, 'seconds');

	if (dayjs() > endDatetime && !options.ignoreExpiry) {
		return false;
	}

	if (listing.chainStatus !== 'GASLESS' && !listing.foundOnChain && !options.ignoreFoundOnChain) {
		return false;
	}

	return true;
}
