import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardOptions } from '$interfaces/ui';
import { getOnChainMetadata, makeHttps } from '$utils/ipfs';
import { writable } from 'svelte/store';

export async function nftToCardOptions(nft: ApiNftData): Promise<CardOptions> {
	if (!nft.thumbnailUrl || !nft.metadata) {
		if (nft) {
			const nftMetadata = await getOnChainMetadata(nft?.contractAddress, nft?.nftId.toString());
			nft.metadata = nftMetadata ?? nft.metadata;
			// TODO: Add temporary image for nfts that did not load here
			nft.thumbnailUrl = nftMetadata?.image ?? nft.thumbnailUrl ?? '';
			nft.assetUrl = nftMetadata?.animation_url ?? nft.assetUrl ?? nft.thumbnailUrl ?? nftMetadata?.image ?? '';
		}
	}

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
					name: nft.collectionName,
				},
				likes: nft.favoriteCount,
				thumbnailUrl: makeHttps(nft.thumbnailUrl) ?? '',
				assetUrl: makeHttps(nft?.metadata?.animation_url || nft.assetUrl || nft.thumbnailUrl) ?? '',
				quantity: 1,
			},
		],
		allowPopup: true,
		allowTrade: true,
		staleResource: writable(),
	};
}
