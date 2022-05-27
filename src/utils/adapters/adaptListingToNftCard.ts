import type { Listing } from '$utils/api/listing';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { adaptListingToUniversalPopup } from './adaptListingToUniversalPopup';

// NEEDS CHANGING
export async function adaptListingToNftCard(listing: Listing) {

	listing.imageUrl = listing.nfts[0]?.nft.thumbnailUrl
	listing.coverImageUrl = listing.nfts[0]?.nft.assetUrl
	const options: NftCardOptions = {
		id: listing.nfts[0]?.nftId,
		title: listing.title,
		imageUrl: listing.imageUrl ? listing.imageUrl : listing.nfts[0]?.nft.thumbnailUrl,
		animationUrl: listing.coverImageUrl ? listing.coverImageUrl : listing.nfts[0]?.nft.assetUrl,
		likes: listing.nfts[0]?.nft.favoriteCount || 0,
		getUniversalPopupOptions: async () => {
			return adaptListingToUniversalPopup(listing);
		}
	};

	return options;
}
