<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let filterOptions = ['All', 'Buy Now', 'Live Auction', 'Not for sale'];
	export let statusFilter = filterOptions[0];
</script>

<div class="flex flex-row flex-wrap items-center gap-x-5 2xl:gap-x-6 gap-y-4 2xl:gap-y-5">
	{#each filterOptions as option}
		<button
			type="button"
			on:click={() => (statusFilter = option)}
			class="px-4 2xl:px-6 py-2 2xl:py-2.5 font-medium text-sm 2xl:text-lg leading-6 2xl:leading-7 border-gradient hover:bg-main-gradient transition-btn {option === statusFilter
				? 'bg-main-gradient'
				: 'bg-gradient-a'}"
		>
			{option}
		</button>
	{/each}
</div>
