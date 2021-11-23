<!-- <script>
	import Search from './Search.svelte';
</script> -->

<div class="px-8 flex gap-x-8 items-center h-16">
	<!-- Logo -->
	<a href="/home">
		<img src="/img/logo/logo.svg" alt="Hinata logo." />
	</a>

	<!-- <Search /> -->

	<!-- Flex filler -->
	<div class="flex-grow" />

	<!-- Marketplace -->
	<!-- <a
		id="marketplace-link"
		href="/marketplace"
		class="relative text-md uppercase font-semibold bg-gradient-to-r bg-clip-text text-transparent from-color-purple to-color-blue"
	>
		Marketplace
	</a> -->

	<!-- Staking -->
	<!-- <a href="/staking" class="relative text-md uppercase font-semibold">Staking</a> -->

	<!-- Create -->
	<!-- <a
		href="/create"
		class="relative text-md uppercase font-semibold bg-gradient-to-r from-color-purple to-color-blue text-white h-full px-16 grid place-items-center"
	>
		Create
	</a> -->

	<!-- Profile -->
	<a href="/profile" class="relative text-md font-semibold whitespace-nowrap">Your Name</a>
</div>

<style>
	#marketplace-link::after {
		@apply absolute h-px w-full bg-gradient-to-r from-color-purple to-color-blue;
		@apply left-0 bottom-0;
		content: '';
	}
</style>
