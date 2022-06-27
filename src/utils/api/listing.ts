import type { EthAddress } from '$interfaces';
import axios from 'axios';
import { ethers } from 'ethers';
import {  parseEther } from 'ethers/lib/utils.js';
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

export interface Listing {
	_id: string;
	listingId: string;
	listingStatus: 'ACTIVE';
	listingType: ListingType;
	listing: {
		price?: number;
		quantity: number;
		startingPrice: string;
		reservePrice: string;
	};
	nfts: {
		_id: string;
		nftId: string;
		amount: number;
		nft: {
			_id: string;
			assetUrl: string;
			thumbnailUrl: string;
			favoriteCount: number;
			metadata: any;
			creator: string;
			contractAddress: string;
			nftId: string;
			collectionId: string;
			isExternal: boolean;
		};
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
	seller: string;
}

export interface listingFetchingFilters {
	collectionId?: string;
	type?: ListingType[];
	price?: { priceMin: number; priceMax: number };
	seller?: EthAddress;
	sortBy?: 'NEWEST' | 'OLDEST' | 'POPULAR' | 'END1MIN'
}

export async function getListings(filters?: listingFetchingFilters, page: number = 1, limit: number = 20) {
	console.log(filters)
	const params = {
		type: filters?.type,
		collectionId: filters?.collectionId ? filters?.collectionId : undefined,
		priceMin: filters?.price?.priceMin === 0  || filters?.price?.priceMin ? ethers.utils.parseEther(filters?.price?.priceMin.toString()).toString() : undefined,
		priceMax:  filters?.price?.priceMax === 0 || filters?.price?.priceMax ? ethers.utils.parseEther(filters?.price?.priceMax.toString()).toString() : undefined,
		seller: filters?.seller,
		sortBy: filters?.sortBy,
		page,
		limit,
	};
	console.log(params)
	const res = await axios.get(getApiUrl('latest', 'listings?'), { params });
	return res.data.data as Listing[];
}

export async function getListing(id: string) {
	const res = await axios.get(getApiUrl('latest', 'listings/' + id)).catch((e) => e.response);

	if (!res) return null;
	return res.data.data as Listing;
}
