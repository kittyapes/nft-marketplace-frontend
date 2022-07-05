import { appProvider, appSigner } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

import erc20Abi from '$constants/contracts/abis/Erc20Mock.json';
import factoryAbi from '$constants/contracts/abis/HinataCollectionFactory.json';
import marketplaceAbi from '$constants/contracts/abis/HinataMarketplace.json';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';
import tokenAbi from '$constants/contracts/abis/hinataToken.json';

type ContractName = 'marketplace' | 'storage' | 'factory' | 'token' | 'weth';

const contracts: { name: ContractName; network: 'eth' | 'rinkeby'; address: string; abi: any }[] = [
	// Rinkeby
	{ name: 'marketplace', network: 'rinkeby', address: '0xfE5c453A595Cec7D2B20Aa9b7D57B5A0AD09d61F', abi: marketplaceAbi },
	{ name: 'storage', network: 'rinkeby', address: '0xbfF4E404ACacd49c55Cc9A04e871D8a738af7095', abi: storageAbi },
	{ name: 'factory', network: 'rinkeby', address: '0xd5a6b5f2C2223fa19c3a9b5ED76A425208BA47D7', abi: factoryAbi },
	{ name: 'token', network: 'rinkeby', address: '0x04013fA3b72E82489d434FD64E3f4142647413cA', abi: tokenAbi },
	{ name: 'weth', network: 'rinkeby', address: '0xf2155859d31C5EA79F45a55C6ad9A44e7f257700', abi: erc20Abi },

	// Eth
	{ name: 'weth', network: 'eth', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', abi: erc20Abi }
];

export function getContractData(name: ContractName) {
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

	return contractData;
}

export function getContract(name: ContractName, canUseFallback: boolean = false) {
	const contractData = getContractData(name);
	const contract = new ethers.Contract(contractData.address, contractData.abi, canUseFallback ? ethers.getDefaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK ?? 4) : get(appSigner));

	return contract;
}
