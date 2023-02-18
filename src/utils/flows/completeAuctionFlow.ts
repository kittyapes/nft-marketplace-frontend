import type { AuctionDataModel } from '$interfaces';
import { ErrNotificationError, HandledError, handleErrActionRejected } from '$utils';
import { type Listing, getListingBids, type GetBidsRes } from '$utils/api/listing';
import contractCaller from '$utils/contracts/contractCaller';
import { listingExistsOnChain, stringListingTypeToEnum } from '$utils/listings';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import type { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';

async function completeAuctionGasless(listing: Listing): Promise<void> {
	// Get highest bid
	let getBidsRes: AxiosResponse<GetBidsRes>;

	try {
		getBidsRes = await getListingBids(listing.listingId);
	} catch (err) {
		notifyError('Failed to retrieve bids. Could not complete auction.');
	}

	const highestBid = getBidsRes.data.data[0];

	const marketplaceV2 = getContract('marketplace-v2');

	const auctionDetails = listing.listing as AuctionDataModel;
	const startTimeTs = dayjs(listing.startTime).unix();

	const callArgs = [
		{
			seller: listing.seller,
			payToken: listing.paymentTokenAddress,
			price: auctionDetails.startingPrice,
			reservePrice: auctionDetails.reservePrice,
			startTime: startTimeTs,
			duration: listing.duration,
			expireTime: listing.signatureExpiryTimestamp,
			quantity: listing.nfts[0].amount,
			listingType: stringListingTypeToEnum(listing.listingType),
			collections: listing.nfts.map((nft) => nft.contractAddress),
			tokenIds: listing.nfts.map((nft) => nft.nftId),
			tokenAmounts: listing.nfts.map((nft) => nft.amount),
		},
		{
			bidder: highestBid.bidder,
			bidAmount: BigNumber.from(highestBid.bidPrice),
		},
		listing.nonce,
		highestBid.nonce,
		listing.signature,
		highestBid.signature,
	];

	try {
		await contractCaller(marketplaceV2, 'completeAuction', 150, 1, ...callArgs);
	} catch (err) {
		if (err.message.includes('USED_SIGNATURE')) {
			throw new ErrNotificationError('Sorry, could not complete your auction. One of the signatures we tried to use was already used.', err);
		} else if (err.message.includes('ERC20: transfer amount exceeds balance')) {
			throw new ErrNotificationError('Sorry, the highest bidder no longer has the required token balance in their wallet.', err);
		} else if (err.code === 'ACTION_REJECTED') {
			throw new ErrNotificationError('Auction completion transaction rejected.', err);
		}

		throw err;
	}
}

async function completeAuctionNormal(listing: Listing) {
	if (!(await listingExistsOnChain(listing.listingId))) {
		notifyError('Failed to Accept Highest Bid: Listing is no longer valid (not on chain)');

		throw new Error('Listing does not exist on chain.');
	}

	const marketplace = getContract('marketplace');

	try {
		await contractCaller(marketplace, 'completeAuction', 150, 1, listing.listingId);
	} catch (err) {
		handleErrActionRejected(err, 'Auction completion transaction rejected.');

		throw err;
	}
}

export async function completeAuctionFlow(listing: Listing) {
	if (listing.chainStatus === 'GASLESS') {
		await completeAuctionGasless(listing);
	} else {
		await completeAuctionNormal(listing);
	}
}
