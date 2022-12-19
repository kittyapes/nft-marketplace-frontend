<script lang="ts">
	import MasonryGridIcon from '$icons/masonry-grid-icon.svelte';
	import ThreeByThreeGridIcon from '$icons/three-by-three-grid-icon.svelte';
	import TwoByTwoGridIcon from '$icons/two-by-two-grid-icon.svelte';

	export let gridStyle = 'normal';
</script>

<div class="flex items-center">
	<button
		on:click={() => (gridStyle = 'normal')}
		class="w-14 h-14 border-gradient flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'normal' ? 'transform bg-main-gradient' : ''}"
	>
		<TwoByTwoGridIcon class="w-5 h-5" />
	</button>
	<button
		on:click={() => (gridStyle = 'dense')}
		class="w-14 h-14 border-gradient border-x-0 flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'dense' ? 'transform bg-main-gradient' : ''}"
	>
		<ThreeByThreeGridIcon class="w-5 h-5" />
	</button>
	<button
		on:click={() => (gridStyle = 'masonry')}
		class="w-14 h-14 border-gradient flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'masonry' ? 'transform bg-main-gradient' : ''}"
	>
		<MasonryGridIcon class="w-5 h-5" />
	</button>
</div>
