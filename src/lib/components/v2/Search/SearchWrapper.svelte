<script lang="ts">
	import PopularSearches from './PopularSearches.svelte';

	export let query: string;
	export let isFocused: boolean;
</script>

<div class="absolute top-16 w-full bg-dark-gradient border-gradient pt-2.5 2xl:pt-2 px-5 2xl:px-6 pb-5 2xl:pb-6 ">
	{#if isFocused && !query}
		<PopularSearches />
	{/if}
</div>
