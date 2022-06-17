import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';

export function getTokenAddress(tokenTicker: 'ETH' | 'HI') {
	return {
		// WETH: WethContractAddress,
		WETH: HinataTokenAddress, // Hotfix
		HI: HinataTokenAddress
	}[tokenTicker];
}
