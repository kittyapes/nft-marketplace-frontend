<script lang='ts'>
	export let row: PopupRowInfo;
	export let first = false;
	export let bold: boolean;
</script>


<div
	class="w-full flex items-center gap-3 p-2"
	class:bg-gray-100={row.id % 2 != 0}
    class:bg-white={row.id % 2 == 0}
>
	<div class="w-10 h-10 rounded-full bg-black " />
	<div>
		<div class="text-xs font-semibold mb-1">{row.nickname}</div>
		<div class="text-sm" class:font-bold={bold}>
			{#if first}
				{row.message} 
				{#if row.amount}
					<b>
						{row.amount} Ξ
					</b>
				{/if}
			{:else}
				<strike class='opacity-50'>
					{row.message}  
					{#if row.amount}
						<b>
							{row.amount} Ξ
						</b>
					{/if}
				</strike>
			{/if}
		</div>
	</div>
</div>