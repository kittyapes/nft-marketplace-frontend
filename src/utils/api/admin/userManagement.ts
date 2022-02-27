import { api } from '$constants/api';
import type { AdminData } from '$lib/interfaces/adminData';
import axios from 'axios';
import { getAxiosConfig } from '..';

export async function addToVerificationQueue(address: string) {
	return await axios.post(api + '/v1/accounts/' + address + '/promote', {}, getAxiosConfig());
}

export interface VerificationQueueItem {
	address: string;
	dateAdded: string;
}

export async function getVerificationQueue(
	sortBy: 'date' | 'alphabetical'
): Promise<VerificationQueueItem[]> {
	// const res = axios.get(api + '/v1/')

	console.log({ sortBy });

	return [
		{ address: 'asdasdasd', dateAdded: 'asdads' },
		{ address: 'homas tobza', dateAdded: 'tomas hobza' }
	];
}

export async function createAdmin(data: Partial<AdminData>) {
	const body = {
		name: data.name,
		// roles: data.permissions.join(',')
		roles: 'editor',
		email: 'email',
		password: ''
	};

	console.log(body);

	return await axios.post(api + '/v1/admins', body, getAxiosConfig()).then((res) => res.data);
}
