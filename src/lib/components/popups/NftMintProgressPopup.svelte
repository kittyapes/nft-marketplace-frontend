<script lang="ts">
	import { goto } from '$app/navigation';
	import Loader from '$icons/loader.svelte';
	import type { PopupHandler } from '$utils/popup';

	import type { Readable } from 'svelte/store';
	import { readable } from 'svelte/store';

	import Popup from '../Popup.svelte';
	import Progressbar from '../Progressbar.svelte';

	const points = [
		{ at: 0, label: 'Upload' },
		{ at: 33, label: 'Bundle TX' },
		{ at: 66, label: 'NFT TX' },
		{ at: 100, label: 'Finished' }
	];

	export let handler: PopupHandler;
	export let progress: Readable<number> = readable(0);

	function clickChooseFormat() {
		goto('/create/choose-listing-format');
		handler.close();
	}
</script>

<Popup class={`min-w-[800px] ${$progress === 100 && 'min-h-[500px]'}`}>
	<div class="font-semibold text-center mt-16 text-lg">Minting progress</div>

	<div class="w-3/4 mx-auto mt-8">
		<Progressbar value={$progress} {points} />
	</div>

	{#if $progress === 100}
		<div class="text-2xl font-semibold text-center mt-16">Proceed to List your Drop?</div>

		<p class="max-w-prose text-center mx-auto mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut</p>

		<div class="flex justify-center gap-x-8 mt-8">
			<button class="btn btn-rounded btn-gradient h-14 w-64 uppercase">View NFT</button>
			<button class="btn btn-rounded btn-gradient h-14 w-64 uppercase" on:click={clickChooseFormat}>Choose listing format</button>
		</div>
	{:else}
		<div class="loading-animation">
			<Loader />
		</div>
	{/if}
</Popup>

<style lang="postcss">
	.loading-animation {
		@apply h-[200px] flex items-center justify-center;
	}
</style>
