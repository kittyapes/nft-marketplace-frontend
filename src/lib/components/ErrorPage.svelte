<script lang="ts">
	import Error404 from '$icons/errors/error404.svelte';
	import Error403Page from './Error403Page.svelte';

	export let errorCode: number;
</script>

{#if errorCode === 403}
	<Error403Page />
{:else if errorCode}
	<div class="h-full w-full grid place-items-center">
		<div class="flex flex-col gap-10 p-40 items-center">
			<Error404 />
			<h1 class="text-7xl py-4 font-semibold text-color-gray-base">Something's missing.</h1>
			<button class="btn btn-rounded text-gradient font-semibold text-5xl" on:click={() => window.history.back()}>Go Back</button>
		</div>
	</div>
{/if}
