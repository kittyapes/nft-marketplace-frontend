<script lang="ts">
	import { isPrice } from '$utils/validator/isPrice';

	export let value = '';
	export let valid = true;
	export let validOverride = null;
	export let placeholder = '';
	export let disabled = false;
	export let tokenIconClass: any;

	$: valid = validOverride ?? isPrice(value);
</script>

<div class="relative">
	<input type="text" class="input w-full h-12 outline-none {$$props.class} {!valid && '!border-red-300'} disabled:bg-white" class:font-semibold={value} {placeholder} {disabled} bind:value />
	<div class="absolute right-0 top-0 bottom-0 grid place-items-center w-12">
		<svelte:component this={tokenIconClass} class="w-5 h-5 opacity-80" />
	</div>
</div>
