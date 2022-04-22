<script>
	import { fade } from 'svelte/transition';
	import { selectedCard } from '$stores/marketplace';
	import { goto } from '$app/navigation';
	import EthIcon from '$icons/eth.svelte';
	import HeartIcon from '$icons/heart.svelte';

	export let metadata;

	let hidden = false;

	let openPopup = (_data) => {
		selectedCard.set({ ..._data });
		goto(`/marketplace/${_data.id}`, { noscroll: true });
	};
</script>

{#if metadata}
	<div class="w-56 min-h-80 rounded-xl border border-gray-400 cursor-pointer transition-all hover:scale-105" transition:fade={{ duration: 500 }} class:hidden on:click={() => openPopup(metadata)}>
		<div class="w-full justify-end flex items-center gap-2 pt-3 px-3">
			<HeartIcon />
			1
		</div>

		<div class="mt-2 aspect-w-1 aspect-h-1 ">
			<img src={metadata.image} alt="ape" class="object-scale-down" />
		</div>

		<div class="w-full flex justify-between px-2 text-xs opacity-60 mt-2">
			<div>{metadata.artist}</div>
			<div>Price</div>
		</div>

		<div class="w-full flex justify-between px-2 gap-2 font-bold mt-2 mb-6 flex-1">
			<div class="tracking-tight leading-tight">{metadata.name}</div>
			<div class="flex gap-1 items-center justify-center flex-shrink-0">
				<EthIcon />
				{metadata.amount}
			</div>
		</div>
	</div>
{/if}
