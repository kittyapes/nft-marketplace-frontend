<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onCrossClick() {
		dispatch('cross-click');
	}

	export let text: string;
</script>

<div class="border px-4 py-2 rounded-lg items-center space-x-3 inline-flex max-w-max">
	<div class="font-semibold select-none">
		{text}
	</div>

	<button class="btn active:opacity-80 transition outline-none focus-visible:scale-125 opacity-80" on:click={onCrossClick}>
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<line x1="11.8585" y1="1.27642" x2="1.33504" y2="11.7998" stroke="#1D1D1D" stroke-width="1.5" />
			<line x1="11.7646" y1="11.7881" x2="1.24118" y2="1.26473" stroke="#1D1D1D" stroke-width="1.5" />
		</svg>
	</button>
</div>
