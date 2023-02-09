import { getApiUrl } from '$utils/api';
import axios from 'axios';

export async function getUserFavoriteNfts(address: string, page = 1, limit = 50) {
	const res = await axios.get(getApiUrl('latest', 'users/favourite'), { params: { limit: limit, address, page } }).catch((e) => e.response);

	if (res.status != 200) {
		console.error(`Failed to get user liked NFTs. Server returned status code ${res.status}, ${res.statusText}.`);
		return [];
	}

	return res?.data?.data?.sort((a: any, b: any) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
}
