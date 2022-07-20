import { connectionDetails } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

const knownTokens: { ticker: string; address: string; network: string; decimals: number }[] = [
	{
		ticker: 'WETH',
		address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		network: 'eth',
		decimals: 18
	},
	{
		ticker: 'WETH',
		address: '0xf2155859d31C5EA79F45a55C6ad9A44e7f257700',
		network: 'rinkeby',
		decimals: 18
	}
];

export function getKnownTokenDetails(options: { ticker?: string; tokenAddress?: string; network?: 'eth' | 'rinkeby' }) {
	let { ticker, tokenAddress, network } = options;

	if (!ticker && !tokenAddress) {
		throw new Error('ticker or tokenAddress must be provided.');
	}

	if (get(connectionDetails)?.chainId === 1) {
		network = 'eth';
	} else if (get(connectionDetails)?.chainId === 4) {
		network = 'rinkeby';
	}

	if (!network) {
		network = 'eth';
	}

	const token = knownTokens.find((t) => (t.ticker === ticker || t.address.toLowerCase() === tokenAddress.toLowerCase()) && t.network === network);

	if (!token) {
		throw new Error(`Couldn't find such token: ${JSON.stringify(options)}`);
	}

	return token;
}

export function parseToken(amount: string, tokenAddress: string, fallback?: any) {
	const tokenDetails = getKnownTokenDetails({ tokenAddress: tokenAddress });

	try {
		return ethers.utils.parseUnits(amount, tokenDetails.decimals);
	} catch (err) {
		if (fallback !== undefined) return fallback;
		throw err;
	}
}

export function formatToken(amount: string, tokenAddress: string) {
	const tokenDetails = getKnownTokenDetails({ tokenAddress: tokenAddress });

	return ethers.utils.formatUnits(amount, tokenDetails.decimals);
}
