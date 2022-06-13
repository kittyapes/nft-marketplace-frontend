import type { UniversalPopupOptions } from './universalPopupOptions';

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
	startTime: Date;
	duration: number; // Seconds in JS (Seconds from server * 1000)
	isTimeActive: boolean; // If the listing should be deemed live - based on its time (start and expiry)
	getPopupProps?: () => Promise<{ options: UniversalPopupOptions }>;
}
