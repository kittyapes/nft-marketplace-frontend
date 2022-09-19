import { page } from '$app/stores';
import { getApiUrl } from '$utils/api';
import axios from 'axios';
import { get } from 'svelte/store';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const slug = event.params.collectionSlug;

	const res = await axios.get(getApiUrl('latest', 'collections/' + slug), { params: { limit: 1, page: 1 } });
	const collection = res.data.data;

	return {
		collection,
	};
}
