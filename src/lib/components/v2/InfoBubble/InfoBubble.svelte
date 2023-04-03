<script lang="ts">
	import { fade } from 'svelte/transition';

	export let gradientText = true;
	export let boldText = true;
	export let wedgePosition: 'left' | 'center' = 'left';

	// Adding 2px, because border is ignored by calculations
	$: wedgePosStyle = { left: 'left: 1.05rem', center: 'left: calc(50% + 2px)' }[wedgePosition];
</script>

<div
	class="bg-dark-gradient custom-shadow p-3 pr-4 rounded-none max-w-md border-gradient text-base"
	on:pointerenter
	on:pointerleave
	out:fade|local={{ duration: 100 }}
	class:font-bold={boldText}
>
	<div class="relative text-white" class:text-gradient={gradientText}>
		<!-- Wedge -->
		<div
			class="absolute -translate-y-5 rotate-45 w-5 h-5 bg-dark-gradient border-gradient -translate-x-1/2"
			style={wedgePosStyle}
		/>
		<div
			class="absolute -translate-y-3 w-10 h-5 bg-dark-gradient -translate-x-1/2"
			style={wedgePosStyle}
		/>

		<span class="relative">
			<slot />
		</span>
	</div>
</div>

<style>
	.custom-shadow {
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.12);
	}
</style>
