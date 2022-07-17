import type { CardOptions } from '$lib/components/NftCard.svelte';
import type { Listing } from '$utils/api/listing';
import dayjs from 'dayjs';
import { writable } from 'svelte/store';

export function listingToCardOptions(listing: Listing): CardOptions {
	const nft = listing.nfts[0].nft;

	const ret: CardOptions = {
		resourceType: 'listing',
		rawResourceData: listing,
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
		listingData: {
			databaseId: listing._id,
			onChainId: listing.listingId,
			sellerAddress: listing.seller,
			listingType: listing.listingType,
			paymentTokenTicker: listing.paymentTokenTicker,
			paymentTokenAddress: listing.paymentTokenAddress,
			startTime: dayjs(listing.startTime).unix(),
			endTime: dayjs(listing.startTime).unix() + listing.duration,
			duration: listing.duration
		},
		allowPopup: true,
		allowTrade: true,
		staleResource: writable()
	};

	if (listing.listingType === 'sale') {
		ret.saleData = {
			price: listing.listing.price
		};
	}

	if (listing.listingType === 'auction') {
		ret.auctionData = {
			startingPrice: listing.listing.startingPrice,
			reservePrice: listing.listing.reservePrice
		};
	}

	return ret;
}
