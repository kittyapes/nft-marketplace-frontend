import { notifyError } from '$utils/toast';
import { coinbaseLogo, metamaskLogo } from '$constants/walletIcons';
import { appProvider, appSigner, connectionDetails, currentUserAddress, externalProvider, communityClaimsArray, web3ModalInstance, appDataToTriggerReload } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import Web3Modal from 'web3modal';
import { WalletState, walletState } from '.';

const infuraId = '456e115b04624699aa0e776f6f2ee65c';
const appName = 'Hinata Marketplace';

// Check if Metamask is Installed on browser
const isMetaMaskInstalled = () => {
	if (window.ethereum) {
		if (window.ethereum.providers) {
			return window.ethereum.providers.find((prov) => prov.isMetaMask);
		} else {
			return window.ethereum?.isMetaMask;
		}
	}
	return false;
};

const getProviderOptions = () => {
	let providerOptions = {};

	// Metamask - replaces the default injected wallet
	if (isMetaMaskInstalled()) {
		providerOptions['custom-metamask'] = {
			display: {
				logo: metamaskLogo,
				name: 'MetaMask',
				description: 'Connect to your MetaMask Wallet',
			},
			package: true,
			connector: async () => {
				let provider = null;
				if (window.ethereum.providers) {
					let providers = window.ethereum.providers;
					provider = providers.find((prov) => prov.isMetaMask);
				} else {
					provider = window.ethereum;
				}

				try {
					await provider.request({ method: 'eth_requestAccounts' });
				} catch (error) {
					console.log('Wallet Request Cancelled');
					return;
				}

				return provider;
			},
		};
	}
	// Display an install metamask button if metamask is not installed
	else {
		providerOptions['custom-metamask'] = {
			display: {
				logo: metamaskLogo,
				name: 'MetaMask',
				description: 'Install the MetaMask extension',
			},
			package: {},
			connector: async () => {
				window.open('https://metamask.io');
				return;
			},
		};
	}

	// WalletConnect
	if ((window as any).WalletConnectProvider) {
		providerOptions['walletconnect'] = {
			package: (window as any).WalletConnectProvider.default, // required
			options: {
				infuraId: infuraId, // required
			},
		};
	}

	// Torus
	if ((window as any).Torus) {
		providerOptions['torus'] = {
			package: (window as any).Torus, // required
		};
	}

	if ((window as any).Authereum) {
		// Authereum
		providerOptions['authereum'] = {
			package: (window as any).Authereum.default, // required
		};
	}

	if ((window as any).WalletLink) {
		// Coinbase or other WalletLink Wallets
		providerOptions['custom-coinbase'] = {
			display: {
				logo: coinbaseLogo,
				name: 'Coinbase',
				description: 'Scan with WalletLink to connect',
			},
			options: {
				appName: appName, // Your app name
				networkUrl: `https://mainnet.infura.io/v3/${infuraId}`,
				chainId: 1,
				network: 'mainnet',
			},
			package: (window as any).WalletLink.default,
			connector: async (_, options) => {
				const { appName, networkUrl, chainId } = options;
				const walletLink = new (window as any).WalletLink.default({
					appName,
				});
				const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
				await provider.enable();
				return provider;
			},
		};
	}

	return providerOptions;
};

// Initialize web3 Modal Instance
export const initWeb3ModalInstance = () => {
	const providerOptions = getProviderOptions();

	const web3Modal = new Web3Modal({
		// Disabled the default injected Metamask (also launches other injected if enabled + present)
		disableInjectedProvider: true,
		cacheProvider: true,
		providerOptions,
	});

	web3ModalInstance.set(web3Modal);

	return web3Modal;
};

// Set the provider
const setProvider = async (provider: ethers.providers.ExternalProvider) => {
	const ethersProvider = new ethers.providers.Web3Provider(provider);

	// Commit values to store
	appProvider.set(ethersProvider ? ethersProvider : null);
	appSigner.set(ethersProvider ? ethersProvider.getSigner() : null);
	const userAddress = ethersProvider ? await ethersProvider.getSigner().getAddress() : null;
	currentUserAddress.set(userAddress);
	const networkDetails = await ethersProvider.getNetwork();
	connectionDetails.set(networkDetails);
	appDataToTriggerReload.set({ address: userAddress, network: networkDetails });

	// console.log(
	//   'WALLET CONNECTED.\n BALANCE: ',
	//   userAddress && ethers.utils.formatEther(
	//     await ethersProvider.getBalance(userAddress)
	//   )
	// );

	return ethersProvider;
};

