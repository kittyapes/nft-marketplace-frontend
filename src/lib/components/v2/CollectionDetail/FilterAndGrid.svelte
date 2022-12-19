<script lang="ts">
	import SortButton from '$components/v2/SortButton/+page.svelte';
	import GridSelector from '$components/v2/GridSelector/+page.svelte';
	import Search from '$icons/search.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import Input from '../Input/Input.svelte';

	export let searchPhrase: string;
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	export let nfts: CardOptions[];

	let sortOptions: { title: string; action?: any }[] = [
		{
			title: 'Ending soon',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return a?.listingData?.endTime - b?.listingData?.endTime;
				});
			},
		},
		{
			title: 'Price low to high',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return parseFloat(a?.saleData?.price) - parseFloat(b?.saleData?.price);
				});
			},
		},
		{
			title: 'Price high to low',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return parseFloat(b?.saleData?.price) - parseFloat(a?.saleData?.price);
				});
			},
		},
		{
			title: 'Most favorited',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return b?.nfts?.[0]?.likes - a?.nfts?.[0]?.likes;
				});
			},
		},
	];
</script>

<div class="flex flex-row items-center gap-x-5 mt-8">
	<Input bind:value={searchPhrase} class="rounded-none border-2 border-gradient h-14 hover:text-white" placeholder="Search by name or attribute" height="44px">
		<Search class="ml-6 w-5 h-6" />
	</Input>

	<SortButton bind:sortOptions class="h-14 min-w-[10rem]" />

	<GridSelector bind:gridStyle />
</div>
