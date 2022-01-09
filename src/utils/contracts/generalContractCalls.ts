import { ethers } from 'ethers';
import { HinataTokenAddress } from '$constants/contractAddresses';
import distributorAbi from '$constants/contracts/merkleDistributor/distributorAbi.json';
import HinataTokenABI from '$constants/contracts/abis/hinataToken.json';

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
