import { appSigner } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { sanitizeHtmlInternal } from '$utils/html';
import { htmlize } from '$utils/misc/htmlize';
import { notifyError } from '$utils/toast';
import type { SupportedSocialNetworks } from '$utils/validator/isValidSocialLink';
import isValidSocialLink from '$utils/validator/isValidSocialLink';
import axios from 'axios';
import { sha512 } from 'hash.js';
import type { PublicProfileData } from 'src/interfaces/userData';
import { get } from 'svelte/store';
import { getApiUrl } from '.';

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

/**
 * Fetch profile data from the from the public user data API endpoint.
 * @param address The address of the profile.
 * @returns Profile data or `null` in case of an error.
 */
export async function fetchProfileData(address: string) {
	if (!address) return null;

	const res = await axios.get(getApiUrl('latest', 'users/' + address));

	if (!res) {
		return null;
	}

	const data = res.data.data as PublicProfileData;

	if (data.bio) {
		data.bio = sanitizeHtmlInternal(htmlize(data.bio));
	}

	return data as PublicProfileData;
}

/**
 * Fetch the user data of the currently connected user wallet. This data is different from the data
 * returned by the `fetchProfileData` function, which returns stripped user data. This function instead
 * returns all the data available, including the data that is only supposed to be seen by the owner
 * of the account.
 * @returns An object representing the profile data of the currently connected user.
 */
export async function fetchCurrentUserData(): Promise<{
	_id: string;
	address: string;
	bio: string;
	coverUrl: string;
	createdAt: string;
	email: string;
	loginHistories: any[];
	nftBalances: Record<number, number>;
	roles: string[];
	social: {
		artstation: string;
		deviantart: string;
		discord: string;
		instagram: string;
		pixiv: string;
		twitter: string;
		website: string;
	};
	thumbnailUrl: string;
	queueDate: number;
	updatedAt: string;
	username: string;
	lastUsedBidNonce: number;
}> {
	try {
		const res = await axios.get(getApiUrl('latest', 'users'), await getAxiosConfig());

		return res.data.data;
	} catch (err) {
		console.error(err);

		notifyError('Failed to load user data.');

		return null;
	}
}

export interface EditableProfileData {
	profileImage: Blob;
	coverImage: Blob;
	username: string;
	email: string;
	bio: string;
	thumbnailUrl: string;
	coverUrl: string;
	social: { [key in SupportedSocialNetworks]: string };
}

// async function hashImage(address: string, file: Blob) {
// 	const formData = new FormData();
// 	formData.append('image', file);

// 	const res = await axios.post(getApiUrl('latest', `users/${address}/hashImage`), formData);

// 	return res.data.data;
// }

export async function checkUsernameAvailability(username: string) {
	const res = await axios.get(getApiUrl('latest', `users/existed?username=${username}`));

	return !res.data.data.username;
}

export async function updateProfile(address: string, data: Partial<EditableProfileData>) {
	// Parse Relevant social links to the social object
	Object.keys(data.social).map((item: SupportedSocialNetworks) => {
		data.social[item] = data.social[item] ? isValidSocialLink(data.social[item], item).parsedValue : '';
	});

	const formData = new FormData();

	const requestTime = Date.now().toString();

	// const profileImageHash = data.profileImage && (await hashImage(address, data.profileImage));
	// const coverImageHash = data.coverImage && (await hashImage(address, data.coverImage));

	const requiredKeys = ['email', 'bio', 'username', 'discord', 'instagram', 'twitter', 'website', 'pixiv', 'deviantart', 'artstation'];

	// Prevent stuff from being undefined
	requiredKeys.forEach((key) => {
		if (!data[key]) {
			data[key] = '';
		}
	});

	// Escape stuff
	data.bio = sanitizeHtmlInternal(htmlize(data.bio));

	const message = [
		data.email,
		data.bio,
		data.username,
		requestTime,
		'',
		'',
		data.social.discord,
		data.social.instagram,
		data.social.twitter,
		data.social.website,
		data.social.pixiv,
		data.social.deviantart,
		data.social.artstation,
	]
		.map((v) => v || '')
		.join('');

	const hashedMessage = sha512().update(message).digest('hex');
	const signature = await get(appSigner).signMessage(hashedMessage);

	formData.append('nickname', '');
	formData.append('email', data.email);
	formData.append('bio', data.bio);
	formData.append('username', data.username);
	formData.append('request_time', requestTime);
	data.profileImage && formData.append('thumbnail', data.profileImage);
	data.coverImage && formData.append('cover', data.coverImage);
	formData.append('discord', data.social.discord);
	formData.append('instagram', data.social.instagram);
	formData.append('twitter', data.social.twitter);
	formData.append('website', data.social.website);
	formData.append('pixiv', data.social.pixiv);
	formData.append('deviantart', data.social.deviantart);
	formData.append('artstation', data.social.artstation);
	formData.append('signature', signature);

	await axios.put(getApiUrl('latest', `users`), formData, await getAxiosConfig());
}
