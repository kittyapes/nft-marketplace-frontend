<script>
	import { browser } from '$app/environment';
	import Loader from '$lib/components/Loader.svelte';

	// Substract the navbar height from the loader height
	export let compensateNavbar = true;

	$: calculatedHeight = compensateNavbar ? `calc(${browser ? window.innerHeight + 'px' : '100vh'} - 4rem)` : (browser && window.innerHeight + 'px') || '100vh';
</script>

<div class="relative" style="height: {calculatedHeight}">
	<Loader />
</div>
