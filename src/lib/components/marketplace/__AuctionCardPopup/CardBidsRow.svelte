<script lang='ts'>
	export let row: PopupRowInfo;
	export let first = false;
</script>

<div
	class="w-full flex items-center gap-3 p-2"
	class:bg-gray-100={row.id % 2 == 0}
	class:bg-white={row.id % 2 != 0}
>
	<div class="w-10 h-10 rounded-full bg-black " />
	<div>
		<div class="text-xs font-semibold">{row.nickname}</div>
		<div class="text-sm">
			{#if first}
				{row.message} 
				<b>
					{row.amount} Ξ
				</b>
			{:else}
				<strike class='opacity-50'>
					{row.message}  
					<b>
						{row.amount} Ξ
					</b>
				</strike>
			{/if}
		</div>
	</div>
</div>
