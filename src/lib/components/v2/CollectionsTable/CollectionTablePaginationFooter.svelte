<script lang="ts">
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let totalNumberOfItems = 0;
	export let itemsPerPage = 10;
	export let selected = 1;
	export let version: 'dark' | 'blue' = 'blue';

	$: totalPages = Math.ceil(totalNumberOfItems / itemsPerPage);
	$: pages = Array.from(Array(totalPages), (_, i) => i + 1);

	function selectPage(page: number) {
		if (totalPages < page || page < 1 || selected === page) return;
		window.scrollTo(0, 0);

		selected = page;
		dispatch('selected', { page: selected });
	}

	function nextPage() {
		selectPage(selected + 1);
	}

	function previousPage() {
		selectPage(selected - 1);
	}
</script>

{#if pages.length > 0}
	<div
		class="flex items-center justify-center mb-20 mt-10 text-white {$$props.class}"
		in:fade={{ duration: 1000 }}
	>
		<div
			class="flex {version === 'blue'
				? 'bg-card-gradient'
				: 'bg-dark-gradient'}  h-10 min-w-[20rem] transition-transform items-center justify-center px-2"
		>
			<div class="mr-2 clickable" on:click={previousPage}>
				<ChevronLeft />
			</div>

			{#each pages.slice(0, pages.length - 1) as page}
				<div
					class="h-full grid place-items-center w-10 text-lg clickable"
					class:selected={page === selected}
					on:click={() => selectPage(page)}
				>
					{page || ''}
				</div>
			{/each}

			<!--<div class="h-full grid place-items-center w-10 text-lg">
                {'...'}
            </div>-->

			<div
				class="h-full grid place-items-center w-10 text-lg clickable"
				class:selected={pages[pages.length - 1] === selected}
				on:click={() => selectPage(pages[pages.length - 1])}
			>
				{pages[pages.length - 1] || ''}
			</div>

			<div class="ml-2 clickable" on:click={nextPage}><ChevronRight /></div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.selected {
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
			linear-gradient(
				180deg,
				rgba(136, 234, 255, 0.2) 0%,
				rgba(133, 141, 247, 0.112) 100%,
				rgba(133, 141, 247, 0.2) 100%
			),
			radial-gradient(
				64.35% 166.74% at 8.56% -7.83%,
				rgba(103, 212, 248, 0.15) 0%,
				rgba(142, 119, 247, 0.15) 100%
			),
			radial-gradient(
				55.22% 148.72% at 98.83% 0%,
				rgba(103, 212, 248, 0.15) 0%,
				rgba(142, 119, 247, 0.15) 100%
			),
			radial-gradient(
				55.65% 55.65% at 51.68% 130.43%,
				rgba(103, 212, 248, 0.15) 0%,
				rgba(142, 119, 247, 0.15) 100%
			);
	}
</style>
