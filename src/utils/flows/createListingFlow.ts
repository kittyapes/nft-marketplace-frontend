import type { EthAddress, UnixTime } from '$interfaces';
import { getApiUrl } from '$utils/api';
import type { ListingType } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { contractCreateListing, LISTING_TYPE } from '$utils/contracts/listing';
import { notifyError, notifySuccess } from '$utils/toast';
import axios from 'axios';
import type { BigNumber } from 'ethers';
import { noTryAsync } from 'no-try';

export interface CreateListingFlowOptions {
	nfts: { nftId: string; amount: BigNumber }[];
	paymentTokenAddress: EthAddress;
	paymentTokenTicker: string;
	title: string;
	description: string;
	quantity: BigNumber;
	listingType: ListingType;
	startTime: UnixTime;

	/** Sale duration in seconds. */
	duration: number;

	sale?: {
		price: BigNumber;
	};

	auction?: {
		startingPrice: BigNumber;
		reservePrice: BigNumber;
	};
}

export async function createListingFlow(options: CreateListingFlowOptions) {
	// Create listing on the server
	const formData = new FormData();

	const nfts = options.nfts.map(({ nftId, amount }) => ({ nftId, amount: amount.toString() }));

	const fields = {
		nfts: JSON.stringify(nfts),
		title: options.title || 'No Title',
		paymentTokenAddress: options.paymentTokenAddress,
		paymentTokenTicker: 'ETH', // hotfix options.paymentTokenTicker,
		description: options.description || 'No Description',
		listingType: options.listingType,
		duration: options.duration.toString(),
		startTime: options.startTime.toString()
	};

	const listing = {};

	// Sale specific
	if (options.sale?.price) {
		listing['price'] = options.sale.price.toString();
		listing['quantity'] = options.quantity.toString();
	}

	// Auction specific
	if (options.auction?.startingPrice) {
		listing['startingPrice'] = options.auction.startingPrice.toString();
	}

	if (options.auction?.reservePrice) {
		listing['reservePrice'] = options.auction.reservePrice.toString();
	}

	// Append listing to formData
	fields['listing'] = JSON.stringify(listing);

	for (const [key, value] of Object.entries(fields)) {
		formData.append(key, value);
	}

	const [err, res] = await noTryAsync(() => axios.post(getApiUrl('latest', 'listings'), formData, getAxiosConfig()));

	if (err) {
		console.error(err);
		notifyError('Server request failed.');
		return { err };
	}

	// Retrieve new listing ID from server response
	const listingId = res.data.data.listingId;
	console.debug('[Listing] Will create listing on chain with id: ' + listingId);

	// Create listing on chain
	const tokenIds = options.nfts.map((nft) => nft.nftId);
	const tokenAmounts = options.nfts.map((nft) => nft.amount);

	let price: BigNumber;

	if (options.listingType === 'sale') {
		price = options.sale?.price;
	} else if (options.listingType === 'auction') {
		price = options.auction?.startingPrice;
	}

	try {
		await contractCreateListing({
			payToken: options.paymentTokenAddress,
			listingId: listingId,
			listingType: LISTING_TYPE.FIXED_PRICE,
			price,
			startTime: options.startTime,
			duration: options.duration,
			tokenIds,
			tokenAmounts,
			quantity: 1
		});
	} catch (err) {
		console.error(err);
		return { err: new Error(err.error?.message) || err };
	}

	notifySuccess('Successfully created a listing.');

	return { success: true };
}