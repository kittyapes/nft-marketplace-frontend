<script lang="ts">
	import Error404 from '$icons/errors/error404.svelte';

	import { currentError } from '$stores/error';

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import Error403Page from './Error403Page.svelte';
	import LoadedContent from './LoadedContent.svelte';

	let loaded = false;

	onMount(() => {
		setTimeout(() => (loaded = true), 0);
	});
</script>

<LoadedContent {loaded}>
	{#if get(currentError) === 404}
		<div class="h-full w-full grid place-items-center">
			<div class="flex flex-col gap-10 p-40 items-center">
				<Error404 />
				<h1 class="text-7xl py-4 font-semibold text-color-gray-base">Something's missing.</h1>
				<button class="btn btn-rounded gradient-text font-semibold text-5xl" on:click={() => window.history.back()}>Go Back</button>
			</div>
		</div>
	{:else if get(currentError) === 403}
		<Error403Page />
	{/if}
</LoadedContent>
