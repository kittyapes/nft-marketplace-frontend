<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';
	import { globalSearch } from '$utils/api/search/globalSearch';
	import Loader from '$icons/loader.svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import { beforeNavigate, goto } from '$app/navigation';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import { setPopup } from '$utils/popup';
	import { page } from '$app/stores';
	import { searchQuery } from '$stores/search';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { browser } from '$app/environment';

	let query: string;
	let searching = false;
	let show = false;

	const resultCategoryLimit = 3;

	let searchResults = {
		collections: [],
		items: [],
		users: [],
	};

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
		$searchQuery = '';
		debouncedSearch.cancel();
	}

	$: if (browser && query) {
		$searchQuery = query.trim();

		if (!$page.url.pathname.startsWith('/search')) {
			searching = true;
			show = false;
			debouncedSearch($searchQuery);
		}
	}

	beforeNavigate(({ to }) => {
		if (!to?.url.pathname.match(/search*/)) query = '';
	});

	const navigateToSearchResults = (query: string) => {
		show = false;
		searching = false;

		query = query.trim();
		goto('/search?query=' + query.replace('#', '%23'));
	};
</script>

<div
	class="flex py-2 px-4 items-center gap-x-4 border border-black border-opacity-30 rounded-md flex-grow-[0.1] relative overflow-visible z-30 {$$props.class}"
	use:outsideClickCallback={{
		cb: () => (searching = false),
	}}
>
	<Search />
	<input
		bind:value={query}
		on:keyup={(e) => {
			if (e.code === 'Enter') {
				navigateToSearchResults($searchQuery);
			}
		}}
		type="text"
		class="w-72 focus:outline-none"
		placeholder="Search nfts, collections, and artists"
	/>
	{#if searching}
		<div class="w-full bg-white top-16 right-0 border-black border-opacity-30 rounded-md border z-30 absolute" in:fly={{ y: -40, duration: 300 }}>
			{#if show}
				<div class=" max-h-[30rem] overflow-y-auto relative blue-scrollbar overscroll-contain">
					{#each Object.keys(searchResults) as section}
						{#if searchResults[section].length > 0}
							<div class="">
								<div class="first-letter:uppercase font-semibold text-sm p-4">{section}</div>
								<div class="border-b border-black border-opacity-30" />
								<div class="p-4 flex flex-col gap-4">
									{#each searchResults[section] as result}
										{#if section === 'items'}
											{@const props = result.nfts[0]}
											<div
												class="flex gap-4 items-center btn"
												on:click={() => {
													setPopup(CardPopup, { props: { options: result }, onClose: () => (searching = true) });
												}}
											>
												{#if props.thumbnailUrl}
													<div class="w-12 h-12 rounded-full grid place-items-center">
														<div class="w-12 h-12 rounded-full bg-cover" style="background-image: url({props.thumbnailUrl})" />
													</div>
												{/if}
												<div class="font-semibold w-full max-w-full truncate">
													{props.name}
												</div>
											</div>
										{:else if section === 'users'}
											<div
												class="flex gap-4 items-center btn"
												on:click={() => {
													searching = false;
													goto('/profile/' + result.address);
												}}
											>
												{#if result.thumbnailUrl}
													<div class="w-12 h-12 rounded-full grid place-items-center">
														<div class="w-12 h-12 bg-cover rounded-full" style="background-image: url({result.thumbnailUrl})" />
													</div>
												{/if}
												<div class="">
													<div class="font-semibold username w-full max-w-full truncate">
														{result.username}
													</div>
												</div>
											</div>
										{:else if section === 'collections'}
											<div
												class="flex gap-4 items-center btn"
												on:click={() => {
													searching = false;
													goto('/collections/' + result.slug);
												}}
											>
												{#if result.logoImageUrl}
													<div class="w-12 h-12 rounded-full grid place-items-center">
														<div class="w-12 h-12 rounded-full bg-cover" style="background-image: url({result.logoImageUrl})" />
													</div>
												{/if}
												<div class="font-semibold w-full max-w-full truncate">
													{result.name}
												</div>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					{/each}
					{#if Object.values(searchResults).filter((e) => e.length > 0).length > 0}
						<div class="all-results p-4">
							<button
								class="btn btn-rounded w-full border-2 btn-gradient-border"
								on:click={() => {
									navigateToSearchResults(query);
								}}
							>
								All results
							</button>
						</div>
					{:else}
						<div class="p-4 text-lg font-semibold">Nothing found</div>
					{/if}
				</div>
			{:else}
				<Loader />
			{/if}
		</div>
	{/if}
</div>

<style type="postcss">
	@media (max-height: 540px) {
		.all-results {
			@apply my-32;
		}
	}
</style>
