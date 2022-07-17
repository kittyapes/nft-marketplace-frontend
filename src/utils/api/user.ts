import axios from 'axios';
import { getApiUrl } from '.';

export async function apiGetHiddenNfts(address: string, page: number, limit: number) {
	const res = await axios.get(getApiUrl('latest', 'users/hiddenNFTs'), {
		params: { page, limit, address }
	});

	return res.data.data;
}
