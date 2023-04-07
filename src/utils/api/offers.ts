import type { OfferModel } from '$interfaces';
import { profileData } from '$stores/user';
import type { BigNumber } from 'ethers';
import { get } from 'svelte/store';

export async function apiGetOffers(page: number, limit: number): Promise<OfferModel[]> {
	if (page === 3) {
		limit = 0;
	}

	return new Promise((resolve, reject) =>
		setTimeout(() => {
			resolve(
				Array(limit).fill({
					userProfileImageUrl: get(profileData).thumbnailUrl,
					username: 'test',
					amount: '12345678.123123',
					ts: 123,
				}),
			);
		}, 1000),
	);

	// TODO offer of current user has to be filtered somehow, so it can be displayed at the top
}

export async function apiMakeOffer(userAddress: string, offerAmount: BigNumber) {
	// TODO... call API

	return new Promise((resolve) => setTimeout(resolve, 3000));
}
