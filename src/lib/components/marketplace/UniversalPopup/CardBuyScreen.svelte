<script lang='ts'>
    export let currencySymbol: string;
    export let header: {info: string, amount: string, buttonText: string} = undefined;

    export let inputBid: number;
</script>


<div class='flex gap-4 flex-col place-items-center'>
    {#if header}
        <div class='flex gap-4 items-center'>
            <p class='text-color-black'>{header.info}</p>
            <p class='font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue'>{header.amount}</p>
            <p class='text-color-black underline underline-offset-1 text-xs font-semibold'>{header.buttonText}</p>
        </div>
    {/if}
    <div class='w-[95%] grid place-items-center relative'>
        <input bind:value={inputBid} type='number' class='w-full p-2 rounded-md border border-color-black text-2xl' placeholder=00.00>
        <button class='rounded-md bg-color-black text-white font-semibold text-xl px-12 py-[10px] absolute right-0'><slot name='button-symbol'></slot></button>
    </div>
    <div class='flex flex-col place-self-start ml-3 gap-3'>
        <div class='flex gap-2'>
            <p class='text-color-gray-base'>Creator gets: </p>
            <p class='text-color-black font-bold'> 0 {currencySymbol}</p>
        </div>
        <div class='flex gap-2'>
            <p class='text-color-gray-base'>Royalties: </p>
            <p class='text-color-black font-bold'> 0 {currencySymbol}</p>
            <button class='ml-1 rounded-full bg-color-gray-lighter px-2'><p>?</p></button>
        </div>
        <div class='flex gap-2'>
            <p class='text-color-gray-base'>Platform fee: </p>
            <p class='text-color-black font-bold'> 0 {currencySymbol}</p>
        </div>
        <div class='flex gap-2'>
            <p class='text-color-gray-base'>Total bid: </p>
            <p class='text-color-black font-bold'> 0 {currencySymbol}</p>
        </div>
    </div>
</div>