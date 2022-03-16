import { getAdminAuthToken } from '.';
import { browser } from '$app/env';
import { isJwtExpired } from '$utils/jwt';
import { derived } from 'svelte/store';
import { currentUserAddress } from '$stores/wallet';

/**
 * Whther the the provided address is currently logged in as an admin.
 *
 * Checks the local storage for the auth token and if it exists.
 */
export function isAdmin(address: string) {
	return (
		browser && getAdminAuthToken(address) !== null && !isJwtExpired(getAdminAuthToken(address))
	);
}

export const isCurrentAddressAdmin = derived(currentUserAddress, (v) => v && isAdmin(v));
