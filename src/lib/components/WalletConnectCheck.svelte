<!-- Checks whether a wallet is connected. Displays a popup if not. -->
<script lang="ts">
	import { type PopupHandler, setPopup } from '$utils/popup';
	import { WalletState, walletState } from '$utils/wallet';
	import LoaderPopup from './LoaderPopup.svelte';
	import WalletNotConnectedPopup from './WalletNotConnectedPopup.svelte';

	let popupHandler: PopupHandler;

	$: if ($walletState === WalletState.UNKNOWN) {
		popupHandler?.close();
		popupHandler = setPopup(LoaderPopup);
	}

	$: if ($walletState === WalletState.DISCONNECTED) {
		popupHandler?.close();
		popupHandler = setPopup(WalletNotConnectedPopup, { closeByOutsideClick: false });
	}

	$: if ($walletState === WalletState.CONNECTED) {
		popupHandler?.close();
	}
</script>
