import type { UniversalPopupOptions } from './universalPopupOptions';

export interface NftCardOptions {
	imageUrl: string;
	title: string;
	collectionName?: string;
	likes?: number;
	price?: string;
	getUniversalPopupOptions: () => Promise<UniversalPopupOptions>;
}
