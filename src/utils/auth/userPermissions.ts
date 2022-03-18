import { profileData } from '$stores/user';
import type { UserData } from 'src/interfaces/userData';
import { derived, get } from 'svelte/store';

export type UserPermission = 'create-admins' | 'promote-users';

/**
 * A list of permissions the current user has.
 */
export const userPermissions = derived(profileData, (data: UserData) => {
	if (!data) return [];

	const permissions: UserPermission[] = [];

	// Cannot use .include here, because it's a string and would also trigger for superadmin \_(-.-)_/
	if (data.roles === 'admin') {
		permissions.push('promote-users', 'create-admins');
	}

	return permissions;
});

/**
 * Store containing a function that will check whether the current user has
 * at least one of the supplied permissions.
 */
export const userHasRole = derived<typeof userPermissions, (...role: UserPermission[]) => boolean>(
	userPermissions,
	(permissions) => {
		return (...permission: UserPermission[]) => {
			return permission.some((r) => permissions.includes(r));
		};
	}
);
