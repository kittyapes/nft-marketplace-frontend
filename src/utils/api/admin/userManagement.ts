import { api } from '$constants/api';
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
	const res = await axios.get(api + '/v1/accounts', { params: {}, ...getAxiosConfig() });

	return res.data.data;
}

export async function getVerifiedCreators(
	verificationStatus: 'verified' | 'inactivated' | 'all',
	sortBy: 'date' | 'alphabetical'
) {
	return await axios.get(api + '/v1/accounts', {
		params: { status: verificationStatus, sortBy },
		...getAxiosConfig()
	});
}

export async function promoteProfileNow(address: string) {
	return await axios.post(api + '/v1/accounts/' + address + '/promoteNow', {}, getAxiosConfig());
}

export async function inactivateProfileNow(address: string) {
	return await axios.post(api + '/v1/accounts/' + address + '/inactivateNow', {}, getAxiosConfig());
}
