import { ethers } from 'ethers';

// export const ethAddressRegex = '^0x[a-fA-F0-9]{40}$';

export function isEthAddress(s: string) {
	if (!s) return false;

	return ethers.utils.isAddress(s);
}
