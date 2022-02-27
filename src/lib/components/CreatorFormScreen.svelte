<script lang="ts">
    import HinataLogoToken from "$icons/hinata-logo-token.svelte";
</script>


<div class='w-full h-full'>
    <div class='grid place-items-center'>
        <HinataLogoToken></HinataLogoToken>
    </div>

    <div class='flex'>
        <div class='step-circle bg-gradient-to-r from-color-purple to-color-blue rounded-full text-white p-4 px-6'>1</div>
        <div class='flex flex-col'>
            <div class='flex flex-col'>

            </div>
            <div class='flex flex-col'>

            </div>
        </div>
    </div>
</div>

<style type='postcss'>
    .step-circle:after {
        @apply inset-y-0 absolute -z-10 left-1/2 border-l border-l-zinc-900 border-dashed;
        content:"";

    }
</style>