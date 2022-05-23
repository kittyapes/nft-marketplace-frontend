import { getListing, Listing } from '$utils/api/listing';
import { getNftFavoriteAmount } from '$utils/nfts/getNftFavoriteAmount';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { adaptListingToUniversalPopup } from './adaptListingToUniversalPopup';

// NEEDS CHANGING
export async function adaptListingToNftCard(listing: Listing) {
	let likes: number;

	listing = await getListing(listing._id);
	if(!listing) return null;

	listing?.nfts ? listing.imageUrl = listing?.nfts[0]?.nft.thumbnailUrl : '';
	listing?.nfts ? listing.coverImageUrl = listing?.nfts[0]?.nft.assetUrl : '';
	listing?.nfts ? likes = await getNftFavoriteAmount(listing?.nfts[0]?.nftId) : likes = 0;

	const options: NftCardOptions = {
		id: listing?.nfts? listing?.nfts[0]?.nftId : listing._id,
		title: listing.title,
		imageUrl: listing?.nfts ? listing?.nfts[0]?.nft.thumbnailUrl : listing.imageUrl,
		animationUrl: listing?.nfts ? listing?.nfts[0]?.nft.assetUrl : listing.coverImageUrl,
		likes,
		getUniversalPopupOptions: async () => {
			return adaptListingToUniversalPopup(listing);
		}
	};
	return options;
}
