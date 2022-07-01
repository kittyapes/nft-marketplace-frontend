import { HinataCollectionFactoryContractAddress } from '$constants/contractAddresses';
import { ethers } from 'ethers';
import HinataCollectionFactory from '$constants/contracts/abis/HinataCollectionFactory.json';

const HinataCollectionFactoryContract= (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
	const contract = new ethers.Contract(HinataCollectionFactoryContractAddress, HinataCollectionFactory , providerOrSigner || ethers.getDefaultProvider());
	return contract;
};

export default HinataCollectionFactoryContract;
