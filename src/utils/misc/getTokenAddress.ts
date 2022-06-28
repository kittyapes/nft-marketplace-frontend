import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';
import { appProvider } from '$stores/wallet';
import { get } from 'svelte/store';
import { getContract } from './getContract';

// TODO: REPLACE WITH RELEVANT TOKEN ADDRESSES
export function getTokenAddress(tokenTicker: 'WETH' | 'HI') {
	return {
		// WETH: WethContractAddress,
		WETH: HinataTokenAddress, // Hotfix
		HI: HinataTokenAddress
	}[tokenTicker];
}

export async function contractGetTokenAddress(tokenTicker: 'WETH') {
	const provider = get(appProvider);
	const network = await provider.getNetwork();

	return {
		WETH: network.name === 'rinkeby' ? await getContract('storage').weth() : '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
	}[tokenTicker];
}
