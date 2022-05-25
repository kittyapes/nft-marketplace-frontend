import { appSigner } from '$stores/wallet';
import { get } from 'svelte/store';
import HinataMarketplaceContract from './hinataMarketplace';

export async function contractApproveToken(address: string, amount: number) {
	const contract = HinataMarketplaceContract(get(appSigner));

	const approveTx = await contract.approve(address, amount);
	await approveTx.wait(1);
}
