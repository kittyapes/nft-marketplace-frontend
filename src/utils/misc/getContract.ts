import { appProvider, appSigner } from '$stores/wallet';
import { ethers, providers, Signer } from 'ethers';
import { get } from 'svelte/store';

import erc20Abi from '$constants/contracts/abis/Erc20Mock.json';
import factoryAbi from '$constants/contracts/abis/HinataCollectionFactory.json';
import marketplaceAbi from '$constants/contracts/abis/HinataMarketplace.json';
import marketplaceV2Abi from '$constants/contracts/abis/HinataMarketplaceV2.json';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';
import hinataStakingAbi from '$constants/contracts/abis/HinataStaking.json';
import hinataVestingAbi from '$constants/contracts/abis/HinataVesting.json';
import tokenAbi from '$constants/contracts/abis/hinataToken.json';
import defaultProvider from '$utils/contracts/defaultProvider';

type ContractName =
	| 'marketplace'
	| 'marketplace-v2'
	| 'storage'
	| 'factory'
	| 'token'
	| 'weth'
	| 'staking'
	| 'hinata-token'
	| 'vesting';

const contracts: {
	name: ContractName;
	network:
		| 'eth'
		| 'rinkeby'
		| 'testing-goerli'
		| 'development-goerli'
		| 'staging-genache'
		| 'staging-goerli';
	address: string;
	abi: any;
}[] = [
	// Goerli Testing Environment
	{
		name: 'marketplace',
		network: 'testing-goerli',
		address: '0x48441F157Eb382C8FEC1f9b40f34aa9a04209028',
		abi: marketplaceAbi,
	},
	{
		name: 'marketplace-v2',
		network: 'testing-goerli',
		address: '0xF472c5e341d192B6CCe028bC9B554038c5f03a43',
		abi: marketplaceV2Abi,
	},
	{
		name: 'storage',
		network: 'testing-goerli',
		address: '0x5c7db52089565A5c3F701135d9015Bc4Df339B1b',
		abi: storageAbi,
	},
	{
		name: 'factory',
		network: 'testing-goerli',
		address: '0xa0B39FCC5FdeB3D839288c3Ec7210AAaf6fB972D',
		abi: factoryAbi,
	},
	{
		name: 'token',
		network: 'testing-goerli',
		address: '0x15733Ab0E019B8Ff529EceB3FA2F33BcdCc4c3a7',
		abi: tokenAbi,
	},
	{
		name: 'weth',
		network: 'testing-goerli',
		address: '0xbA5029aAF14672ef662aD8eB38CDB4E4C16AdF6D',
		abi: erc20Abi,
	},
	{
		name: 'staking',
		network: 'testing-goerli',
		address: '0x0a539ef9b30b360d92bfcdee6836898cdbb6f240',
		abi: hinataStakingAbi,
	},
	// todo: update this token address and abi
	{
		name: 'hinata-token',
		network: 'testing-goerli',
		address: '0xc41a8cF3323946E96E55DdD71EB99E16079aB693',
		abi: hinataStakingAbi,
	},
	{
		name: 'vesting',
		network: 'testing-goerli',
		address: '0x0CB5a8107684A96982Bb2A32E8c4050751ff7D88',
		abi: hinataVestingAbi,
	},

	// Goerli Development Environment
	{
		name: 'marketplace',
		network: 'development-goerli',
		address: '0x1F2C31095e8D9947e7FEb3202e9fd20C1eC0FF4B',
		abi: marketplaceAbi,
	},
	// Marketplace v2 contract is missing
	{
		name: 'storage',
		network: 'development-goerli',
		address: '0xb3f40a5fe7f1621A36C540CF74BC76F8bc10fbAc',
		abi: storageAbi,
	},
	{
		name: 'factory',
		network: 'development-goerli',
		address: '0x7FeDd7Cc42E5486f2Ff73147DD9c06b80665B2A1',
		abi: factoryAbi,
	},
	{
		name: 'token',
		network: 'development-goerli',
		address: '0xaA8aF7853c6E449197a1369dE255A92264F65A6a',
		abi: tokenAbi,
	},
	{
		name: 'weth',
		network: 'development-goerli',
		address: '0xbA5029aAF14672ef662aD8eB38CDB4E4C16AdF6D',
		abi: erc20Abi,
	},

	// Eth
	{
		name: 'marketplace',
		network: 'eth',
		address: '0x9A986d8B2cB50e827393Ec329cb0003535b5Ff75',
		abi: marketplaceAbi,
	},
	{
		name: 'marketplace-v2',
		network: 'eth',
		address: '0x3c3C307CD048fbFCDbfB1b12A6baBABc59544E2b',
		abi: marketplaceV2Abi,
	},
	{
		name: 'storage',
		network: 'eth',
		address: '0x199297eb990BC25DD9A1C1c0D828a7e9DF1d132E',
		abi: storageAbi,
	},
	{
		name: 'factory',
		network: 'eth',
		address: '0x41a508E15F391b2AA3129c9fE054f9A48226AC4F',
		abi: factoryAbi,
	},
	{
		name: 'token',
		network: 'eth',
		address: '0x91a09acc7a76624f593990c4456fc318d705c761',
		abi: tokenAbi,
	},
	{
		name: 'weth',
		network: 'eth',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		abi: erc20Abi,
	},

	// Staging Genache
	{
		name: 'marketplace',
		network: 'staging-genache',
		address: '0x9A986d8B2cB50e827393Ec329cb0003535b5Ff75',
		abi: marketplaceAbi,
	},
	{
		name: 'marketplace-v2',
		network: 'staging-genache',
		address: '0x3c3C307CD048fbFCDbfB1b12A6baBABc59544E2b',
		abi: marketplaceV2Abi,
	},
	{
		name: 'storage',
		network: 'staging-genache',
		address: '0x199297eb990BC25DD9A1C1c0D828a7e9DF1d132E',
		abi: storageAbi,
	},
	{
		name: 'factory',
		network: 'staging-genache',
		address: '0x41a508E15F391b2AA3129c9fE054f9A48226AC4F',
		abi: factoryAbi,
	},
	{
		name: 'token',
		network: 'staging-genache',
		address: '0x91a09acc7a76624f593990c4456fc318d705c761',
		abi: tokenAbi,
	},
	{
		name: 'weth',
		network: 'staging-genache',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		abi: erc20Abi,
	},
	// These three addressess are incorrect (used them for local testing - Ganache)
	{
		name: 'staking',
		network: 'staging-genache',
		address: '0xAD75951631Eb65a6E5F7599F11547f697b32c18f',
		abi: hinataStakingAbi,
	},
	{
		name: 'hinata-token',
		network: 'staging-genache',
		address: '0xad446fD0e4dB99526Deb1d9a3f04df87Cf8335d1',
		abi: hinataStakingAbi,
	},
	{
		name: 'vesting',
		network: 'staging-genache',
		address: '0xE907B49D7b5598824affd9e0ce11E4374f280760',
		abi: hinataVestingAbi,
	},

	// Staging Goerli
	{
		name: 'marketplace',
		network: 'staging-goerli',
		address: '0x1fBf287d7026f5d43549424886B439Fc1d405c58',
		abi: marketplaceAbi,
	},
	{
		name: 'marketplace-v2',
		network: 'staging-goerli',
		address: '0x97d706c8761fd847629DfE5CFc0328abCBCEB1F2',
		abi: marketplaceV2Abi,
	},
	{
		name: 'storage',
		network: 'staging-goerli',
		address: '0xE09dA477881DDC07D8DAD107dd71021EA43aCFf8',
		abi: storageAbi,
	},
	{
		name: 'factory',
		network: 'staging-goerli',
		address: '0x7E6b4e3daE0C60Fa3FD9bfa8dB2215b8B237b4FC',
		abi: factoryAbi,
	},
	{
		name: 'token',
		network: 'staging-goerli',
		address: '0xf41f5a3f6497687738F1cBd0B262f577da9384Bf',
		abi: tokenAbi,
	},
	{
		name: 'weth',
		network: 'staging-goerli',
		address: '0xbA5029aAF14672ef662aD8eB38CDB4E4C16AdF6D',
		abi: erc20Abi,
	},
];

