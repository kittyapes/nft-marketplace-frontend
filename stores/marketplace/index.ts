import { writable } from 'svelte/store';

export const popupOpen = writable<boolean>(false);
export const selectedCard = writable<any>(); // TODO add types
