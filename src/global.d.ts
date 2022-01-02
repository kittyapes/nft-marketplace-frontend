/// <reference types="@sveltejs/kit" />

interface ClaimsObject {
	merkleRoot: string;
	user: {
		amount: string;
		index: number;
		proof: string[];
		address: string;
		hasClaimed: boolean;
	};
}

interface NftData {
	name: string;
	img: string;
	collectionName: string;
	priceEth: number;
	likes: number;
	ownedByUser: boolean;
}

interface MarkeplaceNftListing {
	amount: string;
	animation_url: string;
	artist: string;
	batch: string;
	categories: string;
	categoryIndex: string;
	creationDate: string;
	generation: string;
	id: string;
	image: string;
	maxSupply: string;
	name: string;
	totalSupply: string;
	uri: string;
	status: string;
}

interface LoginHistoryEntry {
	address: string;
	checksum: string;
	device_info: string;
	upload_time: number;
}

interface ProfileData {
	address: string;
	createdAt: string;
	email: string;
	imageUrl: string;
	loginHistories: LoginHistoryEntry[];
	nickname: string;
	status: 'USER' | 'AWAITING_VERIFIED' | 'VERIFIED' | 'AWAITING_INACTIVATED';
	updatedAt: string;
	username: string;
	_id: string;
	bio: string;
}
