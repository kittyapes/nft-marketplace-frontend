import { appSigner } from '$stores/wallet';
import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import HinataMarketplaceContract from '$utils/contracts/hinataMarketplace';
import HinataMarketplaceStorageContract from '$utils/contracts/hinataMarketplaceStorage';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';
import type { ethers } from 'ethers';
import type { NFTCreationObject } from 'src/interfaces/nft/nftCreationObject';
import type { NFTMintingObject } from 'src/interfaces/nft/nftMintingObject';
import { get } from 'svelte/store';

export const getNftId = async () => {
	const res = await axios.get(getApiUrl('latest', 'nfts/usableID'), getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	return res.data.data;
};
