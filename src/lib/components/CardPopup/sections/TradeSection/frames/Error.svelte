<script>
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col justify-center h-[90%]">
	<img class="h-24" src={getIconUrl('purchase-error')} alt="" />

	<div class="mt-4 text-2xl font-bold text-center text-red-500">Error!</div>
	<div class="mt-4 text-center opacity-50">Failed to perform action.</div>

	<button class="w-1/2 mx-auto mt-32 font-bold uppercase btn btn-gradient btn-rounded" on:click={() => dispatch('set-state', { name: 'browse' })}>Continue shopping</button>
</div>
