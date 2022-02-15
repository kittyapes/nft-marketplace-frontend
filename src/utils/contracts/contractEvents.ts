import {
	communityMerkleDistributorLockContract,
	idoMerkleDistributorLockContract,
	privateVestingMerkleDistributorLockContract,
	seedVestingMerkleDistributorLockContract
} from '$constants/contractAddresses';
import { appProvider, currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';
import { checkClaimEligibility } from './airdropDistribution';
import {
	getDistributorContract,
	getHinataTokenContract,
	getStakingContract
} from './generalContractCalls';
import { checkHinataAllowance, getAllTokenBalances } from './tokenBalances';

export default () => {
	const provider = get(appProvider);
	const hinataContract = getHinataTokenContract(provider);
	const stakingContract = getStakingContract(provider);
	const communityAirdropContract = getDistributorContract(
		communityMerkleDistributorLockContract,
		provider
	);
	const seedAirdropContract = getDistributorContract(
		seedVestingMerkleDistributorLockContract,
		provider
	);
	const privateAirdropContract = getDistributorContract(
		privateVestingMerkleDistributorLockContract,
		provider
	);
	const idoAirdropContract = getDistributorContract(idoMerkleDistributorLockContract, provider);

	if (provider) {
		hinataContract.on('Approval', async (userAddress, _poolId, _amount) => {
			if (userAddress === get(currentUserAddress)) {
				try {
					// console.log('LP TOKENS DEPOSITED');
					// Refresh stake balance
					await checkHinataAllowance(userAddress);
				} catch (err) {
					console.log(err);
				}
			}
		});

		stakingContract.on('Staked', async (userAddress, _rest) => {
			if (userAddress === get(currentUserAddress)) {
				try {
					// console.log('LP TOKENS DEPOSITED');
					// Refresh stake balance
					await getAllTokenBalances(userAddress);
				} catch (err) {
					console.log(err);
				}
			}
		});

		communityAirdropContract.on('Claimed', async (_amount, userAddress, _rest) => {
			if (userAddress === get(currentUserAddress)) {
				try {
					// console.log('LP TOKENS DEPOSITED');
					// Refresh stake balance
					await getAllTokenBalances(userAddress);
					await checkClaimEligibility('community', userAddress);
				} catch (err) {
					console.log(err);
				}
			}
		});

		seedAirdropContract.on('Claimed', async (_amount, userAddress, _rest) => {
			if (userAddress === get(currentUserAddress)) {
				try {
					// console.log('LP TOKENS DEPOSITED');
					// Refresh stake balance
					await getAllTokenBalances(userAddress);
					await checkClaimEligibility('seed', userAddress);
				} catch (err) {
					console.log(err);
				}
			}
		});

		privateAirdropContract.on('Claimed', async (_amount, userAddress, _rest) => {
			if (userAddress === get(currentUserAddress)) {
				try {
					// console.log('LP TOKENS DEPOSITED');
					// Refresh stake balance
					await getAllTokenBalances(userAddress);
					await checkClaimEligibility('private', userAddress);
				} catch (err) {
					console.log(err);
				}
			}
		});

		idoAirdropContract.on('Claimed', async (_amount, userAddress, _rest) => {
			if (userAddress === get(currentUserAddress)) {
				try {
					// console.log('LP TOKENS DEPOSITED');
					// Refresh stake balance
					await getAllTokenBalances(userAddress);
					await checkClaimEligibility('ido', userAddress);
				} catch (err) {
					console.log(err);
				}
			}
		});
	}
};
