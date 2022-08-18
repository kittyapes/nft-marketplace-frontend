export function makeHttps(url: string) {
	if (!url) return null;

	if (url.startsWith('https://') || url.startsWith('http://')) {
		return url;
	}

	return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}
