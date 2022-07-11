import { appProvider, currentUserAddress } from '$stores/wallet';
import { getContractInterface } from '$utils/contracts/collection';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import erc1155Abi from '$constants/contracts/abis/Erc1155Mock.json';
import erc721Abi from '$constants/contracts/abis/Erc721Mock.json';

export default async function (nftContractAddress: string, tokenId: string) {
	if (get(appProvider) && get(currentUserAddress)) {
		try {
			// Check if its an erc1155 or erec721
			const collInterface = await getContractInterface(nftContractAddress, get(appProvider));

			if (collInterface === 'ERC1155') {
				const contract = new ethers.Contract(nftContractAddress, erc1155Abi, get(appProvider));
				const balance = await contract.balanceOf(get(currentUserAddress), tokenId);
				const supply = await contract.totalSupply(tokenId);

				return { balance: +ethers.utils.formatUnits(balance, 0), supply: +ethers.utils.formatUnits(supply, 0) };
			} else if (collInterface === 'ERC721') {
				const contract = new ethers.Contract(nftContractAddress, erc721Abi, get(appProvider));
				const balance = await contract.balanceOf(get(currentUserAddress), tokenId);

				return { balance: +ethers.utils.formatUnits(balance, 0), supply: 1 };
			} else {
				return { balance: 0, supply: 1 };
			}
		} catch (error) {
			return { balance: 0, supply: 1 };
		}
	} else {
		return { balance: 0, supply: 1 };
	}
}
