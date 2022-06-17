import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { Listing } from '$utils/api/listing';
import { formatEther } from 'ethers/lib/utils';

export async function adaptListingToNftCard(data: Listing) {
	let price: string;

	try {
		price = formatEther(data.listing.price);
	} catch {
		price = 'N/A';
	}

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
			price,
			listingId: data.listingId
		},
		listingData: {
			sellerAddress: data.seller,
			listingType: 'sale',
			symbol: data.paymentTokenTicker,
			tokenAddress: data.paymentTokenAddress
		},
		likeIds: [data.nfts[0].nftId],
		rawResourceData: data
	};

	const nftCardOptions = {
		id: data.listingId,
		imageUrl: nft.thumbnailUrl,
		title: data.title,
		collectionName: 'N/A',
		likes: nft.favoriteCount,
		price,
		popupComponent: CardPopup,
		popupOptions
	};

	return nftCardOptions;
}
