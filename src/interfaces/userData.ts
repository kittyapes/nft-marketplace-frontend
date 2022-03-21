export type UserRole = 'superadmin' | 'admin' | 'user';

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

export interface UserData {
	address: string;
	createdAt: string;
	email: string;
	imageUrl: string;
	coverUrl: string;
	loginHistories: LoginHistoryEntry[];
	nickname: string;
	status: 'USER' | 'AWAITING_VERIFIED' | 'VERIFIED' | 'AWAITING_INACTIVATED';
	updatedAt: string;
	username: string;
	_id: string;
	bio: string;
	instagram: string;
	discord: string;
	twitter: string;
	website: string;
	pixiv: string;
	deviantart: string;
	artstation: string;
	roles: UserRole;
}