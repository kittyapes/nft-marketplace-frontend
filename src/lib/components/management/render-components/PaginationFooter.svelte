<script lang="ts">
	import ColumnComponentContainer from '$components/management/ColumnComponentContainer.svelte';
	import ArrowDownGradient from '$icons/arrow-down-gradient.svelte';
	import { createEventDispatcher } from 'svelte';

	export let props;

	const dispatch = createEventDispatcher();

	$: localPages = [...Array(props?.pages + 1).keys()].slice(1);

	let selected = 1;

	$: showingPages = props?.pages > 6 ? (selected === 1 ? [...localPages.keys()].slice(1, 6) : showingPages) : localPages;

	function selectPage(page: number) {
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
</script>

<div class="w-full col-span-full select-none">
	<ColumnComponentContainer>
		<div class="flex gap-4 text-lg font-semibold  items-center mx-8">
			<div class="text-color-gray-light clickable" on:click={firstPage}>First</div>
			<div class="flex items-center clickable" on:click={previousPage}>
				<ArrowDownGradient class="rotate-90" />
				<div class="gradient-text ">Previous</div>
			</div>
		</div>
		<div class="flex-grow justify-self-center select-none">
			<div class="flex items-center justify-center gap-2">
				{#each showingPages as page}
					<div class="w-10 h-10 rounded-full font-semibold text-lg clickable items-center justify-center flex transition-colors" on:click={() => selectPage(page)} class:gradient={selected === page}>
						{page}
					</div>
				{/each}
				{#if localPages.length > 5}
					{#if !showingPages.includes(props.pages)}
						{#if !showingPages.includes(props.pages - 1)}
							<div class="font-semibold text-lg">...</div>
						{/if}
						<div class="font-semibold text-lg clickable w-10 h-10 rounded-full items-center justify-center flex " on:click={lastPage} class:gradient={selected === localPages[props.pages - 1]}>
							{localPages[props.pages - 1]}
						</div>
					{/if}
				{/if}
			</div>
		</div>
		<div class="flex gap-4 text-lg font-semibold items-center mx-8">
			<div class="flex items-center clickable" on:click={nextPage}>
				<div class="gradient-text ">Next</div>
				<ArrowDownGradient class="-rotate-90" />
			</div>
			<div class="text-color-gray-light clickable" on:click={lastPage}>Last</div>
		</div>
	</ColumnComponentContainer>
</div>

<style type="postcss">
	.gradient {
		@apply bg-gradient-to-r from-color-purple to-color-blue text-white;
	}
</style>
