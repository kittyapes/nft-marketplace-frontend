import { profileData } from '$stores/user';
import type { UserData, UserRole } from 'src/interfaces/userData';
import { derived } from 'svelte/store';

/**
 * A list of roles the current user has.
 */
export const userRoles = derived(profileData, (data: UserData) => {
	if (!data) return [];

	// Returning an array because API currently returns a string.
	return [data.roles];
});

/**
 * Store containing a function that will check whether the current user has
 * at least one of the supplied roles.
 */
export const userHasRole = derived<typeof userRoles, (...role: UserRole[]) => boolean>(
	userRoles,
	(roles) => {
		return (...role: UserRole[]) => {
			return role.some((r) => roles.includes(r));
		};
	}
);
