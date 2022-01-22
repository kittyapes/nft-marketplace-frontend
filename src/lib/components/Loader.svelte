<script>
	import { browser } from '$app/env';
	import LoaderGlow from '$icons/loader/loader-glow.svelte';
	import LoaderIcon from '$icons/loader/loader-icon.svelte';

	// Substract the navbar height from the loader height
	export let compensateNavbar = true;

	$: calculatedHeight = compensateNavbar
		? `calc(${browser ? window.innerHeight + 'px' : '100vh'} - 4rem)`
		: (browser && window.innerHeight + 'px') || '100vh';
</script>

<div class="relative" style="height: {calculatedHeight}">
	<div class="absolute grid place-items-center w-full" style="height: {calculatedHeight}">
		<LoaderIcon />
	</div>

	<div
		class="absolute grid place-items-center w-full animate-pulse"
		style="height: {calculatedHeight}"
	>
		<div class="opacity-50">
			<LoaderGlow />
		</div>
	</div>
</div>
