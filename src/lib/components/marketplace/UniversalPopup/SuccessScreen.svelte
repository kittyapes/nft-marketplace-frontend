<script lang='ts'>
    import SuccessCheckmark from "$icons/success-checkmark.svelte";
    
    export let successMessage: string;
</script>

<div class='grid place-items-center gap-3'>
    <SuccessCheckmark></SuccessCheckmark>
    <p class='font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue'>Congratulations!</p>
    <p class='text-color-black text-xl text-center'>{successMessage}</p>
</div>
<div />