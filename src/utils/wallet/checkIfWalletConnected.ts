import { goto } from '$app/navigation';
import { walletConnectionRequiredRoutes } from '$constants';
import type { ethers } from 'ethers';

export default function (signer: ethers.Signer, route: string) {
	if (!signer && walletConnectionRequiredRoutes.find((item) => item.startsWith(route))) {
		goto('/');
	}
}
