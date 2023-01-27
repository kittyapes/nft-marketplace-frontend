import type { EthAddress } from '$interfaces';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import type { Dayjs } from 'dayjs';
import { api, getApiUrl, type ApiCallResult } from '.';

export type Notification = {
	_id: string;
	createdAt: string;
	updatedAt: string;
	notificationId: string;
};

// PUBLISH NOTIFICATION

export type PublishNotificationOptions = {
	title: string;
	content: string;
	location?: string;
	targets: string[];
	publishAt: string;
	expireAt?: string;
};

export type PublishNotificationResObject = Notification & {
	targets: string[];
	createdBy: EthAddress;
	publishAt: string;
	content: string;
	title: string;
};

export type PublishNotificationRes = {
	error: boolean;
	data: PublishNotificationResObject;
};

export async function publishNotification(options: PublishNotificationOptions): Promise<ApiCallResult<PublishNotificationRes>> {
	const res = await api.post(getApiUrl(null, '/notifications'), options, await getAxiosConfig());

	return res;
}

// GET NOTIFICATIONS

export type GetNotificationOptions = {
	from?: string;
	to?: string;
};

export type UserNotification = Notification & {
	content: string;
	title: string;
	hasCleared: string;
	userAddress: EthAddress;
	readAt: null | string;
};

export type GetNotificationsRes = {
	error: boolean;
	data: UserNotification[];
};

export async function getNotifications(options?: GetNotificationOptions): Promise<ApiCallResult<GetNotificationsRes>> {
	const res = await api.get(getApiUrl(null, '/notifications'), { params: options, ...(await getAxiosConfig()) });

	return res;
}

// UPDATE NOTIFICATION AS A USER

export type UpdateNotificationAsUserOptions = {
	id: string;
	readAt?: Dayjs;
	hasCleared?: boolean;
};

export type UpdateNotificationAsUserReqParams = {
	readAt?: string;
	hasCleared?: boolean;
};

export type UpdateNotificationAsUserRes = {
	error: boolean;
	data: null;
};

export async function updateNotificationAsUser(options: UpdateNotificationAsUserOptions): Promise<ApiCallResult<UpdateNotificationAsUserRes>> {
	let params: UpdateNotificationAsUserReqParams = {
		readAt: options.readAt?.format('YYYY-MM-DDTHH:mm:ss.SSS') || null,
		hasCleared: options.hasCleared,
	};

	const res = await api.put(getApiUrl(null, '/notifications/user/' + options.id), params, await getAxiosConfig());

	return res;
}

// DELETE NOTIFICATION

export async function deleteNotification(id: string): Promise<ApiCallResult<any>> {
	const res = await api.delete(getApiUrl(null, '/notifications/' + id), await getAxiosConfig());

	return res;
}
