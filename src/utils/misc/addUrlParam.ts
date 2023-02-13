import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export function addUrlParam(key: string, value: string) {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.replaceState({}, '', url.href);
}

export function addUrlParamGoto(key: string, value: string) {
	get(page).url.searchParams.set(key, value);
	goto('?' + get(page).url.searchParams, { noscroll: true, keepfocus: true, replaceState: false });
}
