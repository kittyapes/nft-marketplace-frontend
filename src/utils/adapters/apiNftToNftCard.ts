import type { ApiCollectionData } from '$interfaces/apiCollectionData';
import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import { apiGetCollectionById } from '$utils/api/collection';

export  async function apiNftToNftCard(data: ApiNftData, fallback?: Partial<{ collection: Partial<ApiCollectionData> }>) {
	let collectionData: ApiCollectionData;
	if (!fallback) {
		collectionData = await apiGetCollectionById(data.collectionId).catch(e => {});
	}
	
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
		likeIds: [data._id],
		collectionData: fallback?.collection || collectionData,
		rawResourceData: data
	};

	const nftCardOptions = {
		id: data.nftId,
		imageUrl: data.thumbnailUrl,
		title: data.name,
		collectionName: fallback?.collection?.name || collectionData.name ||'N/A',
		likes: data.favoriteCount,
		likeIds: [data._id],
		popupComponent: CardPopup,
		popupOptions
	};

	return nftCardOptions;
}
