<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import Fullscreen from '$icons/fullscreen.svelte';
	import Share from '$icons/share.svelte';
	import { createEventDispatcher } from 'svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import { welcomeNfts } from '$constants/nfts';
	import { clone } from 'lodash';
	import { notifyError, notifySuccess } from '$utils/toast';

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function cycle() {
		nfts.unshift(nfts.pop());
		nfts = nfts;
	}

	let minting = false;

	async function onMint() {
		minting = true;

		const nftData = data;

		// Web3 stuff here

		try {
			// await ....
		} catch (err) {
			console.error(err);
			return notifyError('Failed minting your NFT.');
		}

		minting = false;
		notifySuccess('Successfully minted your NFT!');
	}

	let nfts = clone(welcomeNfts);
	$: data = nfts[0];
</script>

<div class="bg-white rounded-3xl grid grid-cols-2 overflow-hidden w-[1000px] h-[400px]">
	<div class="bg-color-gray-lighter flex flex-col items-center justify-center p-8 relative">
		<img src={data.img} alt="" class="w-72 h-56 object-contain" />
		<div class="mt-4 font-semibold text-xl">{data.name}</div>
		<div class="flex mt-4 space-x-4">
			<a class="transition-btn" href={data.img} target="_blank">
				<Fullscreen />
			</a>

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
		<div
			class="font-bold uppercase mb-1 border-b border-opacity-30 border-black w-full text-center py-1 text-color-black"
		>
			Welcome to Hinata Marketplace
		</div>

		<div class="text-sm text-center mt-8">
			As a welcoming gift, please accept this free NFT from us to you!
		</div>
		<div class="text-xs opacity-70 mt-1">You pay the gas fee</div>

		<button
			class="bg-gradient-to-r from-color-purple to-color-blue w-full py-4 rounded-3xl text-white uppercase mt-8
            transition-btn disabled:opacity-30"
			on:click={onMint}
			disabled={minting}
		>
			Mint Now
		</button>

		<button class="absolute top-4 right-4 transition-btn" on:click={handleClose}>
			<CloseButton />
		</button>
	</div>
</div>
