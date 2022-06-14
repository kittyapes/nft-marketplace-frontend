<script>
	import LongLeftArrow from '$icons/long-left-arrow.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="pb-2 border-b border-black border-opacity-30">
	<button class="flex items-center gap-2 ml-auto btn" on:click={() => dispatch('go-back')}>
		<LongLeftArrow />
		<p class="text-sm font-semibold text-color-black">GO BACK</p>
	</button>
</div>
