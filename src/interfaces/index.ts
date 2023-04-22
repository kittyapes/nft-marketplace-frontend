import type { PublicProfileData } from './userData';

export type IsoTime = string;
export type UnixTime = number;
export type EthAddress = string;
export type TokenStandard = 'ERC1155' | 'ERC721';
export type MongoId = string;
export type OnChainId = string;

export interface NftModel {
	_id: string;
	contractAddress: string;
	sales: [];
	isExternal: boolean;
	chain: string;
	tokenStandard: string;
	chainStatus: string;
	collectionStatus: string;
	hidden: boolean;
	favoriteCount: number;
	thumbnailUrl: string;
	assetUrl: string;
	nftId: string;
	fullId: string;
	name: string;
	amount: number;
	creator: string;
	owner: string;
	description: string;
	collectionId: string;
	collectionName: string;
	collectionSlug: string;
	uri: string;
	price: number;
	offers: [];
	royalties: [];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface SaleDataModel {
	price: string;
	formatPrice: number;
	quantity: {
		nftFullId: string;
		amount: number;
	}[];
}

export interface AuctionDataModel {
	startingPrice: string;
	reservePrice: string;
	formatStartingPrice: number;
	formatReservePrice: number;
	// bids
	highestBid: string;
}

export interface NftInListingModel {
	nft: NftModel;
	fullId: string;
	contractAddress: string;
	nftId: string;
	amount: number;
}

export interface OfferModel {
	_id: string;
	tokenAmount: string;
	nonce: string;
	paymentTokenTicker: string;
	nftFullId: string;
	collectionAddress: string;
	tokenId: string;
	formatOfferPrice: number;
	offerPrice: string;
	from: string;
	expiration: string; // fix
	paymentTokenAddress: string;
	startTime: string;
	signature: string;
	createdAt: string;
	updatedAt: string;
	lcfrom: string;
	user: PublicProfileData;
	offerStatus: 'PENDING' | 'ACCEPTED';
}
