import { writable } from 'svelte/store';

export const openedInstanceId = writable(null);
export const lastInstanceId = writable(0);
