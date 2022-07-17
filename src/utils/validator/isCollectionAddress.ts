import { appProvider } from '$stores/wallet';
import { getContractInterface } from '$utils/contracts/collection';
import { get } from 'svelte/store';
import { isContractAddress } from './isContractAddress';

export default async function (address: string) {
	try {
		// check if contract address
		const is_contract = await isContractAddress(address).catch(() => false);

		// check if erc1155
		// check if erc721
		const contract_interface = await getContractInterface(address, get(appProvider));

		if (is_contract) {
			return {
				isContract: true,
				isErc721: contract_interface === 'ERC721',
				isErc1155: contract_interface === 'ERC1155'
			};
		} else {
			return {
				isContract: false,
				isErc721: false,
				isErc1155: false
			};
		}
	} catch (error) {
		return {
			isContract: false,
			isErc721: false,
			isErc1155: false
		};
	}
}
