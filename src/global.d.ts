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

interface PrivatePageSplitOptions {
	title: string;
	nextEscrowUnlock: string;
	claimTokensValue: number;
	escrowTokensValue: number;
	airdropType: 'seed' | 'private' | 'ido';
	airdropHasClaimed: boolean;
	contractActive: boolean;
}

interface PopupRowInfo {
	id: number;
	message: string;
	nickname: string;
	imageUrl: string;
	amount: number;
}

interface MoralisNft {
	token_address: string;
	token_id: string;
	amount: string;
	owner_of: string;
	token_hash: string;
	block_number_minted: string;
	block_number: string;
	contract_type: string;
	name: string;
	symbol: string;
	token_uri: string | null;
	metadata: string | null; // JSON String
	synced_at: string; // ISOString
	last_token_uri_sync: string | null; // ISO String
	last_metadata_sync: string | null; // ISO String
	minter_address: string;
}
