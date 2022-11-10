import type { TokenStandard } from '$interfaces';
import type { Collection } from '$utils/api/collection';
import type { ListingType } from '$utils/api/listing';
import type { Writable } from 'svelte/store';

export interface CardOptions {
	/** Determines whether the popup is rendering a listing or an NFT in the user's wallet. */
	resourceType: 'nft' | 'listing';

	/** An array of NFTs contained in a listing. If the card is rendering a single NFT,
	 * then the array length will be 1.
	 */
	nfts: [
		{
			databaseId: string;
			onChainId: string;
			name: string;
			metadata?: any;
			contractType: TokenStandard;
			creator: string;
			contractAddress: string;
			isExternal: boolean;
			collectionData: Partial<Collection>;
			likes: number;
			thumbnailUrl: string;
			assetUrl: string;
		},
	];

	/** Data used when rendering a listing. */
	listingData?: {
		databaseId: string;
		onChainId: string;
		sellerAddress: string;
		listingType: ListingType;
		paymentTokenTicker: string;
		paymentTokenAddress: string;
		startTime: number;
		endTime: number;
		duration: number;
		shortDisplayPrice: string;
	};

	/** Data used when adapting a listing of the type Sale. */
	saleData?: {
		price: string;
		formatPrice: string;
		nftQuantities: Record<string, number>;
	};

	/** Data used when adapting a listing of the type Auction. */
	auctionData?: {
		startingPrice: string;
		reservePrice?: string;
		formatStartingPrice: string;
		formatReservePrice?: string;
		highestBid: string;
	};

	/** The raw data that was used by an adapter to generate this data object. */
	rawResourceData: any;

	/** Resource is no longer valid. For example due to cancelling or purchasing a listing. Indicates that
	 * the resource should be reloaded and no further actions should performed on the resource.
	 */
	staleResource?: Writable<{ reason: string }>;

	allowPopup?: boolean;
	allowTrade?: boolean;
}
