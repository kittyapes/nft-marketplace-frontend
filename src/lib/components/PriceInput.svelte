<script lang="ts">
	import { ethAmountRegex, regexFilter } from '$actions/regexFilter';
	import { isPrice } from '$utils/validator/isPrice';

	export let value = '';
	export let valid = true;
	export let validOverride = null;
	export let placeholder = '';
	export let disabled = false;
	export let tokenIconClass: any;
	export let tokenLabel = 'N/A';

	$: valid = validOverride ?? isPrice(value);
</script>

<div class="relative text-white">
	<input
		type="text"
		class="input w-full h-12 outline-none {$$props.class} {!valid &&
			value &&
			'!border-red-300'} disabled:opacity-50 peer"
		class:font-semibold={value}
		{placeholder}
		{disabled}
		bind:value
		use:regexFilter={{ regex: ethAmountRegex }}
	/>
	<div
		class="absolute right-0 top-0 bottom-0 flex items-center justify-center w-24 gap-2 bg-dark-gradient-lighter bg-gradient-a border-l border-inherit peer-focus:border-color-purple {!valid &&
			value &&
			'!border-red-300'}"
	>
		<div>{tokenLabel}</div>
		<svelte:component this={tokenIconClass} class="w-5 h-5 opacity-80" />
	</div>
</div>
