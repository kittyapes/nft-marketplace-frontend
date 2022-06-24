<script>
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col justify-center h-[90%]">
	<img class="h-24" src={getIconUrl('purchase-error')} alt="" />

	<div class="font-bold text-2xl text-center text-red-500 mt-4">Error!</div>
	<div class="opacity-50 text-center mt-4">NFT purchase failed.</div>

	<button class="btn btn-gradient btn-rounded uppercase font-bold w-1/2 mx-auto mt-32" on:click={() => dispatch('set-state', { name: 'browse' })}>Continue shopping</button>
</div>
