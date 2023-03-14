<script>
	import RewardsHeader from '../lib/RewardsHeader.svelte';

	const currentUser = {
		exp: 0,
		position: null,
	};

	const users = [
		{
			exp: 3690,
			username: 'Darlene Robertson',
			address: null,
		},
		{
			exp: 2400,
			username: 'ScadjJSm',
			address: null,
		},
		{
			exp: 2120,
			username: 'toe',
			address: null,
		},
	];
</script>

<main class="text-white">
	<RewardsHeader />

	<div class="grid grid-cols-[3fr_14fr_4fr] gradient-border mt-16 mb-10 table-wrapper">
		<!-- Table header -->
		<div
			class="font-semibold text-xl uppercase text-center py-4 border-color-blue border-b-2 border-r-2"
		>
			Position
		</div>
		<div class="font-semibold text-xl uppercase px-8 py-4 border-color-blue border-b-2">
			User Name
		</div>
		<div
			class="font-semibold text-xl uppercase text-center py-4 border-color-blue border-l-2 border-b-2"
		>
			Total Exp
		</div>

		<!-- Current user record -->
		<div class="font-semibold text-xl uppercase text-center py-4">
			<p class="text-gradient min-w-full text-center">{currentUser.position || 'Unranked'}</p>
		</div>

		<div class="font-semibold text-xl uppercase px-8 py-4">
			<p class="text-gradient">You</p>
		</div>

		<div class="font-semibold text-xl uppercase text-center py-4 grid place-items-center">
			<p class="text-gradient">{currentUser.exp || '-'}</p>
		</div>

		{#each users as user, i}
			<div class="font-semibold text-xl py-4 grid place-items-center">
				<p class="">{i}</p>
			</div>

			<div class="font-semibold text-xl px-8 py-4">
				<p class="">{user.username}</p>
			</div>

			<div class="font-semibold text-xl text-center py-4 grid place-items-center">
				<p class="">{user.exp}</p>
			</div>
		{/each}
	</div>
</main>

<style type="postcss">
	.table-wrapper:nth-child(3n + 1) {
		@apply border-color-blue border-opacity-50 border-r border-b;
	}

	.table-wrapper:nth-child(3n + 2) {
		@apply border-color-blue border-opacity-50 border-b;
	}

	.table-wrapper:nth-child(3n + 3) {
		@apply border-color-blue border-opacity-50 border-l border-b;
	}
</style>
