<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import { filters } from '$stores/marketplace';
	import { onMount } from 'svelte';

	let min: number;
	let max: number;

	onMount(() => {
		if ($filters?.price) {
			min = $filters.price?.priceMin;
			max = $filters.price?.priceMax;
		}
	});

	const updateValues = () => {
		$filters.price = {
			priceMin: min === 0 || min ? min : null,
			priceMax: max === 0 || max ? max : null
		};
	};

	$: if (((min === 0 || min) && min !== $filters.price?.priceMin) || ((max === 0 || max) && max !== $filters.price?.priceMax)) updateValues();
</script>

<div>
	<div class="text-gray-600 focus-within:text-gray-400">
		<button class="text-black rounded-md border-black border w-full text-sm px-4 py-2.5 text-center flex items-center justify-between">
			<div class="flex items-center gap-3">
				<Eth />
				ETH
			</div>
			<div class="">
				<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</button>
	</div>

	<div class="w-full flex justify-between items-center gap-3 mt-4">
		<input type="number" class="w-24 h-10 border border-black border-opacity-50 rounded-md pl-4" placeholder="MIN" bind:value={min} min="0" />
		TO
		<input type="number" class="w-24 h-10 border border-black border-opacity-50 rounded-md pl-4" placeholder="MAX" bind:value={max} min="0" />
	</div>
</div>
