<script lang="ts">
    import { onMount } from "svelte";
    export let currentVal: number;
    export let totalVal: number;

    let div: HTMLDivElement;

    onMount(() => {
        div.style.setProperty('--part-width', `${100 / (totalVal / currentVal)}%`)
    });
</script>

<div bind:this={div} class='w-full border-2 border-color-black rounded-full outline-none z-20'>
    <p class='text-color-black text-xs text-center z-30'>#{currentVal}/{totalVal}</p>
</div>

<style lang="postcss">

	div {
        --part-width: 50%;
		padding-top: var(--py, 1rem);
		padding-bottom: var(--py, 1rem);
		padding-left: var(--px, 2rem);
		padding-right: var(--px, 2rem);
        @apply relative;
	}

    div::after {
        content: '';
        @apply absolute top-0 bottom-0 left-0 bg-gradient-to-r from-color-purple to-color-blue rounded-l-full rounded-r-none -z-10;
        width: var(--part-width);
    }
</style>
