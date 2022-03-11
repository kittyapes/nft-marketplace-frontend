<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import Fullscreen from '$icons/fullscreen.svelte';
	import { createEventDispatcher } from 'svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import { welcomeNfts } from '$constants/nfts';
	import { clone } from 'lodash-es';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { closePopup } from '$utils/popup';
	import { claimFreeNft } from '$utils/api/freeNft';
	import {
		appSigner,
		currentUserAddress,
		welcomeNftClaimed,
		welcomeNftMessage
	} from '$stores/wallet';

	const dispatch = createEventDispatcher();

	function cycle() {
		nfts.unshift(nfts.pop());
		nfts = nfts;
	}

	let minting = false;
	let minted = false;

	async function onMint() {
		minting = true;

		const nftData = data;

		try {
			// Web3 stuff here
			// await .... mint(nftData. ...)
			// And please set welcomeNftClaimed (in stores/wallet)
			// Update this store walue on wallet connect.

			if ($welcomeNftMessage && $welcomeNftClaimed) {
				const signature = await $appSigner.signMessage($welcomeNftMessage).catch((err) => {
					console.log(err);
					notifyError('Failed to Sign Message');
					return '';
				});

				console.log(signature);

				if (signature) {
					const claimRes = await claimFreeNft(
						welcomeNfts.indexOf(nfts[0]),
						$currentUserAddress,
						signature
					);
					console.log('Here', claimRes);
					notifySuccess('Successfully minted your NFT!');
				}
			} else {
				notifyError(
					$welcomeNftClaimed
						? "It appears you've already claimed your free NFT, please check your wallet to confirm this"
						: 'Failed to mint your NFT'
				);
			}
		} catch (err) {
			console.error(err);
			return notifyError('Failed minting your NFT.');
		}

		minting = false;
		minted = true;
	}

	let nfts = clone(welcomeNfts);
	$: data = nfts[0];
</script>

<div class="bg-white rounded-3xl grid grid-cols-2 overflow-hidden w-[1000px] h-[400px]">
	<div class="bg-color-gray-lighter flex flex-col items-center justify-center p-8 relative">
		<img src={data.img} alt="" class="w-72 h-56 object-contain" />
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
		<div
			class="font-bold uppercase mb-1 border-b border-opacity-30 border-black w-full text-center py-1 text-color-black"
		>
			Welcome to Hinata Marketplace
		</div>

		<div class="text-sm text-center mt-8">
			Thanks for signing up! Choose your free NFT in either portrait or landscape.
		</div>
		<!-- <div class="text-xs opacity-70 mt-1">You pay the gas fee</div> -->

		<button
			class="bg-gradient-to-r from-color-purple to-color-blue w-full py-4 rounded-3xl text-white uppercase mt-8
            transition-btn disabled:opacity-30"
			on:click={onMint}
			disabled={minting || minted}
		>
			Mint Now
		</button>

		<button class="absolute top-4 right-4 transition-btn" on:click={closePopup}>
			<CloseButton />
		</button>
	</div>
</div>
