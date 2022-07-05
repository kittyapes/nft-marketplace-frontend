import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { Listing } from '$utils/api/listing';
import { getTokenDetails } from '$utils/contracts/token';
import dayjs from 'dayjs';
import { formatUnits } from 'ethers/lib/utils.js';
import { writable } from 'svelte/store';

export async function adaptListingToNftCard(data: Listing) {
	const nft = data.nfts?.[0].nft;
	const nftsInListing = data.nfts?.[0].amount;

	const collectionData = {
		slug: data.nfts?.[0].collectionSlug,
		name: data.nfts?.[0].collectionName,
		id: nft.collectionId
	};

	const startTime = dayjs(data.startTime).unix();
	const hasAStartTime = new Date(startTime * 1000).getUTCFullYear() !== 1970;
	// It has a start time and its ending time has not yet passed
	const isTimeLive = hasAStartTime && new Date(startTime * 1000).getTime() + data.duration * 1000 > Date.now();

	// Listing Token Info
	const token = await getTokenDetails(data.paymentTokenAddress);

	let price: string;

	try {
		price = formatUnits(data.listing.price.toString(), token.decimals);
	} catch {
		price = 'N/A';
	}

	console.log(nft);

	const popupOptions: CardPopupOptions = {
		title: data.title,
		assetUrl: nft.assetUrl,
		favorited: false,
		resourceType: 'listing',
		nftData: [
			{
				metadata: nft.metadata,
				isInternalNft: true,
				contractType: nft.tokenStandard ?? 'ERC1155',
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
			tokenDecimals: token.decimals,
			tokenSymbol: token.symbol,
			startTime: data.startTime,
			duration: data.duration,
			onChainId: data.listingId,
			quantity: nftsInListing
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
