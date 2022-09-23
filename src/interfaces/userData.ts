export type UserRole = 'superadmin' | 'admin' | 'user' | 'inactivated_user' | 'verified_user';

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

export interface UserData {
	_id: string;
	address: string;
	createdAt: string;
	updatedAt: string;
	username: string;
	thumbnailUrl: string;
	queueDate: number;
	coverUrl: string;
	bio: string;
	social: { instagram: string; discord: string; twitter: string; website: string; pixiv: string; deviantart: string; artstation: string };
	roles: UserRole[];
}
