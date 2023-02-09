<script lang="ts">
	export let value = '';
	export let disabled = false;
	export let placeholder = '';
	export let validator: (v: string) => boolean = () => true;

	$: valid = validator(value);
</script>

<input type="text" class="input w-full h-12 outline-none {!valid && '!border-red-300'} disabled:opacity-50 peer" class:font-semibold={value} {placeholder} {disabled} bind:value />
