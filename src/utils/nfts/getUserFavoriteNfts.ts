import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';

export async function getUserFavoriteNfts(address?: string, page?: number, limit: number = 20) {
	const res = await axios.get(getApiUrl('latest', 'users/favourite'), { ...getAxiosConfig(address), params: { limit: limit } }).catch((e) => e.response);
	return res?.data.data;
}
