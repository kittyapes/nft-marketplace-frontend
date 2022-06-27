<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import Loader from '$icons/loader.svelte';
	import Search from '$icons/search.svelte';
	import { collectionQuery, filters } from '$stores/marketplace';
	import { adaptCollectionToMintingDropdown } from '$utils/adapters/adaptCollectionToMintingDropdown';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { debounce } from 'lodash-es';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let query = '';
	let collections: any[] = [];
	let searching = false;
	let opened = false;
	let selected: Partial<DropdownCollectionData>;

	interface DropdownCollectionData {
		label: string;
		value: string;
		iconUrl: string;
	}

	onMount(async () => {
		if ($filters.collection?.label) selected = $filters.collection;
		if ($collectionQuery) query = $collectionQuery;
	});

	const handleSelect = (collection: DropdownCollectionData) => {
		$filters.collection = collection;
		selected = collection;
		opened = false;
		searching = false;
	};

	const handleCancelSelected = () => {
		selected = null;
		$filters.collection = null;
	};

	const search = async () => {
		searching = true;
		const collectionSearchRes = await apiSearchCollections({ limit: 5, name: query });
		collections = collectionSearchRes.map(adaptCollectionToMintingDropdown);
		opened = true;
	};

	const debouncedSearch = debounce(async () => {
		await search();
	}, 500);

	$: if (!query) {
		searching = false;
		debouncedSearch.cancel();
	}

	$: if (searching) {
		opened = false;
	}

	$: if (query) {
		debouncedSearch();
	}
</script>

<div class="relative text-color-gray-base ">
	{#if selected}
		<div class="flex gap-4 items-center">
			{#if selected.iconUrl}
				<div class="w-8 h-8 rounded-full grid place-items-center">
					<div class="w-8 h-8 rounded-full bg-cover" style="background-image: url({selected.iconUrl})" />
				</div>
			{/if}
			<div class="font-semibold w-full max-w-full">
				{#if selected.label?.length > 25}
					{selected.label?.slice(0, 25)}...
				{:else}
					{selected.label}
				{/if}
			</div>
			<div class="flex-grow" />
			<button class="btn" on:click={handleCancelSelected}>
				<CloseButton />
			</button>
		</div>
	{:else}
		<div class="relative">
			<span class="absolute inset-y-0 left-0 flex items-center pl-2">
				<button type="submit" class="p-1 focus:outline-none focus:shadow-outline"><Search /></button>
			</span>

			<input bind:value={query} type="text" class="py-2 text-sm text-black rounded-md pl-10 border border-black border-opacity-50 h-10  w-full" placeholder="Only show..." autocomplete="off" />
		</div>
	{/if}

	{#if searching}
		<div class="w-full bg-white rounded-md z-30 mt-2" in:fly={{ y: -40, duration: 300 }}>
			{#if opened}
				{#if collections.length > 0}
					{#each collections as collection}
						<div class="" on:click={() => handleSelect(collection)}>
							<div class="py-4 flex flex-col gap-4">
								<div class="flex gap-4 items-center btn">
									{#if collection.iconUrl}
										<div class="w-8 h-8 rounded-full grid place-items-center">
											<div class="w-8 h-8 rounded-full bg-cover" style="background-image: url({collection.iconUrl})" />
										</div>
									{/if}
									<div class="font-semibold w-full max-w-full">
										{#if collection.label?.length > 25}
											{collection.label?.slice(0, 25)}...
										{:else}
											{collection.label}
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="p-4 text-lg font-semibold">Nothing found</div>
				{/if}
			{:else}
				<Loader />
			{/if}
		</div>
	{/if}
</div>
