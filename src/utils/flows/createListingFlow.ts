import type { EthAddress } from '$interfaces';
import type { ConfigurableListingProps } from '$interfaces/listing';
import { appSigner, currentUserAddress } from '$stores/wallet';
import { getApiUrl } from '$utils/api';
import type { ListingType } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { getCollectionContract } from '$utils/contracts/collection';
import contractCaller from '$utils/contracts/contractCaller';
import type { LISTING_TYPE } from '$utils/contracts/listing';
import { stringListingTypeToEnum } from '$utils/listings';
import { getContract } from '$utils/misc/getContract';
import { parseToken } from '$utils/misc/priceUtils';
import { notifyError, notifySuccess } from '$utils/toast';
import axios from 'axios';
import dayjs from 'dayjs';
import { BigNumber, ethers } from 'ethers';
import { get } from 'svelte/store';

interface CreateNormalArgs {
	id: ethers.BigNumber;
	seller: string;
	payToken: string;
	price: ethers.BigNumber;
	reservePrice: ethers.BigNumber;
	startTime: number;
	duration: BigNumber;
	quantity: BigNumber;
	listingType: LISTING_TYPE;

	/* ETH addresses of collections from which the listings contain NFTs. */
	collections: string[];

	/* On chain token IDs */
	tokenIds: BigNumber[];
	tokenAmounts: BigNumber[];
}

const GASLESS_CREATE_LISTING_TYPES = {
	Listing: [
		{ name: 'seller', type: 'address' },
		{ name: 'payToken', type: 'address' },
		{ name: 'price', type: 'uint128' },
		{ name: 'reservePrice', type: 'uint128' },
		{ name: 'startTime', type: 'uint64' },
		{ name: 'duration', type: 'uint64' },
		{ name: 'expireTime', type: 'uint64' },
		{ name: 'quantity', type: 'uint64' },
		{ name: 'listingType', type: 'uint8' },
		{ name: 'collections', type: 'address[]' },
		{ name: 'tokenIds', type: 'uint256[]' },
		{ name: 'tokenAmounts', type: 'uint256[]' },
		{ name: 'nonce', type: 'uint256' },
	],
};

async function getGaslessListingSignature(
	seller: ethers.Signer,
	payTokenAddress: string,
	price: BigNumber,
	reservePrice: BigNumber,
	startTime: number,
	duration: BigNumber,
	expireTime: number,
	quantity: BigNumber,
	listingType: LISTING_TYPE,
	collections: string[],
	tokenIds: BigNumber[],
	tokenAmounts: BigNumber[],
	nonce: BigNumber,
) {
	const value = {
		seller: await seller.getAddress(),
		payToken: payTokenAddress,
		price,
		reservePrice,
		startTime,
		duration,
		expireTime,
		quantity,
		listingType,
		collections,
		tokenIds,
		tokenAmounts,
		nonce,
	};

	return await (seller as any)._signTypedData(
		{
			name: 'HinataMarketV2',
			version: '1.0',
			chainId: await seller.getChainId(),
			verifyingContract: getContract('marketplace-v2').address,
		},
		GASLESS_CREATE_LISTING_TYPES,
		value,
	);
}

export interface CreateListingFlowOptions extends Partial<ConfigurableListingProps> {
	gasless: boolean;
	nfts: { nftId: string; collectionAddress: EthAddress; amount: number; _id: string }[];
	paymentTokenAddress: EthAddress;
	paymentTokenTicker: string;
	title: string;
	description: string;
	listingType: ListingType;
}

