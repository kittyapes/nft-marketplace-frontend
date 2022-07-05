import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { getContract } from '$utils/misc/getContract';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import type { NFTMintingObject } from 'src/interfaces/nft/nftMintingObject';

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

// Equivalent to minting the NFT
export const createNFTOnChain = async ({ id, amount }: NFTMintingObject) => {
	try {
		const contract = getContract('storage');
		await contractCaller(contract, 'mintArtistNFT', 150, 1, id, amount, []);

		return true;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to create NFT on chain');
		//return false;
	}
};
