<script lang="ts">
	import { goto } from '$app/navigation';
	import Loader from '$icons/loader.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { newBundleData } from '$utils/create';
	import type { PopupHandler } from '$utils/popup';

	import type { Readable } from 'svelte/store';
	import { readable } from 'svelte/store';

	import Popup from '../Popup.svelte';
	import Progressbar from '../Progressbar.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';
	import Spinner from '../v2/Spinner/Spinner.svelte';

	const points = [
		{ at: 0, label: 'Upload', top_value: null },
		{ at: 50, label: 'NFT TX', top_value: null },
		{ at: 100, label: 'Finished', top_value: null },
	];

	export let handler: PopupHandler;
	export let progress: Readable<number> = readable(0);
	export let id: string;

	function clickChooseFormat() {
		goto('/create/choose-listing-format/' + $newBundleData.id);
		handler.close();
	}

	function clickViewNft() {
		goto(`/profile/${$currentUserAddress}?tab=created&id=${id}`);
		handler.close();
	}

	$: mintingComplete = $progress === 100;
</script>

<div class="w-[800px] h-[400px] grid items-stretch text-white">
	<Popup>
		<div class="p-16">
			<div class="text-center text-4xl">Proceed to List your NFT?</div>

			<div class="text-center mt-4">Listing an NFT will reqiure a small network fee. Once you choose the listing format you will be prompted to send an WETHereum transaction.</div>

			<div class="w-3/4 mx-auto mt-12 flex items-center gap-2">
				<div class="flex-grow w-full flex-shrink-0">
					<Progressbar value={$progress} {points} />
				</div>

				{#if !mintingComplete}
					<div class="w-8 h-8 flex-shrink-0">
						<Spinner />
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-2 justify-center gap-x-4 mt-16 w-[500px] mx-auto">
				<PrimaryButton on:click={clickViewNft} disabled={!mintingComplete}>View NFT</PrimaryButton>
				<PrimaryButton on:click={clickChooseFormat} disabled={!mintingComplete}>Choose listing format</PrimaryButton>
			</div>
		</div>
	</Popup>
</div>

<style lang="postcss">
	.loading-animation {
		@apply h-[200px] flex items-center justify-center;
	}
</style>
