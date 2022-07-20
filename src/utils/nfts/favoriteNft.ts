import { getApiUrl } from "$utils/api";
import { getAxiosConfig } from "$utils/auth/axiosConfig";
import axios from "axios";

export async function favoriteNft(id: string) {
	const res = await axios.post(getApiUrl('latest', 'nfts/favourite/' + id), null, await getAxiosConfig()).catch((e) => e.response);
	return res?.data;
}