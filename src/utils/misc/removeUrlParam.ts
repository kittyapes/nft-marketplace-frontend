import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export function removeUrlParam(key: string) {
	const url = new URL(window.location.href);
	url.searchParams.delete(key);
	window.history.replaceState({}, '', url.href);
}

export function removeUrlParamGoto(key: string) {
	get(page).url.searchParams.delete(key);
	goto('?' + get(page).url.searchParams, { noscroll: true, keepfocus: true, replaceState: false });
}
