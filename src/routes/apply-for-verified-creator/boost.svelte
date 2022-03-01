<script lang="ts">
    import Disconnect from "$icons/disconnect.svelte";
    import CreatorFormScreen from "$lib/components/CreatorFormScreen.svelte";
    import LoadedContent from "$lib/components/LoadedContent.svelte";
    import { onMount } from "svelte";

    let loaded: boolean = false;
    
    onMount(() => {
        setTimeout(() => loaded = true, 500);
    });
</script>


<LoadedContent {loaded}>
    <CreatorFormScreen step={3}>
        <div slot='header' class='flex flex-col gap-5 max-w-3xl'>
            <h1 class='uppercase font-bold text-7xl'>
                <p>Boost your</p>
                <p class='gradient-text'>wallet</p>
            </h1>
            <button class='text-color-black text-sm uppercase self-end'>
                <p class='flex gap-3'>
                    how does this work?
                    <Disconnect></Disconnect>
                </p>
            </button>
        </div>
        <div slot='content' id="form-container" class='flex flex-col max-w-xl gap-8'>
            <p class='text-sm font-light mb-6'>Earn $100 in tree transactions for your wallet and every Verified Creator who signs up using your link. There is no limit to how many artists you can onboard and no cap to your bonus!</p>
            <h1 class='text-lg text-color-black uppercase'>Needs twitter/instagram access to continue</h1>
            <div class='flex justify-around'>
                <div class='w-2/5 h-40 border-2 border-[#BFB9B9] rounded-lg uppercase grid place-items-center italic'>TWITTER</div>
                <div class='w-2/5 h-40 border-2 border-[#BFB9B9] rounded-lg uppercase grid place-items-center italic'>Instagram</div>
            </div>
            <button class='w-full btn btn-rounded btn-gradient uppercase font-normal text-sm mt-4 text-black mb-10'>share</button>
        </div>
    </CreatorFormScreen>
</LoadedContent>