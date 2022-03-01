import { writable } from 'svelte/store';

interface LayoutOptions {
	slotType?: 'default' | 'flex';
}

export const layoutOptions = writable<LayoutOptions>({});

export function setLayoutOptions(options: LayoutOptions) {
	layoutOptions.set(options);
}
