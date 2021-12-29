import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '.';

export async function fetchProfileData(address: string) {
	const res = await (await fetch(api + '/v1/accounts/' + address)).json();
	const data = res.data as ProfileData;
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
