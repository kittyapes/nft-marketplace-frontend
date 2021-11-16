<script>
	import Button from '$lib/components/Button.svelte';
	import { setLayoutOptions } from '$lib/utils/layout';

	setLayoutOptions({
		slotType: 'flex'
	});
</script>

<div class="grid place-items-center flex-grow">
	<div class="container flex">
		<div class="flex-grow grid place-items-center mb-16">
			<div>
				<div class="uppercase tracking-widest font-bold text-[#1D1D1D99]">
					step 1 of 2 — Choose your pool
				</div>

				<img src="/img/text/convert-your.svg" alt="Convert your" class="mt-3" />
				<img src="/img/text/tokens.svg" alt="tokens." class="mt-3" />
			</div>
		</div>

		<div class="flex-grow flex flex-col items-center justify-center mt-16">
			<div class="font-medium text-3xl text-center mb-6">
				Connect your wallet <br /> to continue
			</div>
			<Button variant="rounded-black">Connect Wallet</Button>
		</div>
	</div>
</div>
