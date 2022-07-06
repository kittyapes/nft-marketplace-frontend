import { formatUnits, parseUnits } from 'ethers/lib/utils.js';

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

	if (!network) {
		network = 'rinkeby';
	}

	const token = knownTokens.find((t) => (t.ticker === ticker || t.address.toLowerCase() === tokenAddress.toLowerCase()) && t.network === network);

	if (!token) {
		throw new Error(`Couldn't find such token: ${JSON.stringify(options)}`);
	}

	return token;
}

export function parseToken(amount: string, tokenAddress: string) {
	const tokenDetails = getKnownTokenDetails({ tokenAddress: tokenAddress });

	return parseUnits(amount, tokenDetails.decimals);
}

export function formatToken(amount: string, tokenAddress: string) {
	const tokenDetails = getKnownTokenDetails({ tokenAddress: tokenAddress });

	return formatUnits(amount, tokenDetails.decimals);
}
