import type { NftData } from '$interfaces/nft';
import axios from 'axios';
import { getApiUrl } from '.';

export async function getNft(id: string) {
	const res = await axios.get(getApiUrl('latest', 'nfts/' + id));

	return res.data.data as NftData;
}
