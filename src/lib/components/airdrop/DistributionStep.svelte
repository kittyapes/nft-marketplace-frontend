<script>
	export let step = 0;
</script>

<div class="w-full flex items-center gap-11">
	<div
		class="bg-gradient-to-r from-color-purple to-color-blue w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
	>
		<span class="text-2xl text-white font-bold">{step}</span>
	</div>
	<div><slot /></div>
</div>
