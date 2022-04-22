import { writable } from 'svelte/store';

export interface NewBundleData {
	bundleId: string;
}

export const newBundleData = writable({} as NewBundleData);
