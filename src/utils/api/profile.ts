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
	instagram: string;
	discord: string;
	twitter: string;
	website: string;
	pixiv: string;
	deviantart: string;
	artstation: string;
	imageUrl: string;
	coverUrl: string;
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

	const message = [data.email, data.bio, data.username, requestTime, '', '', data.discord, data.instagram, data.twitter, data.website, data.pixiv, data.deviantart, data.artstation]
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
	formData.append('discord', data.discord);
	formData.append('instagram', data.instagram);
	formData.append('twitter', data.twitter);
	formData.append('website', data.website);
	formData.append('pixiv', data.pixiv);
	formData.append('deviantart', data.deviantart);
	formData.append('artstation', data.artstation);
	formData.append('signature', signature);

	await axios.put(getApiUrl('latest', `users/${address}`), formData, getAxiosConfig());
}
