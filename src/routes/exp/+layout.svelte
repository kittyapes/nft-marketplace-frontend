<script lang="ts">
	import { page } from '$app/stores';
	import HorizontalSeparator from './lib/HorizontalSeparator.svelte';
</script>

<div class="max-w-screen-xl mx-auto w-full px-8">
	<div class="relative">
		<div class="w-full absolute bottom-0">
			<HorizontalSeparator />
		</div>

		<div id="tab-container" class="text-white mt-24 flex gap-x-12 text-xl font-medium">
			<a href="./exp-program" class:selected={$page.url.pathname.includes('/exp-program')}>
				EXP Program
			</a>

			<a href="./leaderboard" class:selected={$page.url.pathname.includes('/leaderboard')}>
				Leaderboard
			</a>

			<a href="./claim-and-stake" class:selected={$page.url.pathname.includes('/claim-and-stake')}>
				Claim & Stake
			</a>
		</div>
	</div>

	<slot />
</div>

<style>
	#tab-container > a {
		@apply pb-1 z-10;
	}

	#tab-container > a.selected {
		@apply border-b-[3px];

		background: linear-gradient(
				56.67deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			#67d4f8;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
		@apply max-w-fit;
	}
</style>