export async function createListingFlow(options: CreateListingFlowOptions) {
	// Parse some stuff
	const seller = get(currentUserAddress);
	const payTokenAddress = options.paymentTokenAddress;
	const price = parseToken(options.price || options.startingPrice || '0', payTokenAddress);
	const reservePrice = parseToken(
		options.reservePrice || options.startingPrice || options.price || '0',
		payTokenAddress,
	);
	const startTime = options.startDateTs || dayjs().unix();
	const duration = ethers.BigNumber.from(options.durationSeconds);
	const tokenIds = options.nfts.map((nft) => ethers.BigNumber.from(nft.nftId));
	const tokenAmounts = options.nfts.map((nft) => ethers.BigNumber.from(nft.amount));
	const collectionAddresses = options.nfts.map((nft) => nft.collectionAddress);
	const quantity = ethers.BigNumber.from(tokenAmounts[0]);
	const signatureExpiryTimestamp = dayjs().unix() + 180 * 24 * 60 * 60; // 180 days from now
	const nfts = options.nfts.map((nft) => ({
		nftId: nft.nftId,
		amount: nft.amount,
		contractAddress: nft.collectionAddress,
	}));

	// Create listing on the server
	const formData = new FormData();

	const fields = {
		nfts: JSON.stringify(nfts),
		title: options.title || 'No Title',
		paymentTokenAddress: options.paymentTokenAddress,
		paymentTokenTicker: 'ETH', // hotfix options.paymentTokenTicker,
		description: options.description || 'No Description',
		listingType: options.listingType,
		duration: options.durationSeconds.toString(),
	};

	fields['startTime'] = startTime;

	const listing = {};

	// Sale specific
	if (options.listingType === 'sale') {
		listing['price'] = price.toString();
		listing['quantity'] = quantity.toString();
	}

	// Auction specific
	if (options.listingType === 'auction') {
		listing['startingPrice'] = price.toString();
		listing['reservePrice'] = reservePrice.toString();
	}

	// Append listing to formData
	fields['listing'] = JSON.stringify(listing);

	// Build formData
	for (const [key, value] of Object.entries(fields)) {
		formData.append(key, value);
	}

	// Listing type on chain is represented with a number
	const listingTypeEnumValue = stringListingTypeToEnum(options.listingType);

	// Approve v1 or v2 marketplace contract to manipulate NFTs from collection
	const collectionContract = await getCollectionContract(options.nfts[0].collectionAddress);

	const marketplaceContract = options.gasless
		? getContract('marketplace-v2')
		: getContract('marketplace');
	const isApproved = await collectionContract.isApprovedForAll(
		get(currentUserAddress),
		marketplaceContract.address,
	);

	if (!isApproved) {
		const approval: ethers.ContractTransaction = await collectionContract.setApprovalForAll(
			marketplaceContract.address,
			true,
		);
		await approval.wait(1);
	}

	// Gasless listing
	if (options.gasless) {
		// Get unused nonce
		const nonceRes = await axios.get(
			getApiUrl(null, '/gasless-listings/nonce'),
			await getAxiosConfig(),
		);

		const nonceBigNumber = BigNumber.from(nonceRes.data.data);

		const signer = get(appSigner);

		let signature: string;

		// Get signature from user
		try {
			signature = await getGaslessListingSignature(
				signer,
				payTokenAddress,
				price,
				reservePrice,
				startTime,
				duration,
				signatureExpiryTimestamp,
				quantity,
				listingTypeEnumValue,
				collectionAddresses,
				tokenIds,
				tokenAmounts,
				nonceBigNumber,
			);
		} catch (err) {
			if (err.code === 'ACTION_REJECTED') {
				notifyError('Could not create gasless listing. You have rejected to sign the message.');

				return { error: err, handled: true };
			}

			throw err;
		}

		// Append signature to form-data
		formData.append('signature', signature);
		formData.append('nonce', nonceBigNumber.toString());
		formData.append('signatureExpiryTimestamp', signatureExpiryTimestamp.toString());

		await axios.post(getApiUrl('latest', 'gasless-listings'), formData, await getAxiosConfig());
	}

	// Normal listing
	else {
		// For normal, first call API to get new listingId and then use that in the contract call
		const res = await axios.post(getApiUrl('latest', 'listings'), formData, await getAxiosConfig());
		const listingId = res.data.data.listingId;

		const args: CreateNormalArgs = {
			id: ethers.BigNumber.from(listingId),
			seller,
			payToken: payTokenAddress,
			price,
			reservePrice,
			startTime,
			duration,
			quantity,
			listingType: listingTypeEnumValue,
			collections: collectionAddresses,
			tokenIds,
			tokenAmounts,
		};

		console.debug(
			'[Info] Will call createListing on contract with the following parameters.',
			args,
		);

		try {
			await contractCaller(marketplaceContract, 'createListing', 150, 1, args);
		} catch (err) {
			// Handle user rejecting transaction
			if (err.code === 'ACTION_REJECTED') {
				notifyError('You have rejected the transaction. Your listing could not be created.');
				return { error: err, handled: true };
			}

			// Handle ERC1155 insufficient balance
			if (err.message.includes('ERC1155: insufficient balance')) {
				notifyError(
					'Could not create listing. You do not own this NFT or the NFT has already been listed.',
				);
				return { error: err, handled: true };
			}

			throw err;
		}
	}

	notifySuccess('Successfully created a listing.');
}
