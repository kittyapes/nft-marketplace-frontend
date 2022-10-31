export let getHighestRole = (roles: string[]) => {
	if (roles.includes('INACTIVATED') || roles.includes('inactivated_user') || roles.includes('AWAITING_INACTIVATED')) {
		return 'inactivated_user';
	} else if (roles.includes('superadmin')) {
		return 'superadmin';
	} else if (roles.includes('admin')) {
		return 'admin';
	} else if (roles.includes('verified_user') || roles.includes('ACTIVE') || roles.includes('AWAITING_VERIFIED')) {
		return 'verified_user';
	} else {
		return 'user';
	}
};
