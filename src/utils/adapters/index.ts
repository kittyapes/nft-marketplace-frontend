import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/types';
import type { ApiNftActivityHistoryEntry } from '$utils/api/nft';
import dayjs from 'dayjs';
import { capitalize } from 'lodash-es';

const friendlyEventNames: Record<string, (e: ApiNftActivityHistoryEntry) => string> = {
	LISTING_CANCELLED: (e: ApiNftActivityHistoryEntry) => (capitalize(e.detail?.listingType) || 'Listing') + ' cancelled',
	BID_RECEIVED: () => 'Bid',
	TRANSFER: () => 'Transfer',
	LISTING_CREATED: (e: ApiNftActivityHistoryEntry) => capitalize(e.detail.listingType) + ' created',
	LISTING_PURCHASED: (e: ApiNftActivityHistoryEntry) => {
		return (
			{
				sale: 'Listing purchased',
				auction: 'Auction completed',
			}[e.detail?.listingType] || 'Listing purchased'
		);
	},
};

export function toNftActivityHistoryTableRowData(from: ApiNftActivityHistoryEntry): NftActivityHistoryTableRowData {
	const friendlyDate = dayjs(from.createdAt).fromNow();

	return {
		event: friendlyEventNames[from.event]?.(from) || from.event,
		from: from.from || '',
		to: from.to || '',
		date: friendlyDate,
		price: from.price,
	};
}