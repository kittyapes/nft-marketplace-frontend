import type { DropListingType } from '$interfaces/drops/';
import { writable } from 'svelte/store';

interface NewDropProperties {
	listingType?: DropListingType;
}


export const newDropProperties = writable<NewDropProperties>({});