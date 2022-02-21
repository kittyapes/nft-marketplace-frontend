<script lang='ts'>
	export let row: PopupRowInfo;
    export let odds: number;
</script>

<div
    class="w-full flex items-center gap-3 p-2"
    class:bg-gray-100={row.id % 2 != 0}
    class:bg-white={row.id % 2 == 0}
>
    <div class="w-10 h-10 rounded-full bg-black " />
    <div class='w-[85%]'>
        <div class="text-xs font-semibold mb-1">{row.nickname}</div>
            <p class='inline-block'><b>{row.amount}</b> {#if row.amount === 1} ticket {:else} tickets {/if} </p>
            <p class='inline-block float-right font-semibold'>{#if odds < 1} &lt 1{:else}{odds}{/if}%</p>
    </div>
</div>