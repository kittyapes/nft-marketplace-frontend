export let getHighestRole = (roles: string[]) => {
    if (roles.includes('INACTIVATED') || roles.includes('inactivated_user') || roles.includes('AWAITING_INACTIVATED')) {
        return 'INACTIVATED';
    } else if (roles.includes('superadmin')) {
        return 'superadmin';
    } else if (roles.includes('admin')) {
        return 'admin';
    } else if (roles.includes('verified_user') || roles.includes('ACTIVE') || roles.includes('AWAITING_VERIFIED') || roles.includes('VERIFIED')) {
        return 'VERIFIED';
    } else {
        return 'user';
    }
};