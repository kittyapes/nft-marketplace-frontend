import { getApiUrl } from '$utils/api';
import { fetchProfileData } from '$utils/api/profile';
import { contractGetAuctionBid } from '$utils/contracts/auction';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { formatEther } from 'ethers/lib/utils.js';

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

	console.log(highestBid);

	return highestBid;
}

export async function getBiddingsFlow(listingId: string): Promise<BidRow[]> {
	const highestBid = await fetchHighestBid(listingId);

	if (highestBid.address === '0x0000000000000000000000000000000000000000') {
		return [];
	}

	const highestBidUser = await fetchProfileData(highestBid.address);

	console.log({ highestBidUser });

	const biddings: BidRow[] = [];

	biddings.push({
		bidderName: highestBidUser.username,
		imageUrl: highestBidUser.thumbnailUrl,
		tokenAmount: formatEther(highestBid.amount),
		timeAgo: 'N/A'
	});

	const res = await axios.get(getApiUrl('latest', 'listings/' + listingId + '/bids'));
	const apiBids = res.data.data;

	biddings.push(
		...apiBids.map((bid) => ({
			bidderName: bid.user[0].username,
			imageUrl: bid.user[0].thumbnailUrl,
			tokenAmount: formatEther(bid.bid),
			timeAgo: (dayjs.duration(dayjs().diff(dayjs(bid.queueDate), 's'), 's').humanize() + ' ago').replace('a few seconds ago', 'now')
		}))
	);

	return biddings;
}
