import { writable } from 'svelte/store';
import type { ethers } from 'ethers';
import type Web3Modal from 'web3modal';

export const web3ModalInstance = writable<Web3Modal>(null);
export const appProvider = writable<ethers.providers.Web3Provider>(null);
export const externalProvider = writable<ethers.providers.JsonRpcProvider>(null);
export const connectionDetails = writable<ethers.providers.Network>(null);
export const appSigner = writable<ethers.Signer>(null);
export const userHinataBalance = writable<number>(0);
export const currentUserAddress = writable<string>(null);

// Airdrop
export const timeTillNextClaim = writable<number>(0);
export const airdropEscrowedTokens = writable<number>(0);
export const userClaimsArray = writable<ClaimsObject[]>(null);
export const merkleContractIsActive = writable<boolean>(false);
