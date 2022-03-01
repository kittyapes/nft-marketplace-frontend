<!-- Checks whether a wallet is connected. Displays a popup if not. -->
<script>
	import { setPopup } from '$utils/popup';
	import { WalletState, walletState } from '$utils/wallet';
	import LoaderPopup from './LoaderPopup.svelte';
	import WalletNotConnectedPopup from './WalletNotConnectedPopup.svelte';

	$: if ($walletState === WalletState.UNKNOWN) {
		setPopup(LoaderPopup);
	}

	$: if ($walletState === WalletState.DISCONNECTED) {
		setPopup(WalletNotConnectedPopup);
	}
</script>
