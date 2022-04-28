<script>
	import MainTabs from '$lib/components/marketplace/MainTabs.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';
	import CardsSection from '$lib/sections/MarketplaceCardsSection.svelte';

	let sidebarOpen;

	// $: {
	// 	if ($page.params.id !== 'cards' && $page.params.id) {
	// 		console.log($page.params.id);

	// 		let uri = `https://databasewaifu.herokuapp.com/api/token/${$page.params.id}`;
	// 		let data = fetchMetadataFromUri(parseInt($page.params.id), uri);
	// 		data
	// 			.then((resolvedData) => {
	// 				selectedCard.set(resolvedData);
	// 				setPopup(CardInfoPopup, { unique: true });
	// 			})
	// 			.catch((err) => console.log(err));
	// 	}
	// }
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
