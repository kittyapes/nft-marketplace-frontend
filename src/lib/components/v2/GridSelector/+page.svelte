<script lang="ts">
	import MasonryGridIcon from '$icons/masonry-grid-icon.svelte';
	import ThreeByThreeGridIcon from '$icons/three-by-three-grid-icon.svelte';
	import TwoByTwoGridIcon from '$icons/two-by-two-grid-icon.svelte';

	export let gridStyle = 'normal';
</script>

<div class="flex items-center">
	<button
		on:click={() => (gridStyle = 'normal')}
		class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'normal' ? 'transform scale-y-[1.08]' : ''}"
	>
		<TwoByTwoGridIcon class="w-5 h-5" />
	</button>
	<button
		on:click={() => (gridStyle = 'dense')}
		class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient border-x-0 flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'dense'
			? 'transform scale-y-[1.08]'
			: ''}"
	>
		<ThreeByThreeGridIcon class="w-5 h-5" />
	</button>
	<button
		on:click={() => (gridStyle = 'masonry')}
		class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'masonry' ? 'transform scale-y-[1.08]' : ''}"
	>
		<MasonryGridIcon class="w-5 h-5" />
	</button>
</div>
