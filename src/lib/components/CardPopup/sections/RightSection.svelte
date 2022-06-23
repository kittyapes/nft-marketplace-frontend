<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
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

	$: selectedTab = tabs[1];

	export function goBack() {
		tabComponentInstance.goBack?.();
	}

	let tabComponentInstance;
</script>

<div class="flex flex-col h-full pl-8 overflow-hidden">
	<!-- Tabs -->
	<div class="flex flex-grow-0 space-x-6">
		{#each tabs.filter((t) => t.visible) as tab}
			<button class="flex items-center space-x-2 btn" on:click={() => (selectedTab = tab)}>
				<img src={getIconUrl('card-popup-tab-icon/' + tab.icon + (tab === selectedTab ? '.selected' : ''))} alt={tab.text} />
				<div class="text-[#8C8C8C]" class:gradient-text={tab === selectedTab}>{tab.text}</div>
			</button>
		{/each}
	</div>

	<svelte:component this={selectedTab.sectionComponent} {options} on:close-popup bind:showBackButton bind:this={tabComponentInstance} />
</div>
