<script>
	import { slide } from 'svelte/transition';
	import StatusIcon from '$icons/status.svelte';
	import PriceIcon from '$icons/price.svelte';
	import CollectionsIcon from '$icons/collections.svelte';
	import SortIcon from '$icons/sort.svelte';
	import DownArrow from '$icons/down-arrow.svelte';

	export let title = '';
	export let icon = '';

	export let isOpen = false;
	const toggle = () => (isOpen = !isOpen);
</script>

<div>
	<div
		class="px-11 py-6 border-b border-gray-400 uppercase flex justify-between items-center
		cursor-pointer"
		on:click={toggle}
	>
		<div class=" w-full flex items-center gap-3">
			{#if icon == 'status'}
				<StatusIcon />
			{/if}

			{#if icon == 'collection'}
				<CollectionsIcon />
			{/if}

			{#if icon == 'price'}
				<PriceIcon />
			{/if}

			{#if icon == 'sort'}
				<SortIcon />
			{/if}

			{title}
		</div>

		<button aria-expanded={isOpen} class:rotate-180={isOpen} class="transition">
			<DownArrow />
		</button>
	</div>
	{#if isOpen}
		<div class="p-4 border-b border-gray-400" transition:slide={{ duration: 300 }}>
			<slot />
		</div>
	{/if}
</div>

<style>
	.aria-expanded svg {
		transform: rotate(0.5turn);
	}
</style>
