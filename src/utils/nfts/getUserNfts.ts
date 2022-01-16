// In a node.js environment
import { getMoralis } from '$utils/moralisFuncs';
import axios from 'axios';

export default async (address: string) => {
	try {
		// Get Moralis
		const Moralis = getMoralis();

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
			address: string;
		};

		const options: Options = { chain: 'eth', address: address };
		const ethereumNfts = await Moralis.Web3API.account.getNFTs(options);

		// Parse the metadata object to get the nft image.
		// That is metadata.animation_url or metadata.image. We need to try with other types of nfts from different collections to make sure we cover the data expected from the urls
		ethereumNfts.result.map((item) => {
			item.metadata = JSON.parse(item.metadata);
			return item;
		});

		return ethereumNfts;
	} catch (error) {
		throw new Error('Failed to process request');
	}
};
