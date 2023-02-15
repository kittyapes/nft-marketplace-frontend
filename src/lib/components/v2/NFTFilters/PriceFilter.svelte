<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let minPrice: number = Number($page.url.searchParams.get('minPrice'));
	let maxPrice: number = Number($page.url.searchParams.get('maxPrice'));

	const applyPriceFilter = () => {
		if (minPrice > 0 || maxPrice > 0) $page.url.searchParams.set('token', 'WETH');
		else $page.url.searchParams.delete('token');

		if (minPrice > 0) $page?.url?.searchParams?.set('minPrice', minPrice.toString());
		else $page.url.searchParams.delete('minPrice');

		if (minPrice > 0) $page.url.searchParams.set('maxPrice', maxPrice.toString());
		else $page.url.searchParams.delete('maxPrice');

		goto(`?${$page.url.searchParams}`);
		dispatch('request-refresh');
	};
</script>

<div class="w-full flex flex-col gap-2">
	<div class="flex flex-row items-center ">
		<input bind:value={minPrice} type="number" placeholder="Min" class="--price-input border-gradient bg-gradient-a" />

		<div class="px-3">to</div>

		<input bind:value={maxPrice} type="number" placeholder="Max" class="--price-input border-gradient bg-gradient-a" />
	</div>

	<!-- TODO use v2 button component -->
	<Button on:click={applyPriceFilter} stretch class="h-12 hover:bg-main-gradient bg-gradient-a border-gradient normal-case text-base">Apply</Button>
</div>

<style>
	.--price-input {
		@apply px-2 py-2 outline-none 2xl:w-20 flex-grow text-center h-12;
	}
</style>
