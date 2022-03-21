<script>
	import { selectedCard } from '$stores/marketplace';
	import Fullscreen from '$icons/fullscreen.svelte';
	import Share from '$icons/share.svelte';
	import { notifySuccess } from '$utils/toast';

	function handleShare() {
		navigator.clipboard.writeText(window.location.href);
		notifySuccess('Copied NFT link!');
	}
</script>

<!-- NFT Image side-->
<div class="w-full md:w-1/2 bg-gray-200 h-auto flex items-center justify-center">
	<div class="m-10 text-center h-full flex flex-col justify-end">
		<div class=" w-72 h-72 flex items-center justify-center">
			<img
				src={$selectedCard?.image}
				class="max-w-full max-h-full shadow-xl rounded-xl"
				alt="card artwork"
			/>
		</div>

		<!-- NFT Name and ID-->
		<div class="font-bold text-lg mt-4 opacity-70">
			{$selectedCard?.name} #{$selectedCard?.id}
		</div>

		<!-- Fullscreen and Share button -->
		<div class="flex justify-center mt-24 mb-8 gap-x-4">
			<a href={$selectedCard?.image} target="_blank" class="transition-btn hover:brightness-110">
				<Fullscreen />
			</a>

			<button class="transition-btn hover:brightness-110" on:click={handleShare}>
				<Share />
			</button>
		</div>
	</div>
</div>
