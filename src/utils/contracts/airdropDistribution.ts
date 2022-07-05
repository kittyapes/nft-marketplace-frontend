import {
	idoMerkleDistributorLockContract,
	privateVestingMerkleDistributorLockContract,
	communityMerkleDistributorLockContract,
	seedVestingMerkleDistributorLockContract
} from '$constants/contractAddresses';
import { getDistributorContract } from '$utils/contracts/generalContractCalls';
import {
	appProvider,
	appSigner,
	currentUserAddress,
	externalProvider,
	communityMerkleContractIsActive,
	privateClaimsArray,
	seedClaimsArray,
	communityClaimsArray,
	web3ModalInstance,
	communityEscrowUnlock,
	seedEscrowUnlock,
	privateEscrowUnlock,
	seedMerkleContractIsActive,
	privateMerkleContractIsActive,
	isAirdropClaiming,
	idoEscrowUnlock,
	idoMerkleContractIsActive,
	idoClaimsArray
} from '$stores/wallet';
import { notifyError, notifySuccess } from '$utils/toast';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import { getContractData } from '$utils/misc/getContract';

export const getUTCSeconds = () => {
	const x = new Date();
	const UTCseconds = (x.getTime() + x.getTimezoneOffset() * 60 * 1000) / 1000;
	return UTCseconds;
};

const getDistributorAddress = (airdropType: 'community' | 'private' | 'ido' | 'seed') => {
	let distributorAddress = '';
	switch (airdropType) {
		case 'community':
			distributorAddress = communityMerkleDistributorLockContract;
			break;

		case 'private':
			distributorAddress = privateVestingMerkleDistributorLockContract;
			break;

		case 'ido':
			distributorAddress = idoMerkleDistributorLockContract;
			break;

		case 'seed':
			distributorAddress = seedVestingMerkleDistributorLockContract;
			break;

		default:
			distributorAddress = communityMerkleDistributorLockContract;
			break;
	}

	return distributorAddress;
};

// Check the time since deploy to determine if the user can claim for the current cliff
export const checkClaimEligibility = async (airdropType: 'community' | 'private' | 'ido' | 'seed', userAddress: string) => {
	try {
		const distributorAddress = getDistributorAddress(airdropType);

		const distributorContract = getDistributorContract(distributorAddress, get(appProvider));

		// Get total number of merkle trees
		const numberOfMerkleTrees = +ethers.utils.formatUnits(await distributorContract.treeNumber(), 0);

		// Make sure that this is not past the contract active duration
		const deployTime = +ethers.utils.formatUnits(await distributorContract.deployTime(), 0);
		const contractActiveDuration = +ethers.utils.formatUnits(await distributorContract.contractActiveDuration(), 0);

		// const blockTimestamp = getUTCSeconds();
		const blockTimestamp = (await get(appProvider).getBlock(await get(appProvider).getBlockNumber()))?.timestamp || getUTCSeconds();

		const contractIsActive = blockTimestamp < deployTime + contractActiveDuration;

		// If past, show that claim period has past
		const claimInfoArr: ClaimsObject[] = [];

		if (contractIsActive && numberOfMerkleTrees > 0) {
			// Get their claim times to ensure its already past and then check what the user can claim
			// Get the cliffs (after this time, one can claim)
			for (let currentClaimIndex = 0; currentClaimIndex < numberOfMerkleTrees; currentClaimIndex++) {
				const cliffTime = +ethers.utils.formatUnits(await distributorContract.cliffs(currentClaimIndex), 0);

				const timeToNextClaimInSeconds = deployTime + cliffTime - blockTimestamp;
				let reCheckFunc = null;

				const _treeIsClaimable = blockTimestamp >= deployTime + cliffTime;

				// if (treeIsClaimable) {
				// If not, check the amounts the user can claim from the merkle trees
				// Find user in relevant tree
				const tree = (await import(`../../constants/contracts/merkleDistributor/${airdropType}/tree_${currentClaimIndex}.json`)).default;

				if (tree) {
					// Address might have different capitalization
					const addressArr = Object.keys(tree.claims);

					let userClaimInfo: { amount: string; index: number; proof: string[] } = null;
					let merkleUserAddress = userAddress;

					addressArr.map((addr) => {
						if (addr.toLowerCase() === userAddress.toLowerCase()) {
							userClaimInfo = tree.claims[addr];
							merkleUserAddress = addr;
						}
					});

					if (userClaimInfo) {
						try {
							await distributorContract.merkleRoots(currentClaimIndex);
							const isClaimed = await distributorContract.isClaimed(userClaimInfo.index, currentClaimIndex);

							if (!isClaimed) {
								claimInfoArr.push({
									merkleRoot: await distributorContract.merkleRoots(currentClaimIndex),
									user: {
										...userClaimInfo,
										rootIndex: currentClaimIndex,
										address: merkleUserAddress,
										hasClaimed: false
									},
									nextClaimDuration: timeToNextClaimInSeconds * 1000
								});
							} else {
								// Commented out as there is no need to get the array if we are not claiming tokens
								claimInfoArr.push({
									merkleRoot: await distributorContract.merkleRoots(currentClaimIndex),
									user: {
										...userClaimInfo,
										rootIndex: currentClaimIndex,
										address: merkleUserAddress,
										hasClaimed: true
									},
									nextClaimDuration: timeToNextClaimInSeconds * 1000
								});
							}
						} catch (err) {
							break;
						}
					}
				}
				// } else
				if (timeToNextClaimInSeconds > 0) {
					// checkClaimEligibility(userAddress) && clearTimeout(reCheckFunc)
					reCheckFunc = setTimeout(() => checkClaimEligibility(airdropType, userAddress) && clearTimeout(reCheckFunc), timeToNextClaimInSeconds * 1000);

					if (airdropType === 'community') {
						communityEscrowUnlock.set(get(communityEscrowUnlock) < timeToNextClaimInSeconds * 1000 ? timeToNextClaimInSeconds * 1000 : get(communityEscrowUnlock));
					} else if (airdropType === 'seed') {
						seedEscrowUnlock.set(get(seedEscrowUnlock) < timeToNextClaimInSeconds * 1000 ? timeToNextClaimInSeconds * 1000 : get(seedEscrowUnlock));
					} else if (airdropType === 'private') {
						privateEscrowUnlock.set(get(privateEscrowUnlock) < timeToNextClaimInSeconds * 1000 ? timeToNextClaimInSeconds * 1000 : get(privateEscrowUnlock));
					} else if (airdropType === 'ido') {
						idoEscrowUnlock.set(get(idoEscrowUnlock) < timeToNextClaimInSeconds * 1000 ? timeToNextClaimInSeconds * 1000 : get(idoEscrowUnlock));
					}
				} else {
					reCheckFunc && clearTimeout(reCheckFunc);
				}
			}

			// Send this data to the svelte store for processing
			if (airdropType === 'community') {
				communityClaimsArray.set(claimInfoArr);
				communityMerkleContractIsActive.set(contractIsActive);
			} else if (airdropType === 'seed') {
				seedMerkleContractIsActive.set(contractIsActive);
				seedClaimsArray.set(claimInfoArr);
			} else if (airdropType === 'private') {
				privateMerkleContractIsActive.set(contractIsActive);
				privateClaimsArray.set(claimInfoArr);
			} else if (airdropType === 'ido') {
				idoMerkleContractIsActive.set(contractIsActive);
				idoClaimsArray.set(claimInfoArr);
			}
			console.log(`${airdropType} Checked`);

			return claimInfoArr;
		}
	} catch (err) {
		console.log(airdropType, err);

		communityClaimsArray.set(null);

		return null;
	}
};

