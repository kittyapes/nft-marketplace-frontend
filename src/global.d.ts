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
