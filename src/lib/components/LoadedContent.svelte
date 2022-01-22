<script lang="ts">
	import { fade } from 'svelte/transition';
	import LoaderScreen from '$lib/components/LoaderScreen.svelte';

	// This could also accept a promise in the future
	export let loaded: any = true;

	let loaderOut = false;
	let contentOut = true;
</script>

{#if loaded}
	{#if loaderOut}
		<!-- Cannot be local because it would break ¯\_(ツ)_/¯ -->
		<div
			transition:fade
			on:introend={() => (contentOut = false)}
			on:outroend={() => (contentOut = true)}
		>
			<slot />
		</div>
	{/if}
{:else if contentOut}
	<div
		transition:fade|local
		on:introend={() => (loaderOut = false)}
		on:outroend={() => (loaderOut = true)}
	>
		<LoaderScreen />
	</div>
{/if}