// Claim for the user passing the merkle roots and proof arrays
export const claimAirdropTokens = async (airdropType: 'community' | 'ido' | 'private' | 'seed') => {
	isAirdropClaiming.set(true);

	try {
		const distributorAddress = getDistributorAddress(airdropType);

		const distributorContract = getDistributorContract(distributorAddress, get(appSigner));

		// We assume the user's index and root index is the same across all merkle trees
		// params: AccIndex, accAddress, rootIndexes[], amounts[], merkleProofs[]

		const claimsArray =
			airdropType === 'community'
				? get(communityClaimsArray)
				: airdropType === 'private'
				? get(privateClaimsArray)
				: airdropType === 'ido'
				? get(idoClaimsArray)
				: airdropType === 'seed'
				? get(seedClaimsArray)
				: [];

		if (claimsArray.length > 0) {
			const userIndex = claimsArray[0].user.index;
			const accAddress = claimsArray[0].user.address;
			const rootIndexes = claimsArray.filter((claimsObj) => !claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0).map((claimsObj) => claimsObj.user.rootIndex);
			const amounts = claimsArray.filter((claimsObj) => !claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0).map((claimsObj) => claimsObj.user.amount);
			const merkleProofs = claimsArray.filter((claimsObj) => !claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0).map((claimsObj) => claimsObj.user.proof);

			const txt = await distributorContract.claim(userIndex, accAddress, rootIndexes, amounts, merkleProofs);

			await txt.wait(1);

			notifySuccess('Successfully Claimed Airdrop');

			// Allow the user to add token to wallet
			await addHinataTokenToWallet();

			await checkClaimEligibility(airdropType, get(currentUserAddress));

			isAirdropClaiming.set(false);
			return true;
		}
	} catch (error) {
		console.log(error);
		notifyError(error.message || JSON.stringify(error));
		isAirdropClaiming.set(false);
		return false;
	}
};

export const addHinataTokenToWallet = async () => {
	if (get(web3ModalInstance).cachedProvider === 'custom-metamask') {
		const params = {
			type: 'ERC20',
			options: {
				address: getContractData('token').address,
				symbol: 'HiNATA',
				decimals: 18,
				image: 'https://rinkeby.etherscan.io/images/main/empty-token.png'
			}
		};
		await (get(externalProvider) as any).request({ method: 'wallet_watchAsset', params });
	}
};
