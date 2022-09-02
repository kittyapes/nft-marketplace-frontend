import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError, notifySuccess } from '$utils/toast';
import axios from 'axios';
import { getApiUrl } from '..';

export const whitelistCollection = async (address: string, slug: string) => {
	try {
		await axios.post(
			getApiUrl('latest', 'collections/crawl-collection'),
			{
				address,
				openseaSlug: slug
			},
			await getAxiosConfig()
		);
	} catch (err) {
		notifyError('Failed to whitelist collection. ' + err.message);
		throw err;
	}

	notifySuccess('Successfully whitelisted a collection!');
};
