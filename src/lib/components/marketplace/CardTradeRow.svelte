<script>
	export let idx = 0;
</script>

<div
	class="w-full flex items-center gap-3 p-2"
	class:bg-gray-100={idx % 2 == 0}
	class:white={idx % 2 == 0}
>
	<div class="w-10 h-10 rounded-full bg-black " />
	<div>
		<div class="text-xs">Mura Masa</div>
		<div class="text-sm">Offering <b>3.00 Ξ</b></div>
	</div>
</div>
