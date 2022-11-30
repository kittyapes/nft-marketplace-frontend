<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import SearchResults from './SearchResults.svelte';

	export let query: string;
	export let isDropdownShown: boolean;
	export let show: boolean;
	export let searchResults: {
		collections?: any[];
		items?: any[];
		users?: any[];
	} = {};
</script>

<div class="absolute top-11 w-full bg-dark-gradient border-gradient pt-2.5 2xl:pt-2 px-5 2xl:px-6 pb-5 2xl:pb-6 ">
	{#if isDropdownShown && !query}
		<!-- <PopularSearches /> -->
	{:else if show}
		<SearchResults bind:searchResults />
	{:else}
		<Loader />
	{/if}
</div>
