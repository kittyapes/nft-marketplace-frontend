import type { Listing } from '$utils/api/listing';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { adaptListingToUniversalPopup } from './adaptListingToUniversalPopup';

export function adaptListingToNftCard(listing: Listing) {
	const options: NftCardOptions = {
		id: listing._id,
		title: listing.title,
		imageUrl: listing.imageUrl,
		getUniversalPopupOptions: async () => {
			return adaptListingToUniversalPopup(listing);
		}
	};

	return options;
}
