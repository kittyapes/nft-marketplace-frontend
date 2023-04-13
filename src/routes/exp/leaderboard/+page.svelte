<script lang="ts">
	import { browser } from '$app/environment';
	import { currentUserAddress } from '$stores/wallet';
	import {
		getExpLeaderboard,
		getUserExpPoints,
		type FetchExpLeaderboardOptions,
		type ExpLeaderboardUserRecord,
		type UserExpResponse,
	} from '$utils/api/exp';
	import { writable } from 'svelte/store';
	import { expPointsToColor } from '..';
	import RewardsHeader from '../lib/RewardsHeader.svelte';
	import CollectionTablePaginationFooter from '$components/v2/CollectionsTable/CommonTablePaginationFooter.svelte';

	let page = 1;
	const limit = 50;
	const totalNumberOfItems = 420;

	const apiBoardData = writable<(ExpLeaderboardUserRecord & { class?: string })[]>([]);

	const currentUser = writable<UserExpResponse>({
		exp: 0,
		userAddress: '',
	});

	async function fetchUserExp() {
		const res = await getUserExpPoints();
		$currentUser = res.data;
	}

	async function fetchExpLeaderboard() {
		const params: FetchExpLeaderboardOptions = {
			limit,
			page,
		};

		const res = await getExpLeaderboard(params);
		$apiBoardData = res.data;
	}

	function handlePageSelect(event: CustomEvent) {
		page = event.detail.page;
	}

	$: if (browser && $currentUserAddress) {
		fetchUserExp();
	}

	$: if (browser && page) {
		fetchExpLeaderboard();
	}

	$: users = $apiBoardData.map((u) => {
		u.class = expPointsToColor(u.exp);
		return u;
	});
</script>

<main class="text-white">
	<RewardsHeader />

	<div class="grid grid-cols-[3fr_14fr_4fr] mt-16 mb-32">
		<!-- First column - positions -->
		<div class="flex-col gradient-border !border column-wrap">
			<!-- Header -->
			<div
				class="font-semibold text-xl uppercase text-center py-4 gradient-border !border-x-0 !border-t-0 !border-b"
			>
				Position
			</div>

			<!-- Current user -->
			<div class="font-semibold text-xl uppercase text-center py-4 bg-card-gradient">
				<p class="text-gradient min-w-full text-center whitespace-nowrap">-</p>
			</div>

			<!-- Rest of the leaderboard positions -->
			{#each users as u}
				<div class="font-semibold text-xl py-4 grid place-items-center column-item">
					<p class="">{u.rank}</p>
				</div>
			{/each}
		</div>

		<!-- Second Column - usernames -->
		<div class="flex-col gradient-border !border !border-x-0 column-wrap">
			<!-- Header -->
			<div
				class="font-semibold text-xl uppercase px-8 py-4 gradient-border !border-x-0 !border-t-0 !border-b whitespace-nowrap"
			>
				User Name
			</div>

			<!-- Current user -->
			<a
				href="/profile/{$currentUser.userAddress}"
				class="font-semibold text-xl uppercase px-8 py-4 bg-card-gradient block"
			>
				<p class="text-gradient">You</p>
			</a>

			<!-- Rest of the leaderboard usernames -->
			{#each users as user}
				<div class="font-semibold text-xl px-8 py-4 column-item">
					<a href="/profile/{user.address}" class=""><p>{user.username || 'No Username'}</p></a>
				</div>
			{/each}
		</div>

		<!-- Third column - XP -->
		<div class="flex-col gradient-border !border column-wrap">
			<!-- Header -->
			<div
				class="font-semibold text-xl uppercase text-center py-4 gradient-border !border-x-0 !border-t-0 !border-b whitespace-nowrap"
			>
				Total Exp
			</div>

			<!-- Current user -->
			<div
				class="font-semibold text-xl uppercase text-center py-4 grid place-items-center bg-card-gradient"
			>
				<p class="text-gradient">
					{$currentUser.exp ? +$currentUser.exp.toFixed(3) + ' EXP' : '-'}
				</p>
			</div>

			<!-- Rest of the leaderboard xp -->
			{#each users as user}
				<div
					class="font-semibold text-xl text-center py-4 grid place-items-center column-item {user.class}"
				>
					<p class="">{user.exp}</p>
				</div>
			{/each}
		</div>
	</div>

	<CollectionTablePaginationFooter
		{totalNumberOfItems}
		itemsPerPage={limit}
		on:selected={handlePageSelect}
	/>
</main>

<style lang="postcss">
	.column-wrap > div.column-item {
		@apply border-t border-color-blue border-opacity-20;
	}
</style>
