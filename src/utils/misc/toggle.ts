import { writable } from 'svelte/store';

function toggle(initState) {
	let { subscribe, update } = writable(initState);
	const toggle = () => update((s) => !s);
	return { subscribe, toggle };
}

export function createToggle(state = false) {
	return toggle(state);
}
