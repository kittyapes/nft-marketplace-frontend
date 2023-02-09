export let getGradientColors = (role: string) => {
	role = role.toLowerCase();

	if (role === 'inactivated_user') {
		return {};
	} else if (role === 'superadmin' || role === 'inactive') {
		return {
			start: '#FF297C',
			half: '#F21E91',
			end: '#FC0363',
		};
	} else if (role === 'admin') {
		return {
			start: '#67D4F8',
			half: '#a794ffed',
			end: '#67D4F8',
		};
	} else if (role === 'verified_user' || role === 'active' || role === 'verified') {
		return {
			start: '#ADFF00',
			half: '#4CEF00',
			end: '#59FF9C',
		};
	} else return {};
};
