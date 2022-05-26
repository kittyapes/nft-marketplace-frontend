import { currentUserAddress } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { get } from 'svelte/store';
import { getApiUrl } from '.';

export interface Collection {
	name: string;
	slug: string;
	url?: string;
	image?: Blob;
	cover?: Blob;
	logoImageUrl?: string;
	backgroundImageUrl?: string;
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
	creator: string;
	nfts: [];
	_id: string;
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
	console.log(formData);

	const res = await axios.post(getApiUrl('v2', 'collections'), formData, getAxiosConfig()).catch((e) => e.response);

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	console.log(res);

	return res;
}

export async function apiGetCollection(collectionId: string) {
	const res = await axios.get(getApiUrl('v2', 'collections/' + collectionId), getAxiosConfig());

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export interface CollectionTableRow {
	name: string;
	logoImageUrl: string;
	origin: 'EXTERNAL' | 'HINATA';
	verified: boolean;
	floorPrice: number;
	totalVol: number;
	total24hours: number;
	'24hourPercent': number;
}

export async function apiGetMostActiveCollections(): Promise<CollectionTableRow[]> {
	// TODO shouldn't require token, but the backend wasn't updated yet
	const res = await axios.get(getApiUrl('v2', 'collections'), getAxiosConfig());

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export async function apiSearchCollections() {
	const params = {
		limit: 100
	};

	// TODO shouldn't require token, but the backend wasn't updated yet
	const res = await axios.get(getApiUrl('v2', 'collections/search'), { ...getAxiosConfig(), params });

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}
