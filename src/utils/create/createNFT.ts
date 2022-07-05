import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import { ethers } from 'ethers';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import erc1155Abi from '$constants/contracts/abis/erc1155.json';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';
import { getContract } from '$utils/misc/getContract';
import { get } from 'svelte/store';
import { appSigner, currentUserAddress } from '$stores/wallet';

export const createNFTOnAPI = async ({ amount, animation, creator, image, name, description }: NFTCreationObject) => {
	const formData = new FormData();
	formData.append('thumbnail', image);
	formData.append('asset', animation || null);
	formData.append('amount', amount.toString() || '1');
	formData.append('name', name);
	formData.append('creator', creator);
	formData.append('description', description || 'No description');

	const res = await axios.post(getApiUrl('latest', 'nfts'), formData, getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	if (!res) return null;

	return res.data.data;
};

export const createNFTOnChain = async (options: { id: string; amount: string; contractAddress: string }) => {
	try {
		const contract = new ethers.Contract(
			options.contractAddress,
			[
				{
					inputs: [
						{ internalType: 'address', name: 'account', type: 'address' },
						{ internalType: 'uint256', name: 'id', type: 'uint256' },
						{ internalType: 'uint256', name: 'amount', type: 'uint256' },
						{ internalType: 'bytes', name: 'data', type: 'bytes' }
					],
					name: 'mint',
					outputs: [],
					stateMutability: 'nonpayable',
					type: 'function'
				}
			],
			get(appSigner)
		);
		// const contract = new ethers.Contract(options.contractAddress, storageAbi);
		// const contract = getContract('storage', );
		await contractCaller(contract, 'mint', 150, 1, get(currentUserAddress), options.id, options.amount, []);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create NFT on chain');
		//return false;
	}
};
