import { getApiUrl } from "$utils/api";
import { getAxiosConfig } from "$utils/auth/axiosConfig";
import axios from "axios";

export async function getUsersThatFavoritedNft(id: string) {

	const res = await axios.get(getApiUrl('latest', 'nfts/favourite/' + id), {...getAxiosConfig(), params: {limit: 500}}).catch((e) => e.response);
	return res?.data.data;
}