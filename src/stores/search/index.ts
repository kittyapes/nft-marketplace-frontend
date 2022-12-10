import { writable } from 'svelte/store';

// global search query
export const searchQuery = writable<string>(null);
export const selectedResultTab = writable<string>(null);
