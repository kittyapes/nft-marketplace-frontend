<script lang="ts">
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import HistorySection from './sections/HistorySection/HistorySection.svelte';
	import InfoSection from './sections/InfoSection.svelte';
	import TradeSection from './sections/TradeSection/TradeSection.svelte';

	interface Tab {
		text: string;
		icon: string;
		sectionComponent: ConstructorOfATypedSvelteComponent;
	}

	const tabs: Tab[] = [
		{ text: 'Info', icon: 'info', sectionComponent: InfoSection },
		{
			text: 'Trade',
			icon: 'trade',
			sectionComponent: TradeSection,
		},
		{ text: 'History', icon: 'history', sectionComponent: HistorySection },
	];

	export let defaultTabIndex: number = 0;
	export let selectedTab: Tab = tabs[defaultTabIndex];
</script>

<div class="flex flex-grow-0 space-x-6">
	{#each tabs as tab}
		<button class="flex items-center space-x-3 btn outline-none focus-visible:bg-gray-100 p-2 rounded-md" on:click={() => (selectedTab = tab)}>
			<img class="h-8" src={getIconUrl('card-popup-tab-icon/' + tab.icon + (tab.text === selectedTab.text ? '.selected' : ''))} alt={tab.text} />
			<div class="text-lg text-white" class:text-gradient={tab.text === selectedTab.text}>{tab.text}</div>
		</button>
	{/each}
</div>
