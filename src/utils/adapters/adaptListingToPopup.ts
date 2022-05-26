import { currentUserAddress } from '$stores/wallet';
import type { Listing, ListingType } from '$utils/api/listing';
import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';
import { get } from 'svelte/store';

export interface ListingPopupOptions extends UniversalPopupOptions {
	onChainId?: string;
	title: string;
	price: number;
	paymentTokenTicker: string;
	paymentTokenAddress: string;
	listingType: ListingType;
}

// NEEDS CHANGING
export function adaptListingToPopup(listing: Listing) {
	const options: ListingPopupOptions = {
		id: listing._id,
		onChainId: listing.listingId,
		imageUrl: listing.thumbnailUrl,
		animationUrl: listing.coverImageUrl,
		title: listing.title,
		description: listing.description,
		currentUserIsOwner: listing.paymentTokenAddress === get(currentUserAddress),
		price: listing.listing.price,
		paymentTokenTicker: listing.paymentTokenTicker,
		paymentTokenAddress: listing.paymentTokenAddress,
		listingType: listing.listingType
	};

	return { options };
}
