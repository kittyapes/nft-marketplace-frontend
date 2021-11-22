<script>
	import QueueDrop from '$lib/components/drops/QueueDrop.svelte';
	import AuctionDrop from '$lib/components/drops/AuctionDrop.svelte';
	import LimitedDrop from '$lib/components/drops/LimitedDrop.svelte';
</script>

<div class="w-full">
	<QueueDrop />
	<div class="w-full h-1 border-b-2" />

	<AuctionDrop />
	<div class="w-full h-1 border-b-2" />

	<LimitedDrop />
</div>
