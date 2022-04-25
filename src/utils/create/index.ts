import { writable } from 'svelte/store';

export interface NewBundleData {
	bundleId: number;
}

export const newBundleData = writable({} as NewBundleData);
