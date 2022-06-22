<script>
	import AuctionCountdown from '$lib/components/v2/AuctionCountdown.svelte';
</script>

<main class="max-w-screen-lg p-8 mx-auto my-24 border bg-gray-50 rounded-xl">
	<h1 class="text-xl font-semibold">Welcome to the components route!</h1>

	<div class="p-8 mt-4 bg-white rounded-xl">
		<AuctionCountdown startTime={new Date().toISOString()} duration={3600} />
	</div>
</main>
