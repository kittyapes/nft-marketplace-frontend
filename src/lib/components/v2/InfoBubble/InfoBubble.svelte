<script>
	import { fade } from 'svelte/transition';
</script>

<div class="bg-white custom-shadow font-bold p-3 pr-4 rounded-lg max-w-sm" transition:fade|local={{ duration: 100 }}>
	<div class="relative gradient-text">
		<!-- Wedge -->
		<svg class="absolute -translate-y-5 translate-x-2" width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.89953 1.53553C8.85215 -0.417089 12.018 -0.417088 13.9706 1.53553L20.8701 8.435L10.4351 18.87L6.01399e-05 8.435L6.89953 1.53553Z" fill="white" />
		</svg>

		<slot />
	</div>
</div>

<style>
	.custom-shadow {
		box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.12);
	}
</style>
