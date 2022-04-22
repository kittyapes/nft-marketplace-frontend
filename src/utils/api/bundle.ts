import axios from 'axios';
import { getApiUrl } from '.';

export interface GetBundleResponse {
	_id: string;
	nft_ids: string[];
	nft_amounts: number[];
}

export interface Bundle extends GetBundleResponse {}

export async function getBundle(id: string) {
	const res = await axios.get(getApiUrl('latest', 'drops/' + id));

	return res.data.data as GetBundleResponse;
}
