import { getContract } from '$utils/misc/getContract';

async function hasRole(role: 'minter', address: string) {
	const contract = getContract('storage');

	const _role = { minter: await contract.MINTER_ROLE() }[role];

	return await contract.hasRole(_role, address);
}

export default {
	hasRole,
};
