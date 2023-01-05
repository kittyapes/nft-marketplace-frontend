import { getApiUrl } from '$utils/api';
import axios from 'axios';

export async function getUserFavoriteNfts(address: string, page = 1, limit = 50) {
	const res = await axios.get(getApiUrl('latest', 'users/favourite'), { params: { limit: limit, address, page } }).catch((_e) => null);

	return (
		res?.data?.data?.sort((a: any, b: any) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}) ?? []
	);
}
