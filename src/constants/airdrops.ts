export interface EligibilityPopupOptions {
	shortName: string;
	longName: string;
	tokensDrop: string;
	balancesTitle: string;
	balancesValue: string;
}

export const airdropOnePopupOptions: EligibilityPopupOptions = {
	shortName: 'Airdrop 1',
	longName: 'Community Airdrop 1',
	tokensDrop: '100,000 HINATA',
	balancesTitle: 'WAIFv2',
	balancesValue: '20,000'
};

export const airdropTwoPopupOptions: EligibilityPopupOptions = {
	shortName: 'Airdrop 2',
	longName: 'Community Airdrop 2',
	tokensDrop: '5,000 HINATA',
	balancesTitle: 'WAIFU NFTs',
	balancesValue: '5'
};
