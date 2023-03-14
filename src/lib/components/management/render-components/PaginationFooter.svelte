<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let props;

	const dispatch = createEventDispatcher();

	let selected = 1;
	let itemsPerPage = 20;
	let perPageDroppedDown = false;
	let selectDroppedDown = false;
	let itemsPerPageChoices = [5, 10, 20, 30];

	$: totalPages = props.pages;
	$: pages = Array.from(Array(totalPages), (_, i) => i + 1);
	$: totalNumberOfItems = props.items;

	$: if (itemsPerPage && totalNumberOfItems) {
		totalPages = Math.ceil(totalNumberOfItems / itemsPerPage);
	}

	function selectPage(page: number) {
		if (props.pages < page || page < 1 || selected === page) return;
		selectDroppedDown = false;
		window.scrollTo(0, 0);

		selected = page;

		dispatch('event', { page: selected });
	}

	function nextPage() {
		selectPage(selected + 1);
	}

	function previousPage() {
		selectPage(selected - 1);
	}

	function pickPerPage(choice: number) {
		perPageDroppedDown = false;
		selectPage(1);

		window.scrollTo(0, 0);

		itemsPerPage = choice;

		dispatch('event', { itemsPerPage, page: selected });
	}
</script>

<div
	class="w-full col-span-full select-none items-center flex border-y border-color-gray-lighter text-lg font-medium text-white"
>
	<div class="relative">
		<div class="flex gap-2 border-r border-r-white items-center p-4">
			<div class="text">Items per page: {itemsPerPage}</div>
			<div
				class="clickable"
				on:click={() => {
					perPageDroppedDown = !perPageDroppedDown;
				}}
			>
				<ArrowDown />
			</div>
		</div>
		{#if perPageDroppedDown}
			<div class="flex w-full justify-end">
				<div class="absolute bg-dark-gradient text-white w-1/4 z-20">
					{#each itemsPerPageChoices as choice}
						<div
							class="cursor-pointer text-center dropdown-item"
							transition:slide
							on:click={() => pickPerPage(choice)}
						>
							{choice}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="p-4 flex-grow">
		{selected * itemsPerPage - (itemsPerPage - 1)} - {selected === totalPages
			? totalNumberOfItems
			: selected * itemsPerPage} of {totalNumberOfItems} items
	</div>
	<div class="relative">
		<div class="flex items-center p-4">
			<div class="flex items-center gap-1">
				<div
					class="clickable"
					on:click={() => {
						selectDroppedDown = !selectDroppedDown;
					}}
				>
					<ArrowDown />
				</div>
				<div class="text">{selected}</div>
			</div>
			<div class="pl-2">of {totalPages} pages</div>
		</div>
		{#if selectDroppedDown}
			<div class="flex w-full">
				<div
					class="absolute bg-dark-gradient text-white w-1/4 max-h-24 overflow-y-auto blue-scrollbar z-20"
				>
					{#each pages as page}
						<div
							class="cursor-pointer text-center dropdown-item"
							transition:slide
							on:click={() => {
								selectPage(page);
							}}
						>
							{page}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="flex h-full">
		<div
			class="button-vertical-gradient px-4 h-full border-l border-l-white flex items-center cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all duration-200"
			on:click={previousPage}
		>
			<div class="rotate-90">
				<ArrowDown />
			</div>
		</div>
		<div
			class="button-vertical-gradient px-4 h-full border-l border-l-white flex items-center cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all duration-200"
			on:click={nextPage}
		>
			<div class="-rotate-90">
				<ArrowDown />
			</div>
		</div>
	</div>
</div>

<style type="postcss">
	.dropdown-item:hover {
		background: radial-gradient(
				55.65% 55.65% at 51.68% 130.43%,
				rgba(103, 212, 248, 0.025) 0%,
				rgba(142, 119, 247, 0.025) 100%
			),
			radial-gradient(
				55.22% 148.72% at 98.83% 0%,
				rgba(103, 212, 248, 0.025) 0%,
				rgba(142, 119, 247, 0.025) 100%
			),
			radial-gradient(
				64.35% 166.74% at 8.56% -7.83%,
				rgba(103, 212, 248, 0.025) 0%,
				rgba(142, 119, 247, 0.025) 100%
			),
			linear-gradient(
				180deg,
				rgba(136, 234, 255, 0.1) 0%,
				rgba(133, 141, 247, 0.056) 100%,
				rgba(133, 141, 247, 0.1) 100%
			),
			rgba(0, 0, 0, 0.1);
	}
</style>
