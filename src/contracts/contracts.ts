import { ethers } from 'ethers';
import { merkleDistributorContractAddress } from '$constants/contractAddresses';
import distributorAbi from '$contracts/merkleDistributor/distributorAbi.json';

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
