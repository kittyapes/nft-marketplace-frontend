import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { ethers } from 'ethers';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import type { NFTMintingObject } from 'src/interfaces/nft/nftMintingObject';
import { get } from 'svelte/store';

export const createNFTOnAPI = async ({
	dropId,
	contractId,
	amount,
	name,
	generation,
	categories,
	tag,
	artist,
	creator,
	image,
	animation
}: NFTCreationObject) => {
	const formData = new FormData();
	formData.append('image', image);
	formData.append('animation', animation);
	formData.append('contractId', contractId.toString());
	formData.append('dropId', dropId.toString());
	formData.append('amount', amount);
	formData.append('name', name);
	formData.append('generation', generation.trim() || 'No Generation');
	formData.append('categories', categories.trim() || 'Uncategorized');
	formData.append('tag', tag.trim() || 'Untagged');
	formData.append('artist', artist);
	formData.append('creator', creator);

	const res = await axios.post(`${api}/v1/nfts`, formData, getAxiosConfig());

	return res.data.data;
};

// Equivalent to minting the NFT
// TODO: Ask Anhnt about the data that needs to be passed here or whether an empty array would do
export const createNFTOnChain = async ({ dropId, id, amount }: NFTMintingObject) => {
	try {
		const MarketplaceContract = HinataMarketplaceContract(get(appSigner));
		const nftMintingTransaction: ethers.ContractTransaction = await MarketplaceContract.mintDropNFT(
			ethers.utils.parseEther(dropId.toString()),
			ethers.utils.parseEther(id.toString()),
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
