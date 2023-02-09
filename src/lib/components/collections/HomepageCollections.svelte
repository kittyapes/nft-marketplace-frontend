<script lang="ts">
	import type { Collection, CollectionTableRow } from '$utils/api/collection';
	import DiamondsLoader from '../DiamondsLoader.svelte';
	import CollectionsContainer from './CollectionsContainer.svelte';

	export let collections: Collection[];
	export let loaded: boolean;
	export let isLoading: boolean;
	export let reachedEnd: boolean;
</script>

<div class="grid place-items-center w-full py-20 text-white">
	<div class="w-5/6 flex flex-col">
		<div class="flex flex-col max-w-min gap-4 mt-20 mb-16">
			<h1 class="uppercase font-bold text-7xl">Collections</h1>
			<p class="font-semibold text-xl">The top NFT collections on Hinata, ranked by floor price, volume and other statistics.</p>
		</div>
		{#if loaded}
			<CollectionsContainer {collections} {isLoading} on:end-reached />
		{:else}
			<DiamondsLoader />
		{/if}

		{#if reachedEnd}
			<div class="grid place-items-center">
				<div on:click={() => history.back()} class="uppercase underline font-bold mt-8 text-sm clickable">Go Back</div>
			</div>
		{/if}
	</div>
</div>
