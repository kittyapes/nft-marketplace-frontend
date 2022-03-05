import type { DropListingType } from '$lib/interfaces/drops';
import { writable } from 'svelte/store';

interface NewDropProperties {
	quantity?: 'single' | 'multiple';
	listingType?: DropListingType;
}

export const newDropProperties = writable<NewDropProperties>({});
