import { writable } from 'svelte/store';
import type { ethers } from 'ethers';
import type Web3Modal from 'web3modal';

export const web3ModalInstance = writable<Web3Modal>(null);
export const appProvider = writable<ethers.providers.Web3Provider>(null);
export const appSigner = writable<ethers.Signer>(null);