import type { ethers } from 'ethers';

export async function returnUnUsedNonce(
	contract: ethers.Contract,
	userAddress: string,
	nonce: number,
) {
	const wasUsed = await contract.usedNonces(userAddress, nonce);

	if (wasUsed) {
		return returnUnUsedNonce(contract, userAddress, nonce + 1);
	} else {
		return nonce;
	}
}
