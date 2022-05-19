// In a node.js environment
import { connectionDetails, currentUserAddress } from '$stores/wallet';
import { makeHttps } from '$utils/ipfs';
import axios from 'axios';
import { get, writable } from 'svelte/store';

interface CachedNfts {
	total: number;
	page: number;
	page_size: number;
	cursor: string;
	status: string;
	result: MoralisNft[];
	cachedOn: number;
}

const fetchCacheResultsLocally = (userAddress: string) => {
	try {
		const pastUserResponses = JSON.parse(localStorage.getItem('cachedUserNfts')); // parse might fail (prepare to catch)
		if (pastUserResponses[userAddress.toLowerCase()]) {
			return pastUserResponses;
		} else {
			return {
				...pastUserResponses,
				[userAddress.toLowerCase()]: {
					total: 0,
					page: 0,
					page_size: 0,
					cursor: '',
					status: '',
					result: [],
					cachedOn: 0 // initially 0 so every date check will pass to ensure the data is added the first time
				}
			};
		}
	} catch {
		return {
			[userAddress.toLowerCase()]: {
				total: 0,
				page: 0,
				page_size: 0,
				cursor: '',
				status: '',
				result: [],
				cachedOn: 0 // initially 0 so every date check will pass to ensure the data is added the first time
			}
		};
	}
};

const cacheResultsLocally = (userAddress: string, data: { total: number; page: number; page_size: number; cursor: string; status: string; result: MoralisNft[] }) => {
	const pastResults: CachedNfts = fetchCacheResultsLocally(userAddress);

	data.result.map((item) => {
		if (
			!pastResults[userAddress.toLowerCase()].result.find(
				(dataItem) => dataItem.token_address.toLowerCase() === item.token_address.toLowerCase() && dataItem.token_id.toLowerCase() === item.token_id.toLowerCase()
			)
		) {
			pastResults[userAddress.toLowerCase()].result.push(item);
		}

		return item;
	});

	if (data.total !== pastResults[userAddress.toLowerCase()].result.length) {
		pastResults[userAddress.toLowerCase()].total = data.total;
	} else {
		// Set the timestamp of when the cache was made to udpate this after every week - only add date once everything has been added
		pastResults[userAddress.toLowerCase()].total = data.total;
		pastResults[userAddress.toLowerCase()] = { ...pastResults[userAddress.toLowerCase()], cachedOn: Date.now() };
	}

	localStorage.setItem('cachedUserNfts', JSON.stringify(pastResults));
};

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

export default async (address: string, page = 1, limit = 10) => {
	try {
		// Fetch the current local storage store - if there are no NFTs continue, if there are some NFTs, check the date to confirm its one week past or zero before continuing
		const allNfts = fetchCacheResultsLocally(address);
		const cachedNfts: CachedNfts = allNfts[address.toLowerCase()];

		if (cachedNfts.result.length > 0 && cachedNfts.cachedOn !== 0 && cachedNfts.cachedOn + 3600 * 24 * 7 * 1000 > Date.now()) {
			return cachedNfts;
		}

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
			page?: number;
			limit?: number;
			token_addresses?: string[];
			userAddress: string;
		};

		const options: Options = { chain: get(currentUserAddress).toLowerCase() === address.toLowerCase() ? getCorrectChain() : 'eth', userAddress: address, page, limit };
		console.log('fetching page: ', page);
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

		const apiRoute = 'https://moralis-resolver.vercel.app';
		const userNfts = await axios
			.post(`${apiRoute}/api/nfts/user`, options)
			.then((res: { data: MoralisUserNftResult }) => res.data.data)
			.catch((err) => ({
				total: null,
				page: null,
				page_size: null,
				cursor: '',
				status: '',
				result: []
			}));

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

		// Cache what we get
		cacheResultsLocally(address, userNfts);

		return userNfts;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to process request');
	}
};
