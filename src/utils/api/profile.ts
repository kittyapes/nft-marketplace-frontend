import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { htmlize } from '$utils/misc/htmlize';
import axios from 'axios';
import { sha512 } from 'hash.js';
import type { UserData } from 'src/interfaces/userData';
import { get } from 'svelte/store';
import { getApiUrl } from '.';

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

/**
 * Fetch profile data from the server.
 * @param address The address of the profile.
 * @returns Profile data or `null` in case of an error.
 */
export async function fetchProfileData(address: string) {
	if(!address) return null;
	
	const res = await axios.get(getApiUrl('latest', 'users/' + address)).catch(() => null);

	if (!res) {
		return null;
	}

	const data = res.data.data as UserData;

	return data as UserData;
}

export interface EditableProfileData {
	profileImage: Blob;
	coverImage: Blob;
	username: string;
	email: string;
	bio: string;
	thumbnailUrl: string;
	coverUrl: string;
	social: { instagram: string; discord: string; twitter: string; website: string; pixiv: string; deviantart: string; artstation: string };
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
	data.bio = htmlize(data.bio);

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
		data.social.artstation
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
