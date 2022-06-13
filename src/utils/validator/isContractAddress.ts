import { appProvider } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

export async function isContractAddress(address: string) {
	// Checks mainnet by default if no wallet is connected
	const getCodeResponse = await (get(appProvider) ?? ethers.getDefaultProvider(1)).getCode(address);

	return getCodeResponse === '0x';
}
