<script lang='ts'>
	export let row: PopupRowInfo;
    export let out: boolean = true;
</script>

<div
    class="w-full flex items-center gap-3 p-2"
    class:bg-gray-100={row.id % 2 != 0}
    class:bg-white={row.id % 2 == 0}
>
    <div class="w-10 h-10 rounded-full bg-black " />
    <div class='w-[85%]'>
        <div class="text-xs font-semibold mb-1">{row.nickname}</div>
        <div class='relative'>
            <b>#{row.id + 1}</b>
            {#if out}
                <p class='absolute right-5 -top-2 text-color-gray-base'> Out </p>
            {:else}
                <button class='absolute right-0 -top-4 w-1/5 bg-color-black rounded-full text-white text-center py-2'>{row.amount} {row.message}</button>
            {/if}
        </div>
    </div>
</div>