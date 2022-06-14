import type { ApiCollectionData } from '$interfaces/apiCollectionData';
import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';

export function apiNftToNftCard(data: ApiNftData, fallback?: Partial<{ collection: Partial<ApiCollectionData> }>) {
	console.log(data);

	const popupOptions: CardPopupOptions = {
		title: data.name,
		assetUrl: data.assetUrl,
		favorited: false,
		resourceType: 'nft',
		nftData: [
			{
				metadata: data.metadata,
				isInternalNft: true,
				contractType: 'ERC1155',
				creator: data.creator,
				contractAddress: data.contractAddress,
				tokenId: data.nftId
			}
		],
		likeIds: [data.nftId],
		rawResourceData: data
	};

	const nftCardOptions = {
		id: data.nftId,
		imageUrl: data.thumbnailUrl,
		title: data.name,
		collectionName: fallback?.collection?.name || 'N/A',
		likes: data.favoriteCount,
		popupComponent: CardPopup,
		popupOptions
	};

	return nftCardOptions;
}
