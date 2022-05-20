import axios from 'axios';
import { getApiUrl } from '.';

export interface Collection {
	name: string;
	image?: Blob;
	cover?: Blob;
	description?: string;
	displayTheme: 'CONTAINED' | 'PADDED' | 'COVERED';
	royalties?: { fees: string; address: string }[];
	walletAddress?: string;
	discordUrl?: string;
	instagramUrl?: string;
	mediumUrl?: string;
	otherUrl?: string;
	blockchain?: string;
	paymentTokenTicker: 'eth';
	paymentTokenAddress: string;
	isExplicitSensitive: boolean;
}

export async function apiCreateCollection(options: Collection) {
	const res = await axios.post(getApiUrl('v2', 'collections'), {
		...options
	});

	console.log(res);
}
