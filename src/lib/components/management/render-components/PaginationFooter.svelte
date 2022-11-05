<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let props;

	const dispatch = createEventDispatcher();

	$: localPages = [...Array(props?.pages + 1).keys()].slice(1);

	let selected = 1;
	let itemsPerPage = 10;
	let perPageDroppedDown = false;
	let selectDroppedDown = false;
	let totalPages = 10;
	let pages = [];
	let itemsPerPageChoices = [5, 10, 20, 30];
	let totalNumberOfItems = 100;
	for (let index = 0; index < totalPages; index++) {
		pages.push(index + 1);
	}

	$: showingPages = props?.pages > 6 ? (selected === 1 ? [...localPages.keys()].slice(1, 6) : showingPages) : localPages;

	function selectPage(page: number) {
		selectDroppedDown = false;
		if (props.pages < page || page < 0 || selected === page) return;

		window.scrollTo(0, 0);

		if (page === props.pages) {
			showingPages = localPages.slice(-5);
		}

		if (page === localPages[0]) {
			showingPages = localPages.slice(0, 5);
		}

		if (page === showingPages[showingPages.length - 1] && page !== props.pages) {
			showingPages.shift();
			showingPages.push(showingPages[showingPages.length - 1] + 1);
			showingPages = showingPages;
		} else if (page === showingPages[0] && showingPages[0] !== 1) {
			showingPages.pop();
			showingPages.unshift(showingPages[0] - 1);
			showingPages = showingPages;
		}

		selected = page;
		dispatch('event', { page: selected });
	}

	function nextPage() {
		selectPage(selected + 1);
	}

	function previousPage() {
		selectPage(selected - 1);
	}

	function firstPage() {
		selectPage(localPages?.[0]);
	}

	function lastPage() {
		selectPage(props?.pages);
	}

	function pickPerPage(choice: number) {
		itemsPerPage = choice;
		perPageDroppedDown = false;
	}
</script>

<style type="postcss">
	.gradient {
		@apply bg-gradient-to-r from-color-purple to-color-blue text-white;
	}
</style>

<div class="w-full col-span-full select-none items-center flex border-y border-color-gray-lighter text-lg font-medium text-white">
	<div class="relative">
		<div
			class="flex gap-2 border-r border-r-white items-center p-4 cursor-pointer"
			on:click={() => {
				perPageDroppedDown = !perPageDroppedDown;
			}}>
			<div class="text">Items per page: {itemsPerPage}</div>
			<ArrowDown />
		</div>
		{#if perPageDroppedDown}
			<div class="flex w-full justify-end">
				<div class="absolute bg-white text-color-black rounded-lg w-1/4">
					{#each itemsPerPageChoices as choice}
						<div class="cursor-pointer text-center hover:bg-[#0000001e]" transition:slide on:click={() => pickPerPage(choice)}>{choice}</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="p-4 flex-grow">{selected * itemsPerPage - (itemsPerPage - 1)} – {selected * itemsPerPage} of {totalNumberOfItems} items</div>
	<div class="relative">
		<div class="flex items-center p-4 cursor-pointer">
			<div
				class="flex items-center"
				on:click={() => {
					selectDroppedDown = !selectDroppedDown;
				}}>
				<div class="text">{selected}</div>
				<ArrowDown />
			</div>
			<div class="pl-2">of {totalPages} pages</div>
		</div>
		{#if selectDroppedDown}
			<div class="flex w-full">
				<div class="absolute bg-white text-color-black rounded-lg w-1/4 max-h-24 overflow-y-auto blue-scrollbar">
					{#each pages as page}
						<div class="cursor-pointer text-center hover:bg-[#0000001e]" transition:slide on:click={() => {selectPage(page)}}>{page}</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="flex h-full">
		<div class="button-vertical-gradient px-4 h-full border-l border-l-white flex items-center cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all duration-200" on:click={previousPage}>
			<div class="rotate-90">
				<ArrowDown />
			</div>
		</div>
		<div class="button-vertical-gradient px-4 h-full border-l border-l-white flex items-center cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all duration-200" on:click={nextPage}>
			<div class="-rotate-90">
				<ArrowDown />
			</div>
		</div>
	</div>
</div>
