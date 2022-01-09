export function getInstagramUrl(s: string) {
	if (!s) return null;
	if (s.includes('instagram.com')) return s;

	return `https://instagram.com/${s}`;
}

export function getFacebookUrl(s: string) {
	if (!s) return null;
	if (s.includes('facebook.com')) return s;

	return `https://facebook.com/${s}`;
}

export function getTwitterUrl(s: string) {
	if (!s) return null;
	if (s.includes('twitter.com')) return s;

	return `https://twitter.com/${s}`;
}
