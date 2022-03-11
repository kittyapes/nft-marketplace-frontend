import { currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';

/**
 * Get the value of the currentUserAddress store.
 */
export function getAddress() {
	return get(currentUserAddress);
}
