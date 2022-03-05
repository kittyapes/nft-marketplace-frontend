import { api } from '$constants/api';
import { appSigner } from '$stores/wallet';
import { getAxiosConfig } from '$utils/api';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import axios from 'axios';
import { ethers } from 'ethers';
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
	signature
}: NFTCreationObject) => {
	const res = await axios.post(
		`${api}/v1/nfts`,
		{
			contractId: contractId || 0,
			dropId,
			amount,
			name,
			generation,
			categories,
			tag,
			artist,
			creator,
			signature
		},
		getAxiosConfig()
	);

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
			ethers.utils.parseEther(amount.toString())
			// Data object not added yet
		);

		// Wait for at least once confirmation
		await nftMintingTransaction.wait(1);

		return true;
	} catch (error) {
		console.log(error);
		// Can also notify error
		return false;
	}
};
