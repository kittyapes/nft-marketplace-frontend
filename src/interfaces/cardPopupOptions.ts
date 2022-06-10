export interface CardPopupOptions {
	assetUrl: string;
	title: string;
	id: string;
	metadata?: any;
	creator: string;
	symbol: string;
	contractType: string;
	tokenAddress: string;
	isInternalNft: boolean;
	favorited: boolean;
	resourceType: 'nft' | 'listing';
	saleData?: {
		price: number;
	};
}
