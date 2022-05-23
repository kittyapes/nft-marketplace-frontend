import { writable } from 'svelte/store';

export interface NewBundleData {
	id: number;
}

export const newBundleData = writable({} as NewBundleData);
