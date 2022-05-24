<script context="module" lang="ts">
	let response: number;

	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		response = status;
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script lang="ts">
	import Error404 from '$icons/error404.svelte';
	import Error403Page from '$lib/components/Error403Page.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { onMount } from 'svelte';

	let loaded = false;

	onMount(() => {
		setTimeout(() => (loaded = true), 0);
	});
</script>

<LoadedContent {loaded}>
	{#if response === 404}
		<div class="h-full w-full grid place-items-center">
			<div class="flex flex-col gap-10 p-40 items-center">
				<Error404 />
				<h1 class="text-7xl py-4 font-semibold text-color-gray-base">Something's missing.</h1>
				<button class="btn btn-rounded gradient-text font-semibold text-5xl" on:click={() => window.history.back()}>Go Back</button>
			</div>
		</div>
	{:else if response === 403}
		<Error403Page />
	{/if}
</LoadedContent>
