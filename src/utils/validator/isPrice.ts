import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';

export function isPrice(s: string) {
	if (!s) return false;

	let price: BigNumber;

	try {
		price = ethers.utils.parseEther(s);
	} catch {
		return false;
	}

	return price.gt(0);
}
