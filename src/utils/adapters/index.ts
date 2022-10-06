import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/types';
import type { ApiNftActivityHistoryEntry } from '$utils/api/nft';
import dayjs from 'dayjs';

const friendlyEventNames = {
	LISTING_CANCELLED: 'Unlisted',
	BID_RECEIVED: 'Bid',
	TRANSFER: 'Transfer',
	LISTING_CREATED: 'Listed',
};

export function toNftActivityHistoryTableRowData(from: ApiNftActivityHistoryEntry): NftActivityHistoryTableRowData {
	console.log(from);

	const friendlyDate = dayjs(from.createdAt).fromNow();

	return {
		event: friendlyEventNames[from.event] || from.event,
		from: from.from || '',
		to: from.to || '',
		date: friendlyDate,
		price: from.price,
	};
}
