import { ethers } from 'ethers';

export const ethAddressRegex = '^0x[a-fA-F0-9]{40}$';

export function isEthAddress(s: string) {
	if (!s) return false;

	return ethers.utils.isAddress(s);
}

export function findEthAddress(s: string) {
	if (!s) return null;

	// removing the match signs for start and end of string that allows the match to find the ETH address
	let res = s.match(ethAddressRegex.slice(1, -1));

	if (!res) return null;

	return res?.[0];
}
