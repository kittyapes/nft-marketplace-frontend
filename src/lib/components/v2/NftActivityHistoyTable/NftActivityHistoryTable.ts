export type NftActivityHistoryTableRowData = { event: string; price: string; from: string; to: string; date: string };

export function getMockData(): NftActivityHistoryTableRowData[] {
	return new Array(50).fill({
		event: 'Transfer',
		price: '1',
		from: '0x000000000000000000000000000',
		to: '0x0000000000000000000000',
		date: '1 min',
	} as NftActivityHistoryTableRowData);
}
