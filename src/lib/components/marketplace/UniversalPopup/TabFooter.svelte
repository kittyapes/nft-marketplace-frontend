<script lang='ts'>
    import Button from "$lib/components/Button.svelte";
    import { fade } from 'svelte/transition';

    export let infoText: {[key: string]: any}[];
    export let buttonText: string = '';
    export let buyButtonDisabled = false;
</script>


<div in:fade={{ duration: 300 }}>
    <div class="w-full border-t border-color-black border-opacity-30 flex">
        <div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
            <div class="text-sm text-color-black opacity-70 ">{Object.keys(infoText[0])[0]}</div>
            <div class="text-2xl font-semibold text-color-black">{Object.values(infoText[0])[0]}</div>
        </div>

        <div class="w-1/2 pt-2 pl-4">
            <div class="text-sm text-color-black opacity-70 ">{Object.keys(infoText[1])[0]}</div>
            <div class="text-2xl font-semibold text-color-black">
                {Object.values(infoText[1])[0]}
            </div>
        </div>
    </div>

    <div class="w-full mt-3 flex flex-row gap-4" on:click>
        <slot name='bt'>
            <Button gradient rounded stretch disabled={buyButtonDisabled}>{buttonText}</Button>
        </slot>
    </div>
</div>