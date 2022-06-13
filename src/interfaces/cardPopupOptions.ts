export interface CardPopupOptions {
	/** Asset rendered on the left side of the popup. */
	assetUrl: string;

	/** Title rendered on the left side of the popup. */
	title: string;

	/** TODO */
	id: string;

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
		}
	];

	/** Data used when adapting a listing. */
	listingData?: {
		sellerAddress: string;
		listingType: 'sale';
		symbol: string;
		tokenAddress: string;
	};

	/** Data used when adapting a listing of the type Sale. */
	saleData?: {
		price: number;
		listingId: string;
	};

	/** An array of IDs that should be liked/unliked when the user clicks the like button. */
	likeIds?: string[];

	/** The raw data that was used by an adapter to generate this data object. */
	rawResourceData: any;
}
