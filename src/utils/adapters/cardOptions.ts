import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardOptions } from '$interfaces/ui';
import type { Listing } from '$utils/api/listing';
import { getMetadataFromUri, getOnChainUri, makeHttps } from '$utils/ipfs';
import { scientificToDecimal } from '$utils/misc/scientificToDecimal';
import dayjs from 'dayjs';
import { writable } from 'svelte/store';
import { ethers } from 'ethers';

export interface SanitizedNftData {
	databaseId: string;
	onChainId: string;
	name: string;
	metadata: any;
	contractType: string;
	creator: string;
	contractAddress: string;
	isExternal: boolean;
	collectionData: {
		id: string;
		slug: string;
		name: string;
	};
	likes: number;
	thumbnailUrl: string;
	assetUrl: string;
	quantity: number;
	fullId: string;
}

export async function sanitizeNftData(data: ApiNftData) {
	if (!data.uri) {
		data.uri = await getOnChainUri(data?.contractAddress, data?.nftId.toString());
	}

	if (!data.metadata || !data.thumbnailUrl) {
		const nftMetadata = data.uri ? await getMetadataFromUri(data.uri) : null;
		data.metadata = nftMetadata ?? (data.metadata || {});
		// TODO: Add temporary image for nfts that did not load here
		data.thumbnailUrl = nftMetadata?.image ?? data.thumbnailUrl ?? '';
		data.assetUrl = nftMetadata?.animation_url ?? data.assetUrl ?? data.thumbnailUrl ?? nftMetadata?.image ?? '';
	}

	const ret = {
		databaseId: data?._id,
		onChainId: data?.nftId,
		name: data?.name,
		metadata: data?.metadata,
		contractType: data?.tokenStandard,
		creator: data?.creator,
		contractAddress: data?.contractAddress,
		isExternal: data?.isExternal,
		collectionData: {
			id: data?.collectionId,
			slug: data?.collectionSlug,
			name: data?.collectionName,
		},
		likes: data?.favoriteCount,
		thumbnailUrl: makeHttps(data.thumbnailUrl) ?? '',
		assetUrl: makeHttps(data?.metadata?.animation_url || data?.assetUrl || data?.thumbnailUrl) ?? '',
		fullId: data?.fullId ?? `${data.contractAddress}:${data.nftId}`,
	};

	return ret;
}

function buildCommonObject(): Partial<CardOptions> {
	return {
		allowPopup: true,
		allowTrade: true,
		staleResource: writable(),
	};
}

export async function nftToCardOptions(nft: ApiNftData): Promise<CardOptions> {
	return { ...buildCommonObject(), resourceType: 'nft', rawResourceData: nft, nfts: [await sanitizeNftData(nft)] };
}

export async function listingToCardOptions(listing: Listing): Promise<CardOptions> {
	const nft = listing.nfts?.[0]?.nft || listing.nfts?.[0];

	if (!nft) {
		return null;
	}

	const ret: CardOptions = {
		...buildCommonObject(),
		resourceType: 'listing',
		rawResourceData: listing,
		nfts: [await sanitizeNftData(nft)],
		listingData: {
			databaseId: listing._id,
			onChainId: listing.listingId,
			sellerAddress: listing.seller,
			listingType: listing.listingType,
			paymentTokenTicker: listing.paymentTokenTicker,
			paymentTokenAddress: listing.paymentTokenAddress,
			startTime: dayjs(listing.startTime).unix(),
			endTime: dayjs(listing.startTime).unix() + listing.duration,
			duration: listing.duration,
			shortDisplayPrice: null,
		},
	};

	function toShortDisplayPrice(floatingPrice: string) {
		const bigNumber = ethers.utils.parseEther(floatingPrice);

		const thresholdStr = '0.01';
		const threshold = ethers.utils.parseEther(thresholdStr);

		if (bigNumber.lt(threshold)) {
			return '< ' + thresholdStr;
		} else {
			return floatingPrice;
		}
	}

	if (listing.listingType === 'sale') {
		const fPrice = scientificToDecimal(listing.listing?.formatPrice);

		ret.saleData = {
			price: listing.listing.price,
			formatPrice: fPrice,
			// Has to be updated for when we support listing bundles
			nftQuantities: { [nft.nftId]: nft.amount },
		};

		ret.listingData.shortDisplayPrice = toShortDisplayPrice(fPrice);
	}

	if (listing.listingType === 'auction') {
		const formatStartingPrice = listing.listing?.formatStartingPrice.toString();
		const formatReservePrice = listing.listing?.formatReservePrice.toString();
		const highestBid = listing.highestBid.toString();
		// Highest Bid is Always 0 when there is no highest bid
		const priceToDisplay = highestBid !== '0' && highestBid ? highestBid : formatStartingPrice;

		ret.auctionData = {
			startingPrice: listing.listing?.startingPrice,
			formatStartingPrice,
			reservePrice: listing.listing?.reservePrice,
			formatReservePrice,
			highestBid,
		};

		ret.listingData.shortDisplayPrice = toShortDisplayPrice(scientificToDecimal(priceToDisplay));
	}

	return ret;
}
