<script lang="ts">
	import { ethAddressRegex, isEthAddress } from '$utils/validator/isEthAddress';

	// Prettier would break this line
	const prettierFix = `Royalties (<span class="gradient-text">Optional</span>)`;

	export const values: { fees: number | string; address: string }[] = [
		{ fees: null, address: '' },
		{ fees: null, address: '' },
		{ fees: null, address: '' }
	];

	export let isValid = false;

	$: isValid = values.every((v) => (!!v.fees === !!v.address && isEthAddress(v.address)) || (v.fees == null && v.address == ''));
</script>

<div class="pr-12">
	<h1 class="{$$props.class} uppercase font-semibold mt-8">{@html prettierFix}</h1>

	<div class="flex gap-x-4 mt-4">
		<div id="percent-container" class="grid w-24">
			<div class="text-color-black uppercase font-light text-sm">Fees</div>
			{#each values as value}
				<input type="number" class="input input-hide-controls mt-4 first:mt-2" placeholder="%" required={!!value.address} bind:value={value.fees} />
			{/each}
		</div>

		<div class="grid flex-grow">
			<div class="text-color-black uppercase font-light text-sm">Wallet address</div>
			{#each values as value}
				<input type="text" class="input mt-4 first:mt-2" placeholder="Enter wallet address" autocomplete="nope" pattern={ethAddressRegex} required={!!value.fees} bind:value={value.address} />
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
