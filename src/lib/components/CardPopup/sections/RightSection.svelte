<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';

	import { currentUserAddress } from '$stores/wallet';
	import { getOnChainListing, type ChainListing } from '$utils/contracts/listing';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import HistorySection from './HistorySection/HistorySection.svelte';
	import InfoSection from './InfoSection.svelte';
	import TradeSection from './TradeSection/TradeSection.svelte';

	export let options: CardOptions;
	let chainListing: ChainListing;

	// Check NFT balance to enable/disable trading functionality
	let nftBalance = null;

	async function refreshBalance() {
		if ($currentUserAddress) {
			nftBalance = (await getUserNftBalance(options.nfts[0].contractAddress, options.nfts[0].onChainId)).balance;
		} else {
			nftBalance = 0;
		}
	}

	onMount(async () => {
		if (options.listingData?.onChainId) {
			refreshOnChainListing();
		}

		refreshBalance();
	});

	async function refreshOnChainListing() {
		chainListing = await getOnChainListing(options.listingData.onChainId);
		console.debug('[On chain listing data]:', chainListing);
	}

	// The back button is controlled by dynamic components
	export let showBackButton: boolean;

	let tabs: { text: string; icon: string; sectionComponent: any; loading: boolean; disabled?: boolean }[] = [];

	$: staleResource = options.staleResource;
	$: tabs = [
		{ text: 'Info', icon: 'info', sectionComponent: InfoSection, loading: false },
		{
			text: 'Trade',
			icon: 'trade',
			sectionComponent: TradeSection,
			loading: nftBalance === null && options.resourceType !== 'listing',
			disabled: options.resourceType === 'nft' && !nftBalance,
		},
		{ text: 'History', icon: 'history', sectionComponent: HistorySection, loading: false },
	];

	// Set default tab and prevent overwiriting when statement above
	$: selectedTab = selectedTab || (options.resourceType === 'listing' && tabs[1]) || tabs[0];

	export function goBack() {
		tabComponentInstance.goBack?.();
	}

	let tabComponentInstance;
</script>

<div class="flex flex-col h-full pl-8 overflow-hidden">
	<!-- Tabs -->
	<div class="flex flex-grow-0 space-x-6">
		{#each tabs as tab}
			<button
				class="flex items-center space-x-2 btn text-[#8C8C8C] outline-none focus-visible:bg-gray-100 p-2 rounded-md"
				class:tab-loading={tab.loading}
				on:click={() => (selectedTab = tab)}
				disabled={tab.disabled}
				transition:fade|local
			>
				<img class="h-8" src={getIconUrl('card-popup-tab-icon/' + tab.icon + (tab.text === selectedTab.text ? '.selected' : ''))} alt={tab.text} />
				<div class="" class:text-gradient={tab.text === selectedTab.text}>{tab.text}</div>
			</button>
		{/each}
	</div>

	<svelte:component
		this={selectedTab.sectionComponent}
		{options}
		{chainListing}
		on:close-popup
		on:force-expire
		bind:showBackButton
		bind:this={tabComponentInstance}
		on:listing-created={refreshBalance}
	/>
</div>

<style>
	.tab-loading {
		@apply bg-gray-100 text-transparent rounded-lg;
	}

	.tab-loading > img {
		@apply opacity-0;
	}
</style>
