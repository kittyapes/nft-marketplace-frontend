import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardOptions } from '$interfaces/ui';
import { writable } from 'svelte/store';

export function nftToCardOptions(nft: ApiNftData): CardOptions {
	return {
		resourceType: 'nft',
		rawResourceData: nft,
		nfts: [
			{
				databaseId: nft._id,
				onChainId: nft.nftId,
				name: nft.name,
				metadata: nft.metadata,
				contractType: nft.tokenStandard,
				creator: nft.creator,
				contractAddress: nft.contractAddress,
				isExternal: nft.isExternal,
				collectionData: {
					id: nft.collectionId,
					slug: nft.collectionSlug,
					name: nft.collectionName
				},
				likes: nft.favoriteCount,
				thumbnailUrl: nft.thumbnailUrl,
				assetUrl: nft?.metadata?.animation_url || nft.assetUrl || nft.thumbnailUrl,
				quantity: 1
			}
		],
		allowPopup: true,
		allowTrade: true,
		staleResource: writable()
	};
}
