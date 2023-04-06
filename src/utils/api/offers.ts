import type { OfferModel } from '$interfaces';
import { profileData } from '$stores/user';
import type { BigNumber } from 'ethers';
import { get } from 'svelte/store';

export async function apiGetOffers(): Promise<OfferModel[]> {
	return new Promise((resolve) =>
		setTimeout(() => {
			resolve(
				Array(20).fill({
					userProfileImageUrl: get(profileData).thumbnailUrl,
					username: 'test',
					amount: '12345678.123123',
					ts: 123,
				}),
			);
		}, 3000),
	);
}

export async function apiMakeOffer(userAddress: string, offerAmount: BigNumber) {
	// TODO... call API

	return new Promise((resolve) => setTimeout(resolve, 3000));
}
