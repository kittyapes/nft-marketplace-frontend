<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CloseButton from '$icons/close-button.svelte';
	import Loader from '$icons/loader.svelte';
	import Search from '$icons/search.svelte';
	import { collectionQuery } from '$stores/marketplace';
	import { adaptCollectionToMintingDropdown } from '$utils/adapters/adaptCollectionToMintingDropdown';
	import { apiSearchCollections } from '$utils/api/collection';
	import { debounce } from 'lodash-es';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

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
		if ($collectionQuery) query = $collectionQuery;
	});

	const handleSelect = (collection: DropdownCollectionData) => {
		selected = collection;
		opened = false;
		searching = false;

		$page.url.searchParams.set('collections', collection.value);
		goto('?' + $page.url.searchParams);
		dispatch('request-refresh');
	};

	const handleCancelSelected = () => {
		selected = null;

		$page.url.searchParams.delete('collections');
		goto('?' + $page.url.searchParams);
		dispatch('request-refresh');
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

	onDestroy(() => {
		$page.url.searchParams.delete('collections');
		goto('?' + $page.url.searchParams);
		dispatch('request-refresh');
	});
</script>

<div class="relative text-color-gray-base ">
	{#if selected}
		<div class="flex items-center gap-4">
			{#if selected.iconUrl}
				<div class="grid w-8 h-8 rounded-full place-items-center">
					<div class="w-8 h-8 bg-cover rounded-full" style="background-image: url({selected.iconUrl})" />
				</div>
			{/if}
			<div class="w-full max-w-full font-semibold">
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

			<input bind:value={query} type="text" class="w-full h-10 py-2 pl-10 text-sm text-black border border-black border-opacity-50 rounded-md" placeholder="Only show..." autocomplete="off" />
		</div>
	{/if}

	{#if searching}
		<div class="z-30 w-full mt-2 bg-white rounded-md overflow-y-auto custom-scrollbar max-h-36 overscroll-contain" in:fly={{ y: -40, duration: 300 }}>
			{#if opened}
				{#if collections.length > 0}
					{#each collections as collection}
						<div class="" on:click={() => handleSelect(collection)} in:fly={{ y: -40, duration: 300 }}>
							<div class="flex flex-col gap-4 py-2">
								<div class="flex items-center gap-4 btn">
									<div class="grid w-8 h-8 bg-gray-100 rounded-full place-items-center">
										<div class="w-8 h-8 bg-cover rounded-full shadow" style="background-image: url({collection.iconUrl})" />
									</div>
									<div class="w-full max-w-full font-semibold">
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
