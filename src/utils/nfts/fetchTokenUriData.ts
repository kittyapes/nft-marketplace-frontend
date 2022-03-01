import { makeHttps } from '$utils/ipfs';
import type { TokenUriData } from '$lib/interfaces/tokenUriData';

export async function fetchTokenUriData(uri: string): Promise<TokenUriData | null> {
	console.log(uri);

	if (!uri) {
		return null;
	}

	const res = await fetch(uri);

	const json = await res.json().catch(() => null);

	if (!json) {
		return null;
	}

	console.log(json.image);

	return {
		image: makeHttps(json.image),
		animation_url: makeHttps(json.animation_url)
	};
}
