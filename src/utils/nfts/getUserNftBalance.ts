import { appProvider, currentUserAddress } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

export default async function (nftContractAddress: string, tokenId: string) {
	if (get(appProvider) && get(currentUserAddress)) {
		try {
			const contract = new ethers.Contract(
				nftContractAddress,
				[
					{
						inputs: [
							{ internalType: 'address', name: 'account', type: 'address' },
							{ internalType: 'uint256', name: 'id', type: 'uint256' }
						],
						name: 'balanceOf',
						outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
						stateMutability: 'view',
						type: 'function'
					}
				],
				get(appProvider)
			);
			const balance = await contract.balanceOf(get(currentUserAddress), tokenId);

			return +ethers.utils.formatUnits(balance, 0);
		} catch (error) {
			return 1;
		}
	} else {
		return 0;
	}
}
