// arrow: false is temporary, supposing that the other routes will have children
// in the future, so we might determine whether to display an arrow or not based on the children
// data in the future
export const sidebarItems = [
	{ title: 'Admin Dashboard', href: '/admin', icon: 'create', arrow: false },
	{ title: 'Create', href: '/admin', icon: 'create', arrow: true },
	{ title: 'User Management', href: '/admin/users', icon: 'users-manage', arrow: true },
	{ title: 'Analytics', href: '/admin/analytics', icon: 'analytics', arrow: true }
];
