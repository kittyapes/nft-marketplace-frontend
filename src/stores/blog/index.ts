import { readable } from 'svelte/store';
import axios from 'axios';
import dayjs from 'dayjs';
import { browser } from '$app/env';

export interface BlogPost {
	title: string;
	pubDate: string;
	link: string;
	guid: string;
	author: string;
	thumbnail: string;
	description: string;
	content: string;
	enclosure: string;
	categories: string;
}

const FETCH_URL =
	'https://api.rss2json.com/v1/api.json?rss_url=https://hinatafoundation.medium.com/feed';

export const blogPosts = readable<BlogPost[]>([], (set) => {
	if (!browser) {
		return;
	}

	function formatPostData(post: BlogPost) {
		post.pubDate = dayjs(post.pubDate).format('D MMMM, YYYY');

		return post;
	}

	function handleMediumRes(res) {
		const items = res?.data?.items;

		if (!items) {
			set(null);
		}

		set(items.map(formatPostData));
	}

	axios(FETCH_URL).then(handleMediumRes);
});
