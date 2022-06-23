import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';

// TODO: REPLACE WITH RELEVANT TOKEN ADDRESSES
export function getTokenAddress(tokenTicker: 'WETH' | 'HI') {
	return {
		// WETH: WethContractAddress,
		WETH: HinataTokenAddress, // Hotfix
		HI: HinataTokenAddress
	}[tokenTicker];
}
