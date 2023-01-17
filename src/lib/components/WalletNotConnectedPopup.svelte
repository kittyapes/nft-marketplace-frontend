<script lang="ts">
	import { currentUserAddress } from '$stores/wallet';

	import type { PopupHandler } from '$utils/popup';
	import { WalletState, walletState } from '$utils/wallet';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import Popup from './Popup.svelte';
	import PrimaryButton from './v2/PrimaryButton/PrimaryButton.svelte';

	export let handler: PopupHandler;
	export let onConnectSuccess: () => void;

	async function connectWallet() {
		walletState.set(WalletState.REQUESTING_CONNECT);

		try {
			connectToWallet();
		} catch {
			walletState.set(WalletState.DISCONNECTED);
			return;
		}
	}

	$: if ($currentUserAddress) {
		onConnectSuccess?.();
		handler.close();
	}
</script>

<Popup class="text-white">
	<div class="px-20 py-10 flex flex-col gap-10">
		<div class="uppercase font-semibold text-2xl text-center">Wallet not connected</div>
		<div class="text-center">Please connect your wallet before accessing this page.</div>
		<PrimaryButton on:click={connectWallet}>Connect Wallet</PrimaryButton>
	</div>
</Popup>
