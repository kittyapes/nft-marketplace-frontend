import { ethers } from 'ethers';
import distributorAbi from '$contracts/merkleDistributor/distributorAbi.json';
import merkleTree from '$contracts/merkleDistributor/merkleTree.json';
import { appProvider, appSigner, userClaimsObject } from '$stores/wallet';
import { get } from 'svelte/store';
import { merkleDistributorContractAddress } from '$constants/contractAddresses';

export const claimToken = async (userAddress: string) => {
	// Claims Object
	const claimsObject = get(userClaimsObject);

	if (!claimsObject) {
		return { status: 'error', message: 'Error, User Not Elligible for Airdrop' };
	}

	try {
		// Signed Contract
		const distributorContract = new ethers.Contract(
			merkleDistributorContractAddress,
			distributorAbi,
			get(appSigner)
		);

		let txHash = await distributorContract.claim(
			claimsObject.user.index,
			userAddress,
			claimsObject.user.amount,
			claimsObject.user.proof
		);

		console.log(txHash);

		// Refresh UI
		userClaimsObject.update((obj) => ({
			...obj,
			user: {
				...obj.user,
				hasClaimed: true
			}
		}));

		return { status: 'success', message: 'Successfully Claimed Tokens' };
	} catch (err) {
		if ((err?.message as string).includes('already claimed')) {
			return { status: 'error', message: 'User Already Claimed' };
		} else {
			return { status: 'error', message: err?.message || JSON.stringify(err) };
		}
	}
};

export const userAlreadyClaimed = async (index: number) => {
	try {
		// Check if the airdrop tokens have been claimed or not
		const distributorContract = new ethers.Contract(
			merkleDistributorContractAddress,
			distributorAbi,
			get(appProvider)
		);

		let isClaimed = await distributorContract.isClaimed(index);

		return isClaimed;
	} catch (err) {
		console.log(err);
		return true;
	}
};

export const findUserInMerkleTree = (userAddress: string) => {
	const userAddressesList = Object.keys(merkleTree.claims);

	// Address in the merkle tree (with its capitalization)
	const addressInList = userAddressesList.find(
		(el) => el.toLowerCase() === userAddress.toLowerCase()
	);
	if (addressInList) {
		return {
			merkleRoot: merkleTree.merkleRoot,
			user: {
				address: addressInList,
				...merkleTree.claims[addressInList]
			}
		};
	} else {
		return null;
	}
};

export const checkForClaimEligibility = async (userAddress: string) => {
	fetch('/api/airdrop/canClaim', {
		method: 'POST',
		body: JSON.stringify({ userAddress })
	})
		.then((res) => res.json())
		.then(async (resData) => {
			if (resData) {
				const hasClaimed = await userAlreadyClaimed(resData?.user?.index);

				userClaimsObject.set({
					...resData,
					user: {
						...resData?.user,
						hasClaimed
					}
				});
			} else {
				userClaimsObject.set(null);
			}
		})
		.catch((err) => console.log(err));
};
