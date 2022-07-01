import { HinataMarketplaceContractAddress, WethContractAddress } from '$constants/contractAddresses';
import type { EthAddress, OnChainId, UnixTime } from '$interfaces';
import { appSigner, currentUserAddress } from '$stores/wallet';
import { getIconUrl } from '$utils/misc/getIconUrl';
import { parseToken } from '$utils/misc/priceUtils';
import { notifyError } from '$utils/toast';
import { BigNumber, ethers } from 'ethers';
import { get } from 'svelte/store';
import contractCaller from './contractCaller';
import { getMockErc20TokenContract } from './generalContractCalls';
import HinataMarketplaceContract from './hinataMarketplace';
import HinataMarketplaceStorageContract from './hinataMarketplaceStorage';
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

export const listingTokens = [{ label: 'WETH', iconUrl: getIconUrl('eth.black'), value: WethContractAddress }];
export const whiteListingTokens = [{ label: 'WETH', iconUrl: getIconUrl('eth.light'), value: WethContractAddress }];

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
}

export async function contractCreateListing(options: ContractCreateListingOptions) {
	console.log(options);
	const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
	const MarketplaceStorageContract = HinataMarketplaceStorageContract(get(appSigner));

	const isApproved = await MarketplaceStorageContract.isApprovedForAll(get(currentUserAddress), HinataMarketplaceContractAddress);

	if (!isApproved) {
		const approval: ethers.ContractTransaction = await MarketplaceStorageContract.setApprovalForAll(HinataMarketplaceContractAddress, true);
		await approval.wait(1);
	}

	const callOptions = {
		id: ethers.BigNumber.from(options.listingId),
		seller: get(currentUserAddress),
		payToken: options.payToken,
		price: parseToken(options.price, options.payToken),
		reservePrice: parseToken(options.price, options.payToken),
		startTime: options.startTime,
		duration: options.duration,
		quantity: options.quantity,
		listingType: options.listingType,
		collections: options.collections,
		tokenIds: options.tokenIds,
		tokenAmounts: options.tokenAmounts
	};

	console.debug('[Info] Will call createListing on contract with the following parameters.', callOptions);

	await contractCaller(MarketplaceContract, 'createListing', 150, 1, callOptions);
}

export async function contractPurchaseListing(listingId: string) {
	console.debug('[Listing] Purchasing listing with ID: ' + listingId);

	const contract = HinataMarketplaceContract(get(appSigner));

	const listing = await getOnChainListing(listingId);

	const contractApproved = await ensureAmountApproved(HinataMarketplaceContractAddress, listing.price, listing.payToken);

	if (!contractApproved) {
		notifyError('Insufficient Allowance to Execute Transaction.');
		// No need to proceed if there's no allowance
		return;
	}

	await contractCaller(contract, 'purchaseListing', 150, 1, listingId);
}

export async function getOnChainListing(listingId: string) {
	interface OnChainListing {
		duration: BigNumber;
		id: BigNumber;
		listingType: number;
		payToken: string;
		price: BigNumber;
		quantity: BigNumber;
		seller: string; // seller adddress
		startTime: BigNumber;
	}

	const contract = HinataMarketplaceContract(get(appSigner));
	const onChainListing: OnChainListing = await contract.listings(listingId);

	const token = await getTokenDetails(onChainListing.payToken);

	// Copying over the values to remove the first array vars from chain
	return {
		duration: ethers.utils.formatUnits(onChainListing.duration, 0),
		id: ethers.utils.formatUnits(onChainListing.id, 0),
		listingType: onChainListing.listingType,
		payToken: onChainListing.payToken,
		price: ethers.utils.formatUnits(onChainListing.price, token.decimals),
		quantity: ethers.utils.formatUnits(onChainListing.quantity, 0),
		seller: onChainListing.seller,
		startTime: onChainListing.startTime ? ethers.utils.formatUnits(onChainListing.startTime, 0) : null
	};
}

export async function checkListing() {}

export async function contractCancelListing(listingId: string) {
	console.debug('[Listing] Cancelling listing with ID: ' + listingId);

	const contract = HinataMarketplaceContract(get(appSigner));

	// const tx: ethers.ContractTransaction = await contract.cancelListing(listingId);
	// await tx.wait(1);

	await contractCaller(contract, 'cancelListing', 150, 1, listingId);
}
