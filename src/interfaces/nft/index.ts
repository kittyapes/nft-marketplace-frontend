export interface NftData {
	contractAddress: string;
	sales: [];
	chain: string;
	tokenStandard: string;
	chainStatus: string;
	_id: string;
	thumbnailUrl: string;
	assetUrl: string;
	nftId: string;
	name: string;
	amount: number;
	creator: string;
	owner: string;
	favoriteCount: number;
	metadata: {
		external_url: string;
		image: string;
		animation_url: string;
		name: string;
		description: string;
		artist: string;
	};
	uri: string;
	price: number;
	offers: [];
	royalties: [];
	createdAt: string;
	updatedAt: string;
	collectionId: string;
	owner_of: string;
}
