export let getRoleColor = (role: string) => {
    if (role === 'INACTIVATED' || role === 'inactivated_user' || role === 'INACTIVE' || role === 'inactive') {
        return 'text-color-gray-light';
    }
    else if (role === 'superadmin') {
        return 'text-color-orange';
    } else if (role === 'admin') {
        return 'gradient-text';
    } else if (role === 'verified_user' || role === 'ACTIVE' || role === 'VERIFIED') {
        return 'text-green-400';
    }
};