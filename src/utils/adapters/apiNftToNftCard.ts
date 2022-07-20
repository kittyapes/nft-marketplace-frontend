import type { ApiCollectionData } from '$interfaces/apiCollectionData';
import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { Collection } from '$utils/api/collection';

export async function apiNftToNftCard(data: ApiNftData, fallback?: Partial<{ collection: Partial<ApiCollectionData> }>) {
	let collectionData: Partial<Collection> = {
		id: data.collectionId,
		name: data.collectionName,
		slug: data.collectionSlug
	};

	const popupOptions: CardPopupOptions = {
		title: data.name,
		assetUrl: data.assetUrl || data.thumbnailUrl,
		favorited: false,
		resourceType: 'nft',
		nftData: [
			{
				metadata: data.metadata,
				isInternalNft: true,
				contractType: data.tokenStandard ?? 'ERC1155',
				creator: data.creator,
				contractAddress: data.contractAddress,
				tokenId: data.nftId,
				isExternal: data.isExternal
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
		collectionName: fallback?.collection?.name || collectionData?.name || 'N/A',
		collectionSlug: fallback?.collection?.slug || collectionData?.slug,
		likes: data.favoriteCount,
		likeIds: [data._id],
		popupComponent: CardPopup,
		popupOptions,
		databaseId: data._id,
		disallowListing: false
	};

	return nftCardOptions;
}
