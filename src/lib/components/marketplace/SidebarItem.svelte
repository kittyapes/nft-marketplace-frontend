<script>
	import { slide } from 'svelte/transition';
	import StatusIcon from '$icons/status.svelte';
	import PriceIcon from '$icons/price.svelte';
	import CollectionsIcon from '$icons/collections.svelte';
	import SortIcon from '$icons/sort.svelte';

	import RightArrowIcon from '$icons/RightArrow.svelte';

	export let title = '';
	export let icon = '';

	let isOpen = false;
	const toggle = () => (isOpen = !isOpen);
</script>

<div>
	<div class="px-11 py-6 border-b border-gray-400 uppercase flex justify-between items-center">
		<div on:click={toggle} class=" w-full cursor-pointer flex items-center gap-3">
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

		<button on:click={toggle} aria-expanded={isOpen}>
			<RightArrowIcon />
		</button>
	</div>
	{#if isOpen}
		<div class="p-4 border-b border-gray-400" transition:slide={{ duration: 300 }}>
			<slot />
		</div>
	{/if}
</div>

<style>
	[aria-expanded='true'] svg {
		transform: rotate(0.5turn);
	}
</style>
