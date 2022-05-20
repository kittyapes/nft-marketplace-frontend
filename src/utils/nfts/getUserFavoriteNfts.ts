import { getApiUrl } from "$utils/api";
import { getAxiosConfig } from "$utils/auth/axiosConfig";
import axios from "axios";

export async function getUserFavoriteNfts() {
	const res = await axios.get(getApiUrl('latest', 'users/favourite'), getAxiosConfig()).catch((e) => e.response);
	console.log(res);
	return res?.data.data;
}