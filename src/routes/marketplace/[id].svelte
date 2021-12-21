<script>
	import MainTabs from '$lib/components/marketplace/MainTabs.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';
	import CardsSection from '$lib/sections/MarketplaceCardsSection.svelte';
	import CardInfoPopup from '$lib/components/marketplace/CardPopup.svelte';

	import { page } from '$app/stores';
	import { popupOpen, selectedCard } from '$stores/marketplace';
	import { fetchMetadataFromUri } from '$utils/api/getNFT';

	let sidebarOpen;

	$: {
		if ($page.params.id !== 'cards' && !$selectedCard) {
			let uri = `https://databasewaifu.herokuapp.com/api/token/${$page.params.id}`;
			let data = fetchMetadataFromUri(parseInt($page.params.id), uri);
			data
				.then((resolvedData) => {
					console.log(resolvedData);
					selectedCard.set(resolvedData);
					popupOpen.set(true);
				})
				.catch((err) => console.log(err));
		}
	}
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row">
	{#if $popupOpen}
		<CardInfoPopup />
	{/if}

	<Sidebar bind:isOpen={sidebarOpen} />

	<div
		class={`p-11 w-full ml-0 ${
			!sidebarOpen ? 'md:ml-24' : 'md:ml-72'
		} transform transition-all duration-200`}
	>
		<MainTabs tab={0} />

		<div class="w-full h-px bg-gray-400 mt-7" />

		<div class="w-full flex justify-between mt-3">
			<div />

			<div class="w-36 ">
				<Dropdown />
			</div>
		</div>

		<div>
			<CardsSection />
		</div>
	</div>
</div>
