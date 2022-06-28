import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { Listing } from '$utils/api/listing';
import dayjs from 'dayjs';
import { formatEther } from 'ethers/lib/utils.js';
import { writable } from 'svelte/store';

export async function adaptListingToNftCard(data: Listing) {
	let price: string;

	try {
		price = formatEther(data.listing.price);
	} catch {
		price = 'N/A';
	}

	const nft = data.nfts?.[0].nft;
	const collectionData = {
		slug: data.nfts?.[0].collectionSlug,
		name: data.nfts?.[0].collectionName,
	}

	const startTime = dayjs(data.startTime).unix();
	const hasAStartTime = new Date(startTime * 1000).getUTCFullYear() !== 1970;
	// It has a start time and its ending time has not yet passed
	const isTimeLive = hasAStartTime && new Date(startTime * 1000).getTime() + data.duration * 1000 > Date.now();

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
				tokenId: nft.nftId,
				isExternal: nft.isExternal
			}
		],
		saleData: {
			price,
			listingId: data.listingId
		},
		auctionData: {
			startingPrice: data.listing.startingPrice,
			reservePrice: data.listing.reservePrice
		},
		listingData: {
			sellerAddress: data.seller,
			listingType: data.listingType,
			symbol: data.paymentTokenTicker,
			tokenAddress: data.paymentTokenAddress,
			startTime: data.startTime,
			duration: data.duration,
			onChainId: data.listingId
		},
		likeIds: [nft._id],
		startTime: hasAStartTime ? new Date(startTime * 1000) : null,
		isListingTimeActive: isTimeLive,
		rawResourceData: data,
		collectionData,
		duration: data.duration * 1000,
		staleResource: writable()
	};

	const nftCardOptions = {
		id: nft._id,
		likeIds: [nft._id],
		imageUrl: nft.thumbnailUrl,
		title: data.title,
		collectionName: collectionData?.name || 'N/A',
		likes: nft.favoriteCount,
		price,
		popupComponent: CardPopup,
		popupOptions
	};

	return nftCardOptions;
}
