import type { ListingType } from '$utils/api/listing';

export interface UniversalPopupOptions {
	id: string;
	title: string;
	imageUrl?: string;
	animationUrl?: string;
	creator?: string;
	edition?: string;
	editionType?: string;
	description?: string;
	currentUserIsOwner: boolean;
	price: number;
	paymentTokenTicker: string;
	paymentTokenAddress: string;
	listingType: ListingType;
}
