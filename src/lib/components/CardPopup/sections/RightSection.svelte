<script lang="ts">
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import type { CardOptions } from '$lib/components/NftCard.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getOnChainListing, type ChainListing } from '$utils/contracts/listing';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { _refreshOnChainListingHelper } from '../cardPopup';
	import InfoSection from './InfoSection.svelte';
	import TradeSection from './TradeSection/TradeSection.svelte';

	export let options: CardOptions;
	let chainListing: ChainListing;

	onMount(async () => {
		if (options.listingData?.onChainId) {
			refreshOnChainListing();
		}
	});

	async function refreshOnChainListing() {
		chainListing = await getOnChainListing(options.listingData.onChainId);
		console.debug('[On chain listing data]:', chainListing);
	}

	_refreshOnChainListingHelper.subscribe(() => options.listingData && refreshOnChainListing());

	// The back button is controlled by dynamic components
	export let showBackButton: boolean;

	let tabs: { text: string; icon: string; sectionComponent: any; visible: boolean }[] = [];

	$: options?.staleResource?.subscribe((v) => v && updateTabs());

	function updateTabs() {
		tabs = [
			{ text: 'Info', icon: 'info', sectionComponent: InfoSection, visible: true },
			{
				text: 'Trade',
				icon: 'trade',
				sectionComponent: TradeSection,
				visible: (options.resourceType === 'listing' || (options.resourceType === 'nft' && options.rawResourceData.owner === $currentUserAddress)) && !get(options.staleResource) && options.allowTrade
			}
		];
	}

	updateTabs();

	let selectedTab = tabs[0];

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
			>
				<img class="h-8" src={getIconUrl('card-popup-tab-icon/' + tab.icon + (tab.text === selectedTab.text ? '.selected' : ''))} alt={tab.text} />
				<div class="text-[#8C8C8C]" class:gradient-text={tab.text === selectedTab.text}>{tab.text}</div>
			</button>
		{/each}
	</div>

	<svelte:component this={selectedTab.sectionComponent} {options} {chainListing} on:close-popup bind:showBackButton bind:this={tabComponentInstance} />
</div>

{#if showCannotTrade}
	<AttachToElement to={tradeTab} offsetY={50} offsetX={-12}>
		<InfoBubble>This NFT is not part of any of the whitelisted collections on the marketplace, it therefore cannot be traded here.</InfoBubble>
	</AttachToElement>
{/if}
