import { getApiUrl } from '$utils/api';
import axios from 'axios';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);

	const slug = event.params.collectionSlug;

	if (event.url.pathname.startsWith('/collections/')) {
		const res = await axios.get(getApiUrl('latest', 'collections/' + slug), { params: { limit: 1, page: 1 } });

		if (res.status !== 200) {
			return response;
		}

		console.log(response.headers);

		return response;
	}

	return response;
}
