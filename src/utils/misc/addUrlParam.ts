export function addUrlParam(key: string, value: string) {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.replaceState({}, '', url.href);
}
