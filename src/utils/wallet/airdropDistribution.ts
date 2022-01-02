import { getDistributorContract } from '$contracts/contracts';
import merkleTree from '$contracts/merkleDistributor/merkleTree.json';
import { appProvider, appSigner, merkleContractIsActive, userClaimsArray } from '$stores/wallet';
import { notifyError, notifySuccess } from '$utils/toast';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

// Check the time since deploy to determine if the user can claim for the current cliff
export const checkClaimEligibility = async (userAddress: string) => {
	try {
		const distributorContract = getDistributorContract(get(appProvider));

		// Check Contract Active Time
		const deployTime = +ethers.utils.formatUnits(await distributorContract.deployTime(), 0);
		const contractActiveDuration = +ethers.utils.formatUnits(
			await distributorContract.contractActiveDuration(),
			0
		);
		const milliSecondsSinceUtc = new Date().getUTCMilliseconds();

		const contractIsInactive = milliSecondsSinceUtc < deployTime + contractActiveDuration;

		merkleContractIsActive.set(!contractIsInactive);

		if (!contractIsInactive) {
			// Address might have different capitalization
			const addressArr = Object.keys(merkleTree.claims);

			let userClaimInfo: { amount: string; index: number; proof: string[] } = null;
			let merkleUserAddress = userAddress;

			addressArr.map((addr) => {
				if (addr.toLowerCase() === userAddress.toLowerCase()) {
					userClaimInfo = merkleTree.claims[addr];
					merkleUserAddress = addr;
				}
			});

			// 0, 1, 2
			// Get the amounts for each time the user claims from the merkle trees
			const claimInfoArr: ClaimsObject[] = [];

			for (let currentClaimIndex = 0; ; currentClaimIndex++) {
				try {
					await distributorContract.merkleRoots(currentClaimIndex);
					const isClaimed = await distributorContract.isClaimed(
						userClaimInfo.index,
						currentClaimIndex
					);
					if (!isClaimed) {
						claimInfoArr.push({
							merkleRoot: await distributorContract.merkleRoots(currentClaimIndex),
							user: {
								...userClaimInfo,
								rootIndex: currentClaimIndex,
								address: merkleUserAddress,
								hasClaimed: false
							}
						});
					} else {
						claimInfoArr.push({
							merkleRoot: await distributorContract.merkleRoots(currentClaimIndex),
							user: {
								...userClaimInfo,
								rootIndex: currentClaimIndex,
								address: merkleUserAddress,
								hasClaimed: true
							}
						});
					}
				} catch (err) {
					console.log(err);
					break;
				}
			}

			// User has not claimed for the most recent claim cliff
			console.log('USER CLAIM INFO: ', claimInfoArr);

			userClaimsArray.set(claimInfoArr);

			return claimInfoArr;
		}
	} catch (err) {
		console.log(err);

		userClaimsArray.set(null);

		return null;
	}
};

// Check if the user is eligible

// Claim for the user passing the merkle roots and proof arrays

export const claimAirdropTokens = async () => {
	try {
		const distributorContract = getDistributorContract(get(appSigner));

		// We assume the user's index and root index is the same across all merkle trees
		// params: AccIndex, accAddress, rootIndexes[], amounts[], merkleProofs[]
		const userIndex = get(userClaimsArray)[0].user.index;
		const accAddress = get(userClaimsArray)[0].user.address;
		const rootIndexes = get(userClaimsArray).map((claimsObj) => claimsObj.user.rootIndex);
		const amounts = get(userClaimsArray).map((claimsObj) => claimsObj.user.amount);
		const merkleProofs = get(userClaimsArray).map((claimsObj) => claimsObj.user.proof);

		const txt = await distributorContract.claim(
			userIndex,
			accAddress,
			rootIndexes,
			amounts,
			merkleProofs
		);

		await txt.wait(1);

		notifySuccess('Successfully Claimed Airdrop');

		return true;
	} catch (error) {
		console.log(error);
		notifyError(error.message || JSON.stringify(error));
		return false;
	}
};
