import { makeHttps } from '$utils/ipfs';

function fixTokenData(tokenData: TokenData) {
	// Some image addresses start with the ipfs:// protocol,
	// we need to change them to https://ipfs.io/...

	tokenData.image = makeHttps(tokenData.image);
	tokenData.animation_url = makeHttps(tokenData.animation_url);

	return tokenData;
}

export async function fetchTokenData(url: string) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		return fixTokenData(data) as TokenData;
	} catch {
		console.error('Failed to fetch token data for url:', url);
	}
}
