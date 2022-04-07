<script lang="ts">
	import { currentUserAddress } from '$stores/wallet';

	import type { PopupHandler } from '$utils/popup';
	import { WalletState, walletState } from '$utils/wallet';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import Popup from './Popup.svelte';

	export let handler: PopupHandler;
	export let onConnectSuccess: () => void;

	async function connectWallet() {
		walletState.set(WalletState.REQUESTING_CONNECT);

		handler.close();

		try {
			connectToWallet();
		} catch {
			walletState.set(WalletState.DISCONNECTED);
			return;
		}

		const unsub = currentUserAddress.subscribe((address) => {
			if (address && onConnectSuccess) {
				onConnectSuccess();
				unsub();
			}
		});
	}
</script>

<Popup class="px-24 h-72">
	<div class="uppercase font-semibold text-2xl text-center mt-8">Wallet not connected</div>
	<div class="text-center mt-4">Please connect your wallet before accessing this page.</div>
	<button class="btn btn-gradient btn-rounded mx-auto block uppercase mt-16" on:click={connectWallet}>Connect Wallet</button>
</Popup>
