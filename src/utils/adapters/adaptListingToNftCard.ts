import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { Listing } from '$utils/api/listing';

export async function adaptListingToNftCard(data: Listing) {
	const nft = data.nfts[0].nft;

	const popupOptions: CardPopupOptions = {
		title: data.title,
		assetUrl: nft.assetUrl,
		favorited: false,
		resourceType: 'listing',
		nftData: [
			{
				metadata: nft.metadata,
				isInternalNft: true,
				contractType: 'ERC1155',
				creator: nft.creator,
				contractAddress: nft.contractAddress,
				tokenId: nft.nftId
			}
		],
		saleData: {
			price: data.listing.price,
			listingId: data.listingId
		},
		listingData: {
			sellerAddress: data.seller,
			listingType: 'sale',
			symbol: data.paymentTokenTicker,
			tokenAddress: data.paymentTokenAddress
		},
		likeIds: [nft._id],
		rawResourceData: data
	};

	const nftCardOptions = {
		id: nft._id,
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
