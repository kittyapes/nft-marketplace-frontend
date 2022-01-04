import { HinataTokenAddress } from '$constants/contractAddresses';
import { getDistributorContract } from '$contracts/contracts';
import {
	appProvider,
	appSigner,
	currentUserAddress,
	externalProvider,
	merkleContractIsActive,
	userClaimsArray,
	web3ModalInstance
} from '$stores/wallet';
import { notifyError, notifySuccess } from '$utils/toast';
import { ethers } from 'ethers';
import { get } from 'svelte/store';

export const getUTCSeconds = () => {
	const x = new Date();
	const UTCseconds = (x.getTime() + x.getTimezoneOffset() * 60 * 1000) / 1000;
	return UTCseconds;
};

// Check the time since deploy to determine if the user can claim for the current cliff
export const checkClaimEligibility = async (userAddress: string) => {
	try {
		const distributorContract = getDistributorContract(get(appProvider));
		// Get total number of merkle trees
		const numberOfMerkleTrees = +ethers.utils.formatUnits(
			await distributorContract.treeNumber(),
			0
		);

		// Make sure that this is not past the contract active duration
		const deployTime = +ethers.utils.formatUnits(await distributorContract.deployTime(), 0);
		const contractActiveDuration = +ethers.utils.formatUnits(
			await distributorContract.contractActiveDuration(),
			0
		);

		// const blockTimestamp = getUTCSeconds();
		const blockTimestamp = (
			await get(appProvider).getBlock(await get(appProvider).getBlockNumber())
		).timestamp;

		const contractIsActive = blockTimestamp < deployTime + contractActiveDuration;

		merkleContractIsActive.set(contractIsActive);

		// If past, show that claim period has past
		const claimInfoArr: ClaimsObject[] = [];

		if (contractIsActive) {
			// Get their claim times to ensure its already past and then check what the user can claim
			// Get the cliffs (after this time, one can claim)
			for (
				let currentClaimIndex = 0;
				currentClaimIndex < numberOfMerkleTrees;
				currentClaimIndex++
			) {
				const cliffTime = +ethers.utils.formatUnits(
					await distributorContract.cliffs(currentClaimIndex),
					0
				);

				const timeToNextClaimInSeconds = deployTime + cliffTime - blockTimestamp;
				let reCheckFunc = null;

				const treeIsClaimable = blockTimestamp >= deployTime + cliffTime;

				if (treeIsClaimable) {
					// If not, check the amounts the user can claim from the merkle trees
					// Find user in relevant tree
					const tree = (
						await import(`../../contracts/merkleDistributor/tree_${currentClaimIndex}.json`)
					).default;
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
							// Commented out as there is no need to get the array if we are not claiming tokens
							// claimInfoArr.push({
							// 	merkleRoot: await distributorContract.merkleRoots(currentClaimIndex),
							// 	user: {
							// 		...userClaimInfo,
							// 		rootIndex: currentClaimIndex,
							// 		address: merkleUserAddress,
							// 		hasClaimed: true
							// 	}
							// });
						}
					} catch (err) {
						console.log(err);
						break;
					}
				} else if (timeToNextClaimInSeconds > 0) {
					// checkClaimEligibility(userAddress) && clearTimeout(reCheckFunc)
					reCheckFunc = setTimeout(
						() => checkClaimEligibility(userAddress) && clearTimeout(reCheckFunc),
						timeToNextClaimInSeconds * 1000
					);
				} else {
					console.log('Clear timeout');
					reCheckFunc && clearTimeout(reCheckFunc);
				}
			}

			// Send this data to the svelte store for processing
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

		// Allow the user to add token to wallet
		await addHinataTokenToWallet();

		await checkClaimEligibility(get(currentUserAddress));

		return true;
	} catch (error) {
		console.log(error);
		notifyError(error.message || JSON.stringify(error));
		return false;
	}
};

export const addHinataTokenToWallet = async () => {
	if (get(web3ModalInstance).cachedProvider === 'custom-metamask') {
		const params = {
			type: 'ERC20',
			options: {
				address: HinataTokenAddress,
				symbol: 'HiNATA',
				decimals: 18,
				image: 'https://rinkeby.etherscan.io/images/main/empty-token.png'
			}
		};
		await (get(externalProvider) as any).request({ method: 'wallet_watchAsset', params });
	}
};
