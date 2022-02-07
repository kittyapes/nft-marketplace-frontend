<script>
	import Tick from '$icons/tick.svelte';

	export let name = '';
	export let checked = false;
	export let id = 'check';
	export let label = '';
</script>

<label
	class="flex items-center gap-4 {$$props.class} w-6 h-6 cursor-pointer
	border rounded text-color-blue transition
	{checked ? 'border-color-blue' : 'border-[#989898] border-opacity-40'}"
>
	<input type="checkbox" class="hidden" {id} {name} bind:checked />
	{#if checked}
		<div class="w-6 grid place-items-center">
			<Tick />
		</div>
	{/if}
	{label}
</label>
