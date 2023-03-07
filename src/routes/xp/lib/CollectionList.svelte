<script lang="ts">
	import type { CollectionRecord } from '..';
	import CollectionLink from './CollectionLink.svelte';

	export let collections: CollectionRecord[];
</script>

<div class="py-4 pl-2 md:pl-8 lg:pl-20">
	{#each collections as collection}
		<CollectionLink data={collection} />
	{/each}
</div>
