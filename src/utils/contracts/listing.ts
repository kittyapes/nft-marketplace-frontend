import { HinataMarketplaceContractAddress, HinataMarketplaceStorageContractAddress } from '$constants/contractAddresses';
import { appSigner, currentUserAddress } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import HinataMarketplaceContract from './hinataMarketplace';
import HinataMarketplaceStorageContract from './hinataMarketplaceStorage';

export enum LISTING_TYPE {
	FIXED_PRICE,
	INVENTORIED_FIXED_PRICE,
	TIME_LIMITED_WINER_TAKE_ALL_AUCTION,
	TIERED_1_OF_N_AUCTION,
	TIME_LIMITED_PRICE_PER_TICKET_RAFFLE,
	TIME_LIMITED_1_OF_N_WINNING_TICKETS_RAFFLE
}

export interface ContractCreateListingOptions {
	startingPrice: string;
	duration: number;
	startTime: number;
	payToken: string;
	quantity: number;
	listingId: number;
	listingType: LISTING_TYPE;
	tokenIds: string[];
	tokenAmounts: number[];
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

	const listingCreationTransaction: ethers.ContractTransaction = await MarketplaceContract.createListing({
		id: ethers.BigNumber.from(options.listingId),
		seller: get(currentUserAddress),
		payToken: options.payToken,
		price: options.startingPrice,
		startTime: options.startTime,
		duration: options.duration,
		quantity: options.quantity,
		listingType: options.listingType,
		tokenIds: options.tokenIds,
		tokenAmounts: options.tokenAmounts
	});

	// Wait for at least once confirmation
	await listingCreationTransaction.wait(1);
}

export async function contractPurchaseListing(listingId: string) {
	console.log(listingId);

	const contract = HinataMarketplaceContract(get(appSigner));

	const tx: ethers.ContractTransaction = await contract.purchaseListing(listingId);
	await tx.wait(1);
}
