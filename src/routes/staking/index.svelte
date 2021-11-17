<script>
	import Button from '$lib/components/Button.svelte';
	import { setLayoutOptions } from '$lib/utils/layout';
	import Container from './_lib/Container.svelte';
	import ConvertYourTokens from './_lib/ConvertYourTokens.svelte';

	setLayoutOptions({
		slotType: 'flex'
	});
</script>

<Container class="my-32">
	<ConvertYourTokens />

	<div class="max-w-xl flex flex-col items-center justify-center mt-8">
		<div class="font-medium text-3xl text-center mb-6">
			Connect your wallet <br /> to continue
		</div>
		<Button variant="rounded-black">Connect Wallet</Button>
	</div>
</Container>
