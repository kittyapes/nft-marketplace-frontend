import { derived, writable, type Writable } from 'svelte/store';

export type ComponentStore = Writable<[any, any] | any>;

export function componentStore() {
	return writable() as ComponentStore;
}

export function unpackComponentStore(s: ComponentStore) {
	const component = s[0] || s;
	const props = s[1] || {};

	return { component, props };
}

export function unpackedComponentStore(s: ComponentStore) {
	const component = derived(s, (s) => s[0] || s);
	const props = derived(s, (s) => s[1] || {});

	return { component, props };
}
