import { writable } from 'svelte/store';

// Filters
export const collectionQuery = writable<string>('');
