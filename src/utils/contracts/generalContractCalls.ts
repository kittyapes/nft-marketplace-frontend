import { ethers } from 'ethers';
import { HinataTokenAddress, merkleDistributorContractAddress } from '$constants/contractAddresses';
import distributorAbi from '$constants/contracts/merkleDistributor/distributorAbi.json';
import HinataTokenABI from '$constants/contracts/abis/hinataToken.json';

export const getDistributorContract = (
	providerOrSigner: ethers.providers.Provider | ethers.Signer
) => {
	const distributorContract = new ethers.Contract(
		merkleDistributorContractAddress,
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
