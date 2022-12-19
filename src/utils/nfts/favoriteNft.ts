import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';

/* @param id: must be in {contractAddress}:{nft token id} format */
export async function favoriteNft(id: string) {
	const res = await axios.post(getApiUrl('latest', 'nfts/favourite/' + id), null, await getAxiosConfig()).catch((e) => {
		throw new Error('Failed to favorite NFT');
	});

	return res?.data;
}
