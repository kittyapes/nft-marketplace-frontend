<script>
	const prettierFix = `Royalties (<span class="gradient-text">Optional</span>)`;
</script>

<div class="pr-12">
	<h1 class="{$$props.class} uppercase font-bold mt-8">{@html prettierFix}</h1>

	<div class="flex gap-x-4 mt-4">
		<div id="percent-container" class="grid w-24">
			<div class="text-color-black italic uppercase font-light text-sm">Fees</div>
			<input type="text" class="input mt-2" placeholder="%" />
			<input type="text" class="input mt-4" placeholder="%" />
			<input type="text" class="input mt-4" placeholder="%" />
		</div>

		<div class="grid flex-grow">
			<div class="text-color-black italic uppercase font-light text-sm">Wallet address</div>
			<input type="text" class="input mt-2" placeholder="Enter wallet address" />
			<input type="text" class="input mt-4" placeholder="Enter wallet address" />
			<input type="text" class="input mt-4" placeholder="Enter wallet address" />
		</div>
	</div>
</div>

<style>
	input {
		@apply w-full h-12;
	}

	#percent-container input {
		@apply text-center;
	}
</style>
