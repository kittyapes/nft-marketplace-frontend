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
    import Error404 from '$lib/components/404.svelte'
</script>

<div class='h-full w-full grid place-items-center'>
    {#if response === 404}
        <div class='flex flex-col gap-10 p-20 items-center'>
            <Error404></Error404>
            <h1 class='text-7xl gradient-text py-4'>Something Went Wrong</h1>
            <button class='btn btn-rounded btn-gradient'>Go Back</button>
        </div>
    {/if}
</div>