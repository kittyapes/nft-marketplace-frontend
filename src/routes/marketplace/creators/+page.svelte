<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import CreatorWithNfts from '$lib/components/v2/CreatorWithNfts/CreatorWithNfts.svelte';
	import ErrorBox from '$lib/components/v2/ErrorBox/ErrorBox.svelte';
	import { getListingCreators, type ListingCreatorsData } from '$utils/api/listing';
	import { notifyError } from '$utils/toast';
	import { onMount, tick } from 'svelte';
	import { inview } from 'svelte-inview';
	import { fetchIsFollowing } from "$utils/api/following";
	import { writable } from "svelte/store";

	const limit = 10;

	let page = 1;
	let isFetching = true;
	let isEndReached = false;
	let fetchFailed = false;
	let creators: ListingCreatorsData['users'] = [];
	let creatorFollowStatuses = writable<{ [address: string]: boolean }>({});

	async function checkFollowStatus(creatorAddresses) {
		creatorAddresses.length && creatorFollowStatuses.set(await fetchIsFollowing(creatorAddresses));
	}

	async function fetch() {
		isFetching = true;

		const res = await getListingCreators({ page, limit });

		if (res.err) {
			notifyError('Failed to load creators data.');
			isFetching = false;
			fetchFailed = true;

			return;
		}

		if (res.data.data.users.length) {
			creators = [...creators, ...res.data.data.users];
			page++;
		} else {
			isEndReached = true;
		}

		await tick();

		isFetching = false;
	}

	onMount(() => {
		fetch();
	});

	$: creators.length && checkFollowStatus(creators.map(creator => creator.address));
</script>

<div class="mt-8 flex flex-col gap-4">
	{#each creators as creator}
		<CreatorWithNfts {creator} listings={creator.creatorListings} creatorFollowStatuses={$creatorFollowStatuses} />
	{/each}
</div>

{#if isFetching}
	<DiamondsLoader />
{:else if isEndReached}
	<div class="text-center placeholder">You have reached the end of this list.</div>
{/if}

{#if !isFetching && !isEndReached && !fetchFailed}
	<div use:inview on:enter={fetch} />
{/if}

{#if fetchFailed}
	<div class="mt-8">
		<ErrorBox>
			<div slot="errorDetail">Sorry, failed to fetch creators. Please try reloading the page.</div>
		</ErrorBox>
	</div>
{/if}


<style lang="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-70;
	}
</style>
