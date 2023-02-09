<script lang="ts">
	import NftActivityHistoryTable from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable.svelte';
	import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable';

	const data: NftActivityHistoryTableRowData[] = new Array(20).fill(0).map((i, index) => ({
		event: 'Event ' + index,
		price: index + '.' + index,
		from: '0x' + i.toString().repeat(32),
		to: '0x' + (i + 1).toString().repeat(32),
		date: i + ' mins ago',
	}));

	let skeleton = false;
	let displayEndReachedMsg = false;
	let reachedEndCounter = 0;

	function handleReachedEnd() {
		reachedEndCounter++;
	}
</script>

<button on:click={() => (skeleton = !skeleton)}>Toogle skeleton</button>
<button on:click={() => (displayEndReachedMsg = !displayEndReachedMsg)}>Toogle reached end message</button>

<div>Reached end: {reachedEndCounter}</div>

<div class="h-[400px]">
	<NftActivityHistoryTable {data} {skeleton} {displayEndReachedMsg} on:end-reached={handleReachedEnd} />
</div>
