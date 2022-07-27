<script lang="ts">
	import PlaceholderImage from '$icons/placeholder-image.svelte';

	export let displayStyle: 'CONTAINED' | 'PADDED' | 'COVERED' = 'CONTAINED';
</script>

<div class="flex gap-8 flex-wrap">
	<div class="-option" on:click={() => (displayStyle = 'CONTAINED')} class:-selected={displayStyle === 'CONTAINED'}>
		<div>Contained</div>
		<div class="w-1/2 mx-auto"><PlaceholderImage /></div>
		<div>
			Recommended for <br />
			assets that are not a 1:1 ratio
		</div>
	</div>

	<div class="-option" on:click={() => (displayStyle = 'PADDED')} class:-selected={displayStyle === 'PADDED'}>
		<div>Padded</div>
		<div class="mx-4"><PlaceholderImage /></div>
		<div>
			Recommended <br />
			for assets with transparent background
		</div>
	</div>

	<div class="-option" on:click={() => (displayStyle = 'COVERED')} class:-selected={displayStyle === 'COVERED'}>
		<div>Covered</div>
		<div><PlaceholderImage /></div>
		<div>
			Recommended for <br />
			assets that can extend to the edge
		</div>
	</div>
</div>

<style>
	.-option {
		@apply border-gray-300 border-2 h-72 rounded-md cursor-pointer flex flex-col w-40 select-none relative
        active:scale-95 transition-transform;
	}

	/* Label */
	.-option > :nth-child(1) {
		@apply text-center uppercase mt-1 font-medium;
	}

	/* Style preview */
	.-option > :nth-child(2) {
		@apply flex justify-center items-center bg-neutral-100 mt-2 flex-grow;
	}

	/* Description */
	.-option > :nth-child(3) {
		@apply text-center text-neutral-500 my-4 px-2 text-sm;
	}

	/* Selected style */
	.-option.-selected {
		@apply border-neutral-500;
	}

	.-option.-selected > :nth-child(1):after {
		content: url('/svg/icons/collection-edit-gradient-checkmark.svg');
		@apply absolute h-12 w-12 right-0 translate-x-5 -translate-y-4;
	}
</style>
