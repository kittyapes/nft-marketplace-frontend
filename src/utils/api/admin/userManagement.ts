import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '..';

export async function postVerificationQueueAdd(address: string) {
	return await axios.post(getApiUrl('v2', 'users/' + address + '/promote'), {}, getAxiosConfig());
}

export async function postInactivationQueueAdd(address: string) {
	return await axios.post(getApiUrl('v2', 'users/' + address + '/inactivate'), {}, getAxiosConfig());
}

export interface VerificationQueueItem {
	address: string;
	dateAdded: string;
}

export async function getVerificationQueue(sortBy: 'UPDATED_AT' | 'ALPHABETIC'): Promise<VerificationQueueItem[]> {
	const res = await axios.get(getApiUrl('v2', 'admins/users'), {
		params: { sortBy, status: 'AWAITING_VERIFIED,AWAITING_INACTIVATED' },
		...getAxiosConfig()
	});

	return res.data.data;
}

export async function getVerifiedCreators(verificationStatus: string, sortBy: 'UPDATED_AT' | 'ALPHABETIC', query?: string) {
	return await axios.get(api + '/v1/accounts', {
		params: { status: verificationStatus, sortBy, query: query || null },
		...getAxiosConfig()
	});
}
