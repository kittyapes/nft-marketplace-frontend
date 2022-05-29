import { getApiUrl } from "$utils/api";
import { getAxiosConfig } from "$utils/auth/axiosConfig";
import axios from "axios";

export async function getUserFavoriteNfts() {
	const res = await axios.get(getApiUrl('latest', 'users/favourite'), {...getAxiosConfig(), params: {limit: 500}}).catch((e) => e.response);
	return res?.data.data;
}