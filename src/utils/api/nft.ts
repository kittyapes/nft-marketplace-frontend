import type { ApiNftData } from '$interfaces/apiNftData';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { noTryAsync } from 'no-try';
import { getApiUrl } from '.';

export interface ApiCallResult<T> {
	err?: AxiosError;
	res?: AxiosResponse;
	data?: T;
}

export async function getNft(id: string, lean = false) {
	const res = await axios.get(getApiUrl('latest', 'nfts/' + id), {
		params: {
			lean: lean,
		},
	});

	return res.data.data as ApiNftData;
}

export async function apiGetUserOwnedNftsAlchemy(
	address: string,
	pageKey?: string,
	pageSize = 100,
) {
	const [err, res] = await noTryAsync(() =>
		axios.get(getApiUrl('latest', `nfts/alchemy/user/${address}`), {
			params: { pageKey, pageSize, omitMetadata: false },
		}),
	);

	return {
		err,
		res: (res?.data?.data ?? { pageKey: undefined, nfts: [] }) as {
			nfts: ApiNftData[];
			pageKey: string | undefined;
		},
	};
}

export async function apiGetUserNfts(address: string, type: 'MINTED', page: number, limit: number) {
	const [err, res] = await noTryAsync(() =>
		axios.get(getApiUrl('latest', 'nfts/search'), {
			params: { address, page, limit, type },
		}),
	);

	return {
		err,
		res: res.data.data as { nfts: ApiNftData[]; page: number; limit: number; totalCount: number },
	};
}

export async function apiHideNft(id: string): Promise<ApiCallResult<{ success: boolean }>> {
	try {
		const res = await axios.post(
			getApiUrl('latest', 'nfts/hide/' + id),
			null,
			await getAxiosConfig(),
		);
		return { res, data: { success: true } };
	} catch (err) {
		return { err, data: { success: false } };
	}
}

export async function apiRevealNft(id: string): Promise<ApiCallResult<{ success: boolean }>> {
	try {
		const res = await axios.post(
			getApiUrl('latest', 'nfts/reveal/' + id),
			null,
			await getAxiosConfig(),
		);
		return { res, data: { success: true } };
	} catch (err) {
		return { err, data: { success: false } };
	}
}

export enum PaymentTickersEnum {
	ETH = 'ETH',
}

export enum NftEventTypeEnum {
	LISTING_CREATED = 'LISTING_CREATED',
	LISTING_CANCELLED = 'LISTING_CANCELLED',
	LISTING_PURCHASED = 'LISTING_PURCHASED',
	OFFER_RECEIVED = 'OFFER_RECEIVED',
	OFFER_ACCEPTED = 'OFFER_ACCEPTED',
	BID_RECEIVED = 'BID_RECEIVED',
	MINTED = 'MINTED',
	BURNED = 'BURNED',
	TRANSFER = 'TRANSFER',
}

export interface ApiNftActivityHistoryEntry {
	nftIds: string[];
	contractAddresses: string[];
	tokenQuantities: number[];
	event: NftEventTypeEnum;
	price: string;
	tokenTicker: PaymentTickersEnum;
	tokenDecimals: number;
	from: string;
	to: string | null;
	detail: {
		listingId: string;
		listingType: NftEventTypeEnum;
	} | null;
	txHash: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export async function apiGetNftActivityHistory(
	fullId: string,
	options: {
		sales?: boolean;
		transfers?: boolean;
		listings?: boolean;
		bids?: boolean;
		limit?: number;
		page?: number;
	},
): Promise<ApiNftActivityHistoryEntry[]> {
	const o = options;
	const eventsParam = [
		o.sales && 'Sales',
		o.transfers && 'Transfers',
		o.listings && 'Listing',
		o.bids && 'Bids',
	]
		.filter((v) => v)
		.map((v) => `events=${v}`)
		.join('&');

	const params = {};

	if (options.limit) {
		params['limit'] = options.limit;
	}

	if (options.page) {
		params['page'] = options.page;
	}

	try {
		const res = await axios.get(getApiUrl(null, '/nft-activities/' + fullId + '?' + eventsParam), {
			params,
		});
		return res.data.data;
	} catch {
		return [];
	}
}
