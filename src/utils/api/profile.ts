import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import axios from 'axios';
import { get } from 'svelte/store';
import { getAxiosConfig } from '.';

const optionalProfileFields = ['twitter', 'instagram', 'facebook'];

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

export async function updateProfile(address: string, data: Partial<EditableProfileData>) {
	const formData = new FormData();

	const requestTime = Date.now().toString();

	// const profileImageData = await readFileAsync(data.profileImage);
	// console.log(profileImageData);
	// const profileImageDigest = await crypto.subtle.digest('SHA-512', profileImageData);
	// const hashArray = Array.from(new Uint8Array(profileImageDigest));
	// const hashHex = hashArray
	// .map((b) => b.toString(16).padStart(2, '0'))
	// .join('')
	// .substring(8);

	// We are setting fields which do not have a value to _, because
	// if we wanted to remove a value for a field and set it to "",
	// the backend would ignore it. We are then handling this and not displaying
	// the fields when the value for them is _.
	for (let key of optionalProfileFields) {
		data[key] = data[key] || '_';
	}

	const message = [
		data.email,
		data.bio,
		data.username,
		requestTime,
		data.facebook,
		data.instagram,
		data.twitter
	].join('');
	const signature = await get(appSigner).signMessage(message);

	// console.log(profileImageData);

	// console.log('digest', hashHex);

	formData.append('nickname', '');
	formData.append('email', data.email);
	formData.append('bio', data.bio);
	formData.append('username', data.username);
	formData.append('request_time', requestTime);
	// formData.append('image', data.profileImage, 'image');
	formData.append('facebook', data.facebook);
	formData.append('instagram', data.instagram);
	formData.append('twitter', data.twitter);
	formData.append('signature', signature);

	await axios.put(api + '/v1/accounts/' + address, formData);
}
