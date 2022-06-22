<script lang="ts">
	import HomepageCollections from '$lib/components/collections/HomepageCollections.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiSearchCollections, type CollectionTableRow } from '$utils/api/collection';

	let collections: CollectionTableRow[] = [];
	let loaded = false;

	// Please don't ask me why we need an auth token for this...
	currentUserAddress.subscribe(async (address) => {
		if (!address) return;

		loaded = false;
		collections = await apiSearchCollections();
		loaded = true;
		console.log(collections);
	});
</script>

<HomepageCollections {collections} {loaded} />
