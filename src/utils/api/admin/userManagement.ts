import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '..';

export async function postVerificationQueueAdd(address: string) {
	return await axios.post(api + '/v1/accounts/' + address + '/promote', {}, getAxiosConfig());
}

export async function postInactivationQueueAdd(address: string) {
	return await axios.post(api + '/v1/accounts/' + address + '/inactivate', {}, getAxiosConfig());
}

export interface VerificationQueueItem {
	address: string;
	dateAdded: string;
}

export async function getVerificationQueue(
	sortBy: 'date' | 'alphabetical'
): Promise<VerificationQueueItem[]> {
	const res = await axios.get(api + '/v1/accounts', { params: { sortBy }, ...getAxiosConfig() });

	return res.data.data;
}

export async function getVerifiedCreators(
	verificationStatus: string,
	sortBy: 'date' | 'alphabetical'
) {
	return await axios.get(api + '/v1/accounts', {
		params: { status: verificationStatus, sortBy },
		...getAxiosConfig()
	});
}
