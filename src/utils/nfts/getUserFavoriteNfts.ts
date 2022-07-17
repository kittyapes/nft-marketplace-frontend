import { getApiUrl } from '$utils/api';
import axios from 'axios';

export async function getUserFavoriteNfts(address: string, page: number = 1, limit: number = 50) {
	const res = await axios.get(getApiUrl('latest', 'users/favourite'), { params: { limit: limit, address, page } }).catch((e) => e.response);

	return res?.data.data.sort((a: any, b: any) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
}
