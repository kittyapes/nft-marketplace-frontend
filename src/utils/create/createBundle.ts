import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';

export interface CreateBundleOptions {
	contractId: number;
	description: string;
	title: string;
	nftIds: number[];
	nftAmounts: number[];
	creator: string;
}

export interface CreateBundleResponse {
	artist: string;
	contractId: number;
	coverUrl: string;
	createdAt: string; // Date string
	creator: string; // address
	description: string;
	imageUrl: string;
	title: string;
	updatedAt: string; // Date string
	_id: string; //"622b5edab88c6c7b95fd6c6b"
}

export async function createBundle(options: CreateBundleOptions) {
	const res = await axios
		.post(
			getApiUrl('latest', 'drops'),
			{
				contractId: options.contractId.toString(),
				description: options.description || 'No description.',
				title: options.title,
				creator: options.creator,
				nft_ids: options.nftIds.map((id) => id.toString()),
				nft_amounts: options.nftAmounts
			},
			getAxiosConfig()
		)
		.catch((e) => {
			httpErrorHandler(e);
			return null;
		});

	if (!res) return null;

	return res.data.data as CreateBundleResponse;
}
