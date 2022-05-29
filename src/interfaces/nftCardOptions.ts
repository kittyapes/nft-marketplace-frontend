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
	getPopupProps?: () => Promise<{ options: UniversalPopupOptions }>;
}
