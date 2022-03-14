<script>
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import Popup from './Popup.svelte';

	function connectWallet() {
		connectToWallet().catch(() => location.reload());
	}
</script>

<Popup class="px-24 h-72">
	<div class="uppercase font-semibold text-2xl text-center mt-8">Wallet not connected</div>
	<div class="text-center mt-4">Please connect your wallet before accessing this page.</div>
	<button
		class="btn btn-gradient btn-rounded mx-auto block uppercase mt-16"
		on:click={connectWallet}
	>
		Connect Wallet
	</button>
</Popup>
