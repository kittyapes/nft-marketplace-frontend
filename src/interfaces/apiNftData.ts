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
	fullId: string;
}

// export interface AlchemyNft {
// 	contract: {
// 		address: EthAddress;
// 		name: string;
// 		symbol: string;
// 		tokenType: 'ERC721' | 'ERC1155' | 'UNKNOWN';
// 	};
// 	tokenId: string;
// 	tokenType: 'ERC721' | 'ERC1155' | 'UNKNOWN';
// 	title: string;
// 	description: Date;
// 	timeLastUpdated: Date;
// 	rawMetadata:
// 		| {
// 				external_url: string;
// 				image: string;
// 				name: string;
// 				description: string;
// 				animation_url?: string;
// 		  }
// 		| { metadata: any; attributes: any }; // when you encounter the second iteration, it is an error and should fetch from the chain
// 	tokenUri: {
// 		raw: string;
// 		gateway: string;
// 	};
// 	media: {
// 		raw: string;
// 		gateway: string;
// 		thumbnail: string;
// 		format: 'png' | 'jpeg' | string; // basically image formats
// 		bytes: number; // size of asset in bytes
// 	}[];
// 	balance: number;

// 	// pollyfilled for hinata compatibility
// 	collectionSlug: string;
// 	collectionName: string;
// 	collectionId: string;
// }

// export interface AlchemyUserNftData {
// 	pageKey?: string;
// 	ownedNfts: AlchemyNft[];
// }

// export interface AlchemyCollectionNftData {
// 	pageKey?: string;
// 	nfts: AlchemyNft[];
// }
