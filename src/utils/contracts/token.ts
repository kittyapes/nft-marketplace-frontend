import { appSigner } from '$stores/wallet';
import { BigNumber, ethers } from 'ethers';
import { get } from 'svelte/store';
import { getHinataTokenContract } from './generalContractCalls';

export async function contractGetTokenAllowance(owner: string, spender: string): Promise<ethers.BigNumber> {
	const contract = getHinataTokenContract(get(appSigner));
	const allowance = await contract.allowance(owner, spender);

	return allowance;
}

export async function contractApproveToken(address: string, amount: BigNumber) {
	const contract = getHinataTokenContract(get(appSigner));
	console.log({ amount });

	const approveTx = await contract.approve(address, ethers.utils.parseEther(amount.toString()));
	await approveTx.wait(1);
}
