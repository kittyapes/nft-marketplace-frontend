import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '.';

export type ListingType = 'sale' | 'auction' | 'raffle';

export interface CreateListingOptions {
	bundleId: string;
	listingType: ListingType;
	price: number;
	creator: string;
	duration?: string;
	startedAt?: string;
}

export async function postCreateListing(options: CreateListingOptions) {
	return await axios
		.post(
			getApiUrl('latest', 'listings'),
			{
				dropId: options.bundleId,
				type: options.listingType,
				price: options.price.toString(),
				creator: options.creator,
				duration: options.duration,
				startedAt: options.startedAt
			},
			getAxiosConfig()
		)
		.catch((e) => e.response);
}

export interface Listing {
	_id: string;
	listingStatus: 'ACTIVE';
	listingType: ListingType;
	listing: {
		price: number;
		quantity: number;
	};
	nfts: {
		_id: string;
		nftId: string;
		amount: number;
	}[];
	paymentTokenTicker: 'ETH';
	paymentTokenAddress: string;
	startTime: string;
	duration: number;
	title: string;
	description: string;
	thumbnailUrl: string;
	coverImageUrl: string;
	createdAt: string;
	updatedAt: string;
}

export async function getListings() {
	const res = await axios.get(getApiUrl('latest', 'listings'), { params: { limit: 500 } });

	return res.data.data as Listing[];
}

export async function getListing(id: string) {
	const res = await axios.get(getApiUrl('latest', 'listings/' + id));

	return res.data.data as Listing;
}
