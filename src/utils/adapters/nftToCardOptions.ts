import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardOptions } from '$lib/components/NftCard.svelte';
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
				assetUrl: nft.assetUrl || nft.thumbnailUrl
			}
		],
		allowPopup: true,
		allowTrade: true,
		staleResource: writable()
	};
}
