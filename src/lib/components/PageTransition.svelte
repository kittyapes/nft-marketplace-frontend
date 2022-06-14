<script>
	import { fly } from 'svelte/transition';
	export let url = '';
	const pageTransitionDuration = 300;
</script>

<div class="transition-outer">
	{#key url}
		<div class="transition-inner" in:fly={{ x: -10, duration: pageTransitionDuration, delay: pageTransitionDuration }} out:fly={{ x: 10, duration: pageTransitionDuration }}>
			<slot />
		</div>
	{/key}
</div>

<style>
	.transition-outer {
		display: grid;
		grid-template: 1fr 1fr;
	}
	.transition-inner {
		grid-row: 1;
		grid-column: 1;
	}
</style>
