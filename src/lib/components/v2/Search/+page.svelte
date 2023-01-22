<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';
	import { globalSearch } from '$utils/api/search/globalSearch';
	import { tick } from 'svelte';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import Input from '$components/v2/Input/Input.svelte';
	import { page } from '$app/stores';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { browser } from '$app/environment';
	import EnterKeyIcon from '$icons/enter-key-icon.svelte';
	import SearchWrapper from './SearchWrapper.svelte';
	import { selectedResultTab } from '$stores/search';
	import { goto } from '$app/navigation';

	let query: string;
	let searching = false;
	let isDropdownShown = false;
	let show = false;
	const resultCategoryLimit = 3;

	let searchResults: {
		collections?: any[];
		items?: any[];
		users?: any[];
	} = {};

	const debouncedSearch = debounce(async (query: string) => {
		await searchGlobally(query);
	}, 500);

	const searchGlobally = async (query: string) => {
		const res = await globalSearch(query, resultCategoryLimit).catch((err) => console.error(err));
		searchResults = {
			collections: res?.collections || [],
			items: (await Promise.all(res?.nfts.map(nftToCardOptions))) || [],
			users: res?.verifiedCreators || [],
		};

		await tick();
		show = true;
	};

	$: if (browser && !query) {
		searching = false;
		debouncedSearch.cancel();
	}

	$: if (browser && query) {
		searching = true;
		show = false;
		debouncedSearch(query.trim());
	}

	const navigateToSearchResults = (query: string) => {
		show = false;
		searching = false;

		query = query.trim();
		goto('/search?query=' + query.replace('#', '%23'));
	};
</script>

<div
	use:outsideClickCallback={{
		cb: () => (isDropdownShown = false),
	}}
	class="relative {$$props.class}"
>
	<Input
		on:keyup={(e) => {
			if (e.code === 'Enter' && show) {
				navigateToSearchResults(query.trim());
			}
		}}
		bind:value={query}
		class="rounded-none bg-card-gradient hover:text-white w-full h-10 relative px-14"
		placeholder="Search"
	>
		<div class="absolute top-2 left-5">
			<Search class="w-5 h-6 text-transparent" />
		</div>

		<div class:hidden={!query || !show} class="absolute bg-gradient-a p-2 top-0 right-0" slot="end-icon">
			<EnterKeyIcon class="w-6 h-6" />
		</div>
	</Input>
	{#if isDropdownShown || query}
		<SearchWrapper bind:query bind:isDropdownShown bind:searchResults bind:show />
	{/if}
</div>
