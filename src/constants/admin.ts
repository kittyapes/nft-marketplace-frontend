// arrow: false is temporary, supposing that the other routes will have children
// in the future, so we might determine whether to display an arrow or not based on the children
// data in the future
export const sidebarItems = [
	{ title: 'Admin Dashboard', href: '/admin', icon: 'create', arrow: false },
	{ title: 'Create', href: '/admin', icon: 'create', arrow: true },
	{ title: 'User Management', href: '/admin/users', icon: 'users-manage', arrow: true },
	{ title: 'Analytics', href: '/admin/analytics', icon: 'analytics', arrow: true }
];

// TODO remove, deprecated
export const permissions = [
	'Add Accounts',
	'Remove Accounts',
	'Ban Accounts',
	'Mint NFTs',
	'Verify Creators'
];

export type AdminPermissionKey =
	| 'addAccounts'
	| 'removeAccounts'
	| 'banAccounts'
	| 'mintNfts'
	| 'verifyCreators';

export const adminPermissions: { label: string; key: AdminPermissionKey }[] = [
	{ label: 'Add Accounts', key: 'addAccounts' },
	{ label: 'Remove Accounts', key: 'removeAccounts' },
	{ label: 'Ban Accoutnts', key: 'banAccounts' },
	{ label: 'Mints NFTs', key: 'mintNfts' },
	{ label: 'Verify Creators', key: 'verifyCreators' }
];
