import { ethers } from 'ethers';
import erc1155Abi from '$constants/contracts/abis/erc1155.json';
import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';

export function mintNftFlow(id: string, amount: string, contractAddress: string) {
	const contract = new ethers.Contract(contractAddress, erc1155Abi, get(appSigner));
	// const tx = contract.
}
