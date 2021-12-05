import { metamaskLogo } from "$constants/walletIcons";
import { appProvider, appSigner, web3ModalInstance } from "$stores/wallet";
import { ethers } from "ethers";
import { get } from "svelte/store";
import Web3Modal from "web3modal";

const infuraId = '456e115b04624699aa0e776f6f2ee65c';

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

        console.log('MetaMask Connected');
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
      package: (window as any).Torus, // required
    },

    // Authereum
    authereum: {
      package: (window as any).Authereum.default // required
    },
  }

  const web3Modal = new Web3Modal({
    // Disabled the default injected Metamask (also launches other injected if enabled + present)
    disableInjectedProvider: true,
    cacheProvider: true,
    providerOptions
  });

  web3ModalInstance.set(web3Modal);

  return web3Modal;
}

// Set the provider
const setProvider = async (provider: ethers.providers.ExternalProvider) => {
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  ethersProvider.on('connect', (e) => console.log(Object.keys(e)));
  appProvider.set(ethersProvider ? ethersProvider : null);
  appSigner.set(ethersProvider ? ethersProvider.getSigner() : null);
  const userAddress = ethersProvider ? await ethersProvider.getSigner().getAddress() : '';

  // Initialize wallet events
  initProviderEvents(ethersProvider);

  console.log(
    'WALLET CONNECTED.\n BALANCE: ',
    ethers.utils.formatEther(
      await ethersProvider.getBalance(userAddress)
    )
  );

  return ethersProvider;
}

// Disconnect Wallet
export const disconnectWallet = () => {
  // Clear the cached provider
  get(web3ModalInstance) && get(web3ModalInstance).clearCachedProvider();

  // Reset App Store
  appSigner.set(null);
  web3ModalInstance.set(null);
  appProvider.set(null);
}

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
}

// Subscribe to Wallet Events
const initProviderEvents = (provider: ethers.providers.Web3Provider) => {
  // Subscribe to Account Change Event
  provider.on('accountsChanged', (accounts: string[]) => {
    console.log('ACCOUNTS CHANGED');
    console.log(accounts);
  });

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId: number) => {
    console.log('CHAIN CHANGED');
    console.log(chainId);
  });

  // Subscribe to provider connection
  provider.on('connect', (info: { chainId: number }) => {
    console.log('CONNECTED');
    console.log(info);
  });

  // Subscribe to provider disconnection
  provider.on('disconnect', (error: { code: number; message: string }) => {
    console.log('DISCONNECTED');
    console.log(error);
  });
}

export const refreshConnection = async () => {
  const web3Modal = get(web3ModalInstance) || initWeb3ModalInstance();

  // If user has a cached provider prompt for connection
  if (web3Modal.cachedProvider) {
    // Connect to cached wallet
    const provider: ethers.providers.ExternalProvider = await web3Modal.connectTo(web3Modal.cachedProvider);

    // Add provider to store
    setProvider(provider);
  }
}
