<script lang="ts">
	import { notifyError } from '$utils/toast';
	import { page } from '$app/stores';
	import { globalUsersSearch } from '$utils/api/search/globalSearch';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import type { UserData } from '$interfaces/userData';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import { goto } from '$app/navigation';
	import { searchQuery } from '$stores/search';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { onDestroy } from 'svelte';

	let users: Partial<UserData>[] = [];
	let query = writable('');
	let reachedEnd = false;
	let isLoading = false;
	let showLoader = true;
	let pageNumber = 1;

	const limit = 10;

	const inviewOptions = {};

	if ($page.url.searchParams.get('query')) {
		$searchQuery = $page.url.searchParams.get('query');
	}

	const fetchFunction = async () => {
		const res = await globalUsersSearch($query, limit, pageNumber);

		return res.users;
	};

	async function fetchMore() {
		if (isLoading) return;
		isLoading = true;
		showLoader = true;

		const res = await fetchFunction();

		if (res.error) {
			notifyError('Failed to fetch more users.');
			return;
		}

		if (res.length === 0) {
			reachedEnd = true;
		} else {
			users = [...users, ...res];
			pageNumber++;
		}

		showLoader = false;
		isLoading = false;
	}

	const unsubscribeQuery = searchQuery.subscribe((val) => ($query = val));

	query.subscribe((val) => {
		if (!browser) return;

		reachedEnd = false;
		isLoading = false;
		showLoader = true;
		pageNumber = 1;
		users = [];

		fetchMore();
		$page.url.searchParams.set('query', val);
		goto('?' + $page.url.searchParams, { replaceState: true, keepfocus: true, noscroll: true });
	});

	function onChange(event) {
		if (event.detail.inView) {
			fetchMore();
		}
	}

	onDestroy(unsubscribeQuery);
</script>

{#if showLoader}
	<div class="w-full">
		<DiamondsLoader />
	</div>
{:else if users?.length === 0 && !showLoader}
	<p class="p-36 whitespace-nowrap font-semibold text-lg opacity-70">Nothing to see here, move along.</p>
{/if}

<div class="my-6 2xl:my-8 w-full grid 2xl:grid-cols-2 justify-evenly gap-8">
	{#each users as user}
		<FeaturedArtistCard
			on:click={() => goto(`/profile/${user.address}`)}
			creatorData={{
				name: user.username,
				address: user.address,
				coverImg: user.coverUrl,
				profileImg: user.thumbnailUrl,
				created: 0,
			}}
			includeCreatedNumber={false}
		/>
	{/each}

	{#if users?.length > 0 && !showLoader && !reachedEnd}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
</div>
