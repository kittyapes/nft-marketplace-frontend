import { writable } from 'svelte/store';
import type { ethers } from 'ethers';
import type Web3Modal from 'web3modal';

export const web3ModalInstance = writable<Web3Modal>(null);
export const appProvider = writable<ethers.providers.Web3Provider>(null);
export const externalProvider = writable<ethers.providers.JsonRpcProvider>(null);
export const connectionDetails = writable<ethers.providers.Network>(null);
export const appSigner = writable<ethers.Signer>(null);
export const userHinataBalance = writable<number>(null);
export const currentUserAddress = writable<string>(null);

// Staking
export const stakedHinataBalance = writable<number>(0);
export const stakingWaifuRewards = writable<number>(0);
export const hinataStakingAllowance = writable<number>(0);

// Airdrop is claiming
export const isAirdropClaiming = writable<boolean>(false);

// Airdrop
export const communityEscrowUnlock = writable<number>(0);
export const communityAirdropTokens = writable<number>(0);
export const communityClaimsArray = writable<ClaimsObject[]>(null);
export const communityMerkleContractIsActive = writable<boolean>(false);

// IDO/Public
export const idoEscrowUnlock = writable<number>(0);
export const idoAirdropTokens = writable<number>(0);
export const idoClaimsArray = writable<ClaimsObject[]>(null);
export const idoMerkleContractIsActive = writable<boolean>(false);

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

// Welcome NFT
export const welcomeNftClaimed = writable(true);
