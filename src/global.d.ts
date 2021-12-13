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
