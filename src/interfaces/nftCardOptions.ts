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
}
