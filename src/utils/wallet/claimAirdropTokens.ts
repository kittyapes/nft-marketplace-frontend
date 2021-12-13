import { appSigner } from '$stores/wallet';
import { get } from 'svelte/store';
import { claimToken } from './distributeAirdrop';
import { notifySuccess, notifyError } from '$utils/toast';

const claimAirdropTokens = async () => {
	const signer = get(appSigner);

	const userAddress = await signer.getAddress();

	const result = await claimToken(userAddress);

	if (result.status === 'success') {
		notifySuccess(result.message);
	} else {
		notifyError(result.message);
	}
};

export default claimAirdropTokens;
