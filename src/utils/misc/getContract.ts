import { appProvider, appSigner } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

import marketplaceAbi from '$constants/contracts/abis/HinataMarketplace.json';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';
import factoryAbi from '$constants/contracts/abis/HinataCollectionFactory.json';
import tokenAbi from '$constants/contracts/abis/hinataToken.json';

type ContractName = 'marketplace' | 'storage' | 'factory' | 'token';

const contracts: { name: ContractName; network: 'eth' | 'rinkeby'; address: string; abi: any }[] = [
	{ name: 'marketplace', network: 'rinkeby', address: '0xfE5c453A595Cec7D2B20Aa9b7D57B5A0AD09d61F', abi: marketplaceAbi },
	{ name: 'storage', network: 'rinkeby', address: '0xbfF4E404ACacd49c55Cc9A04e871D8a738af7095', abi: storageAbi },
	{ name: 'factory', network: 'rinkeby', address: '0xd5a6b5f2C2223fa19c3a9b5ED76A425208BA47D7', abi: factoryAbi },
	{ name: 'token', network: 'rinkeby', address: '0x04013fA3b72E82489d434FD64E3f4142647413cA', abi: tokenAbi }
];

export function getContract(name: ContractName) {
	const provider = get(appProvider) || ethers.getDefaultProvider();
	const networkId = provider.network.chainId;

	let networkName: string;

	if (networkId === 1) {
		networkName = 'eth';
	} else if (networkId === 4) {
		networkName = 'rinkeby';
	} else {
		throw new Error(`Network with the ID ${networkId} not supported.`);
	}

	const contractData = contracts.find((c) => c.name === name && c.network === networkName);

	if (!contractData) {
		throw new Error(`Failed to find contract address for network: ${networkName}, contract: ${name}`);
	}

	const contract = new ethers.Contract(contractData.address, contractData.abi, get(appSigner));

	return contract;
}
