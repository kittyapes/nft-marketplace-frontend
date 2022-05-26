import SalePopup from '$lib/components/marketplace/SalePopup/SalePopup.svelte';
import NftDisplayPopup from '$lib/components/profile/NFTDisplayPopup.svelte';
import { getListing, Listing } from '$utils/api/listing';
import { getNftFavoriteAmount } from '$utils/nfts/getNftFavoriteAmount';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { adaptListingToPopup } from './adaptListingToPopup';

// NEEDS CHANGING
export async function adaptListingToNftCard(listing: Listing) {
	let likes: number;

	listing = await getListing(listing._id);
	if (!listing) return null;

	listing?.nfts ? (listing.thumbnailUrl = listing?.nfts[0]?.nft.thumbnailUrl) : '';
	listing?.nfts ? (listing.coverImageUrl = listing?.nfts[0]?.nft.assetUrl) : '';
	listing?.nfts ? (likes = await getNftFavoriteAmount(listing?.nfts[0]?.nftId)) : (likes = 0);

	const options: NftCardOptions = {
		id: listing.listingId,
		title: listing.title,
		imageUrl: listing?.nfts ? listing?.nfts[0]?.nft.thumbnailUrl : listing.thumbnailUrl,
		animationUrl: listing?.nfts ? listing?.nfts[0]?.nft.assetUrl : listing.coverImageUrl,
		likes,
		popupComponent: SalePopup,
		getPopupProps: async () => adaptListingToPopup(listing)
	};
	return options;
}
