import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import { getApiUrl } from '..';

export async function postVerificationQueueAdd(address: string) {
	return await axios.post(getApiUrl('latest', 'users/' + address + '/promote'), {}, await getAxiosConfig());
}

export async function postInactivationQueueAdd(address: string) {
	return await axios.post(getApiUrl('latest', 'users/' + address + '/inactivate'), {}, await getAxiosConfig());
}

export interface VerificationQueueItem {
	address: string;
	dateAdded: string;
}

export async function getVerificationQueue(sortBy: 'UPDATED_AT' | 'ALPHABETIC'): Promise<VerificationQueueItem[]> {
	const res = await axios.get(getApiUrl('latest', 'admins/users'), {
		params: { sortBy, status: 'AWAITING_VERIFIED,AWAITING_INACTIVATED' },
		...await getAxiosConfig()
	});

	return res.data.data;
}

export async function getVerifiedCreators(verificationStatus: string, sortBy: 'UPDATED_AT' | 'ALPHABETIC', query?: string) {

	return await axios.get(getApiUrl('latest', 'admins/users'), {
		params: { status: verificationStatus, sortBy, query: query || null, limit: 100 },
		...await getAxiosConfig()
	});
}
