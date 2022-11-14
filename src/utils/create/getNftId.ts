import { getApiUrl } from '$utils/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { httpErrorHandler } from '$utils/toast';
import axios from 'axios';

export const getNftId = async () => {
	try {
		const res = await axios.get(getApiUrl('latest', 'nfts/usableID'), await getAxiosConfig());

		return res.data.data;
	} catch (err) {
		httpErrorHandler(err);
		return null;
	}
};
