<script lang="ts">
	import type { AirdropPopupOptions } from '$constants/airdrops';
	import ThemedCheck from '$icons/themed-check.svelte';

	export let options: AirdropPopupOptions;

	if (!options) {
		throw new Error('AirdropPopupOptions not provided');
	}

	// @ts-ignore
	$: totalValue = options.eligibleOne * options.valueOne + options.eligibleTwo * options.valueTwo;
</script>

<div id="container" class="bg-white rounded-2xl w-[400px]">
	<h1 class="font-bold text-2xl p-8 px-16">You have an airdrop!</h1>

	<div class="h-px bg-black opacity-20" />

	<div class="p-8 px-16">
		<div class="flex items-center">
			<div class="mr-4">Community Airdrop 1</div>
			{#if options.eligibleOne}
				<ThemedCheck />
			{/if}
		</div>
		<div class="font-bold text-color-black">{options.valueOne} HiNATA</div>

		<div class="flex items-center mt-6">
			<div class="mr-4">Community Airdrop 2</div>
			{#if options.eligibleTwo}
				<ThemedCheck />
			{/if}
		</div>
		<div class="font-bold text-color-black">{options.valueTwo} HiNATA</div>
	</div>

	<div class="h-px bg-black opacity-20" />

	<div class="p-8 px-16">
		<div class="font-bold text-[#807070]">Total Airdrop</div>
		<div class="font-bold text-color-black">{totalValue} HiNATA</div>
	</div>
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
