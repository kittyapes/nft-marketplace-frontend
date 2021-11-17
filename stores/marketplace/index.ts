import { writable } from 'svelte/store';

export const popupOpen = writable<boolean>(false);
