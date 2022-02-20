<script>
	import { setLayoutOptions } from '$lib/utils/layout';
	import Container from '$lib/components/staking/Container.svelte';
	import LeftPane from '$lib/components/staking/LeftPane.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';

	setLayoutOptions({
		slotType: 'flex'
	});
</script>

<Container class="my-32">
	<LeftPane strokedText="Convert your" gradientText="Tokens" />

	<div class="max-w-xl flex flex-col items-center justify-center mt-8">
		<div class="font-light italic text-4xl text-center mb-6">
			Connect your <br />
			wallet to continue
		</div>
		<button
			class="btn btn-black btn-rounded uppercase text-sm font-normal py-4 px-12"
			on:click={connectToWallet}
		>
			Connect Wallet
		</button>
	</div>
</Container>
