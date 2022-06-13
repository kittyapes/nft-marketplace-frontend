import SalePopup from '$lib/components/marketplace/SalePopup/SalePopup.svelte';
import type { Listing } from '$utils/api/listing';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { adaptListingToPopup } from './adaptListingToPopup';

export async function adaptListingToNftCard(listing: Listing) {
	listing.thumbnailUrl = listing.nfts[0]?.nft.thumbnailUrl;
	listing.coverImageUrl = listing.nfts[0]?.nft.assetUrl;

	// Need to check if the listing is active (timewise)
	const hasAStartTime = new Date(listing.startTime).getUTCFullYear() !== 1970;
	// It has a start time and its ending time has not yet passed
	const isTimeLive = hasAStartTime && new Date(listing.startTime).getTime() + listing.duration * 1000 > Date.now();

	const options: NftCardOptions = {
		id: listing.nfts[0]?.nftId,
		title: listing.title,
		imageUrl: listing.thumbnailUrl ? listing.thumbnailUrl : listing.nfts[0]?.nft.thumbnailUrl,
		animationUrl: listing.coverImageUrl ? listing.coverImageUrl : listing.nfts[0]?.nft.assetUrl,
		likes: listing.nfts[0]?.nft.favoriteCount || 0,
		popupComponent: SalePopup,
		startTime: hasAStartTime ? new Date(listing.startTime) : null,
		duration: listing.duration * 1000,
		isTimeActive: isTimeLive,
		getPopupProps: async () => adaptListingToPopup(listing)
	};

	return options;
}
