<script context="module" lang='ts'>

    let response: number;

    /** @type {import('@sveltejs/kit').ErrorLoad} */
    export function load({ error, status }) {
        response = status;
        return {
            props: {
            title: `${status}: ${error.message}`
            }
        };
    }
</script>
  
<script lang='ts'>
    import Button from "$lib/components/Button.svelte";
    import Error404 from '$lib/components/404.svelte'
</script>

<div class='h-full w-full grid place-items-center'>
    {#if response === 404}
        <div class='flex flex-col gap-10 p-20 items-center'>
            <Error404></Error404>
            <h1 class='text-7xl text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue py-4'>Something Went Wrong</h1>
            <Button gradient rounded>Go Back</Button>
        </div>
    {/if}
</div>