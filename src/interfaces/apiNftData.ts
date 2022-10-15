import type { EthAddress, IsoTime, MongoId, TokenStandard } from '$interfaces';

export interface ApiNftData {
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
	_id: MongoId;
}
