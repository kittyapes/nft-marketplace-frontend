import { HinataMarketplaceContractAddress, HinataMarketplaceStorageContractAddress } from '$constants/contractAddresses';
import { ethers } from 'ethers';
import HinataMarketplaceStorageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';

const HinataMarketplaceStorageContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
	const contract = new ethers.Contract(
		HinataMarketplaceStorageContractAddress,
		HinataMarketplaceStorageAbi,
		providerOrSigner || ethers.getDefaultProvider()
	);

	return contract;
};

export default HinataMarketplaceStorageContract;