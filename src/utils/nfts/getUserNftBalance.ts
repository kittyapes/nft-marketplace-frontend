import { appProvider, currentUserAddress } from '$stores/wallet';
import { getContractInterface } from '$utils/contracts/collection';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import erc1155Abi from '$constants/contracts/abis/Erc1155Mock.json';
import erc721Abi from '$constants/contracts/abis/Erc721Mock.json';
import defaultProvider from '$utils/contracts/defaultProvider';

export default async function (nftContractAddress: string, tokenId: string) {
	// Get total supply first
	let collectionInterface = null;
	let totalSupply = 1;
	const provider = get(appProvider) ?? defaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK);

	try {
		const collInterface = await getContractInterface(nftContractAddress, provider);
		const contract = new ethers.Contract(nftContractAddress, erc1155Abi, provider);

		collectionInterface = collInterface;
		if (collInterface === 'ERC1155') {
			const supply = await contract.totalSupply(tokenId);
			totalSupply = +ethers.utils.formatUnits(supply, 0);
		}
	} catch (error) {
		console.log('Failed to fetch total supply: ', error);
	}

	if (get(currentUserAddress)) {
		try {
			// Check if its an erc1155 or erec721
			if (collectionInterface === 'ERC1155') {
				const contract = new ethers.Contract(nftContractAddress, erc1155Abi, provider);
				const balance = await contract.balanceOf(get(currentUserAddress), tokenId);

				return { balance: +ethers.utils.formatUnits(balance, 0), supply: totalSupply };
			} else if (collectionInterface === 'ERC721') {
				const contract = new ethers.Contract(nftContractAddress, erc721Abi, provider);

				// Check if the current user is the owner of the token
				const owner = await contract.ownerOf(tokenId);

				return { balance: owner.toLowerCase() === get(currentUserAddress).toLowerCase() ? 1 : 0, supply: 1 };
			} else {
				return { balance: 0, supply: totalSupply };
			}
		} catch (error) {
			console.log('nft balance error: ', error);
			return { balance: 0, supply: totalSupply };
		}
	} else {
		return { balance: 0, supply: totalSupply };
	}
}
