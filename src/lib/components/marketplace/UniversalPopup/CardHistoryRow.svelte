<script lang="ts">
	import Externallink from '$icons/external-link.svelte';
	export let row: PopupRowInfo;
</script>

<div
	class="w-full flex items-center justify-between"
	class:bg-gray-100={row.id % 2 == 0}
	class:white={row.id % 2 != 0}
>
	<div class="flex gap-3 p-2">
		<div class="w-10 h-10 rounded-full bg-black " />
		<div>
			<div class="text-xs font-semibold mb-1">{row.nickname}</div>
			<div class="text-sm">{row.message} <b>{row.amount} Ξ</b></div>
		</div>
	</div>

	<div class="pr-2">
		<Externallink />
	</div>
</div>
