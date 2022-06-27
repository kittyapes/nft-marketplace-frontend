import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';
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
	return {
		WETH: await getContract('storage').weth()
	}[tokenTicker];
}
