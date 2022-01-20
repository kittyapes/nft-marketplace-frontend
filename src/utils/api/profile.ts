import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import axios from 'axios';
import { get } from 'svelte/store';
import { getAxiosConfig } from '.';


const optionalProfileFields = ['twitter', 'instagram', 'facebook', 'bio'];

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

export interface ProfileData {
	address: string;
	createdAt: string;
	email: string;
	imageUrl: string;
	coverUrl: string;
	loginHistories: LoginHistoryEntry[];
	nickname: string;
	status: 'USER' | 'AWAITING_VERIFIED' | 'VERIFIED' | 'AWAITING_INACTIVATED';
	updatedAt: string;
	username: string;
	_id: string;
	bio: string;
	instagram: string;
	facebook: string;
	twitter: string;


	// new socials
	socialEmail: string;
	pixiv: string;
	deviantart: string;
	artstation: string;
}

export async function fetchProfileData(address: string) {
	const res = await axios.get(api + '/v1/accounts/' + address);
	const data = res.data.data as ProfileData;

	// We are using _ to set a "not present" value for optional fields
	for (let key of optionalProfileFields) {
		data[key] = data[key] !== '_' ? data[key] : null;
	}

	return data;
}

export async function promoteProfile(address: string) {
	return await axios
		.post(api + '/v1/accounts/' + address + '/promote', {}, getAxiosConfig())
		.then((res) => res.data);
}

export async function inactivateProfile(address: string) {
	return await axios
		.post(api + '/v1/accounts/' + address + '/inactivate', {}, getAxiosConfig())
		.then((res) => res.data);
}

export interface EditableProfileData {
	profileImage: Blob;
	coverImage: Blob;
	username: string;
	email: string;
	bio: string;
	instagram: string;
	facebook: string;
	twitter: string;
	imageUrl: string;
	coverUrl: string;

	// new socials
	socialEmail: string;
	pixiv: string;
	deviantart: string;
	artstation: string;
}

function readFileAsync(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result);
		};

		reader.onerror = reject;

		reader.readAsArrayBuffer(file);
	});
}

async function hashImage(address: string, file: Blob) {
	const formData = new FormData();
	formData.append('image', file);

	const res = await axios.post(api + '/v1/accounts/' + address + '/hashImage', formData);

	return res.data.data;
}

export async function updateProfile(address: string, data: Partial<EditableProfileData>) {
	const formData = new FormData();

	const requestTime = Date.now().toString();

	const profileImageHash = data.profileImage && (await hashImage(address, data.profileImage));
	const coverImageHash = data.coverImage && (await hashImage(address, data.coverImage));

	for (let key of optionalProfileFields) {
		data[key] = data[key] || '_';
	}

	const message = [
		data.email,
		data.bio,
		data.username,
		requestTime,
		profileImageHash || '',
		coverImageHash || '',
		data.facebook,
		data.instagram,
		data.twitter,
		data.socialEmail,
		data.pixiv,
		data.deviantart,
		data.artstation
	].join('');

	const signature = await get(appSigner).signMessage(message);

	formData.append('nickname', '');
	formData.append('email', data.email);
	formData.append('bio', data.bio);
	formData.append('username', data.username);
	formData.append('request_time', requestTime);
	data.profileImage && formData.append('image', data.profileImage);
	data.coverImage && formData.append('cover', data.coverImage);
	formData.append('facebook', data.facebook);
	formData.append('instagram', data.instagram);
	formData.append('twitter', data.twitter);
	formData.append('socialEmail', data.socialEmail);
	formData.append('pixiv', data.pixiv);
	formData.append('deviantart', data.deviantart);
	formData.append('artstation', data.artstation);
	formData.append('signature', signature);

	await axios.put(api + '/v1/accounts/' + address, formData);
}
