import axios from 'axios';
import { getApiUrl } from '.';

export interface GetNftResponse {
	_id: string;
	nftId: string;
	imageUrl: string;
	animationUrl: string;
	contractId: string;
	name: string;
	amount: number;
	creator: string;
	createdAt: string;
	updatedAt: string;
	metadata: any;
}

export async function getNft(id: string) {
	const res = await axios.get(getApiUrl('latest', 'nfts/' + id));

	return res.data.data as GetNftResponse;
}
