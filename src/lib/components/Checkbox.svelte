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
	border text-color-purple transition relative
	{checked ? 'border-color-purple' : 'border-[#989898] border-opacity-40'}
	{disabled ? 'opacity-50 cursor-default' : ''}"
>
	<input type="checkbox" class="hidden" {id} {name} {disabled} bind:checked on:change={handleChange} />
	{#if checked}
		<div class="absolute grid w-6 -m-px place-items-center">
			<Tick />
		</div>
	{/if}

	{#if label}
		<div class="whitespace-nowrap ml-8 text-white">
			{label}
		</div>
	{/if}
</label>
