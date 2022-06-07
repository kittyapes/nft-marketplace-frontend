<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import Loader from '$icons/loader.svelte';
	import { welcomeNfts } from '$constants/nfts';
	import { clone } from 'lodash-es';
	import { notifyError, notifySuccess } from '$utils/toast';
	import type { PopupHandler } from '$utils/popup';
	import { claimFreeNft } from '$utils/api/freeNft';
	import { appSigner, currentUserAddress, welcomeNftMessage } from '$stores/wallet';

	export let handler: PopupHandler;

	function cycle() {
		nfts.unshift(nfts.pop());
		nfts = nfts;
	}

	let minting = false;
	let minted = false;

	async function onMint() {
		minting = true;

		try {
			let signature = '';

			if ($welcomeNftMessage) {
				try {
					signature = await $appSigner.signMessage($welcomeNftMessage);
				} catch {
					notifyError('Failed to Sign Message');
					return;
				}
			}

			const claimed = await claimFreeNft(nfts[0].id, $currentUserAddress, signature);

			if (!claimed) {
				notifyError('Failed to Claim Free NFT');
				return;
			}

			notifySuccess('Successfully minted your NFT!');
			minted = true;
			handler.close();
		} catch (err) {
			console.error('FREE NFT ERROR: ', err);
			notifyError('Failed minting your NFT.');
		} finally {
			minting = false;
		}
	}

	let nfts = clone(welcomeNfts);
	$: data = nfts[0];
</script>

<div class="bg-white rounded-3xl grid grid-cols-2 overflow-hidden w-[1000px] h-[400px]">
	<div class="bg-color-gray-lighter flex flex-col items-center justify-center p-8 relative">
		<!-- <img src={data.img} alt={data.name} class="w-72 h-56 object-contain" /> -->
		<video src={data.img} class="w-72 h-56 object-contain" autoplay loop>
			<track kind="captions" />
		</video>
		<div class="mt-4 font-semibold text-xl">{data.name}</div>
		<div class="flex mt-4 space-x-4">
			<!-- <a class="transition-btn" href={data.img} target="_blank">
				<Fullscreen />
			</a> -->

			<!-- <button class="transition-btn">
				<Share />
			</button> -->
		</div>

		<button
			class="absolute top-0 bottom-0 left-4 my-auto bg-white w-8 h-8 rounded-full grid place-items-center shadow
            transition-btn"
			on:click={cycle}
		>
			<ChevronLeft />
		</button>

		<button
			class="absolute top-0 bottom-0 right-4 my-auto bg-white w-8 h-8 rounded-full grid place-items-center shadow
            transition-btn"
			on:click={cycle}
		>
			<ChevronRight />
		</button>
	</div>

	<div class="flex flex-col items-center justify-center px-8 relative w-full">
		<div class="font-bold uppercase mb-1 border-b border-opacity-30 border-black w-full text-center py-1 text-color-black">Welcome to Hinata Marketplace</div>

		<div class="text-sm text-center mt-8">Thanks for signing up! Choose your free NFT in either portrait or landscape.</div>
		<!-- <div class="text-xs opacity-70 mt-1">You pay the gas fee</div> -->

		<button
			class="bg-gradient-to-r from-color-purple to-color-blue w-full py-4 rounded-3xl text-white uppercase mt-8
            transition-btn disabled:opacity-30"
			on:click={onMint}
			disabled={minting || minted}
		>
			{#if minting}
				<div class="loading-animation">
					<Loader />
				</div>
			{:else}
				Mint Now
			{/if}
		</button>

		<button class="absolute top-4 right-4 transition-btn" on:click={handler.close}>
			<CloseButton />
		</button>
	</div>
</div>

<style lang="postcss">
	.loading-animation {
		@apply h-12 flex items-center justify-center;
	}
</style>
