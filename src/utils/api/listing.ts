import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '.';
import type { Bundle } from './bundle';

export type ListingType = 'UNIQUE_FIXED_PRICE' | 'INVENTORIED_FIXED_PRICE';

export interface CreateListingOptions {
	bundleId: string;
	listingType: ListingType;
	price: number;
	creator: string;
	duration?: string;
	startedAt?: string;
}

export async function postCreateListing(options: CreateListingOptions) {
	try {
		const res = await axios.post(
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
		);

		return res.data;
	} catch (error) {
		return null;
	}
}

export interface Listing {
	_id: string;
	drop: Bundle;
}

export async function getListings() {
	const res = await axios.get(getApiUrl('latest', 'listings/search'), { params: { limit: 500 } });

	return res.data.data as Listing[];
}

export async function getListing() {
	
}