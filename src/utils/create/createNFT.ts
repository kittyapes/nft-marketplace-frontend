import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import { ethers } from 'ethers';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import erc1155Abi from '$constants/contracts/abis/Erc1155Mock.json';
import erc721Abi from '$constants/contracts/abis/Erc721Mock.json';
import { get } from 'svelte/store';
import { appProvider, appSigner, currentUserAddress } from '$stores/wallet';
import { getContract } from '$utils/misc/getContract';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';
import { getContractInterface } from '$utils/contracts/collection';

export const createNFTOnAPI = async ({ amount, animation, creator, image, name, description, collectionId }: NFTCreationObject) => {
	const formData = new FormData();
	formData.append('thumbnail', image);
	formData.append('asset', animation || null);
	formData.append('amount', amount.toString() || '1');
	formData.append('name', name);
	formData.append('creator', creator);
	formData.append('description', description || 'No description');
	formData.append('collectionId', collectionId);

	const res = await axios.post(getApiUrl('latest', 'nfts'), formData, getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	if (!res) return null;

	return res.data.data;
};

export const createNFTOnChain = async (options: { id: string; amount: string; collectionAddress: string }) => {
	try {
		const storageAddress = getContract('storage')?.address;
		options.collectionAddress = options.collectionAddress ?? storageAddress;
		const contractType = await getContractInterface(options.collectionAddress, get(appProvider));
		const contractAbi = options.collectionAddress === storageAddress ? storageAbi : contractType === 'ERC721' ? erc721Abi : erc1155Abi;
		const contract = new ethers.Contract(options.collectionAddress, contractAbi, get(appSigner));

		if (storageAddress === options.collectionAddress) {
			await contractCaller(contract, 'mintArtistNFT', 150, 1, options.id, options.amount, []);
		} else {
			// Check what type of contract that is
			if (contractType === 'ERC721') {
				await contractCaller(contract, 'mint', 150, 1, get(currentUserAddress));
			} else if (contractType === 'ERC1155') {
				// This is the default for most collections on the marketplace - erc1155
				await contractCaller(contract, 'mint', 150, 1, get(currentUserAddress), options.id, options.amount);
			} else {
				// UNKNOWN type
				throw new Error('Failed to create NFT on chain');
			}
		}

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create NFT on chain');
		//return false;
	}
};
