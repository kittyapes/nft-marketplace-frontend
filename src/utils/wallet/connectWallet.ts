import { coinbaseLogo, metamaskLogo } from '$constants/walletIcons';
import { appProvider, appSigner, currentUserAddress, web3ModalInstance } from '$stores/wallet';
import { warning } from '$utils/toast';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import Web3Modal from 'web3modal';

const infuraId = '456e115b04624699aa0e776f6f2ee65c';
const appName = 'Hinata Marketplace';

// Check if Metamask is Installed
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

// Initialize web3 Modal Instance
export const initWeb3ModalInstance = () => {
	const providerOptions = {
		// Replace Default Metamask Injected Wallet
		'custom-metamask': {
			display: {
				logo: metamaskLogo,
				name: 'MetaMask',
				description: 'Connect to your MetaMask Wallet'
			},
			package: true,
			connector: async () => {
				if (!isMetaMaskInstalled()) {
					// window.location = "https://metamask.app.link/dapp/www.ethbox.org/app/"; // <-- LOOK HERE
					return;
				}

				let provider = null;
				if (typeof window.ethereum !== 'undefined') {
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
				} else {
					console.log('No MetaMask Wallet found');
					return;
				}

				return provider;
			}
		},

		// WalletConnect
		walletconnect: {
			package: (window as any).WalletConnectProvider.default, // required
			options: {
				infuraId: infuraId // required
			}
		},

		// Torus
		torus: {
			package: (window as any).Torus // required
		},

		// Authereum
		authereum: {
			package: (window as any).Authereum.default // required
		},

		// Coinbase or other WalletLink Wallets
		'custom-coinbase': {
			display: {
				logo: coinbaseLogo,
				name: 'Coinbase',
				description: 'Scan with WalletLink to connect'
			},
			options: {
				appName: appName, // Your app name
				networkUrl: `https://mainnet.infura.io/v3/${infuraId}`,
				chainId: 1,
				network: 'mainnet'
			},
			package: (window as any).WalletLink.default,
			connector: async (_, options) => {
				const { appName, networkUrl, chainId } = options;
				const walletLink = new (window as any).WalletLink.default({
					appName
				});
				const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
				await provider.enable();
				return provider;
			}
		}
	};

	const web3Modal = new Web3Modal({
		// Disabled the default injected Metamask (also launches other injected if enabled + present)
		disableInjectedProvider: true,
		cacheProvider: true,
		providerOptions
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

	// Initialize wallet events
	initProviderEvents(ethersProvider);

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

	// Reset App Store
	appSigner.set(null);
	web3ModalInstance.set(null);
	appProvider.set(null);
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

	// Add provider to store
	setProvider(provider);

	return;
};

// Subscribe to Wallet Events
export const initProviderEvents = (provider: ethers.providers.Web3Provider) => {
	let pollStatus = null;
	pollStatus = setInterval(async () => {
		// Check for network change
		try {
			// If this function fails its likely the network changed
			const networkName = (await provider.getNetwork()).name;
		} catch (err) {
			clearInterval(pollStatus);
			await refreshConnection();
		}

		// Check account change
		const newAccount = await provider.getSigner().getAddress();

		if (get(currentUserAddress) !== newAccount) {
			warning('Account Changed. Fetching New Account Details...');
			clearInterval(pollStatus);
			await refreshConnection();
		}
	}, 1000);
};

export const refreshConnection = async () => {
	const web3Modal = get(web3ModalInstance) || initWeb3ModalInstance();

	// If user has a cached provider prompt for connection
	if (web3Modal.cachedProvider) {
		// Connect to cached wallet
		const provider: ethers.providers.ExternalProvider = await web3Modal.connectTo(
			web3Modal.cachedProvider
		);

		// Add provider to store
		setProvider(provider);
	}
};
