import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';

export const getNftId = async () => {
	const res = await axios.get(getApiUrl('latest', 'nfts/usableID'), await getAxiosConfig()).catch((e) => {
		httpErrorHandler(e);
		return null;
	});

	return res.data.data;
};
