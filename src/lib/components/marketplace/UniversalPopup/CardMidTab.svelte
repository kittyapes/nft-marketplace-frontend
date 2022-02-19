<script lang="ts">
	import CardMidRow from './CardMidRow.svelte';
	import { fade } from 'svelte/transition';

	export let rowInfo: PopupRowInfo[];
    export let crossOld = false;
</script>

<div in:fade={{ duration: 300 }} class="flex-grow h-auto flex-shrink overflow-y-scroll tab-content">
	{#each rowInfo as row}
		<CardMidRow {row} first={row.id === 0 && crossOld}/>
	{/each}
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