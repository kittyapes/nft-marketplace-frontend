import { ethers } from 'ethers';
import { stakingContract } from '$constants/contractAddresses';
import distributorAbi from '$constants/contracts/merkleDistributor/distributorAbi.json';
import HinataStakingABI from '$constants/contracts/abis/HinataStaking.json';
import Erc20MockABI from '$constants/contracts/abis/Erc20Mock.json';

export const getDistributorContract = (distributorAddress: string, providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
	const distributorContract = new ethers.Contract(distributorAddress, distributorAbi, providerOrSigner);

	return distributorContract;
};

export const getStakingContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
	const hinataTokenContract = new ethers.Contract(stakingContract, HinataStakingABI, providerOrSigner);

	return hinataTokenContract;
};

export const getMockErc20TokenContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer, tokenAddress: string) => {
	const erc20Contract = new ethers.Contract(tokenAddress, Erc20MockABI, providerOrSigner);

	return erc20Contract;
};
