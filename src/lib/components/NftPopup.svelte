<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import Fullscreen from '$icons/fullscreen.svelte';
	import Share from '$icons/share.svelte';
	import type { NftData } from '$lib/data/nft';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import Separator from './Separator.svelte';
	import TextInput from './TextInput.svelte';

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	// TODO remove this
	export let data: NftData = {
		img: `https://picsum.photos/200/200`,
		name: 'Chillmeleon #3,806',
		collectionName: 'Bored Ape Yacht Club',
		likes: 100,
		priceEth: 3.2,
		ownedByUser: true
	};
</script>

<div class="bg-white rounded-3xl grid grid-cols-2 overflow-hidden w-[800px]">
	<div class="bg-[#F2F2F2] flex flex-col items-center p-8">
		<img src={data.img} alt="" class="rounded-2xl w-84 h-84" />
		<div class="mt-4 font-semibold text-xl">{data.name}</div>
		<div class="flex mt-4 space-x-4">
			<button>
				<Fullscreen />
			</button>

			<button>
				<Share />
			</button>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center px-8 relative">
		<div class="font-semibold uppercase mb-1">Transfer Your Nft</div>
		<Separator />
		<div class="uppercase text-sm text-left font-bold text-[#4B4B4B] w-full mt-8">
			Wallet Address or ENS Name
		</div>
		<TextInput outline placeholder="example: 0xB45X... or hinata.eth" class="mt-2 mb-2 w-full" />
		<Button gradient class="!w-full mt-3" --py="0.75rem">Send</Button>
		<Separator class="mt-6" />

		<button class="absolute top-4 right-4 transition-btn" on:click={handleClose}>
			<CloseButton />
		</button>
	</div>
</div>
