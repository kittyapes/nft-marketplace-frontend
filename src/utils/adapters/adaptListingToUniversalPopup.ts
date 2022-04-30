import { currentUserAddress } from '$stores/wallet';
import type { Listing } from '$utils/api/listing';
import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';
import { get } from 'svelte/store';

export function adaptListingToUniversalPopup(listing: Listing) {
	const options: UniversalPopupOptions = {
		id: listing._id,
		imageUrl: listing.drop.imageUrl,
		title: listing.drop.title,
		description: listing.drop.description,
		currentUserIsOwner: listing.creator === get(currentUserAddress)
	};

	return options;
}
