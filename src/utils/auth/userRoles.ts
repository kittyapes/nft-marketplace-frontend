import { profileData } from '$stores/user';
import type { UserData, UserRole } from 'src/interfaces/userData';
import { derived } from 'svelte/store';

/**
 * A list of roles the current user has.
 */
export const userRoles = derived(profileData, (data: UserData) => {
	if (!data) return null;

	// No roles, API doesn't return an empty array.
	if (!data.roles) return [];

	return data.roles;
});

/**
 * Store containing a function that will check whether the current user has
 * at least one of the supplied roles. This is in a store so we can use it reactively.
 */
export const userHasRole = derived<typeof userRoles, (...role: UserRole[]) => boolean>(userRoles, (roles) => {
	return (...role: UserRole[]) => {
		if (!roles) return false;

		return role.some((r) => roles.includes(r));
	};
});
