import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { api, getApiUrl, type ApiCallResult } from '.';

export async function getExpPoints(): Promise<ApiCallResult<any>> {
	const res = await api.get(getApiUrl(null, '/exp'), await getAxiosConfig());
	return res;
}
