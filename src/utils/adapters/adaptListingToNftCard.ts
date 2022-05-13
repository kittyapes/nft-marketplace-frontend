import type { Listing } from '$utils/api/listing';
import { getNftFavoriteAmount } from '$utils/nfts/getNftFavoriteAmount';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { adaptListingToUniversalPopup } from './adaptListingToUniversalPopup';

export async function adaptListingToNftCard(listing: Listing) {
	const likes = await getNftFavoriteAmount(listing?.nfts[0]?._id)
	const options: NftCardOptions = {
		id: listing._id,
		title: listing.title,
		imageUrl: listing.imageUrl,
		likes,
		getUniversalPopupOptions: async () => {
			return adaptListingToUniversalPopup(listing);
		}
	};

	return options;
}
