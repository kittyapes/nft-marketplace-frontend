import { getApiUrl } from "$utils/api";
import { getAxiosConfig } from "$utils/auth/axiosConfig";
import axios from "axios";

export async function favoriteNft(id: string) {
	console.log(getAxiosConfig());
	const res = await axios.post(getApiUrl('latest', 'nfts/favourite/' + id), getAxiosConfig()).catch((e) => e.response);
	return res?.data.data;
}