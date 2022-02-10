<script lang="ts">
	import { page } from '$app/stores';
	import TabButton from '$lib/components/TabButton.svelte';
	import CommonProperties from './_lib/CommonProperties.svelte';
	import type { PropertyName } from './_lib/types';

	const listingType = $page.params.listingType;
	const tabs = ['Sale', 'Auction', 'Raffle', 'Limited Edition', 'Queue Drop', 'Gacha', 'Admin'];

	const tabToProperties: { [key: string]: PropertyName[] } = {
		Sale: ['price', 'date', 'quantity']
	};

	let selectedTab = tabs[0];
</script>

<div class="space-x-8">
	{#each tabs as tab}
		<TabButton selected={selectedTab === tab} on:click={() => (selectedTab = tab)}>{tab}</TabButton>
	{/each}
</div>

<hr class="separator" />

<h1 class="text-xl italic uppercase font-light mt-8">
	Step 2: List for <span class="gradient-text">Sale</span>
</h1>

<hr class="separator mt-4" />

<CommonProperties class="mt-8" propertyNames={tabToProperties[selectedTab]} />
