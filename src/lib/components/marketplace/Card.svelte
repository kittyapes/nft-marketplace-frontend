<script>
	import { fetchNFTfromURI } from '$utils/api/getNFT';
	import { fade } from 'svelte/transition';
	import { popupOpen, selectedCard, priceFilters } from '$stores/marketplace';

	export let uri = '';
	export let maxSupply = 0;

	let hidden = false;

	let data = fetchNFTfromURI(uri.replace('radiant-falls-54169', 'databasewaifu'));

	let openPopup = (_data) => {
		popupOpen.set(true);
		selectedCard.set({ ..._data, maxSupply });
		console.log($selectedCard);
	};

	// brain.exe stopped working
	// $: {
	// 	data.then((res) => {
	// 		statusFilters.subscribe((el) => {
	// 			for (let idx in el) {
	// 				if (el[idx].status == res.status && el[idx].selected) {
	// 					hidden = false;
	// 					break;
	// 				} else {
	// 					hidden = true;
	// 				}
	// 			}
	// 		});
	// 	});
	// }

	$: {
		data.then((res) => {
			if (
				$priceFilters.min < $priceFilters.max &&
				$priceFilters.min != 0 &&
				$priceFilters.max != 0
			) {
				if (parseInt(res.price) < $priceFilters.min || parseInt(res.price) > $priceFilters.max) {
					hidden = true;
				} else {
					hidden = false;
				}
			}
		});
	}
</script>

{#await data}
	<div class="w-56 h-80 rounded-xl border bg-gray-200" />
{:then data}
	<div
		class="w-56 min-h-80 rounded-xl border border-gray-400 cursor-pointer transition-all hover:scale-105"
		transition:fade={{ duration: 500 }}
		class:hidden
		on:click={() => openPopup(data)}
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
