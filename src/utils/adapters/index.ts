import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/types';
import type { ApiNftActivityHistoryEntry } from '$utils/api/nft';

export function toNftActivityHistoryTableRowData(from: ApiNftActivityHistoryEntry): NftActivityHistoryTableRowData {
	return {
		event: from.event,
		from: from.from,
		to: from.to,
		date: from.createdAt,
		price: null,
	};
}
