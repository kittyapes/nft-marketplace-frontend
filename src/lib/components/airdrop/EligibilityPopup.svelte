<script lang="ts">
	import type { EligibilityPopupOptions } from '$constants/airdrops';

	export let options: EligibilityPopupOptions;

	if (!options) {
		throw new Error('EligibilityPopupOptions not provided');
	}
</script>

<div id="container" class="bg-white rounded-2xl p-8 w-[400px]">
	<h1 class="font-bold text-2xl">{options.shortName} Eligibility</h1>

	<div class="gray-text mt-8">Total Airdrop</div>

	<div class="text-lg">{options.longName}</div>
	<div class="black-text">{options.tokensDrop}</div>

	<div class="gray-text mt-8">Snapshot Balances</div>

	<div class="black-text">{options.balancesTitle}</div>
	<div class="gray-text">{options.balancesValue}</div>
</div>

<style>
	#container {
		border: 3px solid #00000029;
	}

	.gray-text {
		@apply text-lg font-bold;
		color: #807070;
	}

	.black-text {
		@apply text-lg font-bold;
		color: #232323;
	}
</style>
