<script>
	import TabSwitcher from './CardPopupTabSwitcher.svelte';
	import CardInfoTab from './CardInfoTab.svelte';
	import CardTradeTab from './CardTradeTab.svelte';
	import CardHistoryTab from './CardHistoryTab.svelte';

	import Popupclose from '../icons/popupclose.icon.svelte';
	import { popupOpen, selectedCard } from '../../../../stores/marketplace';

	let tab = 0;
</script>

<div class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
	<!-- Dark overlay -->
	<div class="fixed w-full h-full bg-gray-900 opacity-50" />

	<!-- Modal -->
	<div
		class="bg-white w-full lg:w-2/3  mx-auto rounded-xl shadow-xl z-50 flex flex-col md:flex-row overflow-y-hidden"
		style="height:640px"
	>
		<!-- NFT Image side-->
		<div class="w-full md:w-1/2 bg-gray-200 h-auto flex items-center justify-center">
			<div class="m-10 text-center">
				<div class=" w-72 h-72 flex items-center justify-center">
					<img
						src={$selectedCard.image}
						class="max-w-full max-h-full shadow-xl rounded-xl"
						alt="card artwork"
					/>
				</div>

				<!-- NFT Name and ID-->
				<div class="font-bold text-lg mt-4 opacity-70">
					{$selectedCard.name} #{$selectedCard.id}
				</div>
			</div>
		</div>

		<!-- Content Side-->
		<div class="w-full md:w-1/2 bg-white h-auto p-8">
			<!-- Tabs container -->
			<div class="w-full flex items-center justify-between">
				<!-- Tabs -->
				<TabSwitcher bind:selectedTab={tab} />

				<!-- Close button-->
				<button on:click={() => popupOpen.set(false)}>
					<Popupclose />
				</button>
			</div>

			<!-- Horizontal Line -->
			<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />

			<!-- Selected Tab Content -->
			<div class="py-5 h-full">
				{#if tab == 0}
					<CardInfoTab />
				{:else if tab == 1}
					<CardTradeTab />
				{:else if tab == 2}
					<CardHistoryTab />
				{/if}
			</div>
		</div>
	</div>
</div>
