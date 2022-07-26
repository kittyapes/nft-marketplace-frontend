import type { CardOptions } from '$interfaces/ui';
import type { Listing } from '$utils/api/listing';
import dayjs from 'dayjs';
import { writable } from 'svelte/store';

export function listingToCardOptions(listing: Listing, fallback?: any): CardOptions {
	const nft = listing.nfts?.[0].nft || listing.nfts?.[0];

	const ret: CardOptions = {
		resourceType: 'listing',
		rawResourceData: listing,
		nfts: [
			{
				databaseId: nft?._id,
				onChainId: nft?.nftId,
				name: nft?.name,
				metadata: nft?.metadata,
				contractType: nft?.tokenStandard,
				creator: nft?.creator,
				contractAddress: nft?.contractAddress,
				isExternal: nft?.isExternal,
				collectionData: {
					id: nft?.collectionId,
					slug: nft?.collectionSlug,
					name: nft?.collectionName
				},
				likes: nft?.favoriteCount,
				thumbnailUrl: nft.thumbnailUrl,
				assetUrl: nft?.assetUrl || nft?.thumbnailUrl,
				quantity: nft?.amount
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

	const makeNice = (n: number) => {
		if (n.toString().includes('.')) {
			return n.toString();
		}

		return n.toString() + '.0';
	};

	if (listing.listingType === 'sale') {
		const fPrice = listing.listing?.formatPrice;

		ret.saleData = {
			price: listing.listing.price,
			formatPrice: fPrice ? makeNice(fPrice) : 'N/A'
		};
	}

	if (listing.listingType === 'auction') {
		const fStarting = listing.listing?.formatStartingPrice;
		const fReserve = listing.listing?.formatReservePrice;

		ret.auctionData = {
			startingPrice: listing.listing?.startingPrice,
			formatStartingPrice: fStarting ? makeNice(fStarting) : 'N/A',
			reservePrice: listing.listing?.reservePrice,
			formatReservePrice: fReserve ? makeNice(fReserve) : 'N/A'
		};
	}

	return ret;
}
