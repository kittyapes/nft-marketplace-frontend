import { getContract } from '$utils/misc/getContract';

async function hasRole(role: 'minter', address: string) {
	try {
		const contract = getContract('storage');

		const _role = { minter: await contract.MINTER_ROLE() }[role];

		return await contract.hasRole(_role, address);
	} catch (error) {
		console.error(error);
		return false;
	}
}

export default {
	hasRole,
};
