<!-- <script>
	import Search from './Search.svelte';
</script> -->

<div class="flex items-center h-16 px-8 gap-x-8 fixed w-full z-50 bg-white drop-shadow-lg">
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
		class="relative font-semibold text-transparent uppercase text-md bg-gradient-to-r bg-clip-text from-color-purple to-color-blue"
	>
		Marketplace
	</a> -->

	<!-- Staking -->
	<!-- <a href="/staking" class="relative font-semibold uppercase text-md">Staking</a> -->

	<!-- Create -->
	<!-- <a
		href="/create"
		class="relative grid h-full px-16 font-semibold text-white uppercase text-md bg-gradient-to-r from-color-purple to-color-blue place-items-center"
	>
		Create
	</a> -->

	<!-- Profile -->
	<a href="/profile" class="relative font-semibold text-md whitespace-nowrap">Your Name</a>
</div>

<style>
	/* #marketplace-link::after {
		@apply absolute h-px w-full bg-gradient-to-r from-color-purple to-color-blue;
		@apply left-0 bottom-0;
		content: '';
	} */
</style>
