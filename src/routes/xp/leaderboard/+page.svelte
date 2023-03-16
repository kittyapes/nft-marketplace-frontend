<script>
	import { browser } from '$app/environment';
	import { currentUserAddress } from '$stores/wallet';
	import { getExpPoints } from '$utils/api/exp';
	import { writable } from 'svelte/store';
	import { expPointsToColor } from '..';
	import RewardsHeader from '../lib/RewardsHeader.svelte';

	let currentUser = writable({
		exp: 0,
		userAddress: '',
	});

	async function fetchUserExp() {
		const res = await getExpPoints();
		$currentUser = res.data.data;
		console.log($currentUser);
	}

	$: if (browser && $currentUserAddress) {
		fetchUserExp();
	}

	// $: users = apiBoardData.map((u) => {
	// 	u.class = expPointsToColor(u.exp);
	// 	return u;
	// });
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
				<p class="text-gradient min-w-full text-center whitespace-nowrap">Coming soon</p>
			</div>

			<!-- Rest of the leaderboard positions 
			{#each users as _, i}
				<div class="font-semibold text-xl py-4 grid place-items-center column-item">
					<p class="">{i + 1}</p>
				</div>
			{/each} -->
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

			<!-- Rest of the leaderboard usernames 
			{#each users as user}
				<div class="font-semibold text-xl px-8 py-4 column-item">
					<p class="">{user.username}</p>
				</div>
			{/each} -->
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
				<p class="text-gradient">{$currentUser.exp ? $currentUser.exp + ' EXP' : '-'}</p>
			</div>

			<!-- Rest of the leaderboard xp 
			{#each users as user}
				<div
					class="font-semibold text-xl text-center py-4 grid place-items-center column-item {user.class}"
				>
					<p class="">{user.exp}</p>
				</div>
			{/each} -->
		</div>
	</div>
</main>

<style type="postcss">
	.column-wrap > div.column-item {
		@apply border-t border-color-blue border-opacity-20;
	}
</style>
