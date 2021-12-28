import { connectionDetails } from '$stores/wallet';
import { get } from 'svelte/store';

export const hinataToken =
	get(connectionDetails)?.chainId === 4
		? '0x1aa88b44d0d650fc059275a804a60f538d363d12' // rinkeby
		: get(connectionDetails)?.chainId === 1
		? '' // mainnet
		: '';
