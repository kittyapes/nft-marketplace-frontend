import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '.';

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

/*
export interface CreateListingOptions {
	bundleId: string;
	listingType: ListingType;
	price: number;
	creator: string;
	duration?: string;
	startedAt?: string;
}*/

export interface CreateListingOptions {
	nfts: { nftId: string; amount: number }[];
	description?: string;
	title?: string;
	paymentTokenTicker?: string;
	paymentTokenAddress: string;
	modifiedOn?: string;
	listingType: 'sale' | 'auction' | 'raffle';
	price: number;
	quantity: number;
	//listing?: Sale | Auction | Raffle;
	succesSaleTransaction?: string;
	startTime?: Date;
	duration?: number;
}

export async function postCreateListing(options: CreateListingOptions) {
	const formData = new FormData();
	formData.append('nfts', JSON.stringify(options.nfts));
	formData.append('title', options.title || 'No Title');
	formData.append('paymentTokenAddress', options.paymentTokenAddress);
	formData.append('paymentTokenTicker', options.paymentTokenTicker || 'WETH');
	formData.append('description', options.description || 'No Description');
	formData.append('listingType', options.listingType);
	formData.append('listing', JSON.stringify({ price: options.price, quantity: options.quantity }));
	formData.append('duration', options.duration.toString());
	formData.append('startTime', options.startTime.toString());

	return await axios.post(getApiUrl('latest', 'listings'), formData, getAxiosConfig()).catch((e) => e.response);
}

export interface Listing {
	_id: string;
	listingId: string;
	listingStatus: 'ACTIVE';
	listingType: ListingType;
	listing: {
		price: number;
		quantity: number;
	};
	nfts: {
		_id: string;
		nftId: string;
		amount: number;
		nft: { assetUrl: string; thumbnailUrl: string };
	}[];
	paymentTokenTicker: 'ETH';
	paymentTokenAddress: string;
	startTime: string;
	duration: number;
	title: string;
	description: string;
	thumbnailUrl: string;
	coverImageUrl: string;
	createdAt: string;
	updatedAt: string;
}

export async function getListings() {
	const res = await axios.get(getApiUrl('latest', 'listings'), { params: { limit: 100 } });

	return res.data.data as Listing[];
}

export async function getListing(id: string) {
	const res = await axios.get(getApiUrl('latest', 'listings/' + id)).catch((e) => e.response);

	if (!res) return null;
	return res.data.data as Listing;
}
