<script lang='ts'>
    import type { CollectionData } from "src/interfaces/collectionData";

    export let collections: CollectionData[];
</script>

<div class='w-full flex flex-col'>
    <div class="flex">
        <div class=""></div>
        <div class="bg-color-gray-lighter w-full grid grid-cols-[1fr_7fr_1.5fr_3fr_2fr_3fr]">
            {#each collections as collection, i}
                <div class='border-t border-black border-opacity-[0.15]'>
                    <div class='w-[95%]'>
                        <div class='text-center text-sm grid place-items-center'>{i + 1}</div>
                        <div class='flex'>
                            <div class='w-10 h-10 background profile-pic bg-cover rounded-full  ' style="--url: url({collection.imageUrl})" ></div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>  
    </div>
</div>

<style lang="postcss">
	.profile-pic {
		background-image: var(--url);
	}
</style>