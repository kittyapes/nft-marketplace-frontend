import type { ApiNftData } from '$interfaces/apiNftData';
import type { CardOptions } from '$interfaces/ui';
import type { Listing } from '$utils/api/listing';
import { getMetadataFromUri, getOnChainUri, makeHttps } from '$utils/ipfs';
import dayjs from 'dayjs';
import { writable } from 'svelte/store';

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

	if (!data.thumbnailUrl || !data.metadata) {
		const nftMetadata = data.uri ? await getMetadataFromUri(data.uri) : null;
		data.metadata = nftMetadata ?? data.metadata;
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
		},
	};

	const makeNice = (n: number) => {
		return n.toString();
	};

	if (listing.listingType === 'sale') {
		const fPrice = listing.listing?.formatPrice;

		ret.saleData = {
			price: listing.listing.price,
			formatPrice: fPrice ? makeNice(fPrice) : 'N/A',
			// Has to be updated for when we support listing bundles
			nftQuantities: { [nft.nftId]: nft.amount },
		};
	}

	if (listing.listingType === 'auction') {
		const fStarting = listing.listing?.formatStartingPrice;
		const fReserve = listing.listing?.formatReservePrice;
		const highestBid = listing.highestBid;
		// Highest Bid is Always 0 when there is no highest bid
		const priceToDisplay = highestBid !== 0 && highestBid ? highestBid : fStarting;

		ret.auctionData = {
			startingPrice: listing.listing?.startingPrice,
			formatStartingPrice: fStarting ? makeNice(fStarting) : 'N/A',
			reservePrice: listing.listing?.reservePrice,
			formatReservePrice: fReserve ? makeNice(fReserve) : 'N/A',
			highestBid: highestBid ? makeNice(highestBid) : 'N/A',
			priceToDisplay: priceToDisplay ? makeNice(priceToDisplay) : 'N/A',
		};
	}

	return ret;
}
