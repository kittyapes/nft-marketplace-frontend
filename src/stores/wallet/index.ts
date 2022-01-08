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

// Airdrop is claiming
export const isAirdropClaiming = writable<boolean>(false);

// Airdrop
export const publicEscrowUnlock = writable<number>(0);
export const publicAirdropTokens = writable<number>(0);
export const publicClaimsArray = writable<ClaimsObject[]>(null);
export const publicMerkleContractIsActive = writable<boolean>(false);

// Seed
export const seedEscrowUnlock = writable<number>(0);
export const seedAirdropTokens = writable<number>(0);
export const seedClaimsArray = writable<ClaimsObject[]>(null);
export const seedMerkleContractIsActive = writable<boolean>(false);

// Private
export const privateEscrowUnlock = writable<number>(0);
export const privateAirdropTokens = writable<number>(0);
export const privateClaimsArray = writable<ClaimsObject[]>(null);
export const privateMerkleContractIsActive = writable<boolean>(false);
