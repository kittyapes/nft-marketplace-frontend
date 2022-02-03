export function getInstagramUrl(s: string) {
	if (!s) return null;
	if (s.includes('instagram.com')) return s;

	return `https://instagram.com/${s}`;
}

export function getTwitterUrl(s: string) {
	if (!s) return null;
	if (s.includes('twitter.com')) return s;

	return `https://twitter.com/${s}`;
}
