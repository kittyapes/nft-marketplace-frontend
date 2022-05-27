export interface TokenData {
	amount: string;
	block_number: string;
	block_number_minted: string;
	contract_type: string;
	frozen: boolean;
	is_valid: boolean;
	minter_address: string,
	metadata: {
		animation_url: string;
		artist: string;
		categories: string;
		id: string;
		image: string;
		name: string;
		price: string;
		supply: string;
		external_link: string;
		description: string;
	};
	name: string;
	owner_of: string;
	symbol: string;
	synced_at: string;
	syncing: number;
	token_address: string;
	token_id: string;
	token_uri: string;
}
