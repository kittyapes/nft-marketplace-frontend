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

interface PrivatePageSplitOptions {
	title: string;
	nextEscrowUnlock: string;
	claimTokensValue: number;
	escrowTokensValue: number;
	airdropType: 'seed' | 'private' | 'public';
	airdropHasClaimed: boolean;
	contractActive: boolean;
}
