import type { UniversalPopupOptions } from './universalPopupOptions';

export interface NftCardOptions {
	id: string;
	imageUrl?: string;
	title: string;
	collectionName?: string;
	likes?: number;
	price?: string;
	favorite?: boolean;
	getUniversalPopupOptions: () => Promise<UniversalPopupOptions>;
}
