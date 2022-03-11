<script lang="ts">
	import { log } from '$utils/debug';

	import { ethAddressRegex, isEthAddress } from '$utils/validator/isEthAddress';

	// Prettier would break this line
	const prettierFix = `Royalties (<span class="gradient-text">Optional</span>)`;

	export const values: { percentage: number; ethAddress: string }[] = [
		{ percentage: null, ethAddress: '' },
		{ percentage: null, ethAddress: '' },
		{ percentage: null, ethAddress: '' }
	];

	export let isValid = false;

	$: isValid = values.every(
		(v) =>
			(!!v.percentage === !!v.ethAddress && isEthAddress(v.ethAddress)) ||
			(v.percentage == null && v.ethAddress == '')
	);
</script>

<div class="pr-12">
	<h1 class="{$$props.class} uppercase font-bold mt-8">{@html prettierFix}</h1>

	<div class="flex gap-x-4 mt-4">
		<div id="percent-container" class="grid w-24">
			<div class="text-color-black italic uppercase font-light text-sm">Fees</div>
			{#each values as value}
				<input
					type="number"
					class="input input-hide-controls mt-4 first:mt-2"
					placeholder="%"
					required={!!value.ethAddress}
					bind:value={value.percentage}
				/>
			{/each}
		</div>

		<div class="grid flex-grow">
			<div class="text-color-black italic uppercase font-light text-sm">Wallet address</div>
			{#each values as value}
				<input
					type="text"
					class="input mt-4 first:mt-2"
					placeholder="Enter wallet address"
					autocomplete="nope"
					pattern={ethAddressRegex}
					required={!!value.percentage}
					bind:value={value.ethAddress}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	input {
		@apply w-full h-12;
	}

	#percent-container input {
		@apply text-center;
	}
</style>
