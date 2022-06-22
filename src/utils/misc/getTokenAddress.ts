import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';

export function getTokenAddress(tokenTicker: 'WETH' | 'HI') {
	return {
		// WETH: WethContractAddress,
		WETH: HinataTokenAddress, // Hotfix
		HI: HinataTokenAddress
	}[tokenTicker];
}
