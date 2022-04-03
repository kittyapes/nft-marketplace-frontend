export function htmlize(s: string) {
	return s ? s.replace(/\n/g, '<br>') : '';
}
