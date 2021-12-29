import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import axios from 'axios';
import { get } from 'svelte/store';
import { getAxiosConfig } from '.';

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
	loginHistories: LoginHistoryEntry[];
	nickname: string;
	status: 'USER' | 'AWAITING_VERIFIED' | 'VERIFIED' | 'AWAITING_INACTIVATED';
	updatedAt: string;
	username: string;
	_id: string;
	bio: string;
}

export async function fetchProfileData(address: string) {
	// Testing only
	address = '0x16a73f3A64EcA79E117258e66dFd7071Cc8312A9';

	const res = await axios.get(api + '/v1/accounts/' + address);
	const data = res.data.data as ProfileData;

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
	username: string;
	email: string;
	bio: string;
	socials: {
		instagram: string;
		facebook: string;
		twitter: string;
	};
}

export async function updateProfile(address: string, data: Partial<EditableProfileData>) {
	const formData = new FormData();

	const requestTime = Date.now().toString();

	const message = data.email + data.username + requestTime;
	const signature = await get(appSigner).signMessage(message);

	data.email && formData.append('email', data.email);
	data.username && formData.append('username', data.username);
	formData.append('request_time', requestTime);
	formData.append('signature', signature);

	console.log(signature);

	const res = await axios.put(api + '/v1/accounts/' + address, formData, getAxiosConfig());
}
