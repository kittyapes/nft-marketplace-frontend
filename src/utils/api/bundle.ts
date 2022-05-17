import axios from 'axios';
import { getApiUrl } from '.';

export interface GetBundleResponse {
	_id: string;
	nft_ids: string[];
	nft_amounts: number[];
	title: string;
	imageUrl: string;
}

export interface Bundle {
	_id: string;
	nft_ids: string[];
	nft_amounts: number[];
	title: string;
	imageUrl: string;
	animationUrl: string;
	description: string;
	contractId: string;
}

export async function getBundle(id: string) {
	const res = await axios.get(getApiUrl('latest', 'drops/' + id));

	return res.data.data as GetBundleResponse;
}
