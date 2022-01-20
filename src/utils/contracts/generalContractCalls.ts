import { ethers } from 'ethers';
import { HinataTokenAddress, stakingContract } from '$constants/contractAddresses';
import distributorAbi from '$constants/contracts/merkleDistributor/distributorAbi.json';
import HinataTokenABI from '$constants/contracts/abis/hinataToken.json';
import HinataStakingABI from '$constants/contracts/abis/HinataStaking.json';

export const getDistributorContract = (
	distributorAddress: string,
	providerOrSigner: ethers.providers.Provider | ethers.Signer
) => {
	const distributorContract = new ethers.Contract(
		distributorAddress,
		distributorAbi,
		providerOrSigner
	);

	return distributorContract;
};

export const getHinataTokenContract = (
	providerOrSigner: ethers.providers.Provider | ethers.Signer
) => {
	const hinataTokenContract = new ethers.Contract(
		HinataTokenAddress,
		HinataTokenABI,
		providerOrSigner
	);

	return hinataTokenContract;
};

export const getStakingContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
	const hinataTokenContract = new ethers.Contract(
		stakingContract,
		HinataStakingABI,
		providerOrSigner
	);

	return hinataTokenContract;
};
