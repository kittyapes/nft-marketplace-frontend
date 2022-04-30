<script>
	import MainTabs from '$lib/components/marketplace/MainTabs.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';
	import CardsSection from '$lib/sections/MarketplaceCardsSection.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getListing } from '$utils/api/listing';
	import { adaptListingToUniversalPopup } from '$utils/adapters/adaptListingToUniversalPopup';
	import { setPopup } from '$utils/popup';
	import NftDisplayPopup from '$lib/components/profile/NFTDisplayPopup.svelte';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';

	let sidebarOpen;

	// When there is a URL search param for id, we open a popup with the listing
	onMount(async () => {
		if ($page.url.searchParams.has('id')) {
			const id = $page.url.searchParams.get('id');
			const listing = await getListing(id);
			const adaptedListing = adaptListingToUniversalPopup(listing);

			setPopup(NftDisplayPopup, {
				props: { options: adaptedListing },
				onClose: () => removeUrlParam('id'),
				unique: true
			});
		}
	});
</script>

<div class="flex flex-col w-full h-full min-h-screen md:flex-row">
	<Sidebar bind:isOpen={sidebarOpen} />

	<div class={`p-11 w-full ml-0 ${!sidebarOpen ? 'md:ml-24' : 'md:ml-72'} transform transition-all duration-200`}>
		<MainTabs tab={0} />

		<div class="w-full h-px bg-gray-400 mt-7" />

		<div class="flex justify-between w-full mt-3">
			<div />

			<div class="w-36 ">
				<Dropdown options={[{ label: 'Date' }]} />
			</div>
		</div>

		<div>
			<CardsSection />
		</div>
	</div>
</div>
