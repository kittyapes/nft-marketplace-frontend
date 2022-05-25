import { appSigner } from '$stores/wallet';
import { get } from 'svelte/store';
import { getHinataTokenContract } from './generalContractCalls';

export async function contractApproveToken(address: string, amount: number) {
	const contract = getHinataTokenContract(get(appSigner));

	const approveTx = await contract.approve(address, amount);
	await approveTx.wait(1);
}
