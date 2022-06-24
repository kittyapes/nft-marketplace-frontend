export let getRoleColor = (role: string) => {
    if (role === 'superadmin') {
        return 'text-color-orange';
    } else if (role === 'admin') {
        return 'gradient-text';
    } else if (role === 'verified_user' || role === 'ACTIVE') {
        return 'text-green-400';
    } else if (role === 'INACTIVATED' || role === 'inactivated_user' || role === 'INACTIVE') {
        return 'text-color-gray-light';
    }
};