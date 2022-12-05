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
		$page.url.searchParams.set('query', query);
		window?.location?.replace(`/search/${$selectedResultTab}?${$page.url.searchParams}`);
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
		class="rounded-none bg-gradient-a hover:text-white w-full"
		placeholder="Search"
		height="40px"
	>
		<Search class="ml-6 w-5 h-6" />

		<div class:hidden={!query || !show} class="mr-9 p-2 bg-gradient-a " slot="end-icon">
			<EnterKeyIcon class="w-4 h-3" />
		</div>
	</Input>
	{#if isDropdownShown || query}
		<SearchWrapper bind:query bind:isDropdownShown bind:searchResults bind:show />
	{/if}
</div>
