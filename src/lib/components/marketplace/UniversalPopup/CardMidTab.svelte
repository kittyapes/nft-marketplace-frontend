<script lang="ts">
	import CardMidRow from './CardMidRow.svelte';
	import { fade } from 'svelte/transition';

	export let rowInfo: PopupRowInfo[] = undefined;
    export let crossOld = false;
	export let bold = false;
</script>

<div in:fade={{ duration: 300 }} class="flex-grow h-auto flex-shrink overflow-y-scroll tab-content">
	<slot name='mid-tab-row'>
		{#each rowInfo as row}
			<CardMidRow {row} {bold} first={row.id === 0 || !crossOld}/>
		{/each}
	</slot>
</div>

<style type='postcss'>
	.tab-content {
		-ms-overflow-style: none;  /* Internet Explorer 10+ */
		scrollbar-width: none;  /* Firefox */
	}
	.tab-content::-webkit-scrollbar { 
		display: none;  /* Safari and Chrome */
	}
	
</style>