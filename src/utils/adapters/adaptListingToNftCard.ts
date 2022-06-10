import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { Listing } from '$utils/api/listing';

export async function adaptListingToNftCard(data: Listing) {
	console.log(data);

	const nft = data.nfts[0].nft;

	const popupOptions: CardPopupOptions = {
		id: data.listingId,
		title: data.title,
		assetUrl: nft.assetUrl,
		metadata: nft.metadata,
		creator: data.seller,
		symbol: data.paymentTokenTicker,
		contractType: 'ERC1155',
		tokenAddress: data.paymentTokenAddress,
		isInternalNft: true,
		favorited: false,
		resourceType: 'listing',
		saleData: {
			price: data.listing.price,
			listingId: data.listingId
		},
		likeIds: [data.nfts[0].nftId]
	};

	const nftCardOptions = {
		id: data.listingId,
		imageUrl: nft.thumbnailUrl,
		title: data.title,
		collectionName: 'N/A',
		likes: nft.favoriteCount,
		price: data.listing.price,
		popupComponent: CardPopup,
		popupOptions
	};

	return nftCardOptions;
}
