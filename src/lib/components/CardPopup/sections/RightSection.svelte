<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import InfoSection from './InfoSection.svelte';
	import TradeSection from './TradeSection/TradeSection.svelte';

	export let options: CardPopupOptions;

	// The back button is controlled by dynamic components
	export let showBackButton: boolean;

	$: tabs = [
		{ text: 'Info', icon: 'info', sectionComponent: InfoSection, visible: true },
		{
			text: 'Trade',
			icon: 'trade',
			sectionComponent: TradeSection,
			visible: options.resourceType === 'listing' || (options.resourceType === 'nft' && options.rawResourceData.owner === $currentUserAddress)
		}
	];

	$: selectedTab = tabs[0];

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
			{@const hoverCannotTrade = tab.icon === 'trade' && options.nftData?.[0]?.isExternal}

			<button
				class="flex items-center space-x-2 btn"
				on:click={() => (selectedTab = tab)}
				on:pointerenter={() => hoverCannotTrade && (showCannotTrade = true)}
				on:pointerleave={() => (showCannotTrade = false)}
				bind:this={tradeTab}
			>
				<img src={getIconUrl('card-popup-tab-icon/' + tab.icon + (tab === selectedTab ? '.selected' : ''))} alt={tab.text} />
				<div class="text-[#8C8C8C]" class:gradient-text={tab === selectedTab}>{tab.text}</div>
			</button>
		{/each}
	</div>

	<svelte:component this={selectedTab.sectionComponent} {options} on:close-popup bind:showBackButton bind:this={tabComponentInstance} />
</div>

{#if showCannotTrade}
	<AttachToElement to={tradeTab} offsetY={50} offsetX={-12}>
		<InfoBubble>This NFT is not part of any of the whitelisted collections on the marketplace, it therefore cannot be traded here.</InfoBubble>
	</AttachToElement>
{/if}
