export function removeUrlParam(key: string) {
	const url = new URL(window.location.href);
	url.searchParams.delete(key);
	window.history.replaceState({}, '', url.href);
}