// Disconnect Wallet
export const disconnectWallet = () => {
	// Clear the cached provider
	get(web3ModalInstance) && get(web3ModalInstance).clearCachedProvider();
	deregisterEvents();

	// Clear Local Storage
	localStorage.removeItem('walletconnect');
	localStorage.removeItem('loglevel:torus.js');

	// Reset App Store
	appSigner.set(null);
	web3ModalInstance.set(null);
	appProvider.set(null);
	walletState.set(WalletState.DISCONNECTED);
	currentUserAddress.set(null);
};

// Connect to Wallet (new connection)
export const connectToWallet = async () => {
	// Initialize web3Modal instance or fetch existing instance
	const web3Modal = get(web3ModalInstance) || initWeb3ModalInstance();

	// If user has a cached provider clear it
	if (web3Modal.cachedProvider) {
		// Clear Cached Provider
		web3Modal.clearCachedProvider();
	}

	// Connect to wallet
	const provider: ethers.providers.ExternalProvider = await web3Modal.connect();

	if (await isAllowedNetworks(provider)) {
		// Init Provider Events
		initProviderEvents(provider);

		// Add provider to store
		setProvider(provider);

		// Set wallet state to connected
		walletState.set(WalletState.CONNECTED);

		return;
	} else {
		return;
	}
};

const isAllowedNetworks = async (provider: ethers.providers.ExternalProvider) => {
	const ethersProvider = new ethers.providers.Web3Provider(provider);
	const chainId = (await ethersProvider.getNetwork()).chainId;

	let allowedNetworks = [1];

	try {
		allowedNetworks = import.meta.env.VITE_ALLOWED_NETWORKS.split(',').map((item) => +item);
	} catch (error) {
		allowedNetworks = [1];
	}

	if (allowedNetworks.some((item) => item === chainId)) {
		// only allow rinkeby or mainnet
		return true;
	} else {
		const items = [];
		if (allowedNetworks.some((item) => item === 1)) {
			items.push('Ethereum Mainnet');
		}
		if (allowedNetworks.some((item) => item === 4)) {
			items.push('Ethereum Rinkeby');
		}
		if (allowedNetworks.some((item) => item === 5)) {
			items.push('Ethereum Goerli');
		}
		if (allowedNetworks.some((item) => item === 1337)) {
			items.push('Staging Genache');
		}
		notifyError(`You can only connect to these networks: ${items.join(' | ')}. Please switch your wallet network and reconnect.`);
		return false;
	}
};

// Subscribe to Wallet Events
export const initProviderEvents = (provider: any) => {
	// Subscribe to accounts change
	provider.on('accountsChanged', async (accounts: string[]) => {
		console.log('Account Changed: ', accounts);
		deregisterEvents();
		await refreshConnection();
	});

	// Subscribe to chainId change
	provider.on('chainChanged', async (chainId: number) => {
		console.log('Chain Changed: ', chainId);
		deregisterEvents();
		await refreshConnection();
	});

	// Subscribe to provider connection
	provider.on('connect', (info: { chainId: number }) => {
		console.log('Connect: ', info);
		deregisterEvents();
	});

	// Subscribe to provider disconnection
	provider.on('disconnect', (error: { code: number; message: string }) => {
		console.log('Disconnect', error);

		if (isAllowedNetworks(provider)) {
			notifyError('Wallet Disconnected');
		}
		// else {
		// 	notifyError('You can only connect to mainnet or Rinkeby Test Network');
		// }

		disconnectWallet();
	});

	externalProvider.set(provider);
};

export const deregisterEvents = () => {
	return get(externalProvider).removeAllListeners();
};

export const refreshConnection = async () => {
	// Reset App State
	appSigner.set(null);
	appProvider.set(null);
	// setPopup(null, null);
	communityClaimsArray.set(null);

	// Setting wallet state to UNKNOWN to display loaders
	// rather than 'Connect wallet' prompts
	walletState.set(WalletState.UNKNOWN);

	const web3Modal = get(web3ModalInstance) || initWeb3ModalInstance();

	// If user has a cached provider prompt for connection
	if (web3Modal.cachedProvider) {
		// Connect to cached wallet
		const provider: ethers.providers.ExternalProvider = await web3Modal.connectTo(web3Modal.cachedProvider);

		if (await isAllowedNetworks(provider)) {
			// Init Provider Events
			initProviderEvents(provider);

			// Add provider to store
			setProvider(provider);

			walletState.set(WalletState.CONNECTED);
		} else {
			// notifyError('You can only connect to mainnet or Rinkeby or Goerli Test Network');
		}
	} else {
		walletState.set(WalletState.DISCONNECTED);
	}
};
