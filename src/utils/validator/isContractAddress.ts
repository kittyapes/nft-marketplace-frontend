import { appProvider } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

export async function isContractAddress(address: string) {
	// Checks mainnet by default if no wallet is connected
	try {
		const getCodeResponse = await (get(appProvider) ?? ethers.getDefaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK)).getCode(address);
		return getCodeResponse !== '0x' && getCodeResponse.length > 2;
	} catch (error) {
		return false;
	}
}
