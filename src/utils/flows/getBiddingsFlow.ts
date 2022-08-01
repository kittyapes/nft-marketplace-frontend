import { getApiUrl } from '$utils/api';
import { contractGetAuctionBid } from '$utils/contracts/auction';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { BigNumber, ethers } from 'ethers';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export interface BidRow {
	bidderName: string;
	imageUrl: string;
	tokenAmount: string;
	timeAgo: string;
}

async function fetchHighestBid(listingId: string) {
	const { err, res } = await contractGetAuctionBid(listingId);

	if (err) {
		console.error(err);
		return;
	}

	const highestBid = { address: res[0], amount: res[1] };

	return highestBid;
}

async function _fetchBiddings(listingId: string, tokenDecimals: number) {
	const res = await axios.get(getApiUrl('latest', 'listings/' + listingId + '/bids'));
	const bids = res.data.data as any[];

	let longestString = 0;

	// A hotfix for accumulating the bid amounts, because the contract emits only the differences
	// and the backend returns only them, not accumulated
	for (const [index, bid] of bids.entries()) {
		bid.accumulated = BigNumber.from(bid.bid);

		for (let i = index + 1; bids[i] && bids[i].bidder === bid.bidder; i++) {
			bid.accumulated = bid.accumulated.add(bids[i].bid);
		}

		bid.formatted = ethers.utils.formatUnits(bid.accumulated, tokenDecimals);

		longestString = Math.max(longestString, bid.formatted.length);
	}

	const adaptedBids = bids.map((bid) => ({
		bidderName: bid.user.username,
		imageUrl: bid.user.thumbnailUrl,
		tokenAmount: bid.formatted.padEnd(longestString, '0'),
		timeAgo: dayjs
			.duration(dayjs(bid.bidAt * 1000).diff(dayjs(), 's'), 's')
			.humanize(true)
			.replace('a few seconds ago', 'now')
			.replace('minutes', 'm')
	}));

	return adaptedBids;
}

export async function getBiddingsFlow(listingId: string, tokenDecimals: number): Promise<BidRow[]> {
	try {
		return await _fetchBiddings(listingId, tokenDecimals);
	} catch (err) {
		console.error(err);
		notifyError('Something went wrong while trying to refresh bids.');

		return [];
	}
}
