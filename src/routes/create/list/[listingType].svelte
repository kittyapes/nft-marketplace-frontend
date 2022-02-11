<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import NftCard from '$lib/components/NftCard.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { capitalize } from 'lodash-es';
	import CommonProperties from './_lib/CommonProperties.svelte';
	import Royalties from './_lib/Royalties.svelte';
	import type { PropertyName } from './_lib/types';

	const tabs = ['sale', 'auction', 'raffle', 'limited-edition', 'queue-drop', 'gacha', 'admin'];
	const tabToProperties: { [key: string]: PropertyName[] } = {
		sale: ['price', 'date', 'quantity']
	};

	$: listingType = $page.params.listingType;
	$: validListingType = tabs.includes(listingType);

	function humanizeType(s: string) {
		return capitalize(s.replace(/-/g, ' '));
	}

	if (browser && !validListingType) {
		goto('/create/list/sale');
	}

	let selectedTab = tabs[0];

	const nftName = 'Todo NFT name';
	const nftCollection = 'Todo NFT collection';
	const nftImagePreview = 'https://i.imgur.com/w3duR07.png';
</script>

<div class="space-x-8">
	{#each tabs as tab}
		<TabButton selected={listingType === tab} on:click={() => goto('/create/list/' + tab)}>
			{humanizeType(tab)}
		</TabButton>
	{/each}
</div>

<hr class="separator" />

<div class="flex mb-32">
	<div class="flex-grow">
		<h1 class="text-xl italic uppercase font-light mt-8">
			Step 2: List for <span class="gradient-text">
				{(validListingType && humanizeType(listingType)) || 'N/A'}
			</span>
		</h1>

		<hr class="separator mt-4" />

		<CommonProperties class="mt-8" propNames={tabToProperties[selectedTab]} />

		<hr class="separator mt-8" />

		<Royalties />
	</div>

	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={nftName || 'N/A'} collectionName={nftCollection} imageUrl={nftImagePreview} />
	</div>
</div>
