<script>
	import Card from '$lib/components/marketplace/Card.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';

	let sidebarOpen;
</script>

<div class="w-full min-h-screen h-full flex flex-row">
	<Sidebar bind:isOpen={sidebarOpen} />

	<div class="p-11 w-full ml-72 transform transition-all duration-200" class:ml-24={!sidebarOpen}>
		<div class="w-full flex flex-row gap-5 text-xs">
			<button class="text-color-purple font-bold underline">MARKET</button>
			<div class="w-px h-10 bg-gray-300" />

			<button class="font-bold">DROPS</button>
			<div class="w-px h-10 bg-gray-300" />

			<button class="font-bold">POWAH</button>
			<div class="w-px h-10 bg-gray-300" />

			<button class="font-bold">PHYSICAL NFT</button>
			<div class="w-px h-10 bg-gray-300" />
		</div>

		<div class="w-full h-px bg-gray-400 mt-7" />

		<div class="w-full flex justify-between mt-3">
			<div />

			<div class="w-36 ">
				<Dropdown />
			</div>
		</div>

		<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
		</div>
	</div>
</div>
