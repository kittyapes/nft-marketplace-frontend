<script lang="ts">
	import type { CollectionData } from 'src/interfaces/collectionData';
	import CollectionsContainer from './CollectionsContainer.svelte';

	export let collections: CollectionData[];
</script>

<div class="grid place-items-center w-full my-20">
	<div class="w-5/6 flex flex-col gap-10">
		<div class="flex flex-col max-w-min gap-4 my-20">
			<h1 class="uppercase font-bold text-7xl">Collections</h1>
			<p class="font-semibold text-xl">The top NFT collections on Hinata, ranked by floor price, volume and other statistics.</p>
		</div>
		<hr class="border-t border-black border-opacity-30" />
		<CollectionsContainer {collections} />
	</div>
</div>
