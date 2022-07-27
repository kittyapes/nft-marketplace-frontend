import type { EthAddress } from '$interfaces';
import type { ConfigurableListingProps } from '$interfaces/listing';
import { getApiUrl } from '$utils/api';
import type { ListingType } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { contractCreateListing, LISTING_TYPE } from '$utils/contracts/listing';
import { parseToken } from '$utils/misc/priceUtils';
import { notifySuccess } from '$utils/toast';
import axios from 'axios';
import dayjs from 'dayjs';

export interface CreateListingFlowOptions extends Partial<ConfigurableListingProps> {
	nfts: { nftId: string; collectionAddress: EthAddress; amount: number; _id: string }[];
	paymentTokenAddress: EthAddress;
	paymentTokenTicker: string;
	title: string;
	description: string;
	listingType: ListingType;
}

export async function createListingFlow(options: CreateListingFlowOptions) {
	const token = options.paymentTokenAddress;

	const weiPrice = parseToken(options.price, token, 0).toString();
	const weiStartingPrice = parseToken(options.startingPrice, token, 0).toString();
	const weiReservePrice = parseToken(options.reservePrice || options.startingPrice, token, 0).toString();

	console.log(options);

	// Create listing on the server
	const formData = new FormData();

	// Is this needed?
	const nfts = options.nfts.map(({ nftId, amount, _id }) => ({ nftId, amount: amount.toString(), _id }));

	const fields = {
		nfts: JSON.stringify(nfts),
		title: options.title || 'No Title',
		paymentTokenAddress: options.paymentTokenAddress,
		paymentTokenTicker: 'ETH', // hotfix options.paymentTokenTicker,
		description: options.description || 'No Description',
		listingType: options.listingType,
		duration: options.durationSeconds.toString()
	};

	if (options.startDateTs) {
		fields['startTime'] = dayjs(options.startDateTs * 1000).isAfter(dayjs()) ? options.startDateTs : null;
	}

	const listing = {};

	// Sale specific
	if (options.listingType === 'sale') {
		listing['price'] = weiPrice;
		listing['quantity'] = options.quantity.toString();
	}

	// Auction specific
	if (options.listingType === 'auction') {
		listing['startingPrice'] = weiStartingPrice;
		listing['reservePrice'] = weiReservePrice;
	}

	// Append listing to formData
	fields['listing'] = JSON.stringify(listing);

	for (const [key, value] of Object.entries(fields)) {
		formData.append(key, value);
	}

	const res = await axios.post(getApiUrl('latest', 'listings'), formData, await getAxiosConfig());

	// Retrieve new listing ID from server response
	const listingId = res.data.data.listingId;
	console.debug('[Listing] Will create listing on chain with id: ' + listingId);

	// Create listing on chain
	const tokenIds = options.nfts.map((nft) => nft.nftId);
	const tokenAmounts = options.nfts.map((nft) => nft.amount);
	const collections = options.nfts.map((nft) => nft.collectionAddress);

	const listingType = {
		sale: LISTING_TYPE.FIXED_PRICE,
		auction: LISTING_TYPE.TIME_LIMITED_WINER_TAKE_ALL_AUCTION
	}[options.listingType];

	console.log({ options });

	await contractCreateListing({
		payToken: options.paymentTokenAddress,
		listingId: listingId,
		listingType,
		price: options.price || options.startingPrice || '0',
		reservePrice: options.reservePrice || options.startingPrice || options.price,
		startTime: options.startDateTs || dayjs().unix(),
		duration: options.durationSeconds,
		tokenIds,
		tokenAmounts,
		quantity: 1,
		collections,
		nfts: options.nfts
	});

	notifySuccess('Successfully created a listing.');
}
