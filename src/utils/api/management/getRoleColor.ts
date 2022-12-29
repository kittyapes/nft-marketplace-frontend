export let getRoleColor = (role: string) => {
	role = role.toLowerCase();

	if (role === 'inactivated_user') {
		return 'text-color-pink-dark';
	} else if (role === 'superadmin' || role === 'inactive') {
		return 'text-gradient-red';
	} else if (role === 'admin') {
		return 'text-gradient';
	} else if (role === 'verified_user' || role === 'active' || role === 'verified') {
		return 'text-gradient-green';
	} else return 'text-white';
};
