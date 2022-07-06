<script lang="ts">
	import HomepageCollections from '$lib/components/collections/HomepageCollections.svelte';
	import { apiSearchCollections, type CollectionTableRow } from '$utils/api/collection';
	import { onMount } from 'svelte';

	let collections: CollectionTableRow[] = [];
	let loaded = false;

	// Please don't ask me why we need an auth token for this...
	// We don't anymore 🙂 🔪
	onMount(async () => {
		loaded = false;
		collections = await apiSearchCollections();
		loaded = true;
	});
</script>

<HomepageCollections {collections} {loaded} />
