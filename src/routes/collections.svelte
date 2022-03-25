<script lang="ts">
	import HomepageCollections from '$lib/components/collections/HomepageCollections.svelte';
	import type { CollectionData } from 'src/interfaces/collectionData';

	let collections = Array(20)
		.fill(0)
		.map(
			() =>
				({
					name: 'Terraforms',
					imageUrl: 'https://picsum.photos/400',
					origin: 'HINATA',
					verfified: Math.random() < 0.5,
					floor: Math.random(),
					totalVolume: 2762839.02 + (Math.random() + 1) * 100,
					dailyVolume: 16430.58 + (Math.random() + 1) * 100,
					dailyGrowth: Math.random() < 0.5 ? (Math.random() + 1) * -10 : (Math.random() + 1) * 10
				} as CollectionData)
		);
</script>

<HomepageCollections {collections} />
