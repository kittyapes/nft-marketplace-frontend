import type { EthAddress } from '$interfaces';
import { postCreateListing, type ListingType } from '$utils/api/listing';
import { contractCreateListing, LISTING_TYPE } from '$utils/contracts/listing';
import { notifyError, notifySuccess } from '$utils/toast';
import type { BigNumber } from 'ethers';

interface SaleListOptions {
	nfts: { nftId: string; amount: number }[];
	paymentTokenAddress: EthAddress;
	paymentTokenTicker: string;
	title: string;
	description: string;
	price: BigNumber;
	quantity: BigNumber;

	/** Unix timestamp of when the listing will show up on the marketplace. */
	startTime: number;

	/** Sale duration in seconds. */
	duration: number;
}

export async function saleList(options: SaleListOptions) {
	// Set the listing type to sale.
	const options_: SaleListOptions & { listingType: ListingType } = { ...options, listingType: 'sale' };

	// Create listing on the server
	const { err, res } = await postCreateListing(options_);

	if (err) {
		console.error(err);
		notifyError('Server request failed.');
		return { err };
	}

	const listingId = res.data.data.listingId;
	console.debug('[Listing] Will create listing on chain with id: ' + listingId);

	console.log(options.nfts);

	// Create listing on chain
	const tokenIds = options.nfts.map((nft) => nft.nftId);
	const tokenAmounts = options.nfts.map((nft) => nft.amount);

	try {
		await contractCreateListing({
			payToken: options.paymentTokenAddress,
			listingId: listingId,
			listingType: LISTING_TYPE.FIXED_PRICE,
			startingPrice: options.price.toString(),
			startTime: options.startTime,
			duration: options.duration,
			tokenIds,
			tokenAmounts,
			quantity: 1
		});
	} catch (err) {
		return { err: new Error(err.error.message) };
	}

	notifySuccess('Successfully created a listing.');

	return { success: true };
}
