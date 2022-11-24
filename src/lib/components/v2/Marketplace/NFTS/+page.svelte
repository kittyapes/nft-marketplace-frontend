<script lang="ts">
	import RefreshStretchedIcon from '$icons/refresh-stretched-icon.svelte';
	import Search from '$icons/search.svelte';
	import Input from '../../Input/Input.svelte';
	import SortButton from '$components/v2/SortButton/+page.svelte';
	import FiltersV2 from '$icons/filters-v2.svelte';
	import Button from '$lib/components/Button.svelte';
	import ArrowLeft from '$icons/arrow-left.svelte';
	import GridSelector from '$components/v2/GridSelector/+page.svelte';

	let searchPhrase: string;
	let showFilters = false;
	let sortOptions: { title: string; action?: any }[] = [
		{
			title: 'Ending soon',
			action: () => {},
		},
		{
			title: 'Price low to high',
			action: () => {},
		},
		{
			title: 'Price high to low',
			action: () => {},
		},
		{
			title: 'Most favorited',
			action: () => {},
		},
	];

	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
</script>

<div>
	<div class="w-full flex flex-row items-center gap-x-4 my-6 2xl:my-8">
		<Button class="h-11 2xl:h-14 hover:bg-main-gradient rounded-none border-2 border-gradient flex items-center justify-between">
			{#if showFilters}
				<ArrowLeft class=" w-5 h-6" />
			{:else}
				<FiltersV2 class=" w-5 h-6" />
			{/if}
			Filter
		</Button>
		<button class="w-11 h-11 2xl:h-14 2xl:w-14 min-w-[40px] 2xl:min-w-[50px] border-gradient flex-grow flex flex-row items-center justify-center transition-btn hover:bg-main-gradient">
			<RefreshStretchedIcon class="w-5 h-5" />
		</button>
		<Input bind:value={searchPhrase} class="rounded-none border-2 border-gradient h-11 2xl:h-14 hover:text-white" placeholder="Search by name or address" height="44px">
			<Search class="ml-6 w-5 h-6" />
		</Input>
		<SortButton bind:sortOptions class="h-11 2xl:h-14 min-w-[123px]" />
		<GridSelector bind:gridStyle />
	</div>
</div>
