<script lang="ts">
    import HinataLogoToken from "$icons/hinata-logo-token.svelte";
    
    export let step = 1;
</script>


<div class='grid place-items-center'>
    <div class='w-1/2 flex flex-col gap-10 mt-10'>
        <div class='grid place-items-center'>
            <HinataLogoToken />
        </div>

        <div class='flex gap-10 justify-center relative'>
            <div class='step-circle bg-gradient-to-r from-color-purple to-color-blue rounded-full text-white w-16 h-16 grid place-items-center font-bold text-2xl -bottom-10 min-w-[4rem]'>{step}</div>
            <div class='flex flex-col gap-4'>
                <div class='flex flex-col'>
                    <slot name='header'/>
                </div>
                <div class='flex flex-col'>
                    <slot name='content'></slot>
                </div>
            </div>
        </div>
    </div>
</div>

<style type='postcss'>
    .step-circle:after {
        content:"";
        @apply inset-y-0 absolute -z-50 border-l-white border-l-2 border-dashed h-full  ;
        background: 
            linear-gradient(white, white) padding-box,
            linear-gradient(to bottom, #868BF7, #6CC7F8) border-box;
    }
    
</style>
