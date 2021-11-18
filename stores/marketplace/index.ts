import { writable } from 'svelte/store';
import { CARD_STATUSES } from '../../src/ts/constants/marketplace';

// popup
export const popupOpen = writable<boolean>(false);
export const selectedCard = writable<any>(); // TODO add types

// Filters
export const statusFilters = writable<any>(CARD_STATUSES);
