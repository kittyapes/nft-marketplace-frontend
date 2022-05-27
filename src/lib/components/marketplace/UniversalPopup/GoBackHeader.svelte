<script>
	import LongLeftArrow from '$icons/long-left-arrow.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="border-b border-black border-opacity-30 pb-2">
	<button class="btn flex items-center gap-2 ml-auto" on:click={() => dispatch('go-back')}>
		<LongLeftArrow />
		<p class="text-color-black font-semibold text-sm">GO BACK</p>
	</button>
</div>
