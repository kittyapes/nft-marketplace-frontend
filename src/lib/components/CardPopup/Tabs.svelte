<script lang="ts">
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import HistorySection from './sections/HistorySection/HistorySection.svelte';
	import InfoSection from './sections/InfoSection.svelte';
	import TradeSection from './sections/TradeSection/TradeSection.svelte';

	interface Tab {
		id: 'info' | 'trade' | 'history';
		text: string;
		sectionComponent: ConstructorOfATypedSvelteComponent;
	}

	const tabs: Tab[] = [
		{ id: 'info', text: 'Info', sectionComponent: InfoSection },
		{
			id: 'trade',
			text: 'Trade',
			sectionComponent: TradeSection,
		},
		{ id: 'history', text: 'History', sectionComponent: HistorySection },
	];

	export let defaultTabIndex: number = 0;
	export let selectedTab: Tab = tabs[defaultTabIndex];
	export let disabledTabs: Tab['id'][] = [];
</script>

<div class="grid grid-cols-4 h-20">
	{#each tabs as tab}
		<button
			class="flex items-center space-x-3 btn outline-none focus-visible:bg-color-purple focus-visible:bg-opacity-30 py-2 rounded"
			on:click={() => (selectedTab = tab)}
			disabled={disabledTabs.includes(tab.id)}
		>
			<img class="h-8" src={getIconUrl('card-popup-tab-icon/' + tab.id + (tab.text === selectedTab.text ? '.selected' : ''))} alt={tab.text} />
			<div class="text-lg text-white" class:text-gradient={tab.text === selectedTab.text}>{tab.text}</div>
		</button>
	{/each}
</div>
