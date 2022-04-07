export const urlPattern = '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$';

export function isUrl(s: string) {
	if (!s) return false;

	return s.match(new RegExp(urlPattern));
}
