import { appProvider } from '$stores/wallet';
import { getContractInterface } from '$utils/contracts/collection';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import { isContractAddress } from './isContractAddress';

export default async function (address: string, networkId?: number) {
	// In some cases we may wanna specify the network ID, here we decide which app provider to use
	// based on whether a network ID is provided or not
	let provider: ethers.providers.BaseProvider;

	if (networkId !== undefined) {
		provider = ethers.getDefaultProvider(networkId);
	} else {
		// Checks mainnet by default if no wallet is connected
		provider = get(appProvider) ?? ethers.getDefaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK);
	}

	try {
		// check if contract address
		const is_contract = await isContractAddress(address, provider).catch(() => false);

		// check if erc1155
		// check if erc721
		const contract_interface = await getContractInterface(address, provider);

		if (is_contract) {
			return {
				isContract: true,
				isErc721: contract_interface === 'ERC721',
				isErc1155: contract_interface === 'ERC1155',
			};
		} else {
			return {
				isContract: false,
				isErc721: false,
				isErc1155: false,
			};
		}
	} catch (error) {
		return {
			isContract: false,
			isErc721: false,
			isErc1155: false,
		};
	}
}
