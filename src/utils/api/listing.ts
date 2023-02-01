import type { EthAddress, IsoTime, TokenStandard } from '$interfaces';
import type { ApiNftData } from '$interfaces/apiNftData';
import axios from 'axios';
import { getApiUrl, type ApiCallResult, api } from '.';
import type { UserData } from '$interfaces/userData';

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

export interface Listing {
	_id: string;
	listingId: string;
	listingStatus: 'ACTIVE';
	chainStatus: 'ON_CHAIN' | 'NOT_ON_CHAIN' | 'GASLESS';
	listingType: ListingType;
	listing: {
		price?: string;
		formatPrice?: number;
		quantity: number;
		startingPrice: string;
		formatStartingPrice: number;
		reservePrice: string;
		formatReservePrice: number;
	};
	nfts: {
		amount: number;
		assetUrl: string;
		chain: 'ETHEREUM';
		chainStatus: 'NOT_ON_CHAIN' | 'ON_CHAIN';
		collectionId: string;
		contractAddress: EthAddress;
		createdAt: IsoTime;
		creator: EthAddress;
		favoriteCount: number;
		isExternal: boolean;
		metadata: {
			external_url: string;
			image: string;
			name: string;
			description: string;
			animation_url?: string;
		};
		name: string;
		nftId: string;
		offers: [];
		owner: EthAddress;
		price: number;
		royalties: [];
		sales: [];
		thumbnailUrl: string;
		tokenStandard: TokenStandard;
		updatedAt: IsoTime;
		uri: string;
		collectionName: string;
		collectionSlug: string;
		_id: string;
		nft: ApiNftData;
		fullId: string;
	}[];

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
}

export interface ListingFetchOptions {
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
	users: (UserData & { createdListings: Listing })[];
}

interface ListingCreatorsRes {
	error: boolean;
	data: ListingCreatorsData;
}

export async function getListingCreators(): Promise<ApiCallResult<ListingCreatorsRes>> {
	const res = await api.get(getApiUrl(null, 'users/listingCreators'));

	return res;
}
