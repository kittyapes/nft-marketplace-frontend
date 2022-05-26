<script lang="ts">
	import type { CollectionTableRow } from '$utils/api/collection';
	import CollectionsContainer from './CollectionsContainer.svelte';

	export let collections: CollectionTableRow[];
</script>

<div class="grid place-items-center w-full my-20">
	<div class="w-5/6 flex flex-col">
		<div class="flex flex-col max-w-min gap-4 mt-20 mb-16">
			<h1 class="uppercase font-bold text-7xl">Collections</h1>
			<p class="font-semibold text-xl">The top NFT collections on Hinata, ranked by floor price, volume and other statistics.</p>
		</div>
		<hr class="border-t border-black border-opacity-30" />
		<CollectionsContainer {collections} />

		<div class="grid place-items-center">
			<a href="/" class="uppercase underline font-bold mt-8 text-sm">Go Back</a>
		</div>
	</div>
</div>
