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
