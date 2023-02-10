import type { AuctionDataModel, EthAddress, IsoTime, NftInListingModel, SaleDataModel, TokenStandard } from '$interfaces';
import type { ApiNftData } from '$interfaces/apiNftData';
import axios from 'axios';
import { getApiUrl, type ApiCallResult, api } from '.';
import type { UserData } from '$interfaces/userData';
import { getAxiosConfig } from '$utils/auth/axiosConfig';

export type ListingType = 'sale' | 'auction' | 'raffle';

type Address = string;

interface Bid {
	bidder: Address;
	biddingDate: Date;
	bid: number;
	bidDuration: number; // Seconds to when the bid expires
	bidPriceInUsd: number;
}

export interface Auction {
	startingPrice: number;
	reservePrice: number;
	bids: Bid[]; // can be a sorted array where the highest is always first or last or we can have a separate field `highestBid`
	highestBid: Address; // Left in place even after the auction is done. Similar to the buyer field in the Sale object
}

export interface Sale {
	price: number;
	quantity: number; // needs validation for this to make sure the NFTs match the quantity listed here. - defaults to 1 for bundles
	buyer?: Address; // User who ultimately buys the NFT/Bundle - defaults to null until successful sale
}

export interface Raffle {
	ticketPrice: number;
	nftPrices: number[]; // the indexes should match with the indexes of the nfts object on the parent listing so index 0 should correspond to index 0 on the nfts array
	totalTickets: number; // total number of raffle tickets available
	remainingTickets: number; // remaining tickets after some are sold
	quantity: number; // needs validation for this to make sure the NFTs match the quantity listed here. - defaults to 1 for bundles
	winningTickets: number[];
	durationToClaim: number; // time in seconds after winning ticket is announced after which something will happen (preventing the user from claiming the nft as they were late)
	ticketsBought: RaffleParticipants[];
}

interface RaffleParticipants {
	buyer: Address;
	tickets: number[];
}

export type ListingStatus = 'ACTIVE' | 'SIGNATURE_EXPIRED' | 'SIGNATURE_OR_DATA_INVALID' | 'SIGNATURE_USED';
export type ListingChainStatus = 'ON_CHAIN' | 'NOT_ON_CHAIN' | 'GASLESS';

export interface Listing {
	_id: string;
	listingId: string;
	listingStatus: ListingStatus;
	chainStatus: ListingChainStatus;
	listingType: ListingType;
	listing: SaleDataModel | AuctionDataModel;
	nfts: NftInListingModel[];
	paymentTokenTicker: string;
	paymentTokenAddress: string;
	startTime: string;
	duration: number;
	title: string;
	description: string;
	thumbnailUrl: string;
	coverImageUrl: string;
	createdAt: string;
	updatedAt: string;
	seller: string;

	// Only On Auctions
	highestBid?: number;

	// Nonce exists only in case of gasless listings
	nonce?: string;

	// A signature provided by the seller which can be used by buyers
	// to execute on-chain actions
	signature?: string;

	// The timestamp that
	signatureExpiryTimestamp?: boolean;

	// Whether the listing has been found on chain by the FE
	foundOnChain?: boolean;
}

export interface ListingFetchOptions {
	collectionAddress?: string;
	collectionId?: string;
	type?: ListingType[];
	priceMin?: string;
	priceMax?: string;
	seller?: EthAddress;
	sortBy?: 'NEWEST' | 'OLDEST' | 'POPULAR' | 'END1MIN';
	listingStatus?: ('ACTIVE' | 'UNLISTED' | 'EXPIRED')[];
}

export async function getListings(filters?: ListingFetchOptions, page = 1, limit = 20) {
	const params = Object.entries({ ...filters, page, limit }).reduce((p, [k, v]: [string, any]) => {
		if (k === 'listingStatus') {
			v.forEach((i) => p.append('listingStatus', i));
		} else if (v) {
			p.append(k, v as any);
		}

		return p;
	}, new URLSearchParams());

	const res = await axios.get(getApiUrl('latest', 'listings'), { params });

	return res.data.data?.filter((listing: Listing) => typeof listing.listing !== 'string') as Listing[];
}

export async function getRandomListings(limit = 10) {
	const params = {
		limit,
	};
	const res = await axios.get(getApiUrl('latest', 'listings/getRandom'), { params });
	return res.data.data as Listing[];
}

export async function getListing(id: string) {
	const res = await axios.get(getApiUrl('latest', 'listings/' + id)).catch((e) => console.log(e.response));
	if (!res) return null;
	return res.data.data as Listing;
}

export async function getTrendingListings(count?: number) {
	const params = {
		count,
	};

	const res = await axios.get(getApiUrl('latest', 'listings/trending'), { params }).catch((e) => console.log(e.response));
	if (!res) return [];

	console.log(res);

	return res.data.data as Listing[];
}

export interface ListingCreatorsData {
	users: (UserData & { createdListings: Listing[] })[];
}

export interface ListingCreatorsRes {
	error: boolean;
	data: ListingCreatorsData;
}

export async function getListingCreators(options: { limit?: number; page?: number }): Promise<ApiCallResult<ListingCreatorsRes>> {
	options = {
		limit: 10,
		page: 1,
		...options,
	};

	const res = await api.get(getApiUrl(null, 'users/listingCreators'), {
		params: { limit: options.limit, page: options.page },
	});

	return res;
}

export async function viewedListing(listingId: string): Promise<ApiCallResult<any>> {
	const res = await axios.post(getApiUrl(null, 'listings/view'), { listingId }, await getAxiosConfig());

	return res;
}
