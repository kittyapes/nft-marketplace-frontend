import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable';
import type { ApiNftActivityHistoryEntry } from '$utils/api/nft';
import dayjs from 'dayjs';
import { capitalize } from 'lodash-es';

const friendlyEventNames: Record<string, (e: ApiNftActivityHistoryEntry) => string> = {
	LISTING_CANCELLED: (e: ApiNftActivityHistoryEntry) =>
		(capitalize(e.detail?.listingType) || 'Listing') + ' Cancelled',
	BID_RECEIVED: () => 'Bid',
	TRANSFER: () => 'Transfer',
	LISTING_CREATED: (e: ApiNftActivityHistoryEntry) => capitalize(e.detail.listingType) + ' Created',
	LISTING_PURCHASED: (e: ApiNftActivityHistoryEntry) => {
		return (
			{
				sale: 'Sale Purchased',
				auction: 'Auction Completed',
			}[e.detail?.listingType] || 'Listing Purchased'
		);
	},
	OFFER_ACCEPTED: () => 'Offer Accepted',
	OFFER_RECEIVED: () => 'Offer',
	MINTED: () => 'Mint',
	BURNED: () => 'Burn',
};

export function toNftActivityHistoryTableRowData(
	from: ApiNftActivityHistoryEntry,
): NftActivityHistoryTableRowData {
	const friendlyDate = dayjs(from.createdAt).fromNow();

	return {
		event: friendlyEventNames[from.event]?.(from) || from.event,
		from: from.from || '',
		to: from.to || '',
		date: friendlyDate,
		price: from.price,
	};
}
