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
		name: string;
		description: string;
	};
	uri: string;
	price: number;
	offers: [];
	royalties: [];
	createdAt: string;
	updatedAt: string;
	collectionId: string;
}
