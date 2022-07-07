<script>
	import Tick from '$icons/tick.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let name = '';
	export let checked = false;
	export let id = 'check';
	export let label = '';
	export let disabled = false;

	function handleChange(event) {
		if (event.target.checked) {
			dispatch('checked');
		} else {
			dispatch('unchecked');
		}

		dispatch('change');
	}
</script>

<label
	class="flex items-center gap-4 {$$props.class} w-6 h-6 cursor-pointer
	border rounded text-color-blue transition relative
	{checked ? 'border-color-blue' : 'border-[#989898] border-opacity-40'}"
>
	<input type="checkbox" class="hidden" {id} {name} {disabled} bind:checked on:change={handleChange} />
	{#if checked}
		<div class="absolute grid w-6 -m-px place-items-center">
			<Tick />
		</div>
	{/if}

	{#if label}
		<div class="ml-10 text-black whitespace-nowrap">
			{label}
		</div>
	{/if}
</label>
