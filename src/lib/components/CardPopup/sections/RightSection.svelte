<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import InfoSection from './InfoSection.svelte';
	import TradeSection from './TradeSection.svelte';

	export let options: CardPopupOptions;

	const tabs = [
		{ text: 'Info', icon: 'info', sectionComponent: InfoSection, visible: true },
		{ text: 'Trade', icon: 'trade', sectionComponent: TradeSection, visible: options.resourceType === 'listing' }
	];

	let selectedTab = tabs[0];
</script>

<div class="flex flex-col h-full pl-8 overflow-hidden">
	<!-- Tabs -->
	<div class="flex flex-grow-0 space-x-6">
		{#each tabs.filter((t) => t.visible) as tab}
			<button class="flex items-center space-x-2 btn" on:click={() => (selectedTab = tab)}>
				<img src={getIconUrl('card-popup-tab-icon/' + tab.icon)} alt={tab.text} />
				<div class="text-[#8C8C8C]" class:gradient-text={tab === selectedTab}>{tab.text}</div>
			</button>
		{/each}
	</div>

	<svelte:component this={selectedTab.sectionComponent} {options} on:close-popup />
</div>
