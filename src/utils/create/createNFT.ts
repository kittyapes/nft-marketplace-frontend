import { appSigner } from '$stores/wallet';
import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import { ethers } from 'ethers';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import type { NFTMintingObject } from 'src/interfaces/nft/nftMintingObject';
import { get } from 'svelte/store';

export const createNFTOnAPI = async ({ amount, animation, artist, contractId, creator, image, name }: NFTCreationObject) => {
	const formData = new FormData();
	formData.append('image', image);
	formData.append('animation', animation);
	formData.append('contractId', contractId.toString());
	formData.append('amount', amount.toString() || '1');
	formData.append('name', name);
	formData.append('artist', artist);
	formData.append('creator', creator);

	const res = await axios.post(getApiUrl('latest', 'nfts'), formData, getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	if (!res) return null;

	return res.data.data;
};

// Equivalent to minting the NFT
// TODO: Ask Anhnt about the data that needs to be passed here or whether an empty array would do
export const createNFTOnChain = async ({ dropId, id, amount }: NFTMintingObject) => {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const nftMintingTransaction: ethers.ContractTransaction = await MarketplaceContract.mintDropNFT(
			ethers.utils.parseEther(dropId.toString()),
			ethers.utils.parseEther(id),
			ethers.utils.parseEther(amount.toString()),
			[]
			// Data object not added yet
		);

		// Wait for at least once confirmation
		await nftMintingTransaction.wait(1);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create NFT on chain');
		//return false;
	}
};

export interface BatchMintNftOptions {
	dropId: string;
	nftIds: string[];
	nftAmounts: number[];
}

export async function batchMintNft(options: BatchMintNftOptions) {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const nftMintingTransaction: ethers.ContractTransaction = await MarketplaceContract.mintBatchDropNFT(
			ethers.utils.parseEther(options.dropId),
			// Is the following mapping correct? Will it work?
			options.nftIds.map(ethers.utils.parseEther),
			options.nftAmounts.map((v) => ethers.utils.parseEther(v.toString())),
			[]
			// Data object not added yet
		);

		// Wait for at least once confirmation
		await nftMintingTransaction.wait(1);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create NFT on chain');
		//return false;
	}
}
