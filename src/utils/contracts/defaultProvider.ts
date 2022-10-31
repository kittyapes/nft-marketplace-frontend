import { ethers } from 'ethers';

export default function (network: number) {
	return new ethers.providers.InfuraProvider(network, import.meta.env.VITE_INFURA_KEY);
}
