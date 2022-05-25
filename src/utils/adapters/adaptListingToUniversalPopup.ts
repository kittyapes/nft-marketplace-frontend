import { currentUserAddress } from '$stores/wallet';
import type { Listing } from '$utils/api/listing';
import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';
import { get } from 'svelte/store';

// NEEDS CHANGING
export function adaptListingToUniversalPopup(listing: Listing) {
	const options: UniversalPopupOptions = {
		id: listing._id,
		imageUrl: listing.imageUrl,
		animationUrl: listing.coverImageUrl,
		title: listing.title,
		description: listing.description,
		currentUserIsOwner: listing.paymentTokenAddress === get(currentUserAddress),
		price: listing.listing.price,
		paymentTokenTicker: listing.paymentTokenTicker,
		paymentTokenAddress: listing.paymentTokenAddress,
		listingType: listing.listingType
	};

	return options;
}
