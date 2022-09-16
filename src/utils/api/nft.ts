import type { ApiNftData } from '$interfaces/apiNftData';
import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/types';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { noTryAsync } from 'no-try';
import { getApiUrl, type ApiCallResult } from '.';

export async function getNft(id: string) {
	const res = await axios.get(getApiUrl('latest', 'nfts/' + id));

	return res.data.data as ApiNftData;
}

export async function apiGetUserNfts(address: string, type: 'COLLECTED' | 'MINTED', page: number, limit: number) {
	const [err, res] = await noTryAsync(() =>
		axios.get(getApiUrl('latest', 'nfts/search'), {
			params: { address, page, limit, type },
		}),
	);

	return { err, res: res.data.data as ApiNftData[] };
}

export async function apiHideNft(id: string): Promise<ApiCallResult<{ success: boolean }>> {
	try {
		const res = await axios.post(getApiUrl('latest', 'nfts/hide/' + id), null, await getAxiosConfig());
		return { res, data: { success: true } };
	} catch (err) {
		return { err, data: { success: false } };
	}
}

export async function apiRevealNft(id: string): Promise<ApiCallResult<{ success: boolean }>> {
	try {
		const res = await axios.post(getApiUrl('latest', 'nfts/reveal/' + id), null, await getAxiosConfig());
		return { res, data: { success: true } };
	} catch (err) {
		return { err, data: { success: false } };
	}
}

export async function apiGetNftActivityHistory(id: string): Promise<NftActivityHistoryTableRowData[]> {
	try {
		const res = await axios.get(getApiUrl(null, '/nft-activities/' + id));
		console.log(res);
		return [];
	} catch {
		return [];
	}
}
