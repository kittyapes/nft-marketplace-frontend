/// <reference types="@sveltejs/kit" />

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
