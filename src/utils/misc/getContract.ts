import { appProvider, appSigner } from '$stores/wallet';
import { ethers, providers, Signer } from 'ethers';
import { get } from 'svelte/store';

import erc20Abi from '$constants/contracts/abis/Erc20Mock.json';
import factoryAbi from '$constants/contracts/abis/HinataCollectionFactory.json';
import marketplaceAbi from '$constants/contracts/abis/HinataMarketplace.json';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';
import tokenAbi from '$constants/contracts/abis/hinataToken.json';

type ContractName = 'marketplace' | 'storage' | 'factory' | 'token' | 'weth';

const contracts: { name: ContractName; network: 'eth' | 'rinkeby'; address: string; abi: any }[] = [
	// Rinkeby
	{ name: 'marketplace', network: 'rinkeby', address: '0x81A8685ADAfAE90aC3224598E0b3623bF24584c6', abi: marketplaceAbi },
	{ name: 'storage', network: 'rinkeby', address: '0xDaf3f945857f8Ea58f2bc4cF598a491c30868A72', abi: storageAbi },
	{ name: 'factory', network: 'rinkeby', address: '0xD0776DB18B7878cBD2D56C468208Cda5B9263715', abi: factoryAbi },
	{ name: 'token', network: 'rinkeby', address: '0x04013fA3b72E82489d434FD64E3f4142647413cA', abi: tokenAbi },
	{ name: 'weth', network: 'rinkeby', address: '0xf2155859d31C5EA79F45a55C6ad9A44e7f257700', abi: erc20Abi },

	// Eth
	{ name: 'marketplace', network: 'eth', address: '0x9A986d8B2cB50e827393Ec329cb0003535b5Ff75', abi: marketplaceAbi },
	{ name: 'storage', network: 'eth', address: '0x88129f1931ecc44678b68c4c25393059b4bcfca7', abi: storageAbi },
	{ name: 'factory', network: 'eth', address: '0x41a508E15F391b2AA3129c9fE054f9A48226AC4F', abi: factoryAbi },
	{ name: 'token', network: 'eth', address: '0x91a09acc7a76624f593990c4456fc318d705c761', abi: tokenAbi },
	{ name: 'weth', network: 'eth', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', abi: erc20Abi }
];

export function getContractData(name: ContractName) {
	const provider = get(appProvider) || ethers.getDefaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK);
	const networkId = provider.network?.chainId || +import.meta.env.VITE_DEFAULT_NETWORK;

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

	let provider: providers.Provider | Signer = get(appSigner);

	if (!provider && canUseFallback) {
		provider = ethers.getDefaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK) as unknown as providers.Provider;
	} else if (!provider) {
		throw new Error('Web 3 provider has not been set yet!');
	}

	const contract = new ethers.Contract(contractData.address, contractData.abi, provider);

	return contract;
}
