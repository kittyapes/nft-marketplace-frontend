<script lang="ts">
	import { page } from '$app/stores';
	import Sort from '$icons/sort.svelte';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import MainTabs from '$lib/components/marketplace/MainTabs.svelte';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';
	import CardsSection from '$lib/sections/MarketplaceCardsSection.svelte';
	import { filters } from '$stores/marketplace';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
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
			const popupOptions = (await adaptListingToNftCard(listing)).popupOptions;

			setPopup(CardPopup, { props: { options: popupOptions }, onClose: () => removeUrlParam('id') });
		}
	});

	const handleSelectSort = (event: CustomEvent) => {
		$filters.sortBy = event.detail.value;
	};
</script>

<div class="flex flex-col w-full h-full min-h-screen md:flex-row">
	<Sidebar bind:isOpen={sidebarOpen} />

	<div class={`p-11 w-full ml-0 ${!sidebarOpen ? 'md:ml-24' : 'md:ml-72'} transform transition-all duration-200`}>
		<MainTabs tab={0} />

		<div class="w-full h-px bg-gray-400 mt-7" />

		<div class="flex justify-between w-full mt-3">
			<div />

			<div class="w-52 ">
				<Dropdown
					dropdownIcon={Sort}
					on:select={(e) => handleSelectSort(e)}
					options={[
						{ label: 'Newest', value: 'NEWEST' },
						{ label: 'Oldest', value: 'OLDEST' },
						{ label: 'Most Popular', value: 'POPULAR' },
						{ label: 'Ending Now', value: 'END1MIN' }
					]}
				/>
			</div>
		</div>

		<div>
			<CardsSection />
		</div>
	</div>
</div>
