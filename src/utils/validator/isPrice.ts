export function isPrice(s: string) {
	if (!s) return false;

	return /^\d+(\.\d{1,2})?$/.test(s);
}
