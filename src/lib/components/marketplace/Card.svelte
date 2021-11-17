<script>
	import { fetchNFTfromURI } from '$lib/api/getNFT';
	import { fade } from 'svelte/transition';
	import { popupOpen } from '../../../../stores/marketplace';

	export let uri = '';
</script>

{#await fetchNFTfromURI(uri.replace('radiant-falls-54169', 'databasewaifu'))}
	<div class="w-56 h-80 rounded-xl border bg-gray-200" />
{:then data}
	<div
		class="w-56 min-h-80 rounded-xl border border-gray-400 cursor-pointer transition-all hover:scale-105"
		transition:fade={{ duration: 500 }}
		on:click={() => popupOpen.set(true)}
	>
		<div class="w-full justify-end flex items-center gap-2 pt-3 px-3">
			<img src="/marketplace/heart.svg" alt="heart" />
			1
		</div>

		<div class="mt-2 aspect-w-1 aspect-h-1 ">
			<img src={data.image} alt="ape" class="object-scale-down" />
		</div>

		<div class="w-full flex justify-between px-2 text-xs opacity-60 mt-2">
			<div>{data.artist}</div>
			<div>Price</div>
		</div>

		<div class="w-full flex justify-between px-2 gap-2 font-bold mt-2 mb-6 flex-1">
			<div class="tracking-tight leading-tight">{data.name} #{data.id}</div>
			<div class="flex gap-1 items-center justify-center flex-shrink-0">
				<img src="/marketplace/ethereum-logo.svg" alt="eth" />
				{data.price}
			</div>
		</div>
	</div>
{/await}
