import { fetchProfileData } from '$utils/api/profile';
import { contractGetAuctionBid } from '$utils/contracts/auction';
import { formatEther } from 'ethers/lib/utils.js';

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

	return biddings;
}
