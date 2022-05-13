import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';

export interface CreateListingOptions {
	nfts?: {nftId: string, amount: number}[];
	description: string;
	title?: string;
	paymentTokenTicker?: string;
	paymentTokenAddress: string;
	modifiedOn?: string;
	listingType?: 'sale' | 'auction' | 'raffle';
	listing?: [];
	succesSaleTransaction?: string;

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

export async function createListing(options: CreateListingOptions) {
	const formData = new FormData();
	formData.append('description', options.description || 'No description');
	formData.append('title', options.title);
	formData.append('nfts', options.nfts.join(','));
	formData.append('listingType', options.listingType || 'sale');
	formData.append('paymentTokenTicker', options.paymentTokenTicker || 'ETH');
	formData.append('paymentTokenAddress', options.paymentTokenAddress);


	const res = await axios.post(getApiUrl('latest', 'listings'), formData, getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	if (!res) return null;
	console.log(res);
	return res.data.data as CreateBundleResponse;
}
