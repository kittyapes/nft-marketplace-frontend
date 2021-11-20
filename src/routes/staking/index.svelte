<script>
	import Button from '$lib/components/Button.svelte';
	import ConnectWalletPopup from '$lib/components/ConnectWalletPopup.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { setLayoutOptions } from '$lib/utils/layout';
	import Container from './_lib/Container.svelte';
	import LeftPane from './_lib/LeftPane.svelte';

	setLayoutOptions({
		slotType: 'flex'
	});

	let showWalletPopup = false;
</script>

<Container class="my-32">
	<LeftPane />

	<div class="max-w-xl flex flex-col items-center justify-center mt-8">
		<div class="font-medium text-3xl text-center mb-6">
			Connect your wallet <br /> to continue
		</div>
		<Button variant="rounded-black" on:click={() => (showWalletPopup = true)}>Connect Wallet</Button
		>
	</div>
</Container>

{#if showWalletPopup}
	<Modal on:close={() => (showWalletPopup = false)}>
		<ConnectWalletPopup />
	</Modal>
{/if}
