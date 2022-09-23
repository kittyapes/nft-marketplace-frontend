<script lang="ts">
	import NftActivityHistoryTable from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable.svelte';
	import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/types';

	const data: NftActivityHistoryTableRowData[] = new Array(20).fill(0).map((i, index) => ({
		event: 'Event ' + index,
		price: index + '.' + index,
		from: '0x' + i.toString().repeat(32),
		to: '0x' + (i + 1).toString().repeat(32),
		date: i + ' mins ago',
	}));
</script>

<div class="h-[400px]">
	<NftActivityHistoryTable {data} />
</div>
