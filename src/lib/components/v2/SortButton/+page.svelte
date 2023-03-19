<script lang="ts" context="module">
	export type SortOption = { title: string; id: string; disabled?: boolean };
</script>

<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let sortOptions: SortOption[] = [];
	export let selectedOption: SortOption = null;

	let showSort = false;
	let button: HTMLElement;

	function handleOptionClick(option: SortOption) {
		selectedOption = option;
		showSort = false;
		dispatch('request-refresh');
	}

	async function handleDropdownOutsideClick() {
		showSort = false;
	}
</script>

<div class="flex-grow relative {$$props.class}">
	<button
		on:click={() => (showSort = !showSort)}
		class="w-full h-full border-gradient flex flex-row items-center justify-between px-4 hover:bg-main-gradient gap-x-4"
		bind:this={button}
	>
		<div class="text-base leading-7 capitalize text-opacity-70 whitespace-nowrap">
			{selectedOption?.title || 'Sort By'}
		</div>
		<ArrowDown class="w-4 h-4 transform transition {showSort ? '-rotate-180' : 'rotate-0'}" />
	</button>

	{#if showSort}
		<div
			transition:slide={{ duration: 300 }}
			use:outsideClickCallback={{ cb: handleDropdownOutsideClick, ignoredTargets: [button] }}
			class="relative z-10 mt-1 bg-dark-gradient w-full flex flex-col font-medium text-sm leading-5 whitespace-nowrap truncate sort-list"
		>
			{#each sortOptions as sortOption}
				<button
					on:click={() => handleOptionClick(sortOption)}
					class="inline-flex w-full p-3 border-2 border-b-0 sort-border border-solid enabled:hover:bg-main-gradient disabled:text-gray-600"
					disabled={sortOption.disabled}
				>
					{sortOption.title}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.sort-list button:last-child {
		@apply border-b-2;
	}
	.sort-border {
		border-image: linear-gradient(45deg, rgba(134, 139, 247, 0.25), rgba(108, 199, 248, 0.25)) 1;
	}
</style>
