/// <reference types="@sveltejs/kit" />

declare global {
	interface Number {
		noExponents: () => string;
	}
}

interface ClaimsObject {
	merkleRoot: string;
	user: {
		rootIndex: number;
		amount: string;
		index: number;
		proof: string[];
		address: string;
		hasClaimed: boolean;
	};
	nextClaimDuration: number; // In Milliseconds
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
	socialEmail: string;
	pixiv: string;
	deviantart: string;
	artstation: string;
}

// Data provided by databasewaifu.herokuapp.com
interface TokenData {
	amount: string;
	block_number: string;
	block_number_minted: string;
	contract_type: string;
	frozen: boolean;
	is_valid: boolean;
	metadata: {
		animation_url: string;
		artist: string;
		categories: string;
		id: string;
		image: string;
		name: string;
		price: string;
		supply: string;
	};
	name: string;
	owner_of: string;
	symbol: string;
	synced_at: string;
	syncing: number;
	token_address: string;
	token_id: string;
	token_uri: string;
	token_uri_data: writable<{
		image: string;
	}>;
}

interface PrivatePageSplitOptions {
	title: string;
	nextEscrowUnlock: string;
	claimTokensValue: number;
	escrowTokensValue: number;
	airdropType: 'seed' | 'private' | 'ido';
	airdropHasClaimed: boolean;
	contractActive: boolean;
}
