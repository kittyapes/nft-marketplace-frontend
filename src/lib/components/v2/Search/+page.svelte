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
	import { beforeNavigate, goto } from '$app/navigation';

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
			users: res?.users || [],
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

	const navigateToSearchResults = () => {
		query = query.trim();
		$page.url.searchParams.set('query', query.replace('#', '%23'));
		query = '';

		goto('/search/' + $selectedResultTab + '?' + $page.url.searchParams);
	};

	beforeNavigate(({ to }) => {
		show = false;
		searching = false;
	});
</script>

<div
	use:outsideClickCallback={{
		cb: () => (isDropdownShown = false),
	}}
	class="relative wrapper {$$props.class}"
	on:keyup={(e) => {
		if (e.code === 'Enter' && show) {
			navigateToSearchResults();
		}
	}}
>
	<div class="absolute inset-0 gradient-border animate-gradient-border-spin border-div" />

	<Input bind:value={query} class="rounded-none bg-card-gradient hover:text-white w-full h-10 relative " placeholder="Search" gradientCaret>
		<Search class="w-7 h-7 text-transparent min-w-full ml-4" />

		<div
			class:hidden={!query || !show}
			class="min-w-full mr-6 cursor-pointer"
			slot="end-icon"
			on:click={() => {
				if (show) {
					navigateToSearchResults();
				}
			}}
		>
			<EnterKeyIcon class="w-6 h-6 bg-card-gradient p-1" />
		</div>
	</Input>
	{#if isDropdownShown || query}
		<SearchWrapper bind:query bind:isDropdownShown bind:searchResults bind:show />
	{/if}
</div>

<style type="postcss">
	.wrapper:not(:hover) > .border-div {
		display: none;
	}
</style>
