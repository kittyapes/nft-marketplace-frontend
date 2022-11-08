import { ethers } from 'ethers';
import erc1155abi from '$constants/contracts/abis/erc1155.json';
import erc721abi from '$constants/contracts/abis/Erc721Mock.json';
import { appProvider } from '$stores/wallet';
import { get } from 'svelte/store';
import { getContractInterface } from '$utils/contracts/collection';
import axios from 'axios';
import defaultProvider from '$utils/contracts/defaultProvider';

export function makeHttps(url: string) {
	if (!url) return null;

	if (url.startsWith('https://') || url.startsWith('http://')) {
		return url;
	}

	return url.replace(/^ipfs:\/\//, 'https://hinata-prod.mypinata.cloud/ipfs/');
}

export async function getMetadataFromUri(uri: string) {
	return axios
		.get(makeHttps(uri))
		.then((res) => res.data)
		.catch((_err) => null);
}

export async function getOnChainUri(contractAddress: string, tokenId: string) {
	try {
		const provider = get(appProvider) || defaultProvider(+import.meta.env.VITE_DEFAULT_NETWORK);

		const tokenType = await getContractInterface(contractAddress, provider);

		if (tokenType === 'UNKNOWN') {
			return '';
		}

		const contract = new ethers.Contract(contractAddress, tokenType === 'ERC1155' ? erc1155abi : erc721abi, provider);

		const uri: string = tokenType === 'ERC1155' ? await contract.uri(tokenId) : await contract.tokenURI(tokenId);

		if (!(uri.startsWith('https://') || uri.startsWith('http://'))) {
			return '';
		}

		// fetch metadata
		return uri;
	} catch (error) {
		console.log(error);

		return '';
	}
}
