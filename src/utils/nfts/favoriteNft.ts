import { getApiUrl } from '$utils/api';
import { getNft } from '$utils/api/nft';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';

export async function favoriteNft(id: string) {
	// Check if the ID Supplied is in the format contractAddress:tokenId
	if (id.includes(':')) {
		// Find the Correct ID and then submit call to the BE
		const leanNftdata = await getNft(id, true);
		id = leanNftdata._id;
	}

	const res = await axios.post(getApiUrl('latest', 'nfts/favourite/' + id), null, await getAxiosConfig()).catch((e) => e.response);
	return res?.data;
}
