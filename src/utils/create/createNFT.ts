import { appSigner } from '$stores/wallet';
import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import HinataMarketplaceStorageContract from '$utils/contracts/hinataMarketplaceStorage';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import type { ethers}  from 'ethers';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import type { NFTMintingObject } from 'src/interfaces/nft/nftMintingObject';
import { get } from 'svelte/store';

export const createNFTOnAPI = async ({ amount, animation, contractId, creator, image, name, description }: NFTCreationObject) => {

	const formData = new FormData();
	formData.append('thumbnail', image);	
	formData.append('asset', animation || null);
	formData.append('amount', amount.toString() || '1');
	formData.append('name', name);
	formData.append('creator', creator);
	formData.append('contractAddress', contractId.toString());
	if(description) formData.append('description', description);

	
	const res = await axios.post(getApiUrl('latest', 'nfts'), formData, getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	if (!res) return null;
	
	return res.data.data;
};

// Equivalent to minting the NFT
export const createNFTOnChain = async ({ id, amount }: NFTMintingObject) => {
	try {
		const MarketplaceStorageContract = HinataMarketplaceStorageContract(get(appSigner));
		const nftMintingTransaction: ethers.ContractTransaction = await MarketplaceStorageContract.mintArtistNFT(
			id,
			amount,
			[]
			// Data object not added yet
		);

		// Wait for at least once confirmation
		console.log(id); // logs
		await nftMintingTransaction.wait(1);
		console.log(id) // never gets there

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create NFT on chain');
		//return false;
	}
};

export interface BatchMintNftOptions {
	dropId: number;
	nftIds: number[];
	nftAmounts: number[];
}

export async function batchMintNft(options: BatchMintNftOptions) {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const nftMintingTransaction: ethers.ContractTransaction = await MarketplaceContract.mintBatchDropNFT(
			options.dropId,
			options.nftIds,
			options.nftAmounts,
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
