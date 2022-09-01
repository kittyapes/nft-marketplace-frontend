import type { ethers } from 'ethers';

export async function isContractAddress(address: string, provider: ethers.providers.Provider) {
	try {
		const getCodeResponse = await provider.getCode(address);
		return getCodeResponse !== '0x' && getCodeResponse.length > 2;
	} catch (error) {
		return false;
	}
}
