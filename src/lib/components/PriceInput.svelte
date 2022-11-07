<script lang="ts">
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

<div class="relative">
	<input type="text" class="input w-full h-12 outline-none {$$props.class} {!valid && '!border-red-300'} disabled:bg-white peer" class:font-semibold={value} {placeholder} {disabled} bind:value />
	<div
		class="absolute right-0 top-0 bottom-0 flex items-center justify-center w-24 gap-2 bg-dark-gradient-lighter bg-gradient-a border-l border-inherit peer-focus:border-color-purple {!valid &&
			'!border-red-300'}"
	>
		<div>{tokenLabel}</div>
		<svelte:component this={tokenIconClass} class="w-5 h-5 opacity-80" />
	</div>
</div>
