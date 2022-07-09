import type { EthAddress, OnChainId, UnixTime } from '$interfaces';
import { currentUserAddress } from '$stores/wallet';
import { getContract } from '$utils/misc/getContract';
import { getIconUrl } from '$utils/misc/getIconUrl';
import { parseToken } from '$utils/misc/priceUtils';
import { notifyError } from '$utils/toast';
import { BigNumber, ethers } from 'ethers';
import { get } from 'svelte/store';
import { getCollectionContract } from './collection';
import contractCaller from './contractCaller';
import { ensureAmountApproved, getTokenDetails } from './token';

export enum LISTING_TYPE {
	FIXED_PRICE,
	INVENTORIED_FIXED_PRICE,
	TIME_LIMITED_WINER_TAKE_ALL_AUCTION,
	TIERED_1_OF_N_AUCTION,
	TIME_LIMITED_PRICE_PER_TICKET_RAFFLE,
	TIME_LIMITED_1_OF_N_WINNING_TICKETS_RAFFLE
}

export const listingDurationOptions = [
	{ label: '1 day', value: 1 * 24 * 3600 },
	{ label: '3 days', value: 3 * 24 * 3600 },
	{ label: '7 days', value: 7 * 24 * 3600 },
	{ label: '1 month', value: 30 * 24 * 3600 },
	{ label: '3 months', value: 90 * 24 * 3600 },
	{ label: '6 months', value: 180 * 24 * 3600 }
];

export const listingTokens = [{ label: 'WETH', iconUrl: getIconUrl('eth.black') }];
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
	tokenAmounts: BigNumber[];
	collections: EthAddress[];
	nfts: { nftId: string; amount: BigNumber; collectionAddress: EthAddress }[];
}

export async function contractCreateListing(options: ContractCreateListingOptions) {
	const marketplaceContract = getContract('marketplace');
	const collectionContract = await getCollectionContract(options.nfts[0].collectionAddress);

	// TODO: Check Approval for All NFTS being listed - loop
	const isApproved = await collectionContract.isApprovedForAll(get(currentUserAddress), marketplaceContract.address);

	if (!isApproved) {
		const approval: ethers.ContractTransaction = await collectionContract.setApprovalForAll(marketplaceContract.address, true);
		await approval.wait(1);
	}

	const callOptions = {
		id: ethers.BigNumber.from(options.listingId),
		seller: get(currentUserAddress),
		payToken: options.payToken,
		price: parseToken(options.price, options.payToken),
		reservePrice: parseToken(options.reservePrice, options.payToken),
		startTime: options.startTime,
		duration: options.duration,
		quantity: options.quantity,
		listingType: options.listingType,
		collections: options.collections,
		tokenIds: options.tokenIds,
		tokenAmounts: options.tokenAmounts
	};

	console.debug('[Info] Will call createListing on contract with the following parameters.', callOptions);

	await contractCaller(marketplaceContract, 'createListing', 150, 1, callOptions);
}

export async function contractPurchaseListing(listingId: string) {
	console.debug('[Listing] Purchasing listing with ID: ' + listingId);

	const contract = getContract('marketplace');
	const listing = await getOnChainListing(listingId);

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
	reservePrice: string;
	startTime: number;
	duration: number;
	quantity: number;
	listingType: LISTING_TYPE;
}

export async function getOnChainListing(listingId: string): Promise<ChainListing> {
	const contract = getContract('marketplace');
	const onChainListing = await contract.listings(listingId);

	const token = await getTokenDetails(onChainListing.payToken);

	// Copying over the values to remove the first array vars from chain
	return {
		duration: onChainListing.duration.toNumber(),
		id: ethers.utils.formatUnits(onChainListing.id, 0),
		listingType: onChainListing.listingType,
		payToken: onChainListing.payToken,
		price: ethers.utils.formatUnits(onChainListing.price, token.decimals),
		reservePrice: ethers.utils.formatUnits(onChainListing.reservePrice),
		quantity: onChainListing.quantity.toNumber(),
		seller: onChainListing.seller,
		startTime: onChainListing.startTime ? onChainListing.startTime.toNumber() : null
	};
}

export async function contractCancelListing(listingId: string) {
	console.debug('[Listing] Cancelling listing with ID: ' + listingId);

	const contract = getContract('marketplace');
	await contractCaller(contract, 'cancelListing', 150, 1, listingId);
}

export async function contractUpdateListing(
	listingId: string,
	options: {
		sale: {
			price: string;
		};
		payTokenAddress: string;
	}
) {
	console.debug(`[Info] Will update listing with ID ${listingId} with the following options:`, options);

	const parsedPrice = parseToken(options.sale.price, options.payTokenAddress);

	const contract = getContract('marketplace');
	await contractCaller(contract, 'updateListing', 150, 1, listingId, parsedPrice);
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
