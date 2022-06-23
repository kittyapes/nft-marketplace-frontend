import { HinataMarketplaceContractAddress } from '$constants/contractAddresses';
import { ethers } from 'ethers';
import HinataMarketplaceAbi from '$constants/contracts/abis/HinataMarketplace.json';

const HinataMarketplaceContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
	const contract = new ethers.Contract(HinataMarketplaceContractAddress, HinataMarketplaceAbi, providerOrSigner || ethers.getDefaultProvider());

	return contract;
};

export default HinataMarketplaceContract;
