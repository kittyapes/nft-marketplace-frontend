import type { ApiCollectionData } from './apiCollectionData';
import type { ListingType } from '$utils/api/listing';
import type { Writable } from 'svelte/store';
import type { Collection } from '$utils/api/collection';

export interface CardPopupOptions {
	/** Asset rendered on the left side of the popup. */
	assetUrl: string;

	/** Title rendered on the left side of the popup. */
	title: string;

	/** Whether the like button should be filled or not. */
	favorited: boolean;

	/** Determines whether the popup is rendering a listing or an NFT in the user's wallet. */
	resourceType: 'nft' | 'listing';

	/** An array of NFT data to either render in the Info tab or in the bundle tab. */
	nftData: [
		{
			metadata?: any;
			isInternalNft: boolean;
			contractType: 'ERC1155';
			creator: string;
			contractAddress: string;
			tokenId: string;
			isExternal: boolean;
		}
	];

	/** Data used when adapting a listing. */
	listingData?: {
		sellerAddress: string;
		listingType: ListingType;
		symbol: string;
		tokenAddress: string;
		tokenDecimals: number;
		tokenSymbol: string;
		startTime: string;
		duration: number;
		onChainId: string;
	};

	/** Data used when adapting a listing of the type Sale. */
	saleData?: {
		price: string;
		listingId: string;
	};

	/** Data used when adapting a listing of the type Auction. */
	auctionData?: {
		startingPrice: string;
		reservePrice?: string;
	};

	/** An array of IDs that should be liked/unliked when the user clicks the like button. */
	likeIds?: string[];

	/** Start Time and IsTimeActive used to show listing's dates */
	startTime?: Date | null;
	duration?: number; // Sale Duration in Milliseconds
	isListingTimeActive?: boolean;

	/** The raw data that was used by an adapter to generate this data object. */
	rawResourceData: any;

	/** Resource is no longer valid. For example due to cancelling or purchasing a listing. Indicates that
	 * the resource should be reloaded and no further actions should performed on the resource.
	 */
	staleResource?: Writable<{ reason: string }>;

	collectionData: Partial<Collection>;
}
