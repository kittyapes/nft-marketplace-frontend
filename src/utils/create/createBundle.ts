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
	image: Blob;
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
	console.log(options.image);
	const formData = new FormData();
	formData.append('contractId', options.contractId.toString());
	formData.append('description', options.description || 'No description');
	formData.append('title', options.title);
	formData.append('nftIds', options.nftIds.join(','));
	formData.append('nftAmounts', options.nftAmounts.join(','));
	formData.append('creator', options.creator);
	formData.append('image', options.image);

	const res = await axios.post(getApiUrl('latest', 'drops'), formData, getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	if (!res) return null;

	return res.data.data as CreateBundleResponse;
}
