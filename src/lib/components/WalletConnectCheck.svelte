<!-- Checks whether a wallet is connected. Displays a popup if not. -->
<script>
	import { closePopup, setPopup } from '$utils/popup';
	import { WalletState, walletState } from '$utils/wallet';
	import LoaderPopup from './LoaderPopup.svelte';
	import WalletNotConnectedPopup from './WalletNotConnectedPopup.svelte';

	$: console.log($walletState);

	$: if ($walletState === WalletState.UNKNOWN) {
		setPopup(LoaderPopup);
	}

	$: if ($walletState === WalletState.DISCONNECTED) {
		setPopup(WalletNotConnectedPopup);
	}

	$: if ($walletState === WalletState.CONNECTED) {
		closePopup();
	}
</script>
