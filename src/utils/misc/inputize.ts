export function inputize(s: string) {
	return s ? s.replace(/<br>/g, '\n') : '';
}
