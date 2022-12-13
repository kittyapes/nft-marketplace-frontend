<script lang="ts">
	import Checkmark from '$icons/checkmark.svelte';
	import PlaceholderImageV2 from '$icons/placeholder-image-v2.svelte';
	import Tick from '$icons/tick.svelte';

	export let displayStyle: 'CONTAINED' | 'PADDED' | 'COVERED' = 'CONTAINED';
</script>

<div class=" w-full flex flex-wrap gap-3 2xl:gap-4">
	<div class="-option {displayStyle === 'CONTAINED' ? '-selected border-gradient' : ''}" on:click={() => (displayStyle = 'CONTAINED')}>
		<p>Contained</p>
		<div class="w-1/2 mx-auto bg-gradient-a"><PlaceholderImageV2 /></div>
		<div>
			Recommended for <br />
			assets that are not a 1:1 ratio
		</div>
		<div class:hidden={displayStyle !== 'CONTAINED'} class="absolute -top-2.5 2xl:-top-3.5 -right-2.5 2xl:-right-3.5 bg-main-gradient w-5 2xl:w-7 h-5 2xl:h-7 flex items-center justify-center">
			<Tick />
		</div>
	</div>

	<div class="-option {displayStyle === 'PADDED' ? '-selected border-gradient' : ''}" on:click={() => (displayStyle = 'PADDED')}>
		<p>Padded</p>
		<div class="mx-4 bg-gradient-a"><PlaceholderImageV2 /></div>
		<div>
			Recommended <br />
			for assets with transparent background
		</div>
		<div class:hidden={displayStyle !== 'PADDED'} class="absolute -top-2.5 2xl:-top-3.5 -right-2.5 2xl:-right-3.5 bg-main-gradient w-5 2xl:w-7 h-5 2xl:h-7 flex items-center justify-center">
			<Tick />
		</div>
	</div>

	<div class="-option {displayStyle === 'COVERED' ? '-selected border-gradient' : ''}" on:click={() => (displayStyle = 'COVERED')}>
		<p>Covered</p>
		<div class="bg-gradient-a"><PlaceholderImageV2 /></div>
		<div>
			Recommended for <br />
			assets that can extend to the edge
		</div>
		<div class:hidden={displayStyle !== 'COVERED'} class="absolute -top-2.5 2xl:-top-3.5 -right-2.5 2xl:-right-3.5 bg-main-gradient w-5 2xl:w-7 h-5 2xl:h-7 flex items-center justify-center">
			<Tick />
		</div>
	</div>
</div>

<style>
	.-option {
		@apply border-white border h-56 2xl:h-[279px] rounded-none cursor-pointer flex-grow flex flex-col w-40 select-none relative
        active:scale-95 transition-transform;
	}

	/* Label */
	.-option > :nth-child(1) {
		@apply text-center capitalize mt-4 2xl:mt-5 text-xs 2xl:text-sm font-medium;
	}

	/* Style preview */
	.-option > :nth-child(2) {
		@apply flex justify-center items-center mt-2 flex-grow;
	}

	/* Description */
	.-option > :nth-child(3) {
		@apply text-center my-4 px-2 font-medium text-xs 2xl:text-sm leading-4 2xl:leading-5;
	}

	/* Selected style */
	.-option.-selected {
		/* @apply border-gradient; */
		@apply border-[3px];
	}

	/* .-option.-selected > :nth-child(1):after {
		content: url('/svg/icons/collection-edit-gradient-checkmark.svg');
		@apply absolute h-12 w-12 -mt-4 2xl:-mt-5 right-0 translate-x-5 -translate-y-4;
	} */
</style>
