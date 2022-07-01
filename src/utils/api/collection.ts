import { currentUserAddress } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { get } from 'svelte/store';
import { getApiUrl } from '.';

export interface Collection {
	name: string;
	slug: string;
	image?: Blob;
	cover?: Blob;
	logoImageUrl?: string;
	backgroundImageUrl?: string;
	description?: string;
	isClaimed?: boolean;
	displayTheme: 'CONTAINED' | 'PADDED' | 'COVERED';
	royalties?: { fees: string | number; address: string; createdAt?: string }[];
	walletAddress?: string;
	discordUrl?: string;
	instagramUrl?: string;
	twitterUrl?: string;
	otherUrl?: string;
	telegramUrl?: string;
	blockchain?: string;
	paymentTokenTicker: 'ETH';
	status?: 'INACTIVE' | 'ACTIVE';
	paymentTokenAddress: string;
	isExplicitSensitive: boolean;
	creator: string;
	nfts: any[];
	id: string;
	createdAt?: string;
	origin: 'EXTERNAL' | 'HINATA';
	verified: boolean;
	floorPrice: number;
	totalVol: number;
	total24hours: number;
	'24hourPercent': number;
}

export function getInitialCollectionData(): Partial<Collection> {
	return {
		royalties: [
			{ fees: '', address: '' },
			// TODO uncomment once contract supports it
			/*{ fees: '', address: '' },
			{ fees: '', address: '' }*/
		]
	};
}

export async function addNftsToCollection(nftIds: string[], collectionId: string) {
	const res = await axios.post(getApiUrl('v2', 'collections/' + collectionId + '/add-nfts'), { nfts: nftIds }, getAxiosConfig());

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export async function apiCreateCollection(options: Collection) {
	options = { ...options };
	// renaming keys to match the endpoint
	delete Object.assign(options, { ['logoImage']: options['image'] }).image;
	delete Object.assign(options, { ['backgroundImage']: options['cover'] }).cover;

	options.paymentTokenTicker = 'ETH';
	options.paymentTokenAddress = get(currentUserAddress);
	options.royalties = JSON.stringify(options.royalties) as any;
	options.slug = options.slug.toLowerCase();

	const formData = new FormData();
	Object.entries(options).forEach(([k, v]) => formData.append(k, v));

	const res = await axios.post(getApiUrl('v2', 'collections'), formData, getAxiosConfig()).catch((e) => e.response);

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res;
}

export interface UpdateCollectionOptions {
	displayTheme: 'CONTAINED' | 'PADDED' | 'COVERED';
	name: string;
	slug: string;
	description: string;
	instagramUrl: string;
	discordUrl: string;
	twitterUrl: string;
	websiteUrl: string;
	telegramUrl: string;
	isExplicitSenstive: boolean;
	logoImage?: Blob;
	backgroundImage?: Blob;
	id: string;
}

export async function apiUpdateCollection(options: UpdateCollectionOptions) {
	const formData = new FormData();
	Object.entries(options).forEach(([k, v]) => v && formData.append(k, v));

	const res = await axios.put(getApiUrl('latest', 'collections/' + options.id), formData, getAxiosConfig()).catch((e) => e.response);

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res;
}

export async function apiGetCollectionBySlug(slug: string) {
	const res = await axios.get(getApiUrl('latest', 'collections/' + slug));

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export async function apiGetCollectionById(collectionId: string) {
	const res = await axios.get(getApiUrl('latest', 'collections/detail-by-id/' + collectionId));

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

export async function apiGetMostActiveCollections(): Promise<Collection[]> {
	const res = await axios.get(getApiUrl('latest', 'collections/search'));

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export interface collectionSearchOptions {
	creator?: string;
	slug?: string;
	name?: string;
	limit?: number;
	page?: number;
	sortBy?: 'ALPHABETICAL' | 'CREATED_AT';
	sortReversed?: boolean;
}

export async function apiSearchCollections(options?: collectionSearchOptions) {
	if (options && !options.name) options.name = undefined;
	if (options && !options.limit) options.limit = 20;

	const res = await axios.get(getApiUrl('v2', 'collections/search'), { params: options });
	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export async function apiValidateCollectionNameAndSlug(name: string | null = null, slug: string | null = null) {
	if (name || slug) {
		const params = {};
		const result = {
			nameIsDuplicate: false,
			nameisInvalid: false,
			slugIsDuplicate: false,
			slugIsInvalid: false
		};

		if (name) {
			params['name'] = name;

			const res = await axios.get(getApiUrl('v2', 'collections/validate-name'), { params });

			result['nameIsDuplicate'] = res.data.data.isDuplicate;
			result['nameIsInvalid'] = res.data.data.isInvalid;
		}

		if (slug) {
			params['slug'] = slug;

			const res = await axios.get(getApiUrl('v2', 'collections/validate-slug'), { params });

			result['slugIsDuplicate'] = res.data.data.isDuplicate;
			result['slugIsInvalid'] = res.data.data.isInvalid;
		}

		return result;
	}

	return null;
}

export async function changeCollectionStatus(slug: string, status: string) {
	const res = await axios.post(getApiUrl('latest', `collections/${slug}/set-status`), { status }, getAxiosConfig());

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}
