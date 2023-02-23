import type { EthAddress } from '$interfaces';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { api, getApiUrl, type ApiCallResult } from '.';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export type Notification = {
	_id: string;
	createdAt: string;
	updatedAt: string;
	notificationId: string;
};

// PUBLISH NOTIFICATION

export type PublishNotificationOptions = {
	title?: string;
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
	title?: string;
};

export type PublishNotificationRes = {
	error: boolean;
	data: PublishNotificationResObject;
};

export async function publishNotification(options: PublishNotificationOptions): Promise<ApiCallResult<PublishNotificationRes>> {
	options.publishAt = dayjs(options.publishAt).utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
	options.expireAt = options.expireAt ? dayjs(options.expireAt).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') : undefined;

	const res = await api.post(getApiUrl(null, '/notifications'), options, await getAxiosConfig());

	return res;
}

// GET NOTIFICATIONS

export type UserNotification = Notification & {
	content: string;
	title?: string;
	hasCleared: string;
	userAddress: EthAddress;
	readAt: null | string;
	publishAt: string;
	expireAt: string;
	targets?: string[];
	location?: string;
};

export type GetNotificationsRes = {
	error: boolean;
	data: UserNotification[];
};

export async function getNotifications(isUserAuthenticated = true): Promise<ApiCallResult<GetNotificationsRes>> {
	let res;

	if (isUserAuthenticated) {
		res = await api.get(getApiUrl(null, '/notifications'), { ...(await getAxiosConfig()) });
	} else {
		res = await api.get(getApiUrl(null, '/notifications'));
	}

	return res;
}

// UPDATE NOTIFICATION AS A USER

export type UpdateNotificationAsUserOptions = {
	id: string;
	readAt?: string;
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
	const params: UpdateNotificationAsUserReqParams = {
		// conditionally adding properties to params object
		...(options.hasCleared ? { hasCleared: options.hasCleared } : {}),
		...(options.readAt ? { readAt: dayjs(options.readAt).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') } : {}),
	};

	const res = await api.put(getApiUrl(null, '/notifications/user/' + options.id), params, await getAxiosConfig());

	return res;
}

// UPDATE NOTIFICATION AS A USER

export type UpdateNotificationAsAdminOptions = {
	id: string;
	content?: string;
	title?: string;
	location?: string;
	targets?: string[];
	publishAt?: string;
	expireAt?: string;
};

export type UpdateNotificationAsAdminReqParams = {
	content?: string;
	title?: string;
	location?: string;
	targets?: string[];
	publishAt?: string;
	expireAt?: string;
};

export type UpdateNotificationAsAdminRes = {
	error: boolean;
	data: null;
};

export async function updateNotificationAsAdmin(options: UpdateNotificationAsAdminOptions): Promise<ApiCallResult<UpdateNotificationAsAdminRes>> {
	const params: UpdateNotificationAsAdminReqParams = {
		content: options.content || undefined,
		title: options.title || undefined,
		location: options.location || undefined,
		targets: options.targets || undefined,
		...(options.publishAt ? { publishAt: dayjs(options.publishAt).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') } : {}),
		...(options.expireAt ? { expireAt: dayjs(options.expireAt).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') } : {}),
	};

	const res = await api.put(getApiUrl(null, '/notifications/' + options.id), params, await getAxiosConfig());

	return res;
}

// DELETE NOTIFICATION

export type DeleteNotificationRes = {
	error: false;
	data: {
		deletedNotification: boolean;
		deletedUserNotification: boolean;
	};
};

export async function deleteNotification(id: string): Promise<ApiCallResult<DeleteNotificationRes>> {
	const res = await api.delete(getApiUrl(null, '/notifications/' + id), await getAxiosConfig());

	return res;
}
