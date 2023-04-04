<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';
	import { globalSearch } from '$utils/api/search/globalSearch';
	import { tick } from 'svelte';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import Input from '$components/v2/Input/Input.svelte';
	import { page } from '$app/stores';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import EnterKeyIcon from '$icons/enter-key-icon.svelte';
	import SearchWrapper from './SearchWrapper.svelte';
	import { searchQuery, selectedResultTab } from '$stores/search';
	import { beforeNavigate, goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	let query = writable('');
	let searching = false;
	let isDropdownShown = false;
	let show = false;
	const resultCategoryLimit = 3;
	$: isOnSearchPage = $page.url.pathname.match(/search*/);

	let searchResults: {
		collections?: any[];
		items?: any[];
		creators?: any[];
	} = {};

	const debouncedSearch = debounce(async () => {
		await searchGlobally();
	}, 500);

	const searchGlobally = async () => {
		const res = await globalSearch($query.trim(), resultCategoryLimit).catch((err) => console.error(err));

		searchResults = {
			collections: res?.collections || [],
			items: (await Promise.all(res?.nfts.map(nftToCardOptions))) || [],
			creators: res?.users || [],
		};

		await tick();
		show = true;
		searching = false;
	};

	searchQuery.subscribe((val) => ($query = val));

	query.subscribe((val) => {
		if (!browser) return;
		$searchQuery = val;

		if (isOnSearchPage) {
			$page.url.searchParams.set('query', $query.trim().replace('#', '%23'));
		}

		if (!val) {
			searching = false;
			show = false;
			debouncedSearch.cancel();
		} else if (!isOnSearchPage) {
			searching = true;
			show = false;
			debouncedSearch();
		}
	});

	const navigateToSearchResults = () => {
		$searchQuery = $query;

		goto('/search/' + $selectedResultTab + '?query=' + $query);
	};

	beforeNavigate(({ to }) => {
		if (!to?.url.pathname.match(/search*/)) $query = '';
		searching = false;
		show = false;
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

	<Input bind:value={$query} class="rounded-none bg-card-gradient hover:text-white w-full h-10 relative" placeholder="Search" gradientCaret>
		<Search class="w-7 h-7 text-transparent min-w-full ml-4" />

		<div
			class:hidden={!$query || !show || isOnSearchPage}
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
	{#if (show || searching) && $query && !isOnSearchPage}
		<SearchWrapper bind:query={$query} bind:searchResults bind:show {searching} />
	{/if}
</div>

<style lang="postcss">
	.wrapper:not(:hover) > .border-div {
		display: none;
	}
</style>
