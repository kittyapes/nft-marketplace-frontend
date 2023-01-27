import type { EthAddress, OnChainId, UnixTime } from '$interfaces';
import type { ConfigurableListingProps } from '$interfaces/listing';
import { getContract } from '$utils/misc/getContract';
import { getIconUrl } from '$utils/misc/getIconUrl';
import { parseToken } from '$utils/misc/priceUtils';
import { notifyError } from '$utils/toast';
import { BigNumber, ethers } from 'ethers';
import contractCaller from './contractCaller';
import { ensureAmountApproved, getTokenDetails } from './token';

export enum LISTING_TYPE {
	FIXED_PRICE,
	INVENTORIED_FIXED_PRICE,
	TIME_LIMITED_WINER_TAKE_ALL_AUCTION,
	TIERED_1_OF_N_AUCTION,
	TIME_LIMITED_PRICE_PER_TICKET_RAFFLE,
	TIME_LIMITED_1_OF_N_WINNING_TICKETS_RAFFLE,
}

export const listingTokens = [{ label: 'WETH', iconUrlOrComponent: getIconUrl('eth.black') }];
export const whiteListingTokens = [{ label: 'WETH', iconUrl: getIconUrl('eth.light') }];

export interface ContractCreateListingOptions {
	price: string;
	reservePrice: string;
	duration: number;
	startTime: UnixTime;
	payToken: EthAddress;
	quantity: number;
	listingId: OnChainId;
	listingType: LISTING_TYPE;
	tokenIds: OnChainId[];
	tokenAmounts: number[];
	collections: EthAddress[];
	nfts: { nftId: string; amount: number; collectionAddress: EthAddress }[];
}

export async function contractPurchaseListing(listingId: string) {
	console.debug('[Listing] Purchasing listing with ID: ' + listingId);

	const contract = getContract('marketplace');
	const listing = await getOnChainListing(listingId);

	if (!listing?.isValidOnChainListing) {
		notifyError('Failed to Make Purchase: Listing is no longer valid');
		return;
	}

	const contractApproved = await ensureAmountApproved(contract.address, listing.price, listing.payToken);

	if (!contractApproved) {
		notifyError('Insufficient Allowance to Execute Transaction.');
		// No need to proceed if there's no allowance
		return;
	}

	await contractCaller(contract, 'purchaseListing', 150, 1, listingId);
}

export interface ChainListing {
	id: string;
	seller: string;
	payToken: string;
	price: string;
	rawPrice: BigNumber;
	reservePrice: string;
	startTime: number;
	duration: number;
	quantity: number;
	listingType: LISTING_TYPE;
	isValidOnChainListing: boolean;
	tokensMap: {
		tokenId: string;
		collectionAddress: string;
		tokenQuantityInListing: number;
	};
}
export interface ChainListing {
	id: string;
	seller: string;
	payToken: string;
	price: string;
	rawPrice: BigNumber;
	reservePrice: string;
	startTime: number;
	duration: number;
	quantity: number;
	listingType: LISTING_TYPE;
	isValidOnChainListing: boolean;
	tokensMap: {
		tokenId: string;
		collectionAddress: string;
		tokenQuantityInListing: number;
	};
}

export async function getOnChainListing(listingId: string): Promise<ChainListing> {
	const contract = getContract('marketplace', true);
	const onChainListing = await contract.getListingInfo(listingId);
	// if on chain listing is not valid, return null
	const onChainId = ethers.utils.formatUnits(onChainListing?.id, 0);

	const token = await getTokenDetails(onChainListing?.payToken);

	// Copying over the values to remove the first array vars from chain
	const onChainObj: ChainListing = {
		duration: onChainListing?.duration.toNumber(),
		id: ethers.utils.formatUnits(onChainListing?.id, 0),
		listingType: onChainListing?.listingType,
		payToken: onChainListing?.payToken,
		price: ethers.utils.formatUnits(onChainListing?.price, token.decimals),
		rawPrice: onChainListing?.price,
		reservePrice: ethers.utils.formatUnits(onChainListing?.reservePrice),
		quantity: onChainListing?.quantity.toNumber(),
		seller: onChainListing?.seller,
		startTime: onChainListing?.startTime ? onChainListing?.startTime.toNumber() : null,
		isValidOnChainListing: onChainId === listingId.toString(),
		tokensMap: onChainListing.tokenIds.map((tokenId: ethers.BigNumberish, tokenIndex: number) => {
			return {
				tokenId: ethers.utils.formatUnits(tokenId, 0),
				collectionAddress: onChainListing.collections[tokenIndex],
				tokenQuantityInListing: onChainListing.tokenAmounts[tokenIndex].toNumber(),
			};
		}),
	};

	return onChainObj;
}

export async function contractCancelListing(listingId: string) {
	console.debug('[Listing] Cancelling listing with ID: ' + listingId);

	const contract = getContract('marketplace');
	await contractCaller(contract, 'cancelListing', 150, 1, listingId);
}

export async function contractUpdateListing(listingId: string, payTokenAddress: string, props: Partial<ConfigurableListingProps>) {
	console.debug(`[Info] Will update listing with ID ${listingId} with the following props:`, props);

	const parsedPrice = parseToken(props.price, payTokenAddress);

	const contract = getContract('marketplace');
	await contractCaller(contract, 'updateListing', 150, 1, listingId, parsedPrice, props.startDateTs, props.durationSeconds, props.quantity);
}

export async function getMarketFee() {
	try {
		const marketplaceContract = getContract('marketplace', true);
		const fee = await marketplaceContract.marketFee();

		return +ethers.utils.formatUnits(fee, 2);
	} catch (error) {
		return 0;
	}
}
