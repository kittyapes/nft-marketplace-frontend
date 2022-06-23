import type { MongoId } from '$interfaces';
import type { CardPopupOptions } from './cardPopupOptions';

export interface NftCardOptions {
	id: string;
	imageUrl?: string;
	animationUrl?: string;
	title: string;
	collectionName?: string;
	likes?: number;
	price?: string;
	favorited?: boolean;
	popupComponent?: any;
	popupOptions?: CardPopupOptions;
	startTime?: Date;
	duration?: number; // Seconds in JS (Seconds from server * 1000)
	isListingTimeActive?: boolean; // If the listing should be deemed live - based on its time (start and expiry)

	/** IDs to send to the bakend to like when the user taps the like button. */
	likeIds: MongoId[];
}
