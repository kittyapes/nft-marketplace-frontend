import { currentUserAddress } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { get } from 'svelte/store';
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
	options = { ...options };

	options.paymentTokenTicker = 'eth';
	options.paymentTokenAddress = get(currentUserAddress);
	options.royalties = JSON.stringify(options.royalties) as any;

	const formData = new FormData();
	Object.entries(options).forEach(([k, v]) => formData.append(k, v));

	const res = await axios.post(getApiUrl('v2', 'collections'), formData, getAxiosConfig()).catch((e) => e.response);

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	console.log(res);

	return res;
}
