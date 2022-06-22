import type { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';

export function isPrice(s: string) {
	if (!s) return false;

	let price: BigNumber;

	try {
		price = parseEther(s);
	} catch {
		return false;
	}

	return price.gt(0);
}
