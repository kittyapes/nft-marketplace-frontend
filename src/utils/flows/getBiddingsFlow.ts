import { getApiUrl } from '$utils/api';
import { scientificToDecimal } from '$utils/misc/scientificToDecimal';
import { notifyError } from '$utils/toast';
import axios, { type AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export interface BidRow {
	bidderName: string;
	bidderAddress: string;
	imageUrl: string;
	tokenAmount: string;
	timeAgo: string;
}

export async function getBiddingsFlow(listingId: string): Promise<BidRow[]> {
	let res: AxiosResponse;

	try {
		res = await axios.get(getApiUrl('latest', 'listings/' + listingId + '/bids'));
	} catch (err) {
		console.error(err);
		notifyError('Something went wrong while trying to refresh bids.');

		return [];
	}

	const bids = res.data.data as any[];

	const adaptedBids = bids.map((bid) => ({
		bidderName: bid.user?.username,
		bidderAddress: bid.bidder,
		imageUrl: bid.user?.thumbnailUrl,
		tokenAmount: scientificToDecimal(bid.formatBid),
		timeAgo: dayjs
			.duration(dayjs(bid.bidAt * 1000).diff(dayjs(), 's'), 's')
			.humanize(true)
			.replace('a few seconds ago', 'now')
			.replace('minutes', 'm'),
	}));

	return adaptedBids;
}
