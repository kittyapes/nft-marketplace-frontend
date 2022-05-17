// In a node.js environment
import { connectionDetails } from '$stores/wallet';
import { makeHttps } from '$utils/ipfs';
import axios from 'axios';
import { get, writable } from 'svelte/store';

const getCorrectChain = () => {
	let network:
		| 'eth'
		| '0x1'
		| 'ropsten'
		| '0x3'
		| 'rinkeby'
		| '0x4'
		| 'goerli'
		| '0x5'
		| 'kovan'
		| '0x2a'
		| 'polygon'
		| '0x89'
		| 'mumbai'
		| '0x13881'
		| 'bsc'
		| '0x38'
		| 'bsc testnet'
		| '0x61'
		| '0xfa' = 'eth';

	switch (get(connectionDetails)?.chainId) {
		case 1:
			network = 'eth';
			break;

		case 4:
			network = 'rinkeby';
			break;

		case 42:
			network = 'kovan';
			break;

		case 56:
			network = 'bsc';
			break;

		case 3:
			network = 'ropsten';
			break;

		case 420:
			network = 'goerli';
			break;

		case 137:
			network = 'polygon';
			break;

		case 80001:
			network = 'mumbai';
			break;

		case 97:
			network = 'bsc testnet';
			break;

		default:
			network = 'eth';
			break;
	}

	return network;
};

export default async (address: string) => {
	try {
		// Get Moralis
		//const Moralis = getMoralis();

		type Options = {
			chain?:
				| 'eth'
				| '0x1'
				| 'ropsten'
				| '0x3'
				| 'rinkeby'
				| '0x4'
				| 'goerli'
				| '0x5'
				| 'kovan'
				| '0x2a'
				| 'polygon'
				| '0x89'
				| 'mumbai'
				| '0x13881'
				| 'bsc'
				| '0x38'
				| 'bsc testnet'
				| '0x61'
				| '0xfa';
			format?: 'decimal' | 'hex';
			offset?: number;
			limit?: number;
			token_addresses?: string[];
			userAddress: string;
		};

		const options: Options = { chain: getCorrectChain(), userAddress: address };
		//const ethereumNfts = await Moralis.Web3API.account.getNFTs(options);

		interface MoralisUserNftResult {
			success: boolean;
			message: string;
			data: {
				total: number;
				page: number;
				page_size: number;
				cursor: string;
				status: string;
				result: MoralisNft[];
			};
		}

		const userNfts = await axios
			.post('https://moralis-resolver.vercel.app/api/nfts/user', options)
			.then((res: { data: MoralisUserNftResult }) => res.data.data)
			.catch((err) => ({ result: [] }));

		// Parse the metadata object to get the nft image.
		// That is metadata.animation_url or metadata.image. We need to try with other types of nfts from different collections to make sure we cover the data expected from the urls
		userNfts.result.map(async (item) => {
			item.metadata = JSON.parse(item.metadata);

			// Prepare store for fetched data so we can load asynchronously
			item.token_uri_data = writable(null);

			// Fix IPFS protocol
			if (item.metadata) {
				item.metadata.image = makeHttps(item.metadata.image);
				item.metadata.animation_url = makeHttps(item.metadata.animation_url);
			}

			return item;
		});

		return userNfts;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to process request');
	}
};
