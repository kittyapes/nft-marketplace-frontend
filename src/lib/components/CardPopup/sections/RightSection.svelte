<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';

	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getOnChainListing, type ChainListing } from '$utils/contracts/listing';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { _refreshOnChainListingHelper } from '../cardPopup';
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

	_refreshOnChainListingHelper.subscribe(() => options.listingData && refreshOnChainListing());

	// The back button is controlled by dynamic components
	export let showBackButton: boolean;

	let tabs: { text: string; icon: string; sectionComponent: any; visible: boolean }[] = [];

	$: staleResource = options.staleResource;
	$: tabs = [
		{ text: 'Info', icon: 'info', sectionComponent: InfoSection, visible: true },
		{
			text: 'Trade',
			icon: 'trade',
			sectionComponent: TradeSection,
			visible: (options.resourceType === 'listing' || (options.resourceType === 'nft' && nftBalance)) && !$staleResource && options.allowTrade
		}
	];

	// Set default tab and prevent overwiriting when statement above
	$: selectedTab = selectedTab || (options.resourceType === 'listing' && tabs[1]) || tabs[0];

	export function goBack() {
		tabComponentInstance.goBack?.();
	}

	let tabComponentInstance;

	let showCannotTrade = false;

	let tradeTab: HTMLElement;
</script>

<div class="flex flex-col h-full pl-8 overflow-hidden">
	<!-- Tabs -->
	<div class="flex flex-grow-0 space-x-6">
		{#each tabs.filter((t) => t.visible) as tab}
			{@const hoverCannotTrade = tab.icon === 'trade' && options.nfts?.[0]?.isExternal}

			<button
				class="flex items-center space-x-2 btn"
				on:click={() => (selectedTab = tab)}
				on:pointerenter={() => hoverCannotTrade && (showCannotTrade = true)}
				on:pointerleave={() => (showCannotTrade = false)}
				bind:this={tradeTab}
				transition:fade|local
			>
				<img class="h-8" src={getIconUrl('card-popup-tab-icon/' + tab.icon + (tab.text === selectedTab.text ? '.selected' : ''))} alt={tab.text} />
				<div class="text-[#8C8C8C]" class:gradient-text={tab.text === selectedTab.text}>{tab.text}</div>
			</button>
		{/each}

		{#if nftBalance === null && options.resourceType !== 'listing'}
			<div class="w-24 h-full bg-gray-100 rounded-lg animate-pulse" />
		{/if}
	</div>

	<svelte:component this={selectedTab.sectionComponent} {options} {chainListing} on:close-popup bind:showBackButton bind:this={tabComponentInstance} on:listing-created={refreshBalance} />
</div>

{#if showCannotTrade}
	<AttachToElement to={tradeTab} offsetY={50} offsetX={-12}>
		<InfoBubble>This NFT is not part of any of the whitelisted collections on the marketplace, it therefore cannot be traded here.</InfoBubble>
	</AttachToElement>
{/if}
