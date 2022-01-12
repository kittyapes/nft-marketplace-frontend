// In a node.js environment
import { getMoralis } from '$utils/moralisFuncs';

export const get = async ({ params }) => {
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

		const options: Options = { chain: 'eth', address: params.address };
		const ethereumNfts = await Moralis.Web3API.account.getNFTs(options);

		return {
			body: ethereumNfts
		};
	} catch (error) {
		throw new Error('Failed to process request');
	}
};
