export type UserRole = 'superadmin' | 'admin' | 'user' | 'inactivated_user' | 'verified_user';

export interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

type SocialData = {
	instagram: string;
	discord: string;
	twitter: string;
	website: string;
	pixiv: string;
	deviantart: string;
	artstation: string;
};

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
	social: SocialData;
	roles: UserRole[];
	// Not Sure who removed this before
	status: string; // more to be added later (enum)

	totalMinted: number;
	exp: number;
}

export interface PublicProfileData {
	_id: string;
	address: string;
	bio: string;
	coverUrl: string;
	roles: UserRole[];
	thumbnailUrl: string;
	username: string;
}
