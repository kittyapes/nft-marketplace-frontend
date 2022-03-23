<script lang="ts">
    import HomepageCollections from "$lib/components/collections/HomepageCollections.svelte";
    import type { CollectionData } from "src/interfaces/collectionData";
    
    let collections = Array(20).fill(0)
        .map(() => ({
                name: 'Terraforms', 
                imageUrl: 'https://picsum.photos/400', 
                origin: 'HINATA',
                verfified: true,
                floor: 0.5,
                totalVolume: 2762839.02,
                dailyVolume: 16430.58,
                dailyGrowth: Math.random() < 0.5 ? (Math.random() + 1) * -10 * 50 : (Math.random() + 1) * 10 * 50,
                } as CollectionData)
            );
</script>

<HomepageCollections {collections}></HomepageCollections>