export function getContractData(name: ContractName) {
	const provider = get(appProvider) || defaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK);
	const networkId = provider.network?.chainId || +import.meta.env.VITE_DEFAULT_NETWORK;
	const environment: string | undefined = import.meta.env.VITE_CONTRACTS_ENVIRONMENT;

	let networkName: string;

	if (networkId === 1) {
		networkName = 'eth';
	} else if (networkId === 4) {
		networkName = 'rinkeby';
	} else if (networkId === 5) {
		networkName = 'goerli';
	} else if (networkId === 1337) {
		networkName = 'staging-genache';
	} else {
		throw new Error(`Network with the ID ${networkId} not supported.`);
	}

	if (
		(environment?.trim() === 'development' ||
			environment?.trim() === 'testing' ||
			environment?.trim() === 'staging') &&
		networkName === 'goerli'
	) {
		networkName = `${environment.trim()}-goerli`;
	}

	const contractData = contracts.find((c) => c.name === name && c.network === networkName);

	if (!contractData) {
		if (!['development', 'testing', 'staging'].includes(environment) && networkName === 'goerli') {
			console.warn(
				'Network is set to goerli but CONTRACTS_ENVIRONMENT variable is not set, app may not function properly.',
			);
		}

		throw new Error(
			`Failed to find contract address for network: ${networkName}, contract: ${name}`,
		);
	}

	return contractData;
}

export function getContract(name: ContractName, canUseFallback = false) {
	const contractData = getContractData(name);

	let provider: providers.Provider | Signer = get(appSigner);

	if (!provider && canUseFallback) {
		provider = defaultProvider(
			+import.meta.env.VITE_DEFAULT_NETWORK,
		) as unknown as providers.Provider;
	} else if (!provider) {
		throw new Error('Web 3 provider has not been set yet!');
	}

	const contract = new ethers.Contract(contractData.address, contractData.abi, provider);

	return contract;
}
