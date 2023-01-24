import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { api, getApiUrl, type ApiCallResult } from '.';

export type PublishNotificationOptions = {
	title?: string;
	content: string;
	location: string;
	targets: string;
	pushlishAt: string;
	expireAt: string;
};

export async function publishNotification(options: PublishNotificationOptions): Promise<ApiCallResult<any>> {
	const res = await api.post(getApiUrl(null, '/notifications'), options, await getAxiosConfig());
	console.log(res);

	return res;
}

export type GetNotificationOptions = {
	from?: string;
	to?: string;
};

export async function getNotification(options: GetNotificationOptions): Promise<ApiCallResult<any>> {
	const res = await api.get(getApiUrl(null, '/notifications'), { params: options });
	console.log(res);

	return res;
}

export async function deleteNotification(id: string): Promise<ApiCallResult<any>> {
	const res = await api.delete(getApiUrl(null, '/notifications/' + id), await getAxiosConfig());
	console.log(res);

	return res;
}
