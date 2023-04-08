import { connectionDetails } from '$stores/wallet';
import { ethers, type BigNumberish } from 'ethers';
import { get } from 'svelte/store';

const knownTokens: { ticker: string; address: string; network: string; decimals: number }[] = [
	{
		ticker: 'WETH',
		address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		network: 'eth',
		decimals: 18,
	},
	{
		ticker: 'WETH',
		address: '0xf2155859d31C5EA79F45a55C6ad9A44e7f257700',
		network: 'rinkeby',
		decimals: 18,
	},
	// {
	// 	ticker: 'WETH',
	// 	address: '0x0c84c20673341B5bae28D80F54926269A64B47a5',
	// 	network: 'testing-goerli',
	// 	decimals: 18,
	// },
	// {
	// 	ticker: 'WETH',
	// 	address: '0x6aA500DBe47b19437cB93D84492BDD175AA333BB',
	// 	network: 'development-goerli',
	// 	decimals: 18,
	// },
	// {
	// 	ticker: 'WETH',
	// 	address: '0xbA5029aAF14672ef662aD8eB38CDB4E4C16AdF6D',
	// 	network: 'staging-goerli',
	// 	decimals: 18,
	// },
	{
		ticker: 'WETH',
		address: '0xbA5029aAF14672ef662aD8eB38CDB4E4C16AdF6D',
		network: 'goerli',
		decimals: 18,
	},
	{
		ticker: 'HI',
		address: '0x04013fA3b72E82489d434FD64E3f4142647413cA',
		network: 'rinkeby',
		decimals: 18,
	},
];

export function isKnownToken(options: {
	ticker?: string;
	tokenAddress?: string;
	network?: 'eth' | 'rinkeby' | 'goerli';
}) {
	try {
		getKnownTokenDetails(options);
	} catch {
		return false;
	}

	return true;
}

export function getKnownTokenDetails(options: {
	ticker?: string;
	tokenAddress?: string;
	network?: 'eth' | 'rinkeby' | 'goerli';
}) {
	const { ticker, tokenAddress } = options;
	let { network } = options;

	if (!ticker && !tokenAddress) {
		throw new Error('ticker or tokenAddress must be provided.');
	}

	if (get(connectionDetails)?.chainId === 1) {
		network = 'eth';
	} else if (get(connectionDetails)?.chainId === 4) {
		network = 'rinkeby';
	} else if (get(connectionDetails)?.chainId === 5) {
		network = 'goerli';
	}

	// const environment: string | undefined = import.meta.env.VITE_CONTRACTS_ENVIRONMENT;
	// if ((environment?.trim() === 'development' || environment?.trim() === 'testing' || environment?.trim() === 'staging') && network === 'goerli') {
	// 	(network as string) = `${environment.trim()}-goerli`;
	// }

	if (!network) {
		network = 'eth';
	}

	const token = knownTokens.find(
		(t) =>
			(t.ticker === ticker && t.network === network) ||
			t.address.toLowerCase() === tokenAddress?.toLowerCase(),
	);

	if (!token) {
		throw new Error(`Couldn't find such token: ${JSON.stringify(options)}`);
	}

	return token;
}

export function parseToken(
	amount: string,
	tokenAddress: string,
	fallback?: ethers.BigNumber,
): ethers.BigNumber {
	const tokenDetails = getKnownTokenDetails({ tokenAddress: tokenAddress });

	try {
		return ethers.utils.parseUnits(amount, tokenDetails.decimals);
	} catch (err) {
		if (fallback !== undefined) return fallback;
		throw err;
	}
}

export function formatToken(amount: BigNumberish, tokenAddress: string) {
	const tokenDetails = getKnownTokenDetails({ tokenAddress: tokenAddress });

	return ethers.utils.formatUnits(amount, tokenDetails.decimals);
}
