import type { ApiNftData } from '$interfaces/apiNftData';
import type { NftData } from '$interfaces/nft';
import axios from 'axios';
import { noTryAsync } from 'no-try';
import { getApiUrl } from '.';

export async function getNft(id: string) {
	const res = await axios.get(getApiUrl('latest', 'nfts/' + id));

	return res.data.data as NftData;
}

export async function apiGetUserNfts(address: string, type: 'COLLECTED' | 'MINTED', page: number, limit: number) {
	const [err, res] = await noTryAsync(() =>
		axios.get(getApiUrl('latest', 'nfts/search'), {
			params: { address, page, limit, type }
		})
	);

	return { err, res: res.data.data as ApiNftData[] };
}
