<script>
	import Back from '$icons/back_.svelte';
	import { goBack } from '$utils/navigation';
</script>

<div class="max-w-screen-lg mx-auto">
	<!-- Back button -->
	<button
		class="btn flex items-center space-x-2 uppercase font-semibold mt-16 mb-8 text-sm"
		on:click={goBack}
	>
		<Back />
		<div>Go Back</div>
	</button>

	<slot />
</div>
