import axios from 'axios';
import { getApiUrl } from '.';

export interface Collection {
	name: string;
	url: string;
	image?: Blob;
	cover?: Blob;
	description?: string;
	displayTheme: 'CONTAINED' | 'PADDED' | 'COVERED';
	royalties?: { fees: string | number; address: string }[];
	walletAddress?: string;
	discordUrl?: string;
	instagramUrl?: string;
	twitterUrl?: string;
	otherUrl?: string;
	telegramUrl?: string;
	blockchain?: string;
	paymentTokenTicker: 'eth';
	paymentTokenAddress: string;
	isExplicitSensitive: boolean;
}

export function getInitialCollectionData(): Partial<Collection> {
	return {
		royalties: []
	};
}

export async function apiCreateCollection(options: Collection) {
	const res = await axios.post(getApiUrl('v2', 'collections'), {
		...options
	});

	console.log(res);
}
