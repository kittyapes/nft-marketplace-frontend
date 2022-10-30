<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import Sort from '$icons/sort.svelte';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import MainTabs from '$lib/components/marketplace/MainTabs.svelte';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';
	import CardsSection from '$lib/sections/MarketplaceCardsSection.svelte';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import { getListing } from '$utils/api/listing';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { setPopup } from '$utils/popup';
	import { onMount } from 'svelte';

	let sidebarOpen;

	// When there is a URL search param for id, we open a popup with the listing
	onMount(async () => {
		if ($page.url.searchParams.has('id')) {
			const id = $page.url.searchParams.get('id');
			const listing = await getListing(id);
			const options = await listingToCardOptions(listing);

			setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('id'), unique: true });
		}
	});

	const handleSelectSort = (event: CustomEvent) => {
		$page.url.searchParams.set('sortBy', event.detail.value);
		goto('?' + $page.url.searchParams);
		refreshWithFilters();
	};

	let refreshWithFilters: () => void;
</script>

<div class="flex flex-col w-full h-full min-h-screen md:flex-row">
	<Sidebar bind:isOpen={sidebarOpen} on:request-refresh={refreshWithFilters} />

	<div class={`p-11 w-full ml-0 ${!sidebarOpen ? 'md:ml-24' : 'md:ml-72'} transform transition-all duration-200`}>
		<MainTabs tab={0} />

		<div class="w-full h-px bg-gray-400 mt-7" />

		<div>
			<CardsSection bind:refreshWithFilters />
		</div>
	</div>
</div>
