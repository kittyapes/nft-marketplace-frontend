import contractCaller from './contractCaller';
import { ethers } from 'ethers';
import { getContract } from '$utils/misc/getContract';
import { get } from 'svelte/store';
import { appSigner } from '$stores/wallet';
import erc1155Abi from '$constants/contracts/abis/Erc1155Mock.json';
import erc721Abi from '$constants/contracts/abis/Erc721Mock.json';
import storageAbi from '$constants/contracts/abis/HinataMarketplaceStorage.json';

export async function contractCreateCollection(options: {
	royalties: {
		fees: string | number;
		address: string;
		createdAt?: string;
	}[];
	name: string;
	paymentTokenTicker: string;
	slug: string;
}) {
	const contract = getContract('factory');
	options.royalties = options.royalties.filter((item) => item.fees && item.address);

	const res = await contractCaller(
		contract,
		'create',
		150,
		1,
		options.name,
		options.paymentTokenTicker,
		options.royalties.length > 0 ? options.royalties.map((item) => item.address) : ['0x0000000000000000000000000000000000000000'],
		options.royalties.length > 0 ? options.royalties.map((item) => ethers.utils.parseUnits(item.fees.toString(), 2)) : [ethers.utils.parseUnits('0', 2)],
		false,
	);

	return { contractAddress: res.events[0].args[2] };
}

export async function getContractInterface(address: string, provider: ethers.Signer | ethers.providers.Provider) {
	const ERC165Abi: any = [
		{
			inputs: [
				{
					internalType: 'bytes4',
					name: 'interfaceId',
					type: 'bytes4',
				},
			],
			name: 'supportsInterface',
			outputs: [
				{
					internalType: 'bool',
					name: '',
					type: 'bool',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
	];
	const ERC1155InterfaceId = '0xd9b67a26';
	const ERC721InterfaceId = '0x80ac58cd';

	if (!provider) {
		provider = ethers.getDefaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK);
	}

	const contract = new ethers.Contract(address, ERC165Abi, provider);
	try {
		if (!provider) {
			throw 'No Provider Supplied';
		}
		const isErc1155 = await contract.supportsInterface(ERC1155InterfaceId);
		const isErc721 = await contract.supportsInterface(ERC721InterfaceId);
		if (isErc1155) {
			return 'ERC1155';
		} else if (isErc721) {
			return 'ERC721';
		} else {
			throw 'No Provider Supplied';
		}
	} catch (error) {
		return 'UNKNOWN';
	}
}

export async function getCollectionContract(address: string) {
	const storageAddress = getContract('storage')?.address;
	address = address ?? storageAddress;
	const contractType = await getContractInterface(address, get(appSigner));
	const contractAbi = address === storageAddress ? storageAbi : contractType === 'ERC721' ? erc721Abi : erc1155Abi;
	const contract = new ethers.Contract(address, contractAbi, get(appSigner));

	return contract;
}
