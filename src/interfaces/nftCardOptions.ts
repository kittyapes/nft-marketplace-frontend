import type { CardPopupOptions } from './cardPopupOptions';

export interface NftCardOptions {
	id: string;
	imageUrl?: string;
	animationUrl?: string;
	title: string;
	collectionName?: string;
	likes?: number;
	price?: string;
	favorite?: boolean;
	popupComponent?: any;
	popupOptions?: CardPopupOptions;
	startTime: Date;
	duration: number; // Seconds in JS (Seconds from server * 1000)
	isTimeActive: boolean; // If the listing should be deemed live - based on its time (start and expiry)
}
