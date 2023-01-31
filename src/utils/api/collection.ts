import { currentUserAddress } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { get } from 'svelte/store';
import { getApiUrl } from '.';

export interface Collection {
	mintedFrom: string;
	name: string;
	slug: string;
	image?: Blob;
	cover?: Blob;
	logoImageUrl?: string;
	backgroundImageUrl?: string;
	description?: string;
	isClaimed?: boolean;
	displayTheme: 'CONTAINED' | 'PADDED' | 'COVERED';
	royalties?: { fees: string | null; address: string; createdAt?: string }[];
	walletAddress?: string;
	discordUrl?: string;
	deviantartUrl?: string;
	artstationUrl?: string;
	instagramUrl?: string;
	facebookUrl?: string;
	twitterUrl?: string;
	websiteUrl?: string;
	otherUrl?: string;
	telegramUrl?: string;
	pixivUrl?: string;
	blockchain?: string;
	paymentTokenTicker: 'ETH';
	status?: 'INACTIVE' | 'ACTIVE';
	paymentTokenAddress: string;
	isExplicitSenstive: boolean;
	creator: string;
	nfts: any[];
	id: string;
	createdAt?: string;
	origin: 'EXTERNAL' | 'HINATA';
	verified: boolean;
	collectionAddress: string;
	stats: {
		collectionAddress: string;
		numOfItems: number;
		numOfOwners: number;
		localTotalVol: number;
		externalTotalVol: number;
		local24Vol: number;
		external24Vol: number;
		local7DayVol: number;
		external7DayVol: number;
		local30DayVol: number;
		external30DayVol: number;
		localHighestSale: number;
		externalHighestSale: number;
		localFloorPrice: number;
		externalFloorPrice: number;
		previousLocalTotalVol: number;
		previousExternalTotalVol: number;
		previousLocal24Vol: number;
		previousExternal24Vol: number;
		previousLocal7DayVol: number;
		previousExternal7DayVol: number;
		previousLocal30DayVol: number;
		previousExternal30DayVol: number;
		lastPreviousExternal30DayCount: Date;
		lastPreviousExternal7DayCount: Date;
		lastPreviousLocal30DayCount: Date;
		lastPreviousLocal7DayCount: Date;
		lastPreviousLocal24HourCount: Date;
		lastExternalStatsUpdatedAtBlock: number;
		total24Vol?: number; // calculated on FE
		prevTotal24Vol?: number; // calculated on FE
		vol24HrChange?: number; // calculated on FE
	} | null;
}

export function getInitialCollectionData(): Partial<Collection> {
	return {
		royalties: [
			{ fees: '', address: '' },
			{ fees: '', address: '' },
			{ fees: '', address: '' },
		],
	};
}

export async function addNftsToCollection(nftIds: string[], collectionId: string) {
	const res = await axios.post(getApiUrl('v2', 'collections/' + collectionId + '/add-nfts'), { nfts: nftIds }, await getAxiosConfig());

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

	const res = await axios.post(getApiUrl('v2', 'collections'), formData, await getAxiosConfig()).catch((e) => e.response);

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

	const res = await axios.put(getApiUrl('latest', 'collections/' + options.id), formData, await getAxiosConfig()).catch((e) => e.response);

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res;
}

export async function apiGetCollectionBySlug(slug: string, limit?: number, page?: number) {
	const res = await axios.get(getApiUrl('latest', 'collections/' + slug), { params: { limit, page } });

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

export async function apiGetMostActiveCollections(): Promise<{ collections: Collection[]; totalCount: number }> {
	const limit = 12;
	const res = await axios.get(getApiUrl('v2', 'collections/search'), { params: { limit, status: 'ACTIVE' } });

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}

export interface CollectionSearchOptions {
	creator?: string;
	slug?: string;
	name?: string;
	limit?: number;
	page?: number;
	sortBy?: 'ALPHABETICAL' | 'CREATED_AT' | 'ONE_DAY_VOLUME' | 'SEVEN_DAYS_VOLUME' | 'THIRTY_DAYS_VOLUME' | 'TOTAL_VOLUME';
	sortReversed?: boolean;
	collectionAddress?: string;
	status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
}

export async function apiSearchCollections(options?: CollectionSearchOptions) {
	if (options && !options.name) options.name = null;

	if (options && !options.limit) options.limit = 20;
	else if (!options && !options?.limit) {
		options = {
			limit: 20,
		};
	}

	if (!options.status) options.status = 'ACTIVE';
	else if (options.status === 'ALL') options.status = null;

	const res = await axios.get(getApiUrl('v2', 'collections/search'), { params: options });
	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	if (res.data.data?.collections?.length > 0) {
		res.data.data.collections.map((collection: Collection) => {
			if (collection?.stats) {
				const total24Vol = collection?.stats?.local24Vol + collection?.stats?.external24Vol;
				const prevTotal24Vol = collection?.stats?.previousLocal24Vol + collection?.stats?.previousExternal24Vol;
				const vol24HrChange = (total24Vol - prevTotal24Vol) / prevTotal24Vol;

				collection.stats.total24Vol = total24Vol;
				collection.stats.prevTotal24Vol = prevTotal24Vol;
				collection.stats.vol24HrChange = vol24HrChange;
			}

			return collection;
		});
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
			slugIsInvalid: false,
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
	const res = await axios.post(getApiUrl('latest', `collections/${slug}/set-status`), { status }, await getAxiosConfig());

	if (res.status !== 200) {
		throw new Error(res.data.message);
	}

	return res.data.data;
}
