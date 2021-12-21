import { api } from '$constants/api';

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

export interface ProfileData {
	address: string;
	createdAt: string;
	email: string;
	imageUrl: string;
	loginHistories: LoginHistoryEntry[];
	nickname: string;
	status: 'USER' | 'AWAITING_VERIFIED' | 'VERIFIED';
	updatedAt: string;
	username: string;
	_id: string;
	bio: string;
}

export async function fetchProfileData(address: string) {
	const res = await (await fetch(api + '/v1/accounts/' + address)).json();
	const data = res.data as ProfileData;
	return data;
}
