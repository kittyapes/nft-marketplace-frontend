<script>
	export let strokedText = 'Stroked text';
	export let gradientText = 'Gradient text';
</script>

<div class=" mb-16 max-w-xl">
	<div>
		<div class="uppercase tracking-widest font-bold text-[#1D1D1D99]">
			step 1 of 2 — Choose your pool
		</div>

		<h1 class="text-8xl tracking-tight uppercase font-semibold text-transparent">
			<span class="[-webkit-text-stroke:1.5px_black]">
				{@html strokedText}
			</span>
			<br />
			<span class="gradient-text">{@html gradientText}</span>
		</h1>
	</div>
</div>
