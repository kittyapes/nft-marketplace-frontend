<script>
	const providers = [
		[
			'Metamask',
			'background: linear-gradient(105.03deg, rgba(246, 133, 27, 0.8) 41.49%, rgba(255, 255, 255, 0) 113.45%), linear-gradient(0deg, #E6D53E, #E6D53E);'
		],
		[
			'WalletConnect',
			'background: linear-gradient(99.49deg, rgba(59, 153, 252, 0.8) 44.41%, rgba(96, 108, 152, 0) 152.86%),linear-gradient(0deg, #113854, #113854);'
		],
		[
			'Torus',
			'background: linear-gradient(97.04deg, rgba(3, 83, 248, 0.8) 34.73%, rgba(96, 108, 152, 0) 114.24%),linear-gradient(0deg, #3AC4FF, #3AC4FF);'
		],
		[
			'Authereum',
			'background: linear-gradient(98.76deg, rgba(255, 76, 47, 0.8) 35.55%, rgba(96, 108, 152, 0) 141.3%),linear-gradient(0deg, #040300, #040300);'
		]
	];
</script>

<div class="bg-white rounded-3xl px-16 py-8 w-[400px]">
	<div class="text-xl text-center font-semibold">Connect your wallet</div>

	<div class="grid gap-4 mt-6">
		{#each providers as [provider, style]}
			<button class="provider" {style}>
				<span class="flex-grow text-left">{provider}</span>
				<img src="/img/wallets/{provider.toLocaleLowerCase()}.svg" alt="" />
			</button>
		{/each}
	</div>
</div>

<style>
	.provider {
		@apply rounded-xl h-12 flex items-center px-4 text-white uppercase font-semibold text-xs active:scale-95 transition duration-200;
		box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
	}
</style>
