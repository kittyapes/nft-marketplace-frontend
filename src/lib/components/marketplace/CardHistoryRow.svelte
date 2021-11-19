<script>
	import Externallink from '../icons/externallink.icon.svelte';
	export let idx = 0;
</script>

<div
	class="w-full flex items-center  justify-between"
	class:bg-gray-100={idx % 2 == 0}
	class:white={idx % 2 != 0}
>
	<div class="flex gap-3 p-2">
		<div class="w-10 h-10 rounded-full bg-black " />
		<div>
			<div class="text-xs">Soham</div>
			<div class="text-sm">Placed a bid for <b>5.50 Ξ</b></div>
		</div>
	</div>

	<div>
		<Externallink />
	</div>
</div>
