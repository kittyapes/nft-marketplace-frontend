import type { Listing } from '$utils/api/listing';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';

export function adaptListingToNftCard(listing: Listing) {
	const options: NftCardOptions = {
		title: listing.drop.title,
		imageUrl: listing.drop.imageUrl,
		getUniversalPopupOptions: async () => {
			return {
				id: '-1',
				imageUrl: listing.drop.imageUrl,
				title: listing.drop.title,
				description: listing.drop.description,
				currentUserIsOwner: false
			};
		}
	};

	return options;
}
