<script lang="ts">
	import RefreshStretchedIcon from '$icons/refresh-stretched-icon.svelte';
	import Search from '$icons/search.svelte';
	import CollectionsTable from '$lib/components/v2/Marketplace/Collections/CollectionsTable/+page.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import Input from '../../Input/Input.svelte';
	import SortButton from '$components/v2/SortButton/+page.svelte';

	let collections: Collection[] = [];
	let searchPhrase: string;
	let reachedEnd = false;
	let isLoading = true;
	let page = 1;

	const limit = 10;

	const fetchFunction = async () => {
		const res = await apiSearchCollections({ limit, page });
		return res.collections;
	};

	async function fetchMore() {
		if (reachedEnd) return;
		isLoading = true;

		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more collections.');
			return;
		}

		if (res.length === 0) {
			reachedEnd = true;
		} else {
			page++;
			collections = [...collections, ...res];
		}
		isLoading = false;
	}

	onMount(async () => {
		await fetchMore();
	});

	// TODO implement sort options
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
</script>

<div>
	<div class="w-full flex flex-row items-center gap-x-4 my-6 2xl:my-8">
		<!-- TODO clarify what refresh does -->
		<button class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient flex-grow flex flex-row items-center justify-center transition-btn hover:bg-main-gradient">
			<RefreshStretchedIcon class="w-5 h-5" />
		</button>
		<Input bind:value={searchPhrase} class="rounded-none border-2 border-gradient h-11 2xl:h-14 hover:text-white" placeholder="Search by name or address" height="44px">
			<Search class="ml-6 w-5 h-6" />
		</Input>
		<SortButton bind:sortOptions class="h-11 2xl:h-14 min-w-[123px]" />
	</div>
	<CollectionsTable bind:collections bind:isLoading on:end-reached={fetchMore} />
</div>